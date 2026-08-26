import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from "react-native";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

import styles from "../styles/centralAjuda";
import barraNavegacao from '../styles/barraNavegacao';

export default function CentralAjuda() {
  const [menuAberto, setMenuAberto] = useState(null);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: -100 }}
      >

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Perguntas frequentes</Text>

          <TouchableOpacity style={styles.itemMenu} activeOpacity={0.8}>
            <View style={styles.itemLeft}>
              <Icon name="help-outline" size={24} color="#FFF" />
              <Text style={styles.itemText}>Como cadastrar uma despesa?</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.itemMenu} activeOpacity={0.8}>
            <View style={styles.itemLeft}>
              <Icon name="help-outline" size={24} color="#FFF" />
              <Text style={styles.itemText}>Como criar uma meta?</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.itemMenu} activeOpacity={0.8}>
            <View style={styles.itemLeft}>
              <Icon name="help-outline" size={24} color="#FFF" />
              <Text style={styles.itemText}>Como registrar receita?</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.itemMenu} activeOpacity={0.8}>
            <View style={styles.itemLeft}>
              <Icon name="help-outline" size={24} color="#FFF" />
              <Text style={styles.itemText}>Como visualizar relatórios?</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.cardInfoTitle}>Ainda precisa de ajuda?</Text>
          <Text style={styles.cardInfoText}>
            Nosso suporte está disponível para tirar dúvidas sobre o app, finanças e configurações.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.contactButton}
          activeOpacity={0.8}
          onPress={() => console.log("Contato com suporte")}
        >
          <Icon name="chat-bubble-outline" size={24} color="#FFF" />
          <Text style={styles.contactText}>Fale com o suporte</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Menu expandido */}
      {menuAberto != null && (
        <TouchableWithoutFeedback onPress={() => setMenuAberto(null)}>
          {menuAberto === 'add' && (
            <View style={barraNavegacao.menuExpandido}>
              <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => { setMenuAberto(null); router.push('/transacoes'); }}>
                <Icon name="swap-horiz" size={30} color="#fff" />
                <Text style={barraNavegacao.tabLabel}>Transações</Text>
              </TouchableOpacity>

              <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => { setMenuAberto(null); router.push('/categoria'); }}>
                <Icon name="category" size={30} color="#fff" />
                <Text style={barraNavegacao.tabLabel}>Categoria</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={barraNavegacao.itemMenu}
                onPress={() => {
                  setMenuAberto(null);
                  router.push('/dashboard');
                }}
              >
                <Icon name="bar-chart" size={40} color="#fff" style={{marginBottom: -10}} />
                <Text style={barraNavegacao.tabLabel}>Dashboard</Text>
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

          <View style={barraNavegacao.tabBar}>
            <TouchableOpacity style={barraNavegacao.tabItem} onPress={() => router.push('/inicial')} activeOpacity={0.8}>
              <Icon name="home" size={32} color="#ffffff" />
              <Text style={barraNavegacao.tabLabel}>Início</Text>
            </TouchableOpacity>

            <TouchableOpacity style={barraNavegacao.tabItem} onPress={() => router.push('/fluxoFinanceiro')} activeOpacity={0.8}>
              <Icon name="swap-horiz" size={32} color="#ffffff" />
              <Text style={barraNavegacao.tabLabel}>Fluxo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={barraNavegacao.tabItem} onPress={() => setMenuAberto(menuAberto === 'add' ? null : 'add')} activeOpacity={0.8}>
              <Icon name={menuAberto != null ? "close" : "add-circle"} size={56} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={barraNavegacao.tabItem} onPress={() => router.push('/metas')} activeOpacity={0.8}>
              <Icon name="radar" size={32} color="#ffffff" />
              <Text style={barraNavegacao.tabLabel}>Metas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={barraNavegacao.tabItem} onPress={() => setMenuAberto(menuAberto === 'more' ? null : 'more')} activeOpacity={0.8}>
              <Icon name="menu" size={32} color="#ffffff" />
              <Text style={barraNavegacao.tabLabel}>mais</Text>
            </TouchableOpacity>
          </View>

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
