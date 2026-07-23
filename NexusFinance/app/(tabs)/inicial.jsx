import React, { useState } from 'react';
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/inicio';
import navStyles from '../styles/barraNavegacao';
import barraNavegacao from '../styles/barraNavegacao';

export default function inicial() {
  const [menuAberto, setMenuAberto] = useState(false);

  // Dados 
  const valorMeta = 30000.00;
  const valorTotalMeta = 100000;
  const renda = 1621.00;
  const despesa = 400;
  const gastosNecessidades = 300.00;
  const gastosDesejos = 100.00;
  const gastosInvestimentos = 0.00;
  const porcentagem = (valorMeta / valorTotalMeta) * 100;
  const titleMeta = "Comprar a casa do Nathan"

  const distribuicao = [
    {
      label: "Necessidades",
      valor: gastosNecessidades,
      cor: "#5145FF",
      percentual: (gastosNecessidades / renda) * 100,
    },
    {
      label: "Desejos",
      valor: gastosDesejos,
      cor: "#FF6B6B",
      percentual: (gastosDesejos / renda) * 100,
    },
    {
      label: "Investimentos",
      valor: gastosInvestimentos,
      cor: "#2ED573",
      percentual: (gastosInvestimentos / renda) * 100,
    },
  ];

  const totalDistribuido = gastosNecessidades + gastosDesejos + gastosInvestimentos;

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Seção de saldo geral */}
        <View style={styles.saldoContainer}>
          <Text style={styles.titleSaldo}>Saldo Total:</Text>
          <Text style={styles.valor}>R$ {(renda - despesa).toFixed(2)}</Text>
        </View>
        <View style={styles.content}>

          {/* Cards de visão rápida */}
          <Text style={styles.title}>Visão Rápida</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingVertical: 5,
              paddingRight: 100,
              paddingLeft: 10,
            }}
          >
            <View style={styles.card}>
              <Icon name="keyboard-double-arrow-up" size={38} color="#55ff00" />
              <Text style={styles.cardTitle}>Receitas</Text>
              <Text style={styles.cardValue}>R$ {(renda).toFixed(2)}</Text>
            </View>
            <View style={styles.card}>
              <Icon name="keyboard-double-arrow-down" size={38} color="#ff0000" />
              <Text style={styles.cardTitle}>Despesas</Text>
              <Text style={styles.cardValue}>R$ {(despesa).toFixed(2)}</Text>
            </View>
            <View style={styles.card}>
              <Icon name="attach-money" size={38} color="#fff" />
              <Text style={styles.cardTitle}>Investimentos</Text>
              <Text style={styles.cardValue}>R$ 100,00</Text>
            </View>
          </ScrollView>

          {/* Card de metas e progresso da meta */}
          <View style={styles.metasContainer}>
            <View style={styles.metaCard}>
              <View style={styles.cardTitle}>
                <Text style={{ color: "#ffffff", borderRadius: 20, width: "60%", fontSize: 20 }}>Metas em andamento</Text>
                <Text style={{ color: "#ffffff", backgroundColor: "#4800fff9", borderRadius: 20, width: "30%", marginLeft: "10%", textAlign: "center", fontSize: 12, fontWeight: "600", paddingTop:5 }} onPress={() => router.push('/metas')}>Ver metas</Text>
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

          {/* Card de distribuição da renda */}
          <View style={styles.metasContainer}>
            <View style={styles.metaCard}>
              <View style={styles.distribuicaoHeader}>
                <Text style={styles.distribuicaoTitle}>Distribuição da renda</Text>
                <View style={styles.totalBadge}>
                  <Text style={styles.totalBadgeText}>Total: R$ {renda}</Text>
                </View>
              </View>

              <View style={styles.distribuicaoLista}>
                {distribuicao.map((item) => (
                  <View key={item.label} style={styles.distribuicaoItem}>
                    <View style={styles.distribuicaoLabelRow}>
                      <View style={[styles.colorDot, { backgroundColor: item.cor }]} />
                      <Text style={styles.distribuicaoLabel}>{item.label}</Text>
                      <Text style={styles.distribuicaoValor}>R$ {item.valor.toFixed(2)}</Text>
                    </View>
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${Math.min(item.percentual, 100)}%`, backgroundColor: item.cor },
                        ]}
                      />
                    </View>
                    <Text style={styles.percentText}>{item.percentual.toFixed(1)}% da renda</Text>
                  </View>
                ))}
              </View>

              <View style={styles.distribuicaoFooter}>
                <Text style={styles.footerText}>Restante: R$ {(renda - totalDistribuido).toFixed(2)}</Text>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Menu expandido */}
      {menuAberto && (
        <View style={barraNavegacao.menuExpandido}>
          <TouchableOpacity style={barraNavegacao.itemMenu}>
            <Icon name="attach-money" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Receitas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={barraNavegacao.itemMenu}>
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
          <Text style={barraNavegacao.tabLabel}>Fluxo Financeiro</Text>
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
          onPress={() => router.push('/auth/login')}
          activeOpacity={0.8}
        >
          <Icon name="menu" size={32} color="#ffffff" />
          <Text style={barraNavegacao.tabLabel}>mais</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}