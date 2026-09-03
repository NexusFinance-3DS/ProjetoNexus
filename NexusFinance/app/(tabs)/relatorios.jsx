import { api } from '../../src/api/client';
import { exportReport } from '../../src/api/files';
import { periodDates, formatBRL } from '../../src/data/format';
import { apiStyles, reportContentStyle, reportChartConfig, reportChartStyle, secondaryButtonSpacingStyle, bottomSpacerStyle, relatoriosStyles as styles } from '../../src/styles';
import { useFinance } from '../../src/data/Finance';
import DataStatus from '../../src/components/DataStatus';
import React, { useState } from "react";
import BarraNavegacao from '../../src/components/BarraNavegacao';
import { AnimatedCard, AnimatedScreen } from '../../src/components/AnimatedScreen';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { BarChart } from "react-native-chart-kit";
import Icon from "@expo/vector-icons/MaterialIcons";
const screenWidth = Dimensions.get("window").width;
export default function Relatorios() {
  const finance = useFinance();
  const [periodo, setPeriodo] = useState("Mês");
  const [resumo, setResumo] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  React.useEffect(() => {
    let active = true;
    setError('');
    api('/resumo?' + new URLSearchParams(periodDates(periodo))).then(data => {
      if (active) setResumo(data);
    }).catch(e => {
      if (active) setError(e.message);
    });
    return () => {
      active = false;
    };
  }, [periodo, finance.resumo]);
  const dadosGrafico = {
    labels: ['Receitas', 'Despesas'],
    datasets: [{
      data: [Number(resumo.total_receitas || 0), Number(resumo.total_despesas || 0)]
    }]
  };
  const exportar = async formato => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await exportReport(periodDates(periodo), formato);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  return <AnimatedScreen style={styles.container} delay={60}>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={reportContentStyle}>
        <DataStatus />{!!error && <Text style={apiStyles.error}>{error}</Text>}{busy && <Text style={apiStyles.message}>Gerando relatório...</Text>}

        {/* Período */}

        <AnimatedCard style={styles.card} delay={40}>

          <Text style={styles.cardTitle}>
            Período
          </Text>

          <View style={styles.pickerContainer}>
            <Picker selectedValue={periodo} dropdownIconColor="#FFF" style={styles.picker} onValueChange={itemValue => setPeriodo(itemValue)}>
              <Picker.Item label="Semana" value="Semana" />
              <Picker.Item label="Mês" value="Mês" />
              <Picker.Item label="Ano" value="Ano" />
            </Picker>
          </View>

        </AnimatedCard>

        {/* Receitas x Despesas */}

        <AnimatedCard style={styles.card} delay={120}>

          <Text style={styles.cardTitle}>
            Receitas x Despesas
          </Text>

          <BarChart data={dadosGrafico} width={screenWidth - 70} height={220} yAxisLabel="R$ " fromZero showValuesOnTopOfBars chartConfig={reportChartConfig} style={reportChartStyle} />

        </AnimatedCard>

        {/* Resumo */}

        <AnimatedCard style={styles.card} delay={180}>

          <Text style={styles.cardTitle}>
            Resumo Financeiro
          </Text>

          <View style={styles.itemResumo}>

            <Icon name="trending-up" size={30} color="#00E676" />

            <View style={styles.textos}>
              <Text style={styles.label}>
                Receitas
              </Text>

              <Text style={styles.valor}>
                {formatBRL(Number(resumo.total_receitas || 0))}
              </Text>
            </View>

          </View>

          <View style={styles.itemResumo}>

            <Icon name="trending-down" size={30} color="#FF3B30" />

            <View style={styles.textos}>
              <Text style={styles.label}>
                Despesas
              </Text>

              <Text style={styles.valor}>
                {formatBRL(Number(resumo.total_despesas || 0))}
              </Text>
            </View>

          </View>

          <View style={styles.itemResumo}>

            <Icon name="savings" size={30} color="#5145FF" />

            <View style={styles.textos}>
              <Text style={styles.label}>
                Economia
              </Text>

              <Text style={styles.valor}>
                {formatBRL(Number(resumo.total_receitas || 0) - Number(resumo.total_despesas || 0))}
              </Text>
            </View>

          </View>
          {/* Botões */}

          <TouchableOpacity style={styles.button} activeOpacity={0.8} disabled={busy} onPress={() => exportar("pdf")}>
            <Icon name="picture-as-pdf" size={24} color="#FFF" />

            <Text style={styles.buttonText}>
              Exportar PDF
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, secondaryButtonSpacingStyle]} activeOpacity={0.8} disabled={busy} onPress={() => exportar("xlsx")}>
            <Icon name="share" size={24} color="#FFF" />

            <Text style={styles.buttonText}>
              Exportar planilha
            </Text>
          </TouchableOpacity>

        </AnimatedCard>

        {/* Espaço para a barra inferior */}

        <View style={bottomSpacerStyle} />

      </ScrollView>

      <BarraNavegacao />
    </AnimatedScreen>;
}
