import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useEstilosApp } from '../style/style';

/** Container visual compartilhado pelos cards do painel financeiro. */
export default function CartaoPainel({ children, style, ...props }) {
  const { cores } = useEstilosApp();
  const styles = useMemo(() => StyleSheet.create({
    card: {
      padding: 18,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: cores.borda,
      backgroundColor: cores.superficie,
    },
  }), [cores]);

  return <View {...props} style={[styles.card, style]}>{children}</View>;
}
