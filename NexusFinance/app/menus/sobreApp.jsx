import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from "react-native";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

import styles from "../styles/sobreApp";
import barraNavegacao from '../styles/barraNavegacao';

export default function SobreApp() {
  const [menuAberto, setMenuAberto] = useState(null);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        <View style={styles.mainCard}>
          <Text style={styles.appName}>Nexus Finance</Text>
        </View>

        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>Sua Gestão Financeira, Descomplicada</Text>

          <View style={styles.featureRow}>
            <View style={[styles.featureIcon, { backgroundColor: "#4C4CF0" }]}>
              <Icon name="wallet-travel" size={22} color="#FFF" />
            </View>
            <View style={styles.featureTexts}>
              <Text style={styles.featureTitle}>Organização Completa</Text>
              <Text style={styles.featureText}>Centralize todas as suas contas, receitas e despesas em um só lugar</Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={[styles.featureIcon, { backgroundColor: "#2EA6FF" }]}>
              <Icon name="flag" size={22} color="#FFF" />
            </View>
            <View style={styles.featureTexts}>
              <Text style={styles.featureTitle}>Metas Financeiras</Text>
              <Text style={styles.featureText}>Defina e acompanhe suas metas com facilidade.</Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={[styles.featureIcon, { backgroundColor: "#7B61FF" }]}>
              <Icon name="insert-chart" size={22} color="#FFF" />
            </View>
            <View style={styles.featureTexts}>
              <Text style={styles.featureTitle}>Relatórios Detalhados</Text>
              <Text style={styles.featureText}>Visualize seu progresso com gráficos claros.</Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={[styles.featureIcon, { backgroundColor: "#FF6B6B" }]}>
              <Icon name="sync-alt" size={22} color="#FFF" />
            </View>
            <View style={styles.featureTexts}>
              <Text style={styles.featureTitle}>Controle de Fluxo</Text>
              <Text style={styles.featureText}>Entenda seu fluxo de caixa para um futuro financeiro saudável.</Text>
            </View>
          </View>

        </View>

        <TouchableOpacity style={styles.infoCard} activeOpacity={0.9}>
          <View>
            <Text style={styles.infoTitle}>Termos de Uso</Text>
            <Text style={styles.infoText}>Seus dados estão seguros e criptografados.</Text>
            <Text style={styles.link}>Ler termos completos</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoCard} activeOpacity={0.9}>
          <View>
            <Text style={styles.infoTitle}>Política de Privacidade</Text>
            <Text style={styles.infoText}>Seus dados estão seguros e criptografados.</Text>
            <Text style={styles.link}>Política de Privacidade</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactCard} activeOpacity={0.9} onPress={() => console.log("Contato")}>
          <View style={styles.contactLeft}>
            <Icon name="person" size={20} color="#FFF" />
            <Text style={styles.contactText}>Desenvolvedores e Contato</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerApp}>© Nexus Finance</Text>
          <Text style={styles.footerCopy}>Copyright © 2026</Text>
        </View>

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
