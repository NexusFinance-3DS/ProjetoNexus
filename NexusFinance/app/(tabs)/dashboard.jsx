import { chartPalette, navigationContentStyle, pieChartConfig, legendColorStyle, balanceChartConfig, dashboardChartStyle, flexFillStyle, incomeProgressStyle, expenseProgressStyle, bottomSpacerStyle, dashboardStyles as styles } from '../../src/styles';
import { useFinance } from '../../src/data/Finance';
import DataStatus from '../../src/components/DataStatus';
import BarraNavegacao from '../../src/components/BarraNavegacao';
import { AnimatedCard, AnimatedScreen } from '../../src/components/AnimatedScreen';
import { View, Text, ScrollView } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { PieChart, LineChart } from "react-native-chart-kit";
import { formatBRL } from '../../src/data/format';
export default function Dashboard() {
  const finance = useFinance();
  const {
    getTotals
  } = finance;
  const screenWidth = 340;
  const pieData = (finance.resumo.categorias || []).map((x, index) => ({
    name: x.nome,
    population: Number(x.valor),
    color: chartPalette[index % chartPalette.length],
    legendFontColor: '#FFF',
    legendFontSize: 13
  }));
  const history = finance.historico.evolucao || [];
  const lineData = {
    labels: history.length ? history.map(x => x.mes.slice(5)) : ['Sem dados'],
    datasets: [{
      data: history.length ? history.map(x => Number(x.receitas) - Number(x.despesas)) : [0]
    }]
  };
  const totals = getTotals();
  const receitasPercent = Math.round(totals.totalReceitas / (totals.totalReceitas + totals.totalDespesas || 1) * 100);
  const despesasPercent = Math.round(totals.totalDespesas / (totals.totalReceitas + totals.totalDespesas || 1) * 100);
  return <AnimatedScreen style={styles.container} delay={60}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={navigationContentStyle}>
        <DataStatus />
        <AnimatedCard style={styles.card} delay={40}>
          <Text style={styles.cardTitle}>Gastos por categoria</Text>

          <View style={styles.graficoContainer}>
            <View style={styles.pieWrapper}>
              <PieChart data={pieData} width={200} height={120} accessor="population" backgroundColor="transparent" hasLegend={false} chartConfig={pieChartConfig} style={styles.pieChart} />
            </View>

            <View style={styles.legenda}>
              {pieData.map((item, index) => <View key={index} style={styles.itemLegenda}>
                  <View style={[styles.corLegenda, legendColorStyle(item)]} />
                  <Text style={styles.textoLegenda}>{item.name}</Text>
                </View>)}
            </View>
          </View>
        </AnimatedCard>

        <AnimatedCard style={styles.card} delay={120}>
          <Text style={styles.cardTitle}>Evolução de saldo</Text>

          <LineChart data={lineData} width={screenWidth - 40} height={190} withDots={false} withShadow={false} withInnerLines={true} withOuterLines={false} bezier chartConfig={balanceChartConfig} style={dashboardChartStyle} />
        </AnimatedCard>

        <AnimatedCard style={styles.card} delay={180}>
          <Text style={styles.cardTitle}>Resumo do mês</Text>

          <View style={styles.resumoItem}>
            <View style={styles.iconGreen}>
              <Icon name="arrow-upward" size={34} color="#00FF66" />
            </View>

            <View style={flexFillStyle}>
              <Text style={styles.resumoTitulo}>Receitas</Text>
              <Text style={styles.resumoValor}>{formatBRL(totals.totalReceitas)}</Text>

              <View style={styles.progress}>
                <View style={[styles.progressFill, incomeProgressStyle(receitasPercent)]} />
              </View>
            </View>

            <Text style={styles.percent}>{receitasPercent}%</Text>
          </View>

          <View style={styles.resumoItem}>
            <View style={styles.iconRed}>
              <Icon name="arrow-downward" size={34} color="#FF3030" />
            </View>

            <View style={flexFillStyle}>
              <Text style={styles.resumoTitulo}>Despesas</Text>
              <Text style={styles.resumoValor}>{formatBRL(totals.totalDespesas)}</Text>

              <View style={styles.progress}>
                <View style={[styles.progressFill, expenseProgressStyle(despesasPercent)]} />
              </View>
            </View>

            <Text style={styles.percent}>{despesasPercent}%</Text>
          </View>
        </AnimatedCard>

        <View style={bottomSpacerStyle} />
      </ScrollView>

      <BarraNavegacao />
    </AnimatedScreen>;
}
