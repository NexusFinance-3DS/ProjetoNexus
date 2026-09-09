import MeasuredChart from "../../components/MeasuredChart";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { LineChart, PieChart } from "react-native-chart-kit";
import BarraNavegacao from "../components/BarraNavegacao";
import { AnimatedCard, AnimatedScreen } from "../components/AnimatedScreen";
import { useAppStyles } from "../styles/styles";
import { formatBRL } from "../../services/financeiro";
import { useResumoFinanceiro } from "../../hooks/useResumoFinanceiro";

export default function Dashboard() {
  const { colors, dashboardStyles: styles, sharedStyles } = useAppStyles();
  const { dados, erro } = useResumoFinanceiro();
  const totals = dados.atual;
  const totalMovimentado = totals.totalReceitas + totals.totalDespesas;
  const receitasPercent = totalMovimentado > 0 ? Math.round((totals.totalReceitas / totalMovimentado) * 100) : 0;
  const despesasPercent = totalMovimentado > 0 ? 100 - receitasPercent : 0;
  const pieData = dados.categorias.map((item, index) => ({
    name: item.nome,
    population: item.valor,
    color: [colors.primary, colors.chartPurple, colors.chartBlue, colors.chartOrange, colors.danger, colors.success][index % 6],
    legendFontColor: colors.textPrimary,
    legendFontSize: 13,
  }));
  const lineData = {
    labels: dados.historico.map((item) => item.periodo.slice(5)),
    datasets: [{ data: dados.historico.map((item) => item.saldo) }],
  };

  return (
    <AnimatedScreen style={styles.container} delay={60}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={sharedStyles.paddingBottom120}>
        {erro ? <Text style={sharedStyles.errorText}>{erro}</Text> : null}
        <AnimatedCard style={styles.card} delay={40}>
          <Text style={styles.cardTitle}>Gastos por categoria</Text>
          {pieData.length ? (
            <View style={styles.graficoContainer}>
              <View style={styles.pieWrapper}><PieChart data={pieData} width={200} height={120} accessor="population" backgroundColor="transparent" hasLegend={false} chartConfig={{ color: () => colors.textPrimary }} style={styles.pieChart} /></View>
              <View style={styles.legenda}>{pieData.map((item) => <View key={item.name} style={styles.itemLegenda}><View style={[styles.corLegenda, { backgroundColor: item.color }]} /><Text style={styles.textoLegenda}>{item.name}</Text></View>)}</View>
            </View>
          ) : <Text style={sharedStyles.errorText}>Cadastre despesas para visualizar o gráfico.</Text>}
        </AnimatedCard>

        <AnimatedCard style={styles.card} delay={120}>
          <Text style={styles.cardTitle}>Evolução de saldo</Text>
          {lineData.labels.length ? (
            <MeasuredChart>{(width) => <LineChart data={lineData} width={width} height={190} withDots={false} withShadow={false} withOuterLines={false} chartConfig={{ backgroundGradientFrom: colors.surface, backgroundGradientTo: colors.surface, decimalPlaces: 0, color: () => colors.primary, labelColor: () => colors.textSecondary }} style={sharedStyles.dashboardChart} />}</MeasuredChart>
          ) : <Text style={sharedStyles.errorText}>Ainda não existem dados para este período.</Text>}
        </AnimatedCard>

        <AnimatedCard style={styles.card} delay={180}>
          <Text style={styles.cardTitle}>Resumo do mês</Text>
          <View style={styles.resumoItem}><View style={styles.iconGreen}><Icon name="arrow-upward" size={34} color={colors.success} /></View><View style={sharedStyles.flex}><Text style={styles.resumoTitulo}>Receitas</Text><Text style={styles.resumoValor}>{formatBRL(totals.totalReceitas)}</Text><View style={styles.progress}><View style={[styles.progressFill, { width: `${receitasPercent}%` }]} /></View></View><Text style={styles.percent}>{receitasPercent}%</Text></View>
          <View style={styles.resumoItem}><View style={styles.iconRed}><Icon name="arrow-downward" size={34} color={colors.danger} /></View><View style={sharedStyles.flex}><Text style={styles.resumoTitulo}>Despesas</Text><Text style={styles.resumoValor}>{formatBRL(totals.totalDespesas)}</Text><View style={styles.progress}><View style={[styles.progressFill, { width: `${despesasPercent}%` }]} /></View></View><Text style={styles.percent}>{despesasPercent}%</Text></View>
        </AnimatedCard>
      </ScrollView>
      <BarraNavegacao />
    </AnimatedScreen>
  );
}
