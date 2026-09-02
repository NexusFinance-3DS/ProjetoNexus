import React, { useState } from "react";
import BarraNavegacao from '../components/BarraNavegacao';
import { AnimatedCard, AnimatedScreen } from '../components/AnimatedScreen';
import { View, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from "react-native";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

import { PieChart, LineChart } from "react-native-chart-kit";

import styles from "../styles/dashboard";
import { getTotals, formatBRL } from '../data/financeData';

export default function Dashboard() {
  const screenWidth = 340;

  const pieData = [
    { name: "Alimentação", population: 981, color: "#6C63FF", legendFontColor: "#FFF", legendFontSize: 13 },
    { name: "Transporte", population: 654, color: "#5145FF", legendFontColor: "#FFF", legendFontSize: 13 },
    { name: "Lazer", population: 490, color: "#7C6BFF", legendFontColor: "#FFF", legendFontSize: 13 },
    { name: "Moradia", population: 817, color: "#291CFF", legendFontColor: "#FFF", legendFontSize: 13 },
    { name: "Outros", population: 328, color: "#666", legendFontColor: "#FFF", legendFontSize: 13 },
  ];

  const lineData = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul"],
    datasets: [{ data: [1200, 2500, 3200, 2400, 3000, 4200, 5000] }],
  };

  const totals = getTotals();
  const receitasPercent = Math.round((totals.totalReceitas / (totals.totalReceitas + totals.totalDespesas)) * 100);
  const despesasPercent = 100 - receitasPercent;

  return (
    <AnimatedScreen style={styles.container} delay={60}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <AnimatedCard style={styles.card} delay={40}>
          <Text style={styles.cardTitle}>Gastos por categoria</Text>

          <View style={styles.graficoContainer}>
            <View style={styles.pieWrapper}>
              <PieChart
                data={pieData}
                width={200}
                height={120}
                accessor="population"
                backgroundColor="transparent"
                hasLegend={false}
                chartConfig={{ color: () => "#FFF" }}
                style={styles.pieChart}
              />
            </View>

            <View style={styles.legenda}>
              {pieData.map((item, index) => (
                <View key={index} style={styles.itemLegenda}>
                  <View style={[styles.corLegenda, { backgroundColor: item.color }]} />
                  <Text style={styles.textoLegenda}>{item.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </AnimatedCard>

        <AnimatedCard style={styles.card} delay={120}>
          <Text style={styles.cardTitle}>Evolução de saldo</Text>

          <LineChart
            data={lineData}
            width={screenWidth - 40}
            height={190}
            withDots={false}
            withShadow={false}
            withInnerLines={true}
            withOuterLines={false}
            bezier
            chartConfig={{
              backgroundGradientFrom: "#1c1c1c",
              backgroundGradientTo: "#1c1c1c",
              decimalPlaces: 0,
              color: () => "#5145FF",
              labelColor: () => "#AAA",
            }}
            style={{
              borderRadius: 15,
              marginTop: 10,
              marginBottom: 10,
              marginLeft: 10,
              marginRight: -25,
            }}
          />
        </AnimatedCard>

        <AnimatedCard style={styles.card} delay={180}>
          <Text style={styles.cardTitle}>Resumo do mês</Text>

          <View style={styles.resumoItem}>
            <View style={styles.iconGreen}>
              <Icon name="arrow-upward" size={34} color="#00FF66" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.resumoTitulo}>Receitas</Text>
              <Text style={styles.resumoValor}>{formatBRL(totals.totalReceitas)}</Text>

              <View style={styles.progress}>
                <View style={[styles.progressFill, { width: `${receitasPercent}%` }]} />
              </View>
            </View>

            <Text style={styles.percent}>78%</Text>
          </View>

          <View style={styles.resumoItem}>
            <View style={styles.iconRed}>
              <Icon name="arrow-downward" size={34} color="#FF3030" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.resumoTitulo}>Despesas</Text>
              <Text style={styles.resumoValor}>{formatBRL(totals.totalDespesas)}</Text>

              <View style={styles.progress}>
                <View style={[styles.progressFill, { width: `${despesasPercent}%` }]} />
              </View>
            </View>

            <Text style={styles.percent}>22%</Text>
          </View>
        </AnimatedCard>

        <View style={{ height: 100 }} />
      </ScrollView>

      <BarraNavegacao />
    </AnimatedScreen>
  );
}