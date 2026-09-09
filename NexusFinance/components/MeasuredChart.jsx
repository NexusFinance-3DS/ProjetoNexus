import React, { useState } from 'react';
import { View } from 'react-native';

// Measure the actual card content, including split-screen and rotation changes.
export default function MeasuredChart({ children }) {
  const [width, setWidth] = useState(0);
  return (
    <View style={{ width: '100%', overflow: 'hidden' }} onLayout={({ nativeEvent }) => setWidth(Math.floor(nativeEvent.layout.width))}>
      {width > 0 ? children(width) : null}
    </View>
  );
}
