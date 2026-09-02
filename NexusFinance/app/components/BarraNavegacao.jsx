import React, { useState } from "react";
import { View, Text, Pressable, TouchableWithoutFeedback } from "react-native";
import { router, usePathname } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";

import { colors, radii, shadow } from "../styles/theme";

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
    const fabStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        hitSlop={10}
        style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
      >
        <Animated.View
          style={[
            fabStyle,
            {
              width: 70,
              height: 70,
              borderRadius: 35,
              alignItems: "center",
              justifyContent: "center",
              marginTop: -30,
              backgroundColor: colors.primary,
              borderWidth: 4,
              borderColor: colors.backgroundAlt,
              ...shadow.soft,
            },
          ]}
        >
          <Icon name="add" size={37} color={colors.textLink} />
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      hitSlop={8}
      style={{ flex: 1, alignItems: "center", justifyContent: "center", minHeight: 58 }}
    >
      <Animated.View style={[style, { alignItems: "center" }]}>
        <View
          style={{
            paddingHorizontal: 14,
            paddingVertical: 4,
            borderRadius: radii.pill,
            backgroundColor: isActive || isOpen ? colors.primarySoft : "transparent",
          }}
        >
          <Icon
            name={tab.key === "more" && isOpen ? "close" : tab.icon}
            size={24}
            color={isActive || isOpen ? colors.primary : colors.textSecondary}
          />
        </View>
        <Text
          style={{
            fontSize: 10,
            marginTop: 3,
            fontWeight: isActive ? "700" : "500",
            color: isActive || isOpen ? colors.primary : colors.textSecondary,
          }}
        >
          {tab.label}
        </Text>
        {isActive && (
          <View
            style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: colors.primary,
              marginTop: 3,
            }}
          />
        )}
      </Animated.View>
    </Pressable>
  );
}

function MenuExpandido({ items, onSelect }) {
  const progress = useSharedValue(0);
  React.useEffect(() => {
    progress.value = withTiming(1, { duration: 200 });
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 14 }],
  }));

  return (
    <Animated.View
      style={[
        animStyle,
        {
          position: "absolute",
          bottom: 92,
          width: "94%",
          maxWidth: 420,
          alignSelf: "center",
          paddingHorizontal: 8,
          backgroundColor: colors.surfaceAlt,
          borderRadius: radii.lg,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-around",
          zIndex: 9,
          borderWidth: 1,
          borderColor: colors.border,
          ...shadow.soft,
        },
      ]}
    >
      {items.map((item) => (
        <Pressable
          key={item.label}
          onPress={() => onSelect(item.route)}
          style={({ pressed }) => ({
            alignItems: "center",
            justifyContent: "center",
            width: "22%",
            paddingVertical: 10,
            marginVertical: 4,
            borderRadius: radii.md,
            backgroundColor: pressed ? colors.primarySoft : "transparent",
          })}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.primarySoft,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 6,
            }}
          >
            <Icon name={item.icon} size={22} color={colors.primary} />
          </View>
          <Text style={{ color: colors.textPrimary, fontSize: 11, fontWeight: "600", textAlign: "center" }}>
            {item.label}
          </Text>
        </Pressable>
      ))}
    </Animated.View>
  );
}

export default function BarraNavegacao() {
  const [menuAberto, setMenuAberto] = useState(null);
  const pathname = usePathname();

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

  return (
    <>
      {menuAberto != null && (
        <TouchableWithoutFeedback onPress={() => setMenuAberto(null)}>
          <Animated.View
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(150)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: colors.overlay,
              zIndex: 8,
            }}
          />
        </TouchableWithoutFeedback>
      )}

      {menuAberto === "add" && <MenuExpandido items={ADD_ACTIONS} onSelect={irPara} />}
      {menuAberto === "more" && <MenuExpandido items={MORE_ACTIONS} onSelect={irPara} />}

      <View
        style={{
          position: "absolute",
          bottom: 8,
          alignSelf: "center",
          width: "94%",
          maxWidth: 420,
          zIndex: 10,
          flexDirection: "row",
          height: 76,
          borderRadius: radii.xl,
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: 6,
          alignItems: "center",
          backgroundColor: colors.backgroundAlt,
          ...shadow.soft,
        }}
      >
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
