import React from 'react';
import { Platform, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function ProgressRing(props) {
  if (Platform.OS !== 'web') return <AnimatedCircularProgress {...props} />;
  // The library's SVG transform-origin attribute is invalid in React DOM.
  const { size, width, fill, tintColor, backgroundColor, children } = props;
  const progress = Math.max(0, Math.min(100, Number(fill) || 0));
  const radius = (size - width) / 2;
  const length = 2 * Math.PI * radius;
  return <View style={{ width: size, height: size }} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: progress }}>
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={size / 2} cy={size / 2} r={radius} stroke={backgroundColor} strokeWidth={width} fill="none" />
      <Circle cx={size / 2} cy={size / 2} r={radius} stroke={tintColor} strokeWidth={width} fill="none" strokeDasharray={`${length} ${length}`} strokeDashoffset={length * (1 - progress / 100)} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} />
    </Svg>
    <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>{typeof children === 'function' ? children(progress) : children}</View>
  </View>;
}
