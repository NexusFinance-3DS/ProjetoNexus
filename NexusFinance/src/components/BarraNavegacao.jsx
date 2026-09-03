import { useKeyboardState } from 'react-native-keyboard-controller';
import { scaleAnimationStyle, addTabButtonStyle, floatingAddButtonStyle, tabButtonStyle, centerItemsStyle, tabBadgeStyle, tabLabelStyle, activeTabDotStyle, menuAnimationStyle, expandedMenuStyle, menuActionStyle, menuIconStyle, menuLabelStyle, navigationOverlayStyle, navigationBarStyle, colors } from '../../src/styles';
import React, { useState } from "react";
import { View, Text, Pressable, TouchableWithoutFeedback } from "react-native";
import { router, usePathname } from "expo-router";
import Icon from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, FadeIn, FadeOut } from "react-native-reanimated";
const TABS = [{
  key: "inicial",
  route: "/inicial",
  label: "Início",
  icon: "home"
}, {
  key: "fluxoFinanceiro",
  route: "/fluxoFinanceiro",
  label: "Fluxo",
  icon: "swap-horiz"
}, {
  key: "add",
  route: null,
  label: "",
  icon: "add"
}, {
  key: "metas",
  route: "/metas",
  label: "Metas",
  icon: "radar"
}, {
  key: "more",
  route: null,
  label: "Mais",
  icon: "menu"
}];
const ADD_ACTIONS = [{
  label: "Receitas",
  icon: "attach-money",
  route: "/receita/novaReceita"
}, {
  label: "Despesas",
  icon: "receipt",
  route: "/despesa/novaDespesa"
}, {
  label: "Categoria",
  icon: "category",
  route: "/categoria"
}, {
  label: "Metas",
  icon: "flag",
  route: "/metas"
}];
const MORE_ACTIONS = [{
  label: "Dashboard",
  icon: "bar-chart",
  route: "/dashboard"
}, {
  label: "Relatórios",
  icon: "description",
  route: "/relatorios"
}, {
  label: "Perfil",
  icon: "person",
  route: "/perfil"
}, {
  label: "Config.",
  icon: "settings",
  route: "/configuracoes"
}];
function AnimatedTabButton({
  tab,
  isActive,
  isOpen,
  onPress
}) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => scaleAnimationStyle(scale));
  const handlePressIn = () => {
    scale.value = withTiming(0.92, {
      duration: 90
    });
  };
  const handlePressOut = () => {
    scale.value = withTiming(1, {
      duration: 120
    });
  };
  if (tab.key === "add") {
    return <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress} hitSlop={10} style={addTabButtonStyle}>
        <Animated.View style={[style, floatingAddButtonStyle]}>
          <Icon name="add" size={37} color={colors.textLink} />
        </Animated.View>
      </Pressable>;
  }
  return <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress} hitSlop={8} style={tabButtonStyle}>
      <Animated.View style={[style, centerItemsStyle]}>
        <View style={tabBadgeStyle(isActive, isOpen)}>
          <Icon name={tab.key === "more" && isOpen ? "close" : tab.icon} size={24} color={isActive || isOpen ? colors.primary : colors.textSecondary} />
        </View>
        <Text style={tabLabelStyle(isActive, isOpen)}>
          {tab.label}
        </Text>
        {isActive && <View style={activeTabDotStyle} />}
      </Animated.View>
    </Pressable>;
}
function MenuExpandido({
  items,
  onSelect
}) {
  const progress = useSharedValue(0);
  React.useEffect(() => {
    progress.value = withTiming(1, {
      duration: 200
    });
  }, [progress]);
  const animStyle = useAnimatedStyle(() => menuAnimationStyle(progress));
  return <Animated.View style={[animStyle, expandedMenuStyle]}>
      {items.map(item => <Pressable key={item.label} onPress={() => onSelect(item.route)} style={({
      pressed
    }) => menuActionStyle(pressed)}>
          <View style={menuIconStyle}>
            <Icon name={item.icon} size={22} color={colors.primary} />
          </View>
          <Text style={menuLabelStyle}>
            {item.label}
          </Text>
        </Pressable>)}
    </Animated.View>;
}
export default function BarraNavegacao() {
  const [menuAberto, setMenuAberto] = useState(null);
  const pathname = usePathname();
  const keyboardVisible = useKeyboardState(state => state.isVisible);
  const irPara = route => {
    setMenuAberto(null);
    if (route) router.push(route);
  };
  const handleTabPress = tab => {
    if (Haptics?.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    if (tab.key === "add" || tab.key === "more") {
      setMenuAberto(prev => prev === tab.key ? null : tab.key);
    } else {
      irPara(tab.route);
    }
  };

  // Keep the focused field clear of the floating navigation while typing.
  if (keyboardVisible) return null;
  return <>
      {menuAberto != null && <TouchableWithoutFeedback onPress={() => setMenuAberto(null)}>
          <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(150)} style={navigationOverlayStyle} />
        </TouchableWithoutFeedback>}

      {menuAberto === "add" && <MenuExpandido items={ADD_ACTIONS} onSelect={irPara} />}
      {menuAberto === "more" && <MenuExpandido items={MORE_ACTIONS} onSelect={irPara} />}

      <View style={navigationBarStyle}>
        {TABS.map(tab => <AnimatedTabButton key={tab.key} tab={tab} isActive={tab.route ? pathname?.includes(tab.route) : false} isOpen={menuAberto === tab.key} onPress={() => handleTabPress(tab)} />)}
      </View>
    </>;
}
