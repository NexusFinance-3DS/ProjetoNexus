import React, { useState } from 'react';
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { View, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/inicio';
import barraNavegacao from '../styles/barraNavegacao';
import { getTotals, formatBRL, getPreviousTotals, getEconomiaComparison } from '../data/financeData';

export default function inicial() {
  const [menuAberto, setMenuAberto] = useState(null);

  // Metadados e totais
  const valorMeta = 30000.0;
  const valorTotalMeta = 100000;

  const totals = getTotals();
  const previousTotals = getPreviousTotals();
  const economiaComp = getEconomiaComparison();

  const renda = totals.totalReceitas;
  const despesa = totals.totalDespesas;

  // Distribuição (referente ao mês anterior)
  const gastosNecessidades = 300.0;
  const gastosDesejos = 100.0;
  const gastosInvestimentos = 0.0;

  const porcentagem = (valorMeta / valorTotalMeta) * 100;
  const titleMeta = "Viagem para a Europa";

  const distribuicao = [
    {
      label: "Necessidades",
      valor: gastosNecessidades,
      cor: "#5145FF",
      percentual: (gastosNecessidades / (previousTotals.totalReceitas || renda)) * 100,
    },
    {
      label: "Desejos",
      valor: gastosDesejos,
      cor: "#FF6B6B",
      percentual: (gastosDesejos / (previousTotals.totalReceitas || renda)) * 100,
    },
    {
      label: "Investimentos",
      valor: gastosInvestimentos,
      cor: "#2ED573",
      percentual: (gastosInvestimentos / (previousTotals.totalReceitas || renda)) * 100,
    },
  ];

  const totalDistribuido = gastosNecessidades + gastosDesejos + gastosInvestimentos;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <TouchableOpacity onPress={() => router.push('/perfil')}>
          <View style={styles.profileContaine}>
            <View style={styles.profileCircle}>
              <Icon name="person-outline" size={60} color="#FFF" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.nome}>Cesar Serra</Text>
              <Text style={styles.email}>cesar.serra@gmail.com</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/fluxoFinanceiro')}>
          <View style={styles.saldoContainer}>
            <Text style={styles.titleSaldo}>Saldo atual:</Text>
            <Text style={styles.valor}>{formatBRL(renda - despesa)}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>Visão Rápida</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 5, paddingRight: 100, paddingLeft: 10 }}>
            <View style={styles.card}>
              <TouchableOpacity onPress={() => router.push({ pathname: '/fluxoFinanceiro', params: { aba: 'Receitas' } })}>
                <Icon name="keyboard-double-arrow-up" size={38} color="#55ff00" />
                <Text style={styles.cardTitle}>Receitas</Text>
                <Text style={styles.cardValue}>{formatBRL(renda)}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <TouchableOpacity onPress={() => router.push({ pathname: '/fluxoFinanceiro', params: { aba: 'Despesas' } })}>
                <Icon name="keyboard-double-arrow-down" size={38} color="#ff0000" />
                <Text style={styles.cardTitle}>Despesas</Text>
                <Text style={styles.cardValue}>{formatBRL(despesa)}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <TouchableOpacity onPress={() => router.push('/dashboard')}>
                <Icon name="attach-money" size={38} color="#fff" />
                <Text style={styles.cardTitle}>Economia</Text>
                <Text style={styles.cardValue}>{formatBRL(totals.totalReceitas - totals.totalDespesas)}</Text>
                <Text style={{ fontSize: 12, marginTop: 4, color: economiaComp.diff >= 0 ? '#2ED573' : '#FF4D4D' }}>
                  ({economiaComp.percent >= 0 ? '+' : '-'}{Math.abs(economiaComp.percent).toFixed(1)}%) vs. mês anterior
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.metasContainer}>
            <View style={styles.metaCard}>
              <View style={styles.cardTitle}>
                <Text style={{ color: '#ffffff', borderRadius: 20, width: '60%', fontSize: 20 }}>Metas em andamento</Text>
                <Text style={{ color: '#ffffff', backgroundColor: '#4800fff9', borderRadius: 20, width: '30%', marginLeft: '10%', textAlign: 'center', fontSize: 12, fontWeight: '600', paddingTop: 5 }} onPress={() => router.push('/metas')}>Ver metas</Text>
              </View>
              <View style={styles.metaValue}>
                <View style={styles.graficos}>
                  <AnimatedCircularProgress size={110} width={10} fill={porcentagem} tintColor="#5145FF" backgroundColor="#23283A" rotation={0} lineCap="round">
                    {() => (
                      <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>{Math.round(porcentagem)}%</Text>
                    )}
                  </AnimatedCircularProgress>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={{ color: '#fff', fontSize: 18, marginLeft: '10%', marginTop: '10%', marginBottom: '-15%' }}>{titleMeta}</Text>
                    <View style={{ marginLeft: 20, marginTop: 50, width: 200, height: 6, backgroundColor: '#222', borderRadius: 10 }}>
                      <View style={{ width: `${porcentagem}%`, height: 6, backgroundColor: '#5145FF', borderRadius: 10 }} />
                    </View>
                    <Text style={{ color: '#fff', fontSize: 15, marginLeft: '25%', marginTop: '3%' }}>{formatBRL(valorMeta)} / {formatBRL(valorTotalMeta)}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.metasContainer}>
            <View style={styles.metaCard}>
              <View style={styles.distribuicaoHeader}>
                <Text style={styles.distribuicaoTitle}>Distribuição da renda (mês anterior)</Text>
              </View>

              <View style={styles.distribuicaoLista}>
                {distribuicao.map((item) => (
                  <View key={item.label} style={styles.distribuicaoItem}>
                    <View style={styles.distribuicaoLabelRow}>
                      <View style={[styles.colorDot, { backgroundColor: item.cor }]} />
                      <Text style={styles.distribuicaoLabel}>{item.label}</Text>
                      <Text style={styles.distribuicaoValor}>{formatBRL(item.valor)}</Text>
                    </View>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${Math.min(item.percentual, 100)}%`, backgroundColor: item.cor }]} />
                    </View>
                    <Text style={styles.percentText}>{item.percentual.toFixed(1)}% da renda</Text>
                  </View>
                ))}
              </View>

              <View style={styles.distribuicaoFooter}>
                <Text style={styles.footerText}>Restante (mês anterior): {formatBRL((previousTotals.totalReceitas || renda) - totalDistribuido)}</Text>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>

      {menuAberto != null && (
        <TouchableWithoutFeedback onPress={() => setMenuAberto(null)}>
          <View style={barraNavegacao.overlay} />
        </TouchableWithoutFeedback>
      )}

      {menuAberto === 'add' && (
        <View style={barraNavegacao.menuExpandido}>
          <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => { setMenuAberto(null); router.push('/receita/novaReceita'); }}>
            <Icon name="attach-money" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Receitas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => { setMenuAberto(null); router.push('/despesa/novaDespesa'); }}>
            <Icon name="receipt" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Despesas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => { setMenuAberto(null); router.push('/transacoes'); }}>
            <Icon name="swap-horiz" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Transações</Text>
          </TouchableOpacity>

          <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => { setMenuAberto(null); router.push('/categoria'); }}>
            <Icon name="category" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Categoria</Text>
          </TouchableOpacity>

          <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => { setMenuAberto(null); router.push('/metas'); }}>
            <Icon name="flag" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Metas</Text>
          </TouchableOpacity>
        </View>
      )}

      {menuAberto === 'more' && (
        <View style={barraNavegacao.menuExpandido}>
          <TouchableOpacity
            style={barraNavegacao.itemMenu}
            onPress={() => {
              setMenuAberto(null);
              router.push('/dashboard');
            }}
          >
            <Icon name="menu" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Dashboard</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={barraNavegacao.tabBar}>
        <TouchableOpacity style={barraNavegacao.tabItem} onPress={() => router.push('/inicial')} activeOpacity={0.8}>
          <Icon name="home" size={32} color="#ffffff" />
          <Text style={barraNavegacao.tabLabel}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={barraNavegacao.tabItem} onPress={() => router.push('/fluxoFinanceiro')} activeOpacity={0.8}>
          <Icon name="swap-horiz" size={32} color="#ffffff" />
          <Text style={barraNavegacao.tabLabel}>Fluxo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={barraNavegacao.tabItem} onPress={() => setMenuAberto(menuAberto === 'add' ? null : 'add')} activeOpacity={0.8}>
          <Icon name={menuAberto != null ? "close" : "add-circle"} size={56} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={barraNavegacao.tabItem} onPress={() => router.push('/metas')} activeOpacity={0.8}>
          <Icon name="radar" size={32} color="#ffffff" />
          <Text style={barraNavegacao.tabLabel}>Metas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={barraNavegacao.tabItem} onPress={() => setMenuAberto(menuAberto === 'more' ? null : 'more')} activeOpacity={0.8}>
          <Icon name="menu" size={32} color="#ffffff" />
          <Text style={barraNavegacao.tabLabel}>mais</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

