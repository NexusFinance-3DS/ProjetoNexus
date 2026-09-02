import React, { useState } from "react";
import BarraNavegacao from '../components/BarraNavegacao';
import { AnimatedCard, AnimatedScreen } from '../components/AnimatedScreen';
import { View, Text, TouchableOpacity, ScrollView, Switch, TouchableWithoutFeedback } from "react-native";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

import styles from "../styles/configuracoes";

export default function Configuracoes() {
  const [notificacoes, setNotificacoes] = useState(true);
  const [temaEscuro, setTemaEscuro] = useState(true);

  return (
    <AnimatedScreen style={styles.container} delay={60}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
        <AnimatedCard style={styles.card} delay={40}>
          <Text style={styles.cardTitle}>Preferências</Text>

          <View style={styles.item}>
            <View style={styles.itemLeft}>
              <Icon name="notifications" size={26} color="#5145FF" />
              <Text style={styles.itemText}>Notificações</Text>
            </View>

            <Switch
              value={notificacoes}
              onValueChange={setNotificacoes}
              thumbColor="#FFF"
              trackColor={{ false: "#555", true: "#5145FF" }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.item}>
            <View style={styles.itemLeft}>
              <Icon name="dark-mode" size={26} color="#5145FF" />
              <Text style={styles.itemText}>Tema escuro</Text>
            </View>

            <Switch
              value={temaEscuro}
              onValueChange={setTemaEscuro}
              thumbColor="#FFF"
              trackColor={{ false: "#555", true: "#5145FF" }}
            />
          </View>
        </AnimatedCard>

        <AnimatedCard style={styles.card} delay={120}>
          <Text style={styles.cardTitle}>Conta</Text>

          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <Icon name="lock" size={26} color="#5145FF" />
              <Text style={styles.itemText}>Alterar senha</Text>
            </View>
            <Icon name="chevron-right" size={26} color="#AAA" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <Icon name="language" size={26} color="#5145FF" />
              <Text style={styles.itemText}>Idioma</Text>
            </View>
            <Icon name="chevron-right" size={26} color="#AAA" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <Icon name="security" size={26} color="#5145FF" />
              <Text style={styles.itemText}>Privacidade</Text>
            </View>
            <Icon name="chevron-right" size={26} color="#AAA" />
          </TouchableOpacity>
        </AnimatedCard>

        <AnimatedCard style={styles.card} delay={180}>
          <Text style={styles.cardTitle}>Sistema</Text>

          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <Icon name="backup" size={26} color="#5145FF" />
              <Text style={styles.itemText}>Backup dos dados</Text>
            </View>
            <Icon name="chevron-right" size={26} color="#AAA" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <Icon name="download" size={26} color="#5145FF" />
              <Text style={styles.itemText}>Exportar dados</Text>
            </View>
            <Icon name="chevron-right" size={26} color="#AAA" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <Icon name="info" size={26} color="#5145FF" />
              <Text style={styles.itemText}>Sobre o aplicativo</Text>
            </View>
            <Icon name="chevron-right" size={26} color="#AAA" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <Icon name="star" size={26} color="#5145FF" />
              <Text style={styles.itemText}>Avaliar aplicativo</Text>
            </View>
            <Icon name="chevron-right" size={26} color="#AAA" />
          </TouchableOpacity>
        </AnimatedCard>

        <View style={{ height: 100 }} />
      </ScrollView>

      <BarraNavegacao />
    </AnimatedScreen>
  );
}