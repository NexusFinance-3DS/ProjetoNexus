import React, { useState } from 'react';
import BarraNavegacao from "../../componentes/BarraNavegacao";
import { CartaoAnimado, TelaAnimada } from "../../componentes/TelaAnimada";
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { router } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useEstilosApp } from "../../style/style";
import { formatarReais, apiAutenticada } from "../../servicos/financeiro";
import { useSessao } from "../../contextos/ContextoSessao";
import { useResumoFinanceiro } from "../../ganchos/useResumoFinanceiro";
export default function Perfil() {
  const {
    cores,
    estilosPerfil: estilos,
    estilosCompartilhados
  } = useEstilosApp();
  const [modalSair, setModalSair] = useState(false);
  const {
    usuario,
    encerrarSessao
  } = useSessao();
  const {
    dados
  } = useResumoFinanceiro();
  const totais = dados.atual;
  async function sair() {
    try {
      await apiAutenticada('/auth/logout', {
        method: 'POST'
      });
    } catch {
      // A sessão local deve ser encerrada mesmo se o servidor estiver indisponível.
    }
    await encerrarSessao();
    setModalSair(false);
    router.replace('/auth/login');
  }
  return <TelaAnimada style={estilos.recipiente} atraso={60}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilosCompartilhados.espacamentoInferior120}>
        {/* Perfil */}
        <CartaoAnimado style={estilos.perfilRecipiente} atraso={40}>
          <View style={estilos.perfilCirculo}>
            <Icon name="person-outline" size={60} color={cores.textoPrincipal} />
          </View>

          <View style={estilos.perfilInformacoes}>
            <Text style={estilos.nome}>{usuario?.nome || 'Usuário'}</Text>

            <Text style={estilos.email}>{usuario?.email || ''}</Text>
          </View>

          <TouchableOpacity style={estilos.settingsBotao} onPress={() => router.push('/configuracoes')}>
            <Icon name="settings" size={24} color={cores.textoPrincipal} />
          </TouchableOpacity>
        </CartaoAnimado>

        {/* Resumo */}

        <CartaoAnimado style={estilos.resumoCartao} atraso={120}>
          <Text style={estilos.resumoTitulo}>Resumo da conta</Text>
          <View style={estilos.resumoLinha}>
            <>
              <View style={estilos.itemResumo}>
                <Icon name="account-balance-wallet" size={35} color={cores.primaria} />
                <Text style={estilos.rotuloResumo}>Disponível</Text>
                <Text style={estilos.valorResumo}>{formatarReais(dados.saldoDisponivel)}</Text>
              </View>

              <View style={estilos.itemResumo}>
                <Icon name="trending-up" size={35} color={cores.sucesso} />
                <Text style={estilos.rotuloResumo}>Receitas</Text>
                <Text style={[estilos.valorResumo, estilosCompartilhados.positivoTexto]}>
                  {formatarReais(totais.totalReceitas)}
                </Text>
              </View>

              <View style={estilos.itemResumo}>
                <Icon name="trending-down" size={35} color={cores.perigo} />
                <Text style={estilos.rotuloResumo}>Despesas</Text>
                <Text style={[estilos.valorResumo, estilosCompartilhados.negativoTexto]}>
                  {formatarReais(totais.totalDespesas)}
                </Text>
              </View>

              <View style={estilos.itemResumo}>
                <Icon name="savings" size={35} color={cores.primaria} />
                <Text style={estilos.rotuloResumo}>Resultado mensal</Text>
                <Text style={estilos.valorResumo}>
                  {formatarReais(totais.totalReceitas - totais.totalDespesas)}
                </Text>
              </View>
            </>
          </View>
        </CartaoAnimado>

        {/* Menu */}

        <CartaoAnimado style={estilos.menuCartao} atraso={180}>
          <TouchableOpacity style={estilos.itemMenu} onPress={() => router.push('/menus/meuCadastro')}>
            <View style={estilos.itemEsquerda}>
              <Icon name="person-outline" size={24} color={cores.textoPrincipal} />
              <Text style={estilos.itemTexto}>Meu cadastro</Text>
            </View>
            <Icon name="chevron-right" size={24} color={cores.textoPrincipal} />
          </TouchableOpacity>

          <TouchableOpacity style={estilos.itemMenu} onPress={() => router.push('/relatorios')}>
            <View style={estilos.itemEsquerda}>
              <Icon name="description" size={24} color={cores.textoPrincipal} />
              <Text style={estilos.itemTexto}>Relatórios</Text>
            </View>
            <Icon name="chevron-right" size={24} color={cores.textoPrincipal} />
          </TouchableOpacity>

          <TouchableOpacity style={estilos.itemMenu} onPress={() => router.push('/menus/centralAjuda')}>
            <View style={estilos.itemEsquerda}>
              <Icon name="support-agent" size={24} color={cores.textoPrincipal} />
              <Text style={estilos.itemTexto}>Central de ajuda</Text>
            </View>
            <Icon name="chevron-right" size={24} color={cores.textoPrincipal} />
          </TouchableOpacity>

          <TouchableOpacity style={estilos.itemMenu} onPress={() => router.push('/menus/sobreApp')}>
            <View style={estilos.itemEsquerda}>
              <Icon name="info-outline" size={24} color={cores.textoPrincipal} />
              <Text style={estilos.itemTexto}>Sobre o aplicativo</Text>
            </View>
            <Icon name="chevron-right" size={24} color={cores.textoPrincipal} />
          </TouchableOpacity>

          <TouchableOpacity style={estilos.itemMenu} onPress={() => setModalSair(true)}>
            <View style={estilos.itemEsquerda}>
              <Icon name="logout" size={24} color={cores.textoPrincipal} />

              <Text style={estilos.itemTexto}>Encerrar sessão</Text>
            </View>

            <Icon name="chevron-right" size={24} color={cores.textoPrincipal} />
          </TouchableOpacity>
        </CartaoAnimado>
      </ScrollView>

      {/* Modal de confirmação */}

      <Modal visible={modalSair} transparent animationType="fade" onRequestClose={() => setModalSair(false)}>
        <ScrollView contentContainerStyle={[estilos.modalFundo, {
        flex: undefined,
        flexGrow: 1,
        paddingVertical: 32
      }]}>
          <View style={estilos.modal}>
            <View style={estilos.modalIcone}>
              <Icon name="logout" size={40} color={cores.sobrePrimaria} />
            </View>

            <Text accessibilityRole="header" style={estilos.modalTitulo}>Sair da conta?</Text>

            <Text style={estilos.modalTexto}>Você poderá entrar novamente quando quiser.</Text>

            <View style={estilos.modalBotoes}>
              <TouchableOpacity style={estilos.sair} onPress={() => setModalSair(false)}>
                <Text style={estilos.cancelarTexto}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={estilos.cancelar} onPress={sair}>
                <Text style={estilos.sairTexto}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>

      <BarraNavegacao />
    </TelaAnimada>;
}
