import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback } from "react-native";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import styles from "../styles/perfil";
import barraNavegacao from "../styles/barraNavegacao";
import { getTotals, formatBRL } from '../data/financeData';

export default function Perfil() {
  const [modalSair, setModalSair] = useState(false);
  const [menuAberto, setMenuAberto] = useState(null);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* Perfil */}
        <View style={styles.profileContainer}>

          <View style={styles.profileCircle}>
            <Icon
              name="person-outline"
              size={60}
              color="#FFF"
            />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.nome}>
              Cesar Serra
            </Text>

            <Text style={styles.email}>
              cesar.serra@gmail.com
            </Text>
          </View>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => router.push("/configuracoes")}
          >
            <Icon name="settings" size={24} color="#FFF" />
          </TouchableOpacity>

        </View>

        {/* Resumo */}

        <View style={styles.resumoCard}>

          <Text style={styles.resumoTitulo}>
            Resumo da conta
          </Text>
          <View style={styles.resumoRow}>
            {(() => {
              const totals = getTotals();
              return (
                <>
                  <View style={styles.itemResumo}>
                    <Icon name="account-balance-wallet" size={35} color="#5145FF" />
                    <Text style={styles.labelResumo}>Saldo</Text>
                    <Text style={styles.valorResumo}>{formatBRL(totals.saldo)}</Text>
                  </View>

                  <View style={styles.itemResumo}>
                    <Icon name="trending-up" size={35} color="#2ED573" />
                    <Text style={styles.labelResumo}>Receitas</Text>
                    <Text style={[styles.valorResumo, { color: "#2ED573" }]}>{formatBRL(totals.totalReceitas)}</Text>
                  </View>

                  <View style={styles.itemResumo}>
                    <Icon name="trending-down" size={35} color="#FF4D4D" />
                    <Text style={styles.labelResumo}>Despesas</Text>
                    <Text style={[styles.valorResumo, { color: "#FF4D4D" }]}>{formatBRL(totals.totalDespesas)}</Text>
                  </View>

                  <View style={styles.itemResumo}>
                    <Icon name="savings" size={35} color="#5145FF" />
                    <Text style={styles.labelResumo}>Economia</Text>
                    <Text style={styles.valorResumo}>{formatBRL(totals.totalReceitas - totals.totalDespesas)}</Text>
                  </View>
                </>
              );
            })()}
          </View>

        </View>

        {/* Menu */}

        <View style={styles.menuCard}>

          <TouchableOpacity style={styles.itemMenu} onPress={() => router.push("/menus/meuCadastro")}>
            <View style={styles.itemLeft}>
              <Icon name="person-outline" size={24} color="#FFF" />
              <Text style={styles.itemTexto}>Meu cadastro</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.itemMenu}
            onPress={() => router.push("/relatorios")}
          >
            <View style={styles.itemLeft}>
              <Icon name="description" size={24} color="#FFF" />
              <Text style={styles.itemTexto}>Relatórios</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemMenu} onPress={() => router.push("/menus/centralAjuda")}>
            <View style={styles.itemLeft}>
              <Icon name="support-agent" size={24} color="#FFF" />
              <Text style={styles.itemTexto}>Central de ajuda</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemMenu} onPress={() => router.push("/menus/sobreApp")}>
            <View style={styles.itemLeft}>
              <Icon name="info-outline" size={24} color="#FFF" />
              <Text style={styles.itemTexto}>Sobre o aplicativo</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.itemMenu}
            onPress={() => setModalSair(true)}
          >

            <View style={styles.itemLeft}>

              <Icon
                name="logout"
                size={24}
                color="#FFF"
              />

              <Text style={styles.itemTexto}>
                Encerrar sessão
              </Text>

            </View>

            <Icon
              name="chevron-right"
              size={24}
              color="#FFF"
            />

          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* Modal de confirmação */}

      <Modal
        visible={modalSair}
        transparent
        animationType="fade"
        onRequestClose={() => setModalSair(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modal}>

            <View style={styles.modalIcon}>
              <Icon
                name="logout"
                size={40}
                color="#fff"
              />
            </View>

            <Text style={styles.modalTitulo}>
              Encerrar sessão
            </Text>

            <Text style={styles.modalTexto}>
              Tem certeza que deseja sair da sua conta?
            </Text>

            <View style={styles.modalButtons}>

              <TouchableOpacity
                style={styles.cancelar}
                onPress={() => setModalSair(false)}
              >
                <Text style={styles.cancelarTexto}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sair}
                onPress={() => {
                  setModalSair(false);
                  router.replace("/auth/login");
                }}
              >
                <Text style={styles.sairTexto}>
                  Sair
                </Text>
              </TouchableOpacity>

            </View>

          </View>
        </View>
      </Modal>

      {/* Menu expandido */}
      {menuAberto != null && (
        <TouchableWithoutFeedback onPress={() => setMenuAberto(null)}>
          {menuAberto === 'add' && (
            <View style={barraNavegacao.menuExpandido}>
              <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => { setMenuAberto(null); router.push('/transacoes'); }}>
                <Icon name="swap-horiz" size={30} color="#fff" />
                <Text style={barraNavegacao.tabLabel}>Transações</Text>
              </TouchableOpacity>

              <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => { setMenuAberto(null); router.push('/categoria'); }}>
                <Icon name="category" size={30} color="#fff" />
                <Text style={barraNavegacao.tabLabel}>Categoria</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={barraNavegacao.itemMenu}
                onPress={() => {
                  setMenuAberto(null);
                  router.push('/dashboard');
                }}
              >
                <Icon name="bar-chart" size={40} color="#fff" style={{marginBottom: -10}} />
                <Text style={barraNavegacao.tabLabel}>Dashboard</Text>
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

          <View style={barraNavegacao.tabBar}>
            <TouchableOpacity style={barraNavegacao.tabItem} onPress={() => router.push('/inicial')} activeOpacity={0.8}>
              <Icon name="home" size={32} color="#ffffff" />
              <Text style={barraNavegacao.tabLabel}>Início</Text>
            </TouchableOpacity>

            <TouchableOpacity style={barraNavegacao.tabItem} onPress={() => router.push('/fluxoFinanceiro')} activeOpacity={0.8}>
              <Icon name="swap-horiz" size={32} color="#ffffff" />
              <Text style={barraNavegacao.tabLabel}>Fluxo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={barraNavegacao.tabItem} onPress={() => setMenuAberto(menuAberto === 'add' ? null : 'add')} activeOpacity={0.8}>
              <Icon name={menuAberto != null ? "close" : "add-circle"} size={56} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={barraNavegacao.tabItem} onPress={() => router.push('/metas')} activeOpacity={0.8}>
              <Icon name="radar" size={32} color="#ffffff" />
              <Text style={barraNavegacao.tabLabel}>Metas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={barraNavegacao.tabItem} onPress={() => setMenuAberto(menuAberto === 'more' ? null : 'more')} activeOpacity={0.8}>
              <Icon name="menu" size={32} color="#ffffff" />
              <Text style={barraNavegacao.tabLabel}>mais</Text>
            </TouchableOpacity>
          </View>

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