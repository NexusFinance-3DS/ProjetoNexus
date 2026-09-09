import { useTheme } from '../../contexts/ThemeContext';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { AnimatedScreen } from '../components/AnimatedScreen';
import { TransactionSelectors } from '../../components/TransactionOptions';
import { useTransactionOptions } from '../../hooks/useTransactionOptions';

function CategoriasDoTipo({ tipo }) {
  const options = useTransactionOptions(tipo);
  return <TransactionSelectors options={options} showAccountType={false} />;
}

export default function Categorias() {
  const { colors } = useTheme();
  const [tipo, setTipo] = useState('Receita');
  return <AnimatedScreen maxWidth={560} style={{ flex: 1, backgroundColor: colors.background }}>
    <ScrollView contentContainerStyle={{ paddingVertical: 20, paddingBottom: 60 }}>
      <View style={{ flexDirection: 'row', gap: 12, marginHorizontal: 16, marginBottom: 24 }}>
        {['Receita', 'Despesa'].map((item) => <Pressable key={item} accessibilityRole="tab" accessibilityState={{ selected: tipo === item }} onPress={() => setTipo(item)} style={{ flex: 1, padding: 14, borderRadius: 12, backgroundColor: tipo === item ? colors.primary : colors.input }}><Text style={{ color: tipo === item ? colors.onPrimary : colors.textPrimary, fontSize: 16, textAlign: 'center' }}>{item === 'Receita' ? 'Receitas' : 'Despesas'}</Text></Pressable>)}
      </View>
      <CategoriasDoTipo key={tipo} tipo={tipo} />
    </ScrollView>
  </AnimatedScreen>;
}
