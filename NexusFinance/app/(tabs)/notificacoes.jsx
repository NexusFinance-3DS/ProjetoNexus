import React, { useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "expo-router";
import Icon from "@expo/vector-icons/MaterialIcons";
import BarraNavegacao from "../components/BarraNavegacao";
import { AnimatedCard, AnimatedScreen } from "../components/AnimatedScreen";
import { useAppStyles } from "../styles/styles";
import { apiAutenticada } from "../../services/financeiro";

export default function Notificacoes() {
  const { colors, notificacoesStyles: styles, sharedStyles } = useAppStyles();
  const VISUAL = {
    Financeira: { icone: 'account-balance-wallet', cor: colors.successSoft, iconColor: colors.success },
    Meta: { icone: 'flag', cor: colors.primarySoft, iconColor: colors.textLink },
    Sistema: { icone: 'info', cor: colors.primarySoft, iconColor: colors.textLink },
    Lembrete: { icone: 'notifications', cor: colors.surfaceElevated, iconColor: colors.warning },
  };
  const [notificacoes, setNotificacoes] = useState([]);
  const [erro, setErro] = useState("");

  useFocusEffect(useCallback(() => {
    let active = true;
    apiAutenticada("/notificacoes")
      .then((response) => active && setNotificacoes(response.notificacoes))
      .catch((error) => active && setErro(error.message));
    return () => { active = false; };
  }, []));

  async function marcarComoLida(item) {
    if (item.lida) return;
    await apiAutenticada(`/notificacoes/${item.id}/lida`, { method: "PATCH" });
    setNotificacoes((current) => current.map((notification) => notification.id === item.id ? { ...notification, lida: true } : notification));
  }

  return (
    <AnimatedScreen style={styles.container} delay={60}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={sharedStyles.paddingBottom120}>
        <Text style={styles.subTitle}>Últimas notificações</Text>
        {erro ? <Text style={sharedStyles.errorText}>{erro}</Text> : null}
        {notificacoes.map((item, index) => {
          const visual = VISUAL[item.tipo] || VISUAL.Sistema;
          return (
            <AnimatedCard key={item.id} style={[styles.card, !item.lida && styles.cardNova]} delay={80 + index * 40}>
              <TouchableOpacity activeOpacity={0.8} style={sharedStyles.rowCentered} onPress={() => marcarComoLida(item)}>
                <View style={[styles.iconContainer, { backgroundColor: visual.cor }]}><Icon name={visual.icone} size={28} color={visual.iconColor} /></View>
                <View style={styles.textContainer}>
                  <View style={styles.row}><Text style={styles.cardTitle}>{item.titulo}</Text><Text style={styles.hora}>{new Date(item.criado_em).toLocaleDateString("pt-BR")}</Text></View>
                  <Text style={styles.descricao}>{item.descricao}</Text>
                </View>
                {!item.lida && <View style={styles.bolinha} />}
              </TouchableOpacity>
            </AnimatedCard>
          );
        })}
        {!erro && notificacoes.length === 0 ? (
          <View style={styles.emptyContainer}><Icon name="notifications-off" size={80} color={colors.textMuted} /><Text style={styles.emptyTitle}>Nenhuma notificação</Text><Text style={styles.emptyText}>Quando houver novidades elas aparecerão aqui.</Text></View>
        ) : null}
      </ScrollView>
      <BarraNavegacao />
    </AnimatedScreen>
  );
}
