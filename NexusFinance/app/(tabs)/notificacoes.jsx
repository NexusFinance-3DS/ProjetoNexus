import React, { useState } from "react";
import BarraNavegacao from '../components/BarraNavegacao';
import { AnimatedCard, AnimatedScreen } from '../components/AnimatedScreen';
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import Icon from "@expo/vector-icons/MaterialIcons";

import { notificacoesStyles as styles, sharedStyles } from "../styles/styles";
import { formatBRL } from '../data/financeData';

export default function Notificacoes() {
  const [notificacoes] = useState([
    { id: 1, titulo: "Meta atualizada", descricao: `Você economizou ${formatBRL(250)} para sua meta.`, hora: "Agora", icone: "flag", cor: "#4b3df2", lida: false },
    { id: 2, titulo: "Nova receita", descricao: `Salário de ${formatBRL(4500)} foi registrado.`, hora: "10 min", icone: "trending-up", cor: "#00E676", lida: false },
    { id: 3, titulo: "Despesa adicionada", descricao: `Pagamento de ${formatBRL(120.2)} em Alimentação.`, hora: "35 min", icone: "trending-down", cor: "#FF3B30", lida: true },
    { id: 4, titulo: "Lembrete", descricao: "Sua conta de internet vence amanhã.", hora: "Hoje", icone: "notifications", cor: "#FF9800", lida: true },
    { id: 5, titulo: "Parabéns!", descricao: "Você economizou mais que no mês passado.", hora: "Ontem", icone: "emoji-events", cor: "#FFD700", lida: true },
  ]);

  return (
    <AnimatedScreen style={styles.container} delay={60}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.subTitle}>Últimas notificações</Text>

        {notificacoes.map((item, index) => (
          <AnimatedCard key={item.id} style={[styles.card, !item.lida && styles.cardNova]} delay={80 + index * 60}>
            <TouchableOpacity activeOpacity={0.8} style={sharedStyles.rowCentered}>
              <View style={[styles.iconContainer, { backgroundColor: item.cor }]}>
                <Icon name={item.icone} size={28} color="#FFF" />
              </View>

              <View style={styles.textContainer}>
                <View style={styles.row}>
                  <Text style={styles.cardTitle}>{item.titulo}</Text>
                  <Text style={styles.hora}>{item.hora}</Text>
                </View>

                <Text style={styles.descricao}>{item.descricao}</Text>
              </View>

              {!item.lida && <View style={styles.bolinha} />}
            </TouchableOpacity>
          </AnimatedCard>
        ))}

        {notificacoes.length === 0 && (
          <View style={styles.emptyContainer}>
            <Icon name="notifications-off" size={80} color="#666" />
            <Text style={styles.emptyTitle}>Nenhuma notificação</Text>
            <Text style={styles.emptyText}>Quando houver novidades elas aparecerão aqui.</Text>
          </View>
        )}

        <View style={sharedStyles.bottomSpacer} />
      </ScrollView>

      <BarraNavegacao />
    </AnimatedScreen>
  );
}
