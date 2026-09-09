import React from "react";
import BarraNavegacao from '../components/BarraNavegacao';
import { AnimatedCard, AnimatedScreen } from '../components/AnimatedScreen';
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import Icon from "@expo/vector-icons/MaterialIcons";

import { useAppStyles } from "../styles/styles";

export default function SobreApp() {
  const { colors, sharedStyles, sobreAppStyles: styles } = useAppStyles();

  return (
    <AnimatedScreen style={styles.container} delay={60}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={sharedStyles.paddingBottom120}>

        <AnimatedCard style={styles.mainCard} delay={40}>
          <Text style={styles.appName}>Nexus Finance</Text>
        </AnimatedCard>

        <AnimatedCard style={styles.featuresCard} delay={120}>
          <Text style={styles.featuresTitle}>Sua Gestão Financeira, Descomplicada</Text>

          <View style={styles.featureRow}>
            <View style={[styles.featureIcon, sharedStyles.featurePurple]}>
              <Icon name="wallet-travel" size={22} color={colors.onPrimary} />
            </View>
            <View style={styles.featureTexts}>
              <Text style={styles.featureTitle}>Organização Completa</Text>
              <Text style={styles.featureText}>Centralize todas as suas contas, receitas e despesas em um só lugar</Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={[styles.featureIcon, sharedStyles.featureBlue]}>
              <Icon name="flag" size={22} color={colors.onPrimary} />
            </View>
            <View style={styles.featureTexts}>
              <Text style={styles.featureTitle}>Metas Financeiras</Text>
              <Text style={styles.featureText}>Defina e acompanhe suas metas com facilidade.</Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={[styles.featureIcon, sharedStyles.featureViolet]}>
              <Icon name="insert-chart" size={22} color={colors.onPrimary} />
            </View>
            <View style={styles.featureTexts}>
              <Text style={styles.featureTitle}>Relatórios Detalhados</Text>
              <Text style={styles.featureText}>Visualize seu progresso com gráficos claros.</Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={[styles.featureIcon, sharedStyles.featureRed]}>
              <Icon name="sync-alt" size={22} color={colors.onPrimary} />
            </View>
            <View style={styles.featureTexts}>
              <Text style={styles.featureTitle}>Controle de Fluxo</Text>
              <Text style={styles.featureText}>Entenda seu fluxo de caixa para um futuro financeiro saudável.</Text>
            </View>
          </View>

        </AnimatedCard>

        <View style={styles.infoCard}>
          <View>
            <Text style={styles.infoTitle}>Seus registros</Text>
            <Text style={styles.infoText}>Consulte suas receitas e despesas no Fluxo financeiro. Use Relatórios para acompanhar os totais por período.</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View>
            <Text style={styles.infoTitle}>Sua conta</Text>
            <Text style={styles.infoText}>Suas categorias personalizadas e seus anexos ficam vinculados à sua conta. Para sair do aplicativo, use Encerrar sessão no Perfil.</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.contactCard} activeOpacity={0.9} onPress={() => router.push("/menus/centralAjuda")}>
          <View style={styles.contactLeft}>
            <Icon name="person" size={20} color={colors.textPrimary} />
            <Text style={styles.contactText}>Central de ajuda</Text>
          </View>
          <Icon name="chevron-right" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerApp}>© Nexus Finance</Text>
          <Text style={styles.footerCopy}>Copyright © 2026</Text>
        </View>

      </ScrollView>

      <BarraNavegacao />
    </AnimatedScreen>
  );
}
