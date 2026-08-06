import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

import { PieChart, LineChart } from "react-native-chart-kit";

import styles from "../styles/dashboard";
import barraNavegacao from '../styles/barraNavegacao';

export default function Dashboard() {
  const [menuAberto, setMenuAberto] = useState(false);

  const screenWidth = 340;

  const pieData = [
    {
      name: "Alimentação",
      population: 981,
      color: "#6C63FF",
      legendFontColor: "#FFF",
      legendFontSize: 13,
    },
    {
      name: "Transporte",
      population: 654,
      color: "#5145FF",
      legendFontColor: "#FFF",
      legendFontSize: 13,
    },
    {
      name: "Lazer",
      population: 490,
      color: "#7C6BFF",
      legendFontColor: "#FFF",
      legendFontSize: 13,
    },
    {
      name: "Moradia",
      population: 817,
      color: "#291CFF",
      legendFontColor: "#FFF",
      legendFontSize: 13,
    },
    {
      name: "Outros",
      population: 328,
      color: "#666",
      legendFontColor: "#FFF",
      legendFontSize: 13,
    },
  ];

  const lineData = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul"],
    datasets: [
      {
        data: [1200, 2500, 3200, 2400, 3000, 4200, 5000],
      },
    ],
  };

  return (
    <View style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        <View style={styles.card}>

          <Text style={styles.cardTitle}>
            Gastos por categoria
          </Text>

          <View style={styles.graficoContainer}>

            <View style={styles.pieWrapper}>
              <PieChart
                data={pieData}
                width={200}
                height={120}
                accessor="population"
                backgroundColor="transparent"
                hasLegend={false}
                chartConfig={{
                  color: () => "#FFF",
                }}
                style={styles.pieChart}
              />
            </View>

            <View style={styles.legenda}>

              {pieData.map((item, index) => (
                <View key={index} style={styles.itemLegenda}>

                  <View
                    style={[
                      styles.corLegenda,
                      { backgroundColor: item.color },
                    ]}
                  />

                  <Text style={styles.textoLegenda}>
                    {item.name}
                  </Text>

                </View>
              ))}

            </View>

          </View>

        </View>

        <View style={styles.card}>

          <Text style={styles.cardTitle}>
            Evolução de saldo
          </Text>

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
              backgroundGradientFrom: "#11151D",
              backgroundGradientTo: "#11151D",
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

        </View>

        <View style={styles.card}>

          <Text style={styles.cardTitle}>
            Resumo do mês
          </Text>

          <View style={styles.resumoItem}>

            <View style={styles.iconGreen}>
              <Icon
                name="arrow-upward"
                size={34}
                color="#00FF66"
              />
            </View>

            <View style={{ flex: 1 }}>

              <Text style={styles.resumoTitulo}>
                Receitas
              </Text>

              <Text style={styles.resumoValor}>
                R$ 8.100,00
              </Text>

              <View style={styles.progress}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: "78%",
                    },
                  ]}
                />
              </View>

            </View>

            <Text style={styles.percent}>
              78%
            </Text>

          </View>

          <View style={styles.resumoItem}>

            <View style={styles.iconRed}>
              <Icon
                name="arrow-downward"
                size={34}
                color="#FF3030"
              />
            </View>

            <View style={{ flex: 1 }}>

              <Text style={styles.resumoTitulo}>
                Despesas
              </Text>

              <Text style={styles.resumoValor}>
                R$ 3.270,00
              </Text>

              <View style={styles.progress}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: "32%",
                    },
                  ]}
                />
              </View>

            </View>

            <Text style={styles.percent}>
              32%
            </Text>

          </View>

        </View>

        <View style={{ height: 100 }} />

      </ScrollView>

      {/* Menu expandido */}
      {menuAberto && (
        <View style={barraNavegacao.menuExpandido}>
          <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => router.push('/receita/novaReceita')}>
            <Icon name="attach-money" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Receitas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => router.push('/despesa/novaDespesa')}>
            <Icon name="receipt" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Despesas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={barraNavegacao.itemMenu}>
            <Icon name="swap-horiz" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Transações</Text>
          </TouchableOpacity>

          <TouchableOpacity style={barraNavegacao.itemMenu}>
            <Icon name="category" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Categoria</Text>
          </TouchableOpacity>

          <TouchableOpacity style={barraNavegacao.itemMenu}>
            <Icon name="flag" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Metas</Text>
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
          style={barraNavegacao.tabItem}
          onPress={() => router.push('/metas')}
          activeOpacity={0.8}
        >
          <Icon name="radar" size={32} color="#ffffff" />
          <Text style={barraNavegacao.tabLabel}>Metas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={barraNavegacao.tabItem}
          onPress={() => router.push('/dashboard')}
          activeOpacity={0.8}
        >
          <Icon name="menu" size={32} color="#ffffff" />
          <Text style={barraNavegacao.tabLabel}>mais</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}