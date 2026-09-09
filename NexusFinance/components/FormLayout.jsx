import React, { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from 'react';
import { InputAccessoryView, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScreenHeaderHeightContext } from './ScreenHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { focusedScrollOffset, keyboardOverlap } from './keyboardGeometry.mjs';
import { useTheme, useThemedStyles } from '../contexts/ThemeContext';

const FormContext = createContext(null);

export function KeyboardArea({ children, modal = false, style }) {
  const headerHeight = useContext(ScreenHeaderHeightContext);
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView style={[{ flex: 1 }, modal && { paddingTop: insets.top, paddingLeft: insets.left, paddingRight: insets.right }, style]} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={modal ? 0 : headerHeight}>
      {children}
    </KeyboardAvoidingView>
  );
}

// Measure the focused field again after the keyboard resizes the viewport.
// This also covers switching fields while the keyboard is already visible.
export function FormScrollView({ children, contentContainerStyle, onScroll, onScrollBeginDrag, onLayout, onContentSizeChange, resetScrollOnKeyboardHide = false, style, ...props }) {
  const styles = useThemedStyles(createStyles);
  const scroll = useRef(null);
  const viewport = useRef(null);
  const focused = useRef(null);
  const offset = useRef(0);
  const frame = useRef(null);
  const settleTimer = useRef(null);
  const keyboard = useRef(Keyboard.metrics?.());
  const manualScroll = useRef(false);
  const [overlap, setOverlap] = useState(0);
  const accessoryId = useId();
  const reveal = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      viewport.current?.measureInWindow((x, y, width, height) => {
        const bounds = { x, y, width, height };
        setOverlap(keyboardOverlap(bounds, keyboard.current));
        if (!keyboard.current?.height || manualScroll.current) return;
        const input = focused.current;
        if (!input?.isFocused()) return;
        input.measureInWindow((inputX, inputY, inputWidth, inputHeight) => {
          if (focused.current !== input || !input.isFocused() || !keyboard.current?.height || manualScroll.current) return;
          const target = focusedScrollOffset({ viewport: bounds, input: { y: inputY, height: inputHeight }, keyboard: keyboard.current, offset: offset.current });
          if (Math.abs(target - offset.current) > 1) scroll.current?.scrollTo({ y: target, animated: false });
        });
      });
    });
  }, []);

  useEffect(() => {
    const update = (event) => {
      keyboard.current = event.endCoordinates;
      manualScroll.current = false;
      reveal();
      clearTimeout(settleTimer.current);
      // Native window resizing and iOS accessory layout may finish after the event.
      settleTimer.current = setTimeout(reveal, (event.duration || 0) + 100);
    };
    const hide = () => {
      keyboard.current = null;
      clearTimeout(settleTimer.current);
      cancelAnimationFrame(frame.current);
      setOverlap(0);
      if (resetScrollOnKeyboardHide) {
        offset.current = 0;
        scroll.current?.scrollTo({ y: 0, animated: false });
      }
    };
    const subscriptions = [
      Keyboard.addListener('keyboardDidShow', update),
      Keyboard.addListener('keyboardDidChangeFrame', update),
      Keyboard.addListener('keyboardDidHide', hide),
    ];
    return () => { subscriptions.forEach((subscription) => subscription.remove()); clearTimeout(settleTimer.current); cancelAnimationFrame(frame.current); };
  }, [reveal, resetScrollOnKeyboardHide]);

  return (
    <FormContext.Provider value={{ accessoryId, focus: (input) => { focused.current = input; manualScroll.current = false; reveal(); } }}>
      <View ref={viewport} collapsable={false} style={[{ flex: 1 }, style]} onLayout={(event) => { reveal(); onLayout?.(event); }}>
      <ScrollView
        {...props}
        ref={scroll}
        style={{ flex: 1 }}
        contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle, { paddingBottom: (StyleSheet.flatten(contentContainerStyle)?.paddingBottom ?? StyleSheet.flatten(contentContainerStyle)?.paddingVertical ?? 24) + overlap }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        automaticallyAdjustKeyboardInsets={false}
        removeClippedSubviews={false}
        scrollEventThrottle={16}
        onScroll={(event) => { offset.current = event.nativeEvent.contentOffset.y; onScroll?.(event); }}
        onScrollBeginDrag={(event) => { manualScroll.current = true; clearTimeout(settleTimer.current); cancelAnimationFrame(frame.current); onScrollBeginDrag?.(event); }}
        onLayout={reveal}
        onContentSizeChange={(width, height) => { reveal(); onContentSizeChange?.(width, height); }}
      >
        {children}
      </ScrollView>
      </View>
      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID={accessoryId}>
          <View style={styles.toolbar}>
            <Pressable accessibilityRole="button" onPress={Keyboard.dismiss} style={styles.done}>
              <Text style={styles.doneText}>Concluir</Text>
            </Pressable>
          </View>
        </InputAccessoryView>
      )}
    </FormContext.Provider>
  );
}

export function FormInput({ onFocus, style, ...props }) {
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles(createStyles);
  const ref = useRef(null);
  const form = useContext(FormContext);
  return <TextInput placeholderTextColor={colors.placeholder} selectionColor={colors.primary} cursorColor={colors.primary} keyboardAppearance={isDark ? 'dark' : 'light'} {...props} ref={ref} style={[{ color: colors.textPrimary }, style, styles.input]} inputAccessoryViewID={Platform.OS === 'ios' ? form?.accessoryId : undefined} onFocus={(event) => { form?.focus(ref.current); onFocus?.(event); }} />;
}

const createStyles = (colors) => StyleSheet.create({
  input: { minHeight: 48, paddingVertical: 12 },
  toolbar: { backgroundColor: colors.surface, alignItems: 'flex-end', borderTopWidth: 1, borderColor: colors.border },
  done: { minHeight: 44, paddingHorizontal: 20, justifyContent: 'center' },
  doneText: { color: colors.textLink, fontSize: 17, fontWeight: '600' },
});
