import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/inicio';
import navStyles from '../styles/barraNavegacao';

export default function inicial() {
  return (
    <View style={styles.container}>
      <ScrollView>
      <View style={styles.saldoContainer}>
        <Text style={styles.titleSaldo}>Saldo Total:</Text>
        <Text style={styles.valor}>R$ 100,00</Text>
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
            <Text style={styles.cardValue}>R$ 500,00</Text>
          </View>
          <View style={styles.card}>
            <Icon name="keyboard-double-arrow-down" size={38} color="#ff0000" />
            <Text style={styles.cardTitle}>Despesas</Text>
            <Text style={styles.cardValue}>R$ 400,00</Text>
          </View>
          <View style={styles.card}>
            <Icon name="attach-money" size={38} color="#fff" />
            <Text style={styles.cardTitle}>Investimentos</Text>
            <Text style={styles.cardValue}>R$ 100,00</Text>
          </View>
        </ScrollView>
        <View style={styles.metasContainer}>
            <View style={styles.metaCard}>
              <Text style={styles.metaTitle}>Metas em andamento</Text>
              <Text style={styles.metaValue}>R$ 200,00</Text>
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