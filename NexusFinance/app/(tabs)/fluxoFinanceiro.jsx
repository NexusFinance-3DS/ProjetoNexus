import React, { useMemo, useState } from 'react';
import BarraNavegacao from '../components/BarraNavegacao';
import { AnimatedCard, AnimatedScreen } from '../components/AnimatedScreen';
import { View, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/fluxoFinanceiro';
import { transacoes } from '../data/financeData';

export default function fluxoFinanceiro() {
  const { aba } = useLocalSearchParams();
  const [abaSelecionada, setAbaSelecionada] = useState(aba || 'Geral');

  const totalReceitas = useMemo(
    () => transacoes.filter(item => item.tipo === 'Receitas').reduce((sum, item) => sum + item.valor, 0),
    [transacoes]
  );

  const totalDespesas = useMemo(
    () => transacoes.filter(item => item.tipo === 'Despesas').reduce((sum, item) => sum + item.valor, 0),
    [transacoes]
  );

  const transacoesFiltradas = useMemo(
    () =>
      abaSelecionada === 'Geral'
        ? transacoes
        : transacoes.filter(item => item.tipo === abaSelecionada),
    [abaSelecionada, transacoes]
  );

  return (
    <AnimatedScreen style={styles.container} delay={60}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <AnimatedCard style={styles.filtroContainer} delay={40}>
          {['Geral', 'Receitas', 'Despesas'].map(option => (
            <TouchableOpacity
              key={option}
              style={[styles.botaoFiltro, abaSelecionada === option && styles.botaoAtivo]}
              onPress={() => setAbaSelecionada(option)}
            >
              <Text style={[styles.textoFiltro, abaSelecionada === option && styles.textoAtivo]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </AnimatedCard>

        <View style={styles.resumoContainer}>
          <AnimatedCard style={styles.resumoCard} delay={90}>
            <Text style={styles.resumoLabel}>Saldo</Text>
            <Text style={styles.resumoValue}>R$ {(totalReceitas - totalDespesas).toFixed(2)}</Text>
          </AnimatedCard>
          <AnimatedCard style={styles.resumoCard} delay={140}>
            <Text style={styles.resumoLabel}>Receitas</Text>
            <Text style={styles.resumoValue}>R$ {totalReceitas.toFixed(2)}</Text>
          </AnimatedCard>
          <AnimatedCard style={styles.resumoCard} delay={190}>
            <Text style={styles.resumoLabel}>Despesas</Text>
            <Text style={styles.resumoValue}>R$ {totalDespesas.toFixed(2)}</Text>
          </AnimatedCard>
        </View>

        <AnimatedCard style={styles.dados} delay={220}>
          <Text style={styles.dadosTitulo}>{abaSelecionada === 'Geral' ? 'Transações Recentes' : abaSelecionada}</Text>
          {transacoesFiltradas.map((item, index) => (
            <AnimatedCard key={item.id} style={styles.transacaoItem} delay={260 + index * 50}>
              <View>
                <Text style={styles.transacaoDescricao}>{item.descricao}</Text>
                <Text style={styles.transacaoCategoria}>{item.categoria}</Text>
              </View>
              <View style={styles.transacaoDireita}>
                <Text style={[styles.transacaoValor, item.tipo === 'Receitas' ? styles.receita : styles.despesa]}>
                  {item.tipo === 'Receitas' ? '+' : '-'} R$ {item.valor.toFixed(2)}
                </Text>
                <Text style={styles.transacaoData}>{item.data}</Text>
              </View>
            </AnimatedCard>
          ))}

          {transacoesFiltradas.length === 0 && (
            <Text style={styles.dadosTexto}>Nenhuma transação encontrada para essa categoria.</Text>
          )}
        </AnimatedCard>
      </ScrollView>

      <BarraNavegacao />
    </AnimatedScreen>
  );
}