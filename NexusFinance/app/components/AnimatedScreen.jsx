import { useTheme } from '../../contexts/ThemeContext';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader, { ScreenHeaderHeightContext } from '../../components/ScreenHeader';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export function AnimatedScreen({ children, style, delay = 0, direction = 'up', maxWidth = 960, animated = true }) {
  const { colors } = useTheme();
  const [headerHeight, setHeaderHeight] = useState(0);
  const insets = useSafeAreaInsets();
  const entering = direction === 'down' ? FadeInDown.delay(delay).duration(420).springify() : FadeInUp.delay(delay).duration(420);
  const Container = animated ? Animated.View : View;

  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: StyleSheet.flatten(style)?.backgroundColor || colors.background }}>
    <View style={{ flex: 1, width: '100%', maxWidth, alignSelf: 'center' }}>
    <ScreenHeader onLayout={({ nativeEvent }) => setHeaderHeight(nativeEvent.layout.height)} />
    <ScreenHeaderHeightContext.Provider value={headerHeight + insets.top}>
    <Container {...(animated ? { entering } : {})} style={[style, { flex: 1, width: '100%', maxWidth, alignSelf: 'center' }]}>
      {children}
    </Container>
    </ScreenHeaderHeightContext.Provider>
    </View>
    </SafeAreaView>
  );
}

export function AnimatedCard({ children, style, delay = 0, direction = 'down' }) {
  const entering = direction === 'up' ? FadeInUp.delay(delay).duration(420) : FadeInDown.delay(delay).duration(420).springify();

  return (
    <Animated.View entering={entering} style={style}>
      {children}
    </Animated.View>
  );
}

export function AnimatedPressable({ children, style, onPress, delay = 0, direction = 'down' }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={direction === 'up' ? FadeInUp.delay(delay).duration(120) : FadeInDown.delay(delay).duration(420).springify()} style={animStyle}>
      <Pressable
        style={style}
        onPressIn={() => {
          scale.value = withSpring(0.97, { damping: 12, stiffness: 220 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 10, stiffness: 200 });
        }}
        onPress={onPress}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
