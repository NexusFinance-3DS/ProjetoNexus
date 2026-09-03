import React, { useState } from "react";
import BarraNavegacao from '../components/BarraNavegacao';
import { AnimatedCard, AnimatedScreen } from '../components/AnimatedScreen';
import { View, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { router } from "expo-router";
import Icon from "@expo/vector-icons/MaterialIcons";

import { relatoriosStyles as styles, sharedStyles } from "../styles/styles";
import { getTotals, formatBRL } from '../data/financeData';

const screenWidth = Dimensions.get("window").width;

export default function Relatorios() {
  const [periodo, setPeriodo] = useState("Mês");

  const dadosGrafico = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai"],
    datasets: [
      {
        data: [5200, 6100, 4800, 7200, 8100],
      },
      {
        data: [3100, 3500, 2900, 4000, 3700],
      },
    ],
  };

  return (
    <AnimatedScreen style={styles.container} delay={60}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={sharedStyles.paddingBottomNegative100}
      >

        {/* Período */}

        <AnimatedCard style={styles.card} delay={40}>

          <Text style={styles.cardTitle}>
            Período
          </Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={periodo}
              dropdownIconColor="#FFF"
              style={styles.picker}
              onValueChange={(itemValue) => setPeriodo(itemValue)}
            >
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

          <BarChart
            data={dadosGrafico}
            width={screenWidth - 70}
            height={220}
            yAxisLabel="R$ "
            fromZero
            showValuesOnTopOfBars
            chartConfig={{
              backgroundGradientFrom: "#1c1c1c",
              backgroundGradientTo: "#1c1c1c",
              decimalPlaces: 0,
              color: (opacity = 1) =>
                `rgba(81,69,255,${opacity})`,
              labelColor: () => "#FFF",
              propsForBackgroundLines: {
                stroke: "#303030",
              },
            }}
            style={sharedStyles.reportChart}
          />

        </AnimatedCard>

        {/* Resumo */}

        <AnimatedCard style={styles.card} delay={180}>

          <Text style={styles.cardTitle}>
            Resumo Financeiro
          </Text>

          <View style={styles.itemResumo}>

            <Icon
              name="trending-up"
              size={30}
              color="#00E676"
            />

            <View style={styles.textos}>
              <Text style={styles.label}>
                Receitas
              </Text>

              <Text style={styles.valor}>
                {formatBRL(getTotals().totalReceitas)}
              </Text>
            </View>

          </View>

          <View style={styles.itemResumo}>

            <Icon
              name="trending-down"
              size={30}
              color="#FF3B30"
            />

            <View style={styles.textos}>
              <Text style={styles.label}>
                Despesas
              </Text>

              <Text style={styles.valor}>
                {formatBRL(getTotals().totalDespesas)}
              </Text>
            </View>

          </View>

          <View style={styles.itemResumo}>

            <Icon
              name="savings"
              size={30}
              color="#5145FF"
            />

            <View style={styles.textos}>
              <Text style={styles.label}>
                Economia
              </Text>

              <Text style={styles.valor}>
                {formatBRL(getTotals().totalReceitas - getTotals().totalDespesas)}
              </Text>
            </View>

          </View>
          {/* Botões */}

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => {
              console.log("Exportar PDF");
            }}
          >
            <Icon
              name="picture-as-pdf"
              size={24}
              color="#FFF"
            />

            <Text style={styles.buttonText}>
              Exportar PDF
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, sharedStyles.marginTop15]}
            activeOpacity={0.8}
            onPress={() => {
              console.log("Compartilhar");
            }}
          >
            <Icon
              name="share"
              size={24}
              color="#FFF"
            />

            <Text style={styles.buttonText}>
              Compartilhar Relatório
            </Text>
          </TouchableOpacity>

        </AnimatedCard>

        {/* Espaço para a barra inferior */}

        <View style={sharedStyles.bottomSpacer} />

      </ScrollView>

      <BarraNavegacao />
    </AnimatedScreen>
  );
}
