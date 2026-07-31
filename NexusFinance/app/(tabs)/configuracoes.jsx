import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

import styles from "../styles/configuracoes";
import navStyles from "../styles/barraNavegacao";

export default function Configuracoes() {
  const [notificacoes, setNotificacoes] = useState(true);
  const [temaEscuro, setTemaEscuro] = useState(true);
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <View style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        <Text style={styles.title}>
          Configurações
        </Text>

        <View style={styles.card}>

          <Text style={styles.cardTitle}>
            Preferências
          </Text>

          <View style={styles.item}>

            <View style={styles.itemLeft}>
              <Icon
                name="notifications"
                size={26}
                color="#5145FF"
              />

              <Text style={styles.itemText}>
                Notificações
              </Text>
            </View>

            <Switch
              value={notificacoes}
              onValueChange={setNotificacoes}
              thumbColor="#FFF"
              trackColor={{
                false: "#555",
                true: "#5145FF",
              }}
            />

          </View>

          <View style={styles.divider} />

          <View style={styles.item}>

            <View style={styles.itemLeft}>
              <Icon
                name="dark-mode"
                size={26}
                color="#5145FF"
              />

              <Text style={styles.itemText}>
                Tema escuro
              </Text>
            </View>

            <Switch
              value={temaEscuro}
              onValueChange={setTemaEscuro}
              thumbColor="#FFF"
              trackColor={{
                false: "#555",
                true: "#5145FF",
              }}
            />

          </View>

        </View>

        <View style={styles.card}>

          <Text style={styles.cardTitle}>
            Conta
          </Text>

          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <Icon
                name="lock"
                size={26}
                color="#5145FF"
              />
              <Text style={styles.itemText}>
                Alterar senha
              </Text>
            </View>

            <Icon
              name="chevron-right"
              size={26}
              color="#AAA"
            />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <Icon
                name="language"
                size={26}
                color="#5145FF"
              />
              <Text style={styles.itemText}>
                Idioma
              </Text>
            </View>

            <Icon
              name="chevron-right"
              size={26}
              color="#AAA"
            />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <Icon
                name="security"
                size={26}
                color="#5145FF"
              />
              <Text style={styles.itemText}>
                Privacidade
              </Text>
            </View>

            <Icon
              name="chevron-right"
              size={26}
              color="#AAA"
            />
          </TouchableOpacity>

        </View>

        <View style={styles.card}>

          <Text style={styles.cardTitle}>
            Sistema
          </Text>

          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <Icon
                name="backup"
                size={26}
                color="#5145FF"
              />
              <Text style={styles.itemText}>
                Backup dos dados
              </Text>
            </View>

            <Icon
              name="chevron-right"
              size={26}
              color="#AAA"
            />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <Icon
                name="download"
                size={26}
                color="#5145FF"
              />
              <Text style={styles.itemText}>
                Exportar dados
              </Text>
            </View>

            <Icon
              name="chevron-right"
              size={26}
              color="#AAA"
            />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <Icon
                name="info"
                size={26}
                color="#5145FF"
              />
              <Text style={styles.itemText}>
                Sobre o aplicativo
              </Text>
            </View>

            <Icon
              name="chevron-right"
              size={26}
              color="#AAA"
            />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
              <Icon
                name="star"
                size={26}
                color="#5145FF"
              />
              <Text style={styles.itemText}>
                Avaliar aplicativo
              </Text>
            </View>

            <Icon
              name="chevron-right"
              size={26}
              color="#AAA"
            />
          </TouchableOpacity>

        </View>

        <View style={{ height: 100 }} />

      </ScrollView>

      {menuAberto && (
        <View style={navStyles.menuExpandido}>
          <TouchableOpacity style={navStyles.itemMenu} onPress={() => router.push("/receita/novaReceita")}>
            <Icon name="attach-money" size={30} color="#fff" />
            <Text style={navStyles.tabLabel}>Receitas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={navStyles.itemMenu} onPress={() => router.push("/despesa/novaDespesa")}>
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

      {/* Barra de navegação */}

      <View style={navStyles.tabBar}>

        <TouchableOpacity
          style={navStyles.tabItem}
          onPress={() => router.push("/inicial")}
        >
          <Icon name="home" size={32} color="#FFF" />
          <Text style={navStyles.tabLabel}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={navStyles.tabItem}
          onPress={() => router.push("/fluxoFinanceiro")}
        >
          <Icon name="swap-horiz" size={32} color="#FFF" />
          <Text style={navStyles.tabLabel}>Fluxo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={navStyles.tabItem}
          onPress={() => setMenuAberto(!menuAberto)}
        >
          <Icon
            name="add-circle"
            size={56}
            color="#5145FF"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={navStyles.tabItem}
          onPress={() => router.push("/metas")}
        >
          <Icon
            name="track-changes"
            size={32}
            color="#FFF"
          />
          <Text style={navStyles.tabLabel}>Metas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={navStyles.tabItem}
          onPress={() => router.push("/perfil")}
        >
          <Icon
            name="menu"
            size={32}
            color="#FFF"
          />
          <Text style={navStyles.tabLabel}>Mais</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}