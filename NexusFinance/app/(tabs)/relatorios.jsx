import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

import styles from "../styles/relatorios";
import navStyles from "../styles/barraNavegacao";

const screenWidth = Dimensions.get("window").width;

export default function Relatorios() {
  const [periodo, setPeriodo] = useState("Mês");
  const [menuAberto, setMenuAberto] = useState(false);

  const dadosGrafico = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [
      {
        data: [5200, 6100, 4800, 7200, 8100, 7900],
      },
      {
        data: [3100, 3500, 2900, 4000, 3700, 3270],
      },
    ],
  };

  return (
    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
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
                stroke: "#2A3246",
              },
            }}
            style={{
              borderRadius: 15,
              marginTop: 15,
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
                R$ 8.100,00
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
                R$ 3.270,00
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
                R$ 4.830,00
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
      {menuAberto && (
        <View style={navStyles.menuExpandido}>
          <TouchableOpacity style={navStyles.itemMenu} onPress={() => router.push('/receita/novaReceita')}>
            <Icon name="attach-money" size={30} color="#fff" />
            <Text style={navStyles.tabLabel}>Receitas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={navStyles.itemMenu} onPress={() => router.push('/despesa/novaDespesa')}>
            <Icon name="receipt" size={30} color="#fff" />
            <Text style={navStyles.tabLabel}>Despesas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={navStyles.itemMenu}>
            <Icon name="swap-horiz" size={30} color="#fff" />
            <Text style={navStyles.tabLabel}>Transações</Text>
          </TouchableOpacity>

          <TouchableOpacity style={navStyles.itemMenu}>
            <Icon name="category" size={30} color="#fff" />
            <Text style={navStyles.tabLabel}>Categoria</Text>
          </TouchableOpacity>

          <TouchableOpacity style={navStyles.itemMenu}>
            <Icon name="flag" size={30} color="#fff" />
            <Text style={navStyles.tabLabel}>Metas</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Barra de navegação inferior */}
      <View style={navStyles.tabBar}>
        <TouchableOpacity
          style={navStyles.tabItem}
          onPress={() => router.push('/inicial')}
          activeOpacity={0.8}
        >
          <Icon name="home" size={32} color="#ffffff" />
          <Text style={navStyles.tabLabel}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={navStyles.tabItem}
          onPress={() => router.push('/fluxoFinanceiro')}
          activeOpacity={0.8}
        >
          <Icon name="swap-horiz" size={32} color="#ffffff" />
          <Text style={navStyles.tabLabel}>Fluxo Financeiro</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={navStyles.tabItem}
          onPress={() => setMenuAberto(!menuAberto)}
          activeOpacity={0.8}
        >
          <Icon
            name={menuAberto ? "close" : "add-circle"}
            size={56}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={navStyles.tabItem}
          onPress={() => router.push('/metas')}
          activeOpacity={0.8}
        >
          <Icon name="radar" size={32} color="#ffffff" />
          <Text style={navStyles.tabLabel}>Metas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={navStyles.tabItem}
          onPress={() => router.push('/dashboard')}
          activeOpacity={0.8}
        >
          <Icon name="menu" size={32} color="#ffffff" />
          <Text style={navStyles.tabLabel}>mais</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}