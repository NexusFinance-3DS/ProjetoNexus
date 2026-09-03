import { useFinance } from '../../src/data/Finance';
import { useSession } from '../../src/data/Session';
import DataStatus from '../../src/components/DataStatus';
import { navigationContentStyle, incomeColorStyle, expenseColorStyle, perfilStyles as styles } from '../../src/styles';
import { useState } from "react";
import BarraNavegacao from '../../src/components/BarraNavegacao';
import { AnimatedCard, AnimatedScreen } from '../../src/components/AnimatedScreen';
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { router } from "expo-router";
import Icon from "@expo/vector-icons/MaterialIcons";
import { formatBRL } from '../../src/data/format';
export default function Perfil() {
  const finance = useFinance();
  const {
    user,
    logout
  } = useSession();
  const {
    getTotals
  } = finance;
  const [modalSair, setModalSair] = useState(false);
  return <AnimatedScreen style={styles.container} delay={60}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={navigationContentStyle}>
        <DataStatus />

        {/* Perfil */}
        <AnimatedCard style={styles.profileContainer} delay={40}>

          <View style={styles.profileCircle}>
            <Icon name="person-outline" size={60} color="#FFF" />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.nome}>
              {user?.nome}
            </Text>

            <Text style={styles.email}>
              {user?.email}
            </Text>
          </View>

          <TouchableOpacity style={styles.settingsButton} onPress={() => router.push("/configuracoes")}>
            <Icon name="settings" size={24} color="#FFF" />
          </TouchableOpacity>

        </AnimatedCard>

        {/* Resumo */}

        <AnimatedCard style={styles.resumoCard} delay={120}>

          <Text style={styles.resumoTitulo}>
            Resumo da conta
          </Text>
          <View style={styles.resumoRow}>
            {(() => {
            const totals = getTotals();
            return <>
                  <View style={styles.itemResumo}>
                    <Icon name="account-balance-wallet" size={35} color="#5145FF" />
                    <Text style={styles.labelResumo}>Saldo</Text>
                    <Text style={styles.valorResumo}>{formatBRL(totals.saldo)}</Text>
                  </View>

                  <View style={styles.itemResumo}>
                    <Icon name="trending-up" size={35} color="#2ED573" />
                    <Text style={styles.labelResumo}>Receitas</Text>
                    <Text style={[styles.valorResumo, incomeColorStyle]}>{formatBRL(totals.totalReceitas)}</Text>
                  </View>

                  <View style={styles.itemResumo}>
                    <Icon name="trending-down" size={35} color="#FF4D4D" />
                    <Text style={styles.labelResumo}>Despesas</Text>
                    <Text style={[styles.valorResumo, expenseColorStyle]}>{formatBRL(totals.totalDespesas)}</Text>
                  </View>

                  <View style={styles.itemResumo}>
                    <Icon name="savings" size={35} color="#5145FF" />
                    <Text style={styles.labelResumo}>Economia</Text>
                    <Text style={styles.valorResumo}>{formatBRL(totals.totalReceitas - totals.totalDespesas)}</Text>
                  </View>
                </>;
          })()}
          </View>

        </AnimatedCard>

        {/* Menu */}

        <AnimatedCard style={styles.menuCard} delay={180}>

          <TouchableOpacity style={styles.itemMenu} onPress={() => router.push("/menus/meuCadastro")}>
            <View style={styles.itemLeft}>
              <Icon name="person-outline" size={24} color="#FFF" />
              <Text style={styles.itemTexto}>Meu cadastro</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemMenu} onPress={() => router.push("/relatorios")}>
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

          <TouchableOpacity style={styles.itemMenu} onPress={() => setModalSair(true)}>

            <View style={styles.itemLeft}>

              <Icon name="logout" size={24} color="#FFF" />

              <Text style={styles.itemTexto}>
                Encerrar sessão
              </Text>

            </View>

            <Icon name="chevron-right" size={24} color="#FFF" />

          </TouchableOpacity>

        </AnimatedCard>
      </ScrollView>

      {/* Modal de confirmação */}

      <Modal visible={modalSair} transparent animationType="fade" onRequestClose={() => setModalSair(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modal}>

            <View style={styles.modalIcon}>
              <Icon name="logout" size={40} color="#fff" />
            </View>

            <Text style={styles.modalTitulo}>
              Encerrar sessão
            </Text>

            <Text style={styles.modalTexto}>
              Tem certeza que deseja sair da sua conta?
            </Text>

            <View style={styles.modalButtons}>

              <TouchableOpacity style={styles.cancelar} onPress={() => setModalSair(false)}>
                <Text style={styles.cancelarTexto}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sair} onPress={() => {
              setModalSair(false);
              logout().catch(() => {});
            }}>
                <Text style={styles.sairTexto}>
                  Sair
                </Text>
              </TouchableOpacity>

            </View>

          </View>
        </View>
      </Modal>

      <BarraNavegacao />
    </AnimatedScreen>;
}
