import { api } from '../../src/api/client';
import { useFinance } from '../../src/data/Finance';
import DataStatus from '../../src/components/DataStatus';
import { rowCenterStyle, categoryColorStyle, bottomSpacerStyle, notificacoesStyles as styles } from '../../src/styles';
import BarraNavegacao from '../../src/components/BarraNavegacao';
import { AnimatedCard, AnimatedScreen } from '../../src/components/AnimatedScreen';
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
export default function Notificacoes() {
  const finance = useFinance();
  const {
    notificacoes
  } = finance;
  return <AnimatedScreen style={styles.container} delay={60}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <DataStatus />
        <Text style={styles.subTitle}>Últimas notificações</Text>

        {notificacoes.map((item, index) => <AnimatedCard key={item.id} style={[styles.card, !item.lida && styles.cardNova]} delay={80 + index * 60}>
            <TouchableOpacity activeOpacity={0.8} style={rowCenterStyle} onPress={() => api("/notificacoes/" + item.id, {
          method: "PATCH",
          body: {
            lida: true
          }
        }).then(finance.refresh).catch(finance.refresh)}>
              <View style={[styles.iconContainer, categoryColorStyle(item)]}>
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
          </AnimatedCard>)}

        {notificacoes.length === 0 && <View style={styles.emptyContainer}>
            <Icon name="notifications-off" size={80} color="#666" />
            <Text style={styles.emptyTitle}>Nenhuma notificação</Text>
            <Text style={styles.emptyText}>Quando houver novidades elas aparecerão aqui.</Text>
          </View>}

        <View style={bottomSpacerStyle} />
      </ScrollView>

      <BarraNavegacao />
    </AnimatedScreen>;
}
