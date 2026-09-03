import { reportContentStyle, centralAjudaStyles as styles } from '../../src/styles';
import BarraNavegacao from '../../src/components/BarraNavegacao';
import { AnimatedCard, AnimatedScreen } from '../../src/components/AnimatedScreen';
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
export default function CentralAjuda() {
  return <AnimatedScreen style={styles.container} delay={60}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={reportContentStyle}>

        <AnimatedCard style={styles.card} delay={40}>
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
        </AnimatedCard>

        <AnimatedCard style={styles.cardInfo} delay={120}>
          <Text style={styles.cardInfoTitle}>Ainda precisa de ajuda?</Text>
          <Text style={styles.cardInfoText}>
            Nosso suporte está disponível para tirar dúvidas sobre o app, finanças e configurações.
          </Text>
        </AnimatedCard>

        <TouchableOpacity style={styles.contactButton} activeOpacity={0.8} onPress={() => console.log("Contato com suporte")}>
          <Icon name="chat-bubble-outline" size={24} color="#FFF" />
          <Text style={styles.contactText}>Fale com o suporte</Text>
        </TouchableOpacity>

      </ScrollView>

      <BarraNavegacao />
    </AnimatedScreen>;
}
