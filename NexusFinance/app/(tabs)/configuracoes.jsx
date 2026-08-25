import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch, TouchableWithoutFeedback } from "react-native";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

import styles from "../styles/configuracoes";
import barraNavegacao from "../styles/barraNavegacao";

export default function Configuracoes() {
  const [notificacoes, setNotificacoes] = useState(true);
  const [temaEscuro, setTemaEscuro] = useState(true);
  const [menuAberto, setMenuAberto] = useState(null);

  return (
    <View style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>

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

      {/* Menu expandido */}
      {menuAberto != null && (
        <TouchableWithoutFeedback onPress={() => setMenuAberto(null)}>
          <View style={barraNavegacao.overlay} />
        </TouchableWithoutFeedback>
      )}

      {menuAberto === 'add' && (
        <View style={barraNavegacao.menuExpandido}>
          <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => { setMenuAberto(null); router.push('/receita/novaReceita'); }}>
            <Icon name="attach-money" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Receitas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => { setMenuAberto(null); router.push('/despesa/novaDespesa'); }}>
            <Icon name="receipt" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Despesas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => { setMenuAberto(null); router.push('/transacoes'); }}>
            <Icon name="swap-horiz" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Transações</Text>
          </TouchableOpacity>

          <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => { setMenuAberto(null); router.push('/categoria'); }}>
            <Icon name="category" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Categoria</Text>
          </TouchableOpacity>

          <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => { setMenuAberto(null); router.push('/metas'); }}>
            <Icon name="flag" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Metas</Text>
          </TouchableOpacity>
        </View>
      )}

      {menuAberto === 'more' && (
        <View style={barraNavegacao.menuExpandido}>
          <TouchableOpacity
            style={barraNavegacao.itemMenu}
            onPress={() => {
              setMenuAberto(null);
              router.push('/dashboard');
            }}
          >
            <Icon name="menu" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Dashboard</Text>
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
          <Text style={barraNavegacao.tabLabel}>Fluxo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={barraNavegacao.tabItem}
          onPress={() => setMenuAberto(menuAberto === 'add' ? null : 'add')}
          activeOpacity={0.8}
        >
          <Icon
            name={menuAberto != null ? "close" : "add-circle"}
            size={56}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={barraNavegacao.tabItem}
          onPress={() => router.push('/metas')}
          activeOpacity={0.8}
        >
          <Icon name="radar" size={32} color="#ffffff" />
          <Text style={barraNavegacao.tabLabel}>Metas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={barraNavegacao.tabItem}
          onPress={() => setMenuAberto(menuAberto === 'more' ? null : 'more')}
          activeOpacity={0.8}
        >
          <Icon name="menu" size={32} color="#ffffff" />
          <Text style={barraNavegacao.tabLabel}>mais</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}