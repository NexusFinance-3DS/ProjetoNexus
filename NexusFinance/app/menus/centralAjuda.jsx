import React from "react";
import BarraNavegacao from '../components/BarraNavegacao';
import { AnimatedCard, AnimatedScreen } from '../components/AnimatedScreen';
import { Alert, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import Icon from "@expo/vector-icons/MaterialIcons";

import { useAppStyles } from "../styles/styles";

export default function CentralAjuda() {
  const { colors, centralAjudaStyles: styles, sharedStyles } = useAppStyles();

  return (
    <AnimatedScreen style={styles.container} delay={60}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={sharedStyles.paddingBottom120}
      >

        <AnimatedCard style={styles.card} delay={40}>
          <Text style={styles.cardTitle}>Perguntas frequentes</Text>

          <TouchableOpacity style={styles.itemMenu} activeOpacity={0.8} onPress={() => Alert.alert("Cadastrar uma despesa", "Abra Nova despesa, informe o valor, a descrição e a data. Escolha o tipo de conta e a categoria. Você também pode anexar um arquivo de até 10 MB e marcar a despesa como paga ou fixa. Toque em Salvar despesa.")}>
            <View style={styles.itemLeft}>
              <Icon name="help-outline" size={24} color={colors.textPrimary} />
              <Text style={styles.itemText}>Como cadastrar uma despesa?</Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.itemMenu} activeOpacity={0.8} onPress={() => Alert.alert("Criar uma meta", "Abra Metas e toque em Adicionar Meta. Informe o nome, o valor desejado e quanto você já possui. Confirme em Salvar.")}>
            <View style={styles.itemLeft}>
              <Icon name="help-outline" size={24} color={colors.textPrimary} />
              <Text style={styles.itemText}>Como criar uma meta?</Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.itemMenu} activeOpacity={0.8} onPress={() => Alert.alert("Registrar receita", "Abra Nova receita, preencha os dados, selecione o tipo de conta e a categoria e toque em Salvar receita. Para uma categoria personalizada, toque em Adicionar nova categoria.")}>
            <View style={styles.itemLeft}>
              <Icon name="help-outline" size={24} color={colors.textPrimary} />
              <Text style={styles.itemText}>Como registrar receita?</Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.itemMenu} activeOpacity={0.8} onPress={() => Alert.alert("Visualizar relatórios", "Abra Relatórios no menu de navegação. Escolha Mês atual ou Últimos 6 meses para consultar receitas, despesas e economia.")}>
            <View style={styles.itemLeft}>
              <Icon name="help-outline" size={24} color={colors.textPrimary} />
              <Text style={styles.itemText}>Como visualizar relatórios?</Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </AnimatedCard>

        <AnimatedCard style={styles.cardInfo} delay={120}>
          <Text style={styles.cardInfoTitle}>Ainda precisa de ajuda?</Text>
          <Text style={styles.cardInfoText}>
            Consulte as informações e os recursos do aplicativo.
          </Text>
        </AnimatedCard>

        <TouchableOpacity
          style={styles.contactButton}
          activeOpacity={0.8}
          onPress={() => router.push("/menus/sobreApp")}
        >
          <Icon name="chat-bubble-outline" size={24} color={colors.onPrimary} />
          <Text style={styles.contactText}>Sobre o aplicativo</Text>
        </TouchableOpacity>

      </ScrollView>

      <BarraNavegacao />
    </AnimatedScreen>
  );
}
