import MeasuredChart from "../../components/MeasuredChart";
import React, { useState } from "react";
import { Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { StackedBarChart } from "react-native-chart-kit";
import Icon from "@expo/vector-icons/MaterialIcons";
import BarraNavegacao from "../components/BarraNavegacao";
import { AnimatedCard, AnimatedScreen } from "../components/AnimatedScreen";
import { useAppStyles } from "../styles/styles";
import { formatBRL, today } from "../../services/financeiro";
import { useResumoFinanceiro } from "../../hooks/useResumoFinanceiro";
import { exportarRelatorio } from "../../services/relatorio";

export default function Relatorios() {
  const { colors, relatoriosStyles: styles, sharedStyles } = useAppStyles();
  const [periodo, setPeriodo] = useState("Mês");
  const { dados, erro, carregando } = useResumoFinanceiro();
  const [exportando, setExportando] = useState(false);
  const [erroExportacao, setErroExportacao] = useState('');
  const totals = dados.atual;
  const history = periodo === "Mês" ? [{ periodo: today().slice(0, 7), receitas: totals.totalReceitas, despesas: totals.totalDespesas, saldo: totals.saldo }] : dados.historico;
  const reportTotals = periodo === "Mês" ? totals : history.reduce((sum, item) => ({
    totalReceitas: sum.totalReceitas + item.receitas,
    totalDespesas: sum.totalDespesas + item.despesas,
    saldo: sum.saldo + item.saldo,
  }), { totalReceitas: 0, totalDespesas: 0, saldo: 0 });
  const chartData = {
    labels: history.map((item) => item.periodo.slice(5)),
    legend: ["Receitas", "Despesas"],
    data: history.map((item) => [item.receitas, item.despesas]),
    barColors: [colors.success, colors.danger],
  };
  async function exportar() {
    if (exportando) return;
    setExportando(true); setErroExportacao('');
    try { await exportarRelatorio(periodo === 'Mês' ? 'Mês atual' : 'Últimos 6 meses', reportTotals, history); }
    catch (error) { setErroExportacao(error.message); }
    finally { setExportando(false); }
  }

  return (
    <AnimatedScreen style={styles.container} delay={60}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={sharedStyles.paddingBottom120}>
        {erro ? <Text style={sharedStyles.errorText}>{erro}</Text> : null}
        <AnimatedCard style={styles.card} delay={40}>
          <Text style={styles.cardTitle}>Período</Text>
          <View style={styles.pickerContainer}><Picker selectedValue={periodo} dropdownIconColor={colors.textPrimary} style={[styles.picker, Platform.OS === 'web' && { backgroundColor: colors.surface }, Platform.OS === "ios" && { height: 180 }]} itemStyle={{ color: colors.textPrimary, fontSize: 16 }} onValueChange={setPeriodo}><Picker.Item label="Mês atual" value="Mês" /><Picker.Item label="Últimos 6 meses" value="Semestre" /></Picker></View>
        </AnimatedCard>

        <AnimatedCard style={styles.card} delay={120}>
          <Text style={styles.cardTitle}>Receitas x Despesas (R$)</Text>
          {chartData.labels.length ? (
            <MeasuredChart>{(width) => <StackedBarChart data={chartData} width={width} height={220} yAxisLabel="" formatYLabel={(value) => Number(value).toLocaleString('pt-BR', { notation: 'compact', maximumFractionDigits: 1 })} fromZero chartConfig={{ backgroundGradientFrom: colors.surface, backgroundGradientTo: colors.surface, decimalPlaces: 0, color: (opacity = 1) => `rgba(81,69,255,${opacity})`, labelColor: () => colors.textPrimary, propsForBackgroundLines: { stroke: colors.divider } }} style={sharedStyles.reportChart} />}</MeasuredChart>
          ) : <Text style={sharedStyles.errorText}>Ainda não existem transações para gerar o gráfico.</Text>}
        </AnimatedCard>

        <AnimatedCard style={styles.card} delay={180}>
          <Text style={styles.cardTitle}>Resumo Financeiro</Text>
          <View style={styles.itemResumo}><Icon name="trending-up" size={30} color={colors.success} /><View style={styles.textos}><Text style={styles.label}>Receitas</Text><Text style={styles.valor}>{formatBRL(reportTotals.totalReceitas)}</Text></View></View>
          <View style={styles.itemResumo}><Icon name="trending-down" size={30} color={colors.danger} /><View style={styles.textos}><Text style={styles.label}>Despesas</Text><Text style={styles.valor}>{formatBRL(reportTotals.totalDespesas)}</Text></View></View>
          <View style={styles.itemResumo}><Icon name="savings" size={30} color={colors.primary} /><View style={styles.textos}><Text style={styles.label}>Economia</Text><Text style={styles.valor}>{formatBRL(reportTotals.saldo)}</Text></View></View>
          {erroExportacao ? <Text style={sharedStyles.errorText}>{erroExportacao}</Text> : null}
          <TouchableOpacity style={styles.button} activeOpacity={0.8} disabled={exportando || carregando || !!erro} onPress={exportar}><Icon name="picture-as-pdf" size={24} color={colors.onPrimary} /><Text style={styles.buttonText}>{exportando ? 'Exportando...' : 'Exportar PDF'}</Text></TouchableOpacity>
        </AnimatedCard>
      </ScrollView>
      <BarraNavegacao />
    </AnimatedScreen>
  );
}
