import { scaleAnimationStyle } from '../../src/styles';
import { Pressable } from 'react-native';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
export function AnimatedScreen({
  children,
  style,
  delay = 0,
  direction = 'up'
}) {
  const entering = direction === 'down' ? FadeInDown.delay(delay).duration(420).springify() : FadeInUp.delay(delay).duration(420);
  return <Animated.View entering={entering} style={style}>
      {children}
    </Animated.View>;
}
export function AnimatedCard({
  children,
  style,
  delay = 0,
  direction = 'down'
}) {
  const entering = direction === 'up' ? FadeInUp.delay(delay).duration(420) : FadeInDown.delay(delay).duration(420).springify();
  return <Animated.View entering={entering} style={style}>
      {children}
    </Animated.View>;
}
export function AnimatedPressable({
  children,
  style,
  onPress,
  delay = 0,
  direction = 'down'
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => scaleAnimationStyle(scale));
  return <Animated.View entering={direction === 'up' ? FadeInUp.delay(delay).duration(120) : FadeInDown.delay(delay).duration(420).springify()} style={animStyle}>
      <Pressable style={style} onPressIn={() => {
      scale.value = withSpring(0.97, {
        damping: 12,
        stiffness: 220
      });
    }} onPressOut={() => {
      scale.value = withSpring(1, {
        damping: 10,
        stiffness: 200
      });
    }} onPress={onPress}>
        {children}
      </Pressable>
    </Animated.View>;
}
