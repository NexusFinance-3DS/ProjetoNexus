import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

import styles from "../styles/centralAjuda";
import navStyles from "../styles/barraNavegacao";

export default function CentralAjuda() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
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
          <Icon name="track-changes" size={32} color="#ffffff" />
          <Text style={navStyles.tabLabel}>Metas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={navStyles.tabItem}
          onPress={() => router.push('/perfil')}
          activeOpacity={0.8}
        >
          <Icon name="menu" size={32} color="#ffffff" />
          <Text style={navStyles.tabLabel}>Mais</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
