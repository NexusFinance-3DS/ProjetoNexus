import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import BarraNavegacao from '../components/BarraNavegacao';
import { AnimatedScreen } from '../components/AnimatedScreen';
import FinancialOverview from '../../components/FinancialOverview';
import { useAppStyles } from '../styles/styles';
import { useResumoFinanceiro } from '../../hooks/useResumoFinanceiro';

export default function Dashboard() {
  const { colors, dashboardStyles: styles, sharedStyles } = useAppStyles();
  const { dados, erro, carregando, recarregar } = useResumoFinanceiro();
  return (
    <AnimatedScreen style={styles.container} delay={60}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[sharedStyles.paddingBottom120, { paddingHorizontal: 16 }]}
      >
        {carregando ? (
          <ActivityIndicator accessibilityLabel="Carregando dashboard" color={colors.primary} />
        ) : erro ? (
          <View>
            <Text style={sharedStyles.errorText}>{erro}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={recarregar}
              style={{ minHeight: 44, justifyContent: 'center' }}
            >
              <Text style={{ color: colors.textLink }}>Tentar novamente</Text>
            </Pressable>
          </View>
        ) : (
          <FinancialOverview dados={dados} />
        )}
      </ScrollView>
      <BarraNavegacao />
    </AnimatedScreen>
  );
}
