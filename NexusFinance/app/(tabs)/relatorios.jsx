import React, { useState } from "react";
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { BarChart } from "react-native-chart-kit";
import Icon from "@expo/vector-icons/MaterialIcons";
import BarraNavegacao from "../components/BarraNavegacao";
import { AnimatedCard, AnimatedScreen } from "../components/AnimatedScreen";
import { relatoriosStyles as styles, sharedStyles } from "../styles/styles";
import { formatBRL } from "../../services/financeiro";
import { useResumoFinanceiro } from "../../hooks/useResumoFinanceiro";

const screenWidth = Dimensions.get("window").width;

export default function Relatorios() {
  const [periodo, setPeriodo] = useState("Mês");
  const { dados, erro } = useResumoFinanceiro();
  const totals = dados.atual;
  const history = periodo === "Mês" ? dados.historico.slice(-1) : dados.historico;
  const reportTotals = periodo === "Mês" ? totals : history.reduce((sum, item) => ({
    totalReceitas: sum.totalReceitas + item.receitas,
    totalDespesas: sum.totalDespesas + item.despesas,
    saldo: sum.saldo + item.saldo,
  }), { totalReceitas: 0, totalDespesas: 0, saldo: 0 });
  const chartData = {
    labels: history.map((item) => item.periodo.slice(5)),
    datasets: [{ data: history.map((item) => item.receitas) }, { data: history.map((item) => item.despesas) }],
  };

  return (
    <AnimatedScreen style={styles.container} delay={60}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={sharedStyles.paddingBottom120}>
        {erro ? <Text style={sharedStyles.errorText}>{erro}</Text> : null}
        <AnimatedCard style={styles.card} delay={40}>
          <Text style={styles.cardTitle}>Período</Text>
          <View style={styles.pickerContainer}><Picker selectedValue={periodo} dropdownIconColor="#FFF" style={styles.picker} onValueChange={setPeriodo}><Picker.Item label="Mês atual" value="Mês" /><Picker.Item label="Últimos 6 meses" value="Semestre" /></Picker></View>
        </AnimatedCard>

        <AnimatedCard style={styles.card} delay={120}>
          <Text style={styles.cardTitle}>Receitas x Despesas</Text>
          {chartData.labels.length ? (
            <BarChart data={chartData} width={screenWidth - 70} height={220} yAxisLabel="R$ " fromZero chartConfig={{ backgroundGradientFrom: "#1c1c1c", backgroundGradientTo: "#1c1c1c", decimalPlaces: 0, color: (opacity = 1) => `rgba(81,69,255,${opacity})`, labelColor: () => "#FFF", propsForBackgroundLines: { stroke: "#303030" } }} style={sharedStyles.reportChart} />
          ) : <Text style={sharedStyles.errorText}>Ainda não existem transações para gerar o gráfico.</Text>}
        </AnimatedCard>

        <AnimatedCard style={styles.card} delay={180}>
          <Text style={styles.cardTitle}>Resumo Financeiro</Text>
          <View style={styles.itemResumo}><Icon name="trending-up" size={30} color="#00E676" /><View style={styles.textos}><Text style={styles.label}>Receitas</Text><Text style={styles.valor}>{formatBRL(reportTotals.totalReceitas)}</Text></View></View>
          <View style={styles.itemResumo}><Icon name="trending-down" size={30} color="#FF3B30" /><View style={styles.textos}><Text style={styles.label}>Despesas</Text><Text style={styles.valor}>{formatBRL(reportTotals.totalDespesas)}</Text></View></View>
          <View style={styles.itemResumo}><Icon name="savings" size={30} color="#5145FF" /><View style={styles.textos}><Text style={styles.label}>Economia</Text><Text style={styles.valor}>{formatBRL(reportTotals.saldo)}</Text></View></View>
          <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={() => alert("Exportação será implementada em uma próxima etapa.")}><Icon name="picture-as-pdf" size={24} color="#FFF" /><Text style={styles.buttonText}>Exportar PDF</Text></TouchableOpacity>
        </AnimatedCard>
      </ScrollView>
      <BarraNavegacao />
    </AnimatedScreen>
  );
}
