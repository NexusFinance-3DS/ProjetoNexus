import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

import styles from "../styles/notificacoes";
import barraNavegacao from "../styles/barraNavegacao";

export default function Notificacoes() {
  const [menuAberto, setMenuAberto] = useState(false);

  const [notificacoes] = useState([
    {
      id: 1,
      titulo: "Meta atualizada",
      descricao: "Você economizou R$ 250,00 para sua meta.",
      hora: "Agora",
      icone: "flag",
      cor: "#5145FF",
      lida: false,
    },
    {
      id: 2,
      titulo: "Nova receita",
      descricao: "Salário de R$ 2.500,00 foi registrado.",
      hora: "10 min",
      icone: "trending-up",
      cor: "#00E676",
      lida: false,
    },
    {
      id: 3,
      titulo: "Despesa adicionada",
      descricao: "Pagamento de R$ 120,00 em Alimentação.",
      hora: "35 min",
      icone: "trending-down",
      cor: "#FF3B30",
      lida: true,
    },
    {
      id: 4,
      titulo: "Lembrete",
      descricao: "Sua conta de internet vence amanhã.",
      hora: "Hoje",
      icone: "notifications",
      cor: "#FF9800",
      lida: true,
    },
    {
      id: 5,
      titulo: "Parabéns!",
      descricao: "Você economizou mais que no mês passado.",
      hora: "Ontem",
      icone: "emoji-events",
      cor: "#FFD700",
      lida: true,
    },
  ]);

  return (
    <View style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>

          <TouchableOpacity
            onPress={() => router.back()}
          >
            <Icon
              name="arrow-back"
              size={28}
              color="#FFF"
            />
          </TouchableOpacity>

          <Text style={styles.title}>
            Notificações
          </Text>

          <TouchableOpacity>
            <Icon
              name="delete-sweep"
              size={28}
              color="#FFF"
            />
          </TouchableOpacity>

        </View>

        <Text style={styles.subTitle}>
          Últimas notificações
        </Text>

        {notificacoes.map((item) => (

          <TouchableOpacity
            key={item.id}
            style={[
              styles.card,
              !item.lida && styles.cardNova,
            ]}
            activeOpacity={0.8}
          >

            <View
              style={[
                styles.iconContainer,
                { backgroundColor: item.cor },
              ]}
            >
              <Icon
                name={item.icone}
                size={28}
                color="#FFF"
              />
            </View>

            <View style={styles.textContainer}>

              <View style={styles.row}>

                <Text style={styles.cardTitle}>
                  {item.titulo}
                </Text>

                <Text style={styles.hora}>
                  {item.hora}
                </Text>

              </View>

              <Text style={styles.descricao}>
                {item.descricao}
              </Text>

            </View>

            {!item.lida && (
              <View style={styles.bolinha} />
            )}

          </TouchableOpacity>

        ))}

        {notificacoes.length === 0 && (
          <View style={styles.emptyContainer}>

            <Icon
              name="notifications-off"
              size={80}
              color="#666"
            />

            <Text style={styles.emptyTitle}>
              Nenhuma notificação
            </Text>

            <Text style={styles.emptyText}>
              Quando houver novidades elas aparecerão aqui.
            </Text>

          </View>
        )}

        <View style={{ height: 100 }} />

      </ScrollView>

      {/* Menu expandido */}
      {menuAberto && (
        <View style={barraNavegacao.menuExpandido}>
          <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => router.push('/receita/novaReceita')}>
            <Icon name="attach-money" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Receitas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => router.push('/despesa/novaDespesa')}>
            <Icon name="receipt" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Despesas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={barraNavegacao.itemMenu}>
            <Icon name="swap-horiz" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Transações</Text>
          </TouchableOpacity>

          <TouchableOpacity style={barraNavegacao.itemMenu}>
            <Icon name="category" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Categoria</Text>
          </TouchableOpacity>

          <TouchableOpacity style={barraNavegacao.itemMenu}>
            <Icon name="flag" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Metas</Text>
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
          <Text style={barraNavegacao.tabLabel}>Fluxo Financeiro</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={barraNavegacao.tabItem}
          onPress={() => setMenuAberto(!menuAberto)}
          activeOpacity={0.8}
        >
          <Icon name={menuAberto ? "close" : "add-circle"} size={56} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={barraNavegacao.tabItem}
          onPress={() => router.push('/metas')}
          activeOpacity={0.8}
        >
          <Icon name="track-changes" size={32} color="#ffffff" />
          <Text style={barraNavegacao.tabLabel}>Metas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={barraNavegacao.tabItem}
          onPress={() => router.push('/perfil')}
          activeOpacity={0.8}
        >
          <Icon name="menu" size={32} color="#ffffff" />
          <Text style={barraNavegacao.tabLabel}>Mais</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}