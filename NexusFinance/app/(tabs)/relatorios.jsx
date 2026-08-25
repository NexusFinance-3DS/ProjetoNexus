import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

import styles from "../styles/relatorios";
import barraNavegacao from '../styles/barraNavegacao';
import { getTotals, formatBRL } from '../data/financeData';

const screenWidth = Dimensions.get("window").width;

export default function Relatorios() {
  const [periodo, setPeriodo] = useState("Mês");
  const [menuAberto, setMenuAberto] = useState(null);

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
    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: -100 }}
      >

        {/* Período */}

        <View style={styles.card}>

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

        </View>

        {/* Receitas x Despesas */}

        <View style={styles.card}>

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
              backgroundGradientFrom: "#151922",
              backgroundGradientTo: "#151922",
              decimalPlaces: 0,
              color: (opacity = 1) =>
                `rgba(81,69,255,${opacity})`,
              labelColor: () => "#FFF",
              propsForBackgroundLines: {
                stroke: "#303030",
              },
            }}
            style={{
              borderRadius: 15,
              marginTop: 10,
              marginBottom: 5,
            }}
          />

        </View>

        {/* Resumo */}

        <View style={styles.card}>

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
            style={[styles.button, { marginTop: 15 }]}
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

        </View>

        {/* Espaço para a barra inferior */}

        <View style={{ height: 100 }} />

      </ScrollView>

      {/* Menu expandido */}
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

      {/* Barra de navegação inferior */}
      <View style={barraNavegacao.tabBar}>
        <TouchableOpacity
          style={barraNavegacao.tabItem}
          onPress={() => router.push('/inicial')}
          activeOpacity={0.8}
        >
          <Icon name="home" size={32} color="#ffffff" />
          <Text style={barraNavegacao.tabLabel}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={barraNavegacao.tabItem}
          onPress={() => router.push('/fluxoFinanceiro')}
          activeOpacity={0.8}
        >
          <Icon name="swap-horiz" size={32} color="#ffffff" />
          <Text style={barraNavegacao.tabLabel}>Fluxo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={barraNavegacao.tabItem}
          onPress={() => setMenuAberto(menuAberto === 'add' ? null : 'add')}
          activeOpacity={0.8}
        >
          <Icon
            name={menuAberto != null ? "close" : "add-circle"}
            size={56}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={barraNavegacao.tabItem}
          onPress={() => router.push('/metas')}
          activeOpacity={0.8}
        >
          <Icon name="radar" size={32} color="#ffffff" />
          <Text style={barraNavegacao.tabLabel}>Metas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={barraNavegacao.tabItem}
          onPress={() => setMenuAberto(menuAberto === 'more' ? null : 'more')}
          activeOpacity={0.8}
        >
          <Icon name="menu" size={32} color="#ffffff" />
          <Text style={barraNavegacao.tabLabel}>mais</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}