import { navigationContentStyle, aboutInfoIconStyle, aboutContactIconStyle, aboutPrivacyIconStyle, aboutTermsIconStyle, sobreAppStyles as styles } from '../../src/styles';
import BarraNavegacao from '../../src/components/BarraNavegacao';
import { AnimatedCard, AnimatedScreen } from '../../src/components/AnimatedScreen';
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
export default function SobreApp() {
  return <AnimatedScreen style={styles.container} delay={60}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={navigationContentStyle}>

        <AnimatedCard style={styles.mainCard} delay={40}>
          <Text style={styles.appName}>Nexus Finance</Text>
        </AnimatedCard>

        <AnimatedCard style={styles.featuresCard} delay={120}>
          <Text style={styles.featuresTitle}>Sua Gestão Financeira, Descomplicada</Text>

          <View style={styles.featureRow}>
            <View style={[styles.featureIcon, aboutInfoIconStyle]}>
              <Icon name="wallet-travel" size={22} color="#FFF" />
            </View>
            <View style={styles.featureTexts}>
              <Text style={styles.featureTitle}>Organização Completa</Text>
              <Text style={styles.featureText}>Centralize todas as suas contas, receitas e despesas em um só lugar</Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={[styles.featureIcon, aboutContactIconStyle]}>
              <Icon name="flag" size={22} color="#FFF" />
            </View>
            <View style={styles.featureTexts}>
              <Text style={styles.featureTitle}>Metas Financeiras</Text>
              <Text style={styles.featureText}>Defina e acompanhe suas metas com facilidade.</Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={[styles.featureIcon, aboutPrivacyIconStyle]}>
              <Icon name="insert-chart" size={22} color="#FFF" />
            </View>
            <View style={styles.featureTexts}>
              <Text style={styles.featureTitle}>Relatórios Detalhados</Text>
              <Text style={styles.featureText}>Visualize seu progresso com gráficos claros.</Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={[styles.featureIcon, aboutTermsIconStyle]}>
              <Icon name="sync-alt" size={22} color="#FFF" />
            </View>
            <View style={styles.featureTexts}>
              <Text style={styles.featureTitle}>Controle de Fluxo</Text>
              <Text style={styles.featureText}>Entenda seu fluxo de caixa para um futuro financeiro saudável.</Text>
            </View>
          </View>

        </AnimatedCard>

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

      <BarraNavegacao />
    </AnimatedScreen>;
}
