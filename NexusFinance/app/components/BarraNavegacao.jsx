import { ScreenHeaderHeightContext } from "../../components/ScreenHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useState } from "react";
import { View, Text, Pressable, TouchableWithoutFeedback, Keyboard, ScrollView, useWindowDimensions } from "react-native";
import { router, usePathname } from "expo-router";
import Icon from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";

import { useAppStyles } from "../styles/styles";

const TABS = [
  { key: "inicial", route: "/inicial", label: "Início", icon: "home" },
  { key: "fluxoFinanceiro", route: "/fluxoFinanceiro", label: "Fluxo", icon: "swap-horiz" },
  { key: "add", route: null, label: "", icon: "add" },
  { key: "metas", route: "/metas", label: "Metas", icon: "radar" },
  { key: "more", route: null, label: "Mais", icon: "menu" },
];

const ADD_ACTIONS = [
  { label: "Receitas", icon: "attach-money", route: "/receita/novaReceita" },
  { label: "Despesas", icon: "receipt", route: "/despesa/novaDespesa" },
  { label: "Categoria", icon: "category", route: "/categoria" },
  { label: "Metas", icon: "flag", route: "/metas" },
];

const MORE_ACTIONS = [
  { label: "Dashboard", icon: "bar-chart", route: "/dashboard" },
  { label: "Relatórios", icon: "description", route: "/relatorios" },
  { label: "Perfil", icon: "person", route: "/perfil" },
  { label: "Config.", icon: "settings", route: "/configuracoes" },
];

function AnimatedTabButton({ tab, isActive, isOpen, onPress }) {
  const { barraNavegacaoStyles: styles, colors } = useAppStyles();
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.92, { duration: 90 });
  };
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 120 });
  };

  if (tab.key === "add") {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Adicionar"
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        hitSlop={10}
        style={styles.fabPressable}
      >
        <Animated.View
          style={[
            style,
            styles.fab,
          ]}
        >
          <Icon name="add" size={37} color={colors.onPrimary} />
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={tab.label}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      hitSlop={8}
      style={styles.tabPressable}
    >
      <Animated.View style={[style, styles.tabAnimatedContent]}>
        <View
          style={[
            styles.tabPill,
            { backgroundColor: isActive || isOpen ? colors.primarySoft : "transparent" },
          ]}
        >
          <Icon
            name={tab.key === "more" && isOpen ? "close" : tab.icon}
            size={24}
            color={isActive || isOpen ? colors.primary : colors.textSecondary}
          />
        </View>
        <Text
          style={[
            styles.tabText,
            {
              fontWeight: isActive ? "700" : "500",
              color: isActive || isOpen ? colors.primary : colors.textSecondary,
            },
          ]}
        >
          {tab.label}
        </Text>
        {isActive && (
          <View style={styles.activeDot} />
        )}
      </Animated.View>
    </Pressable>
  );
}

function MenuExpandido({ items, onSelect }) {
  const { barraNavegacaoStyles: styles, colors } = useAppStyles();
  const { height } = useWindowDimensions();
  const headerHeight = React.useContext(ScreenHeaderHeightContext);
  const insets = useSafeAreaInsets();
  const progress = useSharedValue(0);
  React.useEffect(() => {
    progress.value = withTiming(1, { duration: 200 });
  }, [progress]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 14 }],
  }));

  return (
    <Animated.View
      style={[
        animStyle,
        styles.expandedMenu,
      ]}
    >
      <ScrollView style={{ maxHeight: Math.max(80, height - headerHeight - insets.bottom - 110), width: "100%" }} contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around" }}>
      {items.map((item) => (
        <Pressable
          key={item.label}
          onPress={() => onSelect(item.route)}
          style={({ pressed }) => [
            styles.expandedMenuItem,
            { backgroundColor: pressed ? colors.primarySoft : "transparent" },
          ]}
        >
          <View style={styles.expandedMenuIcon}>
            <Icon name={item.icon} size={22} color={colors.primary} />
          </View>
          <Text style={styles.expandedMenuLabel}>
            {item.label}
          </Text>
        </Pressable>
      ))}
      </ScrollView>
    </Animated.View>
  );
}

export default function BarraNavegacao() {
  const { barraNavegacaoStyles: styles } = useAppStyles();
  const [menuAberto, setMenuAberto] = useState(null);
  const pathname = usePathname();
  const [keyboardVisible, setKeyboardVisible] = useState(Keyboard.isVisible());
  React.useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => { setKeyboardVisible(true); setMenuAberto(null); });
    const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  const irPara = (route) => {
    setMenuAberto(null);
    if (route) router.push(route);
  };

  const handleTabPress = (tab) => {
    if (Haptics?.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    if (tab.key === "add" || tab.key === "more") {
      setMenuAberto((prev) => (prev === tab.key ? null : tab.key));
    } else {
      irPara(tab.route);
    }
  };

  if (keyboardVisible) return null;

  return (
    <>
      {menuAberto != null && (
        <TouchableWithoutFeedback onPress={() => setMenuAberto(null)}>
          <Animated.View
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(150)}
            style={styles.currentOverlay}
          />
        </TouchableWithoutFeedback>
      )}

      {menuAberto === "add" && <MenuExpandido items={ADD_ACTIONS} onSelect={irPara} />}
      {menuAberto === "more" && <MenuExpandido items={MORE_ACTIONS} onSelect={irPara} />}

      <View style={styles.currentTabBar}>
        {TABS.map((tab) => (
          <AnimatedTabButton
            key={tab.key}
            tab={tab}
            isActive={tab.route ? pathname?.includes(tab.route) : false}
            isOpen={menuAberto === tab.key}
            onPress={() => handleTabPress(tab)}
          />
        ))}
      </View>
    </>
  );
}
