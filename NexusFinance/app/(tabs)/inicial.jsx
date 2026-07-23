import React from 'react';
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/inicio';
import navStyles from '../styles/barraNavegacao';

export default function inicial() {
  const valorMeta = 30000.00;
  const valorTotalMeta = 100000;
  const renda = 1621.00;
  const despesa = 400;
  const gastosNecessidades = 300.00;
  const gastosDesejos = 100.00;
  const gastosInvestimentos = 0.00;
  const porcentagem = (valorMeta / valorTotalMeta) * 100;
  const titleMeta = "Comprar a casa do Nathan"

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.saldoContainer}>
          <Text style={styles.titleSaldo}>Saldo Total:</Text>
          <Text style={styles.valor}>R$ {renda - despesa}</Text>
        </View>
        <View style={styles.content}>

          <Text style={styles.title}>Visão Rápida</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingVertical: 5,
              paddingRight: 45,
              paddingLeft: 10,
            }}
          >
            <View style={styles.card}>
              <Icon name="keyboard-double-arrow-up" size={38} color="#55ff00" />
              <Text style={styles.cardTitle}>Receitas</Text>
              <Text style={styles.cardValue}>R$ {renda}</Text>
            </View>
            <View style={styles.card}>
              <Icon name="keyboard-double-arrow-down" size={38} color="#ff0000" />
              <Text style={styles.cardTitle}>Despesas</Text>
              <Text style={styles.cardValue}>R$ {despesa}</Text>
            </View>
            <View style={styles.card}>
              <Icon name="attach-money" size={38} color="#fff" />
              <Text style={styles.cardTitle}>Investimentos</Text>
              <Text style={styles.cardValue}>R$ 100,00</Text>
            </View>
          </ScrollView>
          <View style={styles.metasContainer}>
            <View style={styles.metaCard}>
              <View style={styles.cardTitle}>
                <Text style={{ color: "#ffffff", borderRadius: 20, width: "60%", fontSize: 20 }}>Metas em andamento</Text>
                <Text style={{ color: "#ffffff", backgroundColor: "#4800fff9", borderRadius: 20, width: "30%", marginLeft: "10%", textAlign: "center", fontSize: 20 }} onPress={() => router.push('/metas')}>Ver metas</Text>
              </View>
              <View style={styles.metaValue}>
                <View style={styles.graficos}>
                  <AnimatedCircularProgress
                    size={110}
                    width={10}
                    fill={porcentagem}
                    tintColor="#5145FF"
                    backgroundColor="#23283A"
                    rotation={0}
                    lineCap="round"
                  >
                    {() => (
                      <Text
                        style={{
                          color: "white",
                          fontSize: 24,
                          fontWeight: "bold",
                        }}
                      >
                        {Math.round(porcentagem)}%
                      </Text>
                    )}
                  </AnimatedCircularProgress>
                  <View style={{ flexDirection: "column" }}>
                    <Text style={{ color: "#fff", fontSize: 18, marginLeft: "10%", marginTop: "10%", marginBottom: "-15%" }}>{titleMeta}</Text>
                    <View
                      style={{
                        marginLeft: 20,
                        marginTop: 50,
                        width: 200,
                        height: 6,
                        backgroundColor: "#222",
                        borderRadius: 10,
                      }}
                    >

                      <View
                        style={{
                          width: `${porcentagem}%`,
                          height: 6,
                          backgroundColor: "#5145FF",
                          borderRadius: 10,
                        }}
                      />
                    </View>
                    <Text style={{ color: "#fff", fontSize: 15, marginLeft: "25%", marginTop: "3%" }}>R$ {valorMeta} / R$ {valorTotalMeta}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.metasContainer}>
            <View style={styles.metaCard}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ color: "#ffffff", borderRadius: 20, width: "60%", fontSize: 20 }}>Distribuição da renda</Text>
                <Text style={{ color: "#ffffff", backgroundColor: "#4800fff9", borderRadius: 20, width: "30%", marginLeft: "10%", textAlign: "center", fontSize: 20 }}>R$ {renda}</Text>
              </View>
              <View style={styles.distribuicao}>

                <View style={styles.necessidade}>
                  <Text>Necessidades</Text>
                  <View
                      style={{
                        marginTop: 10,
                        width: 200,
                        height: 6,
                        backgroundColor: "#222",
                        borderRadius: 10,
                      }}
                    >

                      <View
                        style={{
                          width: `${porcentagem}%`,
                          height: 6,
                          backgroundColor: "#5145FF",
                          borderRadius: 10,
                        }}
                      />
                    </View>
                  <Text>Limites</Text>
                </View>
                <View style={styles.desejos}>

                </View>
                <View style = {styles.investimentos}>

                </View>

              </View>
            </View>
          </View>

        </View>
      </ScrollView>


      {/*barra de navegação inferior*/}
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
          onPress={() => router.push('/auth/login')}
          activeOpacity={0.8}
        >
          <Icon name="add-circle" size={56} color="rgb(255, 255, 255)" />
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
          onPress={() => router.push('/auth/login')}
          activeOpacity={0.8}
        >
          <Icon name="menu" size={32} color="#ffffff" />
          <Text style={navStyles.tabLabel}>mais</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}