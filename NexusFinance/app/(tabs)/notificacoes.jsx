import React, { useCallback, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialIcons';
import BarraNavegacao from "../componentes/BarraNavegacao";
import { CartaoAnimado, TelaAnimada } from "../componentes/TelaAnimada";
import { useEstilosApp } from "../estilos/estilos";
import { apiAutenticada } from "../../servicos/financeiro";
export default function Notificacoes() {
  const {
    cores,
    estilosNotificacoes: estilos,
    estilosCompartilhados
  } = useEstilosApp();
  const VISUALIZACAO = {
    Financeira: {
      icone: 'account-balance-wallet',
      cor: cores.sucessoSuave,
      iconColor: cores.sucesso
    },
    Meta: {
      icone: 'flag',
      cor: cores.primariaSuave,
      iconColor: cores.textoLink
    },
    Sistema: {
      icone: 'info',
      cor: cores.primariaSuave,
      iconColor: cores.textoLink
    },
    Lembrete: {
      icone: 'notifications',
      cor: cores.superficieElevada,
      iconColor: cores.aviso
    }
  };
  const [notificacoes, setNotificacoes] = useState([]);
  const [erro, setErro] = useState('');
  useFocusEffect(useCallback(() => {
    let ativo = true;
    apiAutenticada('/notificacoes').then(resposta => ativo && setNotificacoes(resposta.notificacoes)).catch(falha => ativo && setErro(falha.message));
    return () => {
      ativo = false;
    };
  }, []));
  async function marcarComoLida(item) {
    if (item.lida) return;
    await apiAutenticada(`/notificacoes/${item.id}/lida`, {
      method: 'PATCH'
    });
    setNotificacoes(atual => atual.map(notificacao => notificacao.id === item.id ? {
      ...notificacao,
      lida: true
    } : notificacao));
  }
  return <TelaAnimada style={estilos.recipiente} atraso={60}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilosCompartilhados.espacamentoInferior120}>
        <Text style={estilos.secundarioTitulo}>Últimas notificações</Text>
        {erro ? <Text style={estilosCompartilhados.erroTexto}>{erro}</Text> : null}
        {notificacoes.map((item, index) => {
        const visual = VISUALIZACAO[item.tipo] || VISUALIZACAO.Sistema;
        return <CartaoAnimado key={item.id} style={[estilos.cartao, !item.lida && estilos.cartaoNova]} atraso={80 + index * 40}>
              <TouchableOpacity activeOpacity={0.8} style={estilosCompartilhados.linhaCentralizado} onPress={() => marcarComoLida(item)}>
                <View style={[estilos.iconeRecipiente, {
              backgroundColor: visual.cor
            }]}>
                  <Icon name={visual.icone} size={28} color={visual.iconColor} />
                </View>
                <View style={estilos.textoRecipiente}>
                  <View style={estilos.linha}>
                    <Text style={estilos.cartaoTitulo}>{item.titulo}</Text>
                    <Text style={estilos.hora}>
                      {new Date(item.criado_em).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                  <Text style={estilos.descricao}>{item.descricao}</Text>
                </View>
                {!item.lida && <View style={estilos.bolinha} />}
              </TouchableOpacity>
            </CartaoAnimado>;
      })}
        {!erro && notificacoes.length === 0 ? <View style={estilos.vazioRecipiente}>
            <Icon name="notifications-off" size={80} color={cores.textoSuave} />
            <Text style={estilos.vazioTitulo}>Nenhuma notificação</Text>
            <Text style={estilos.vazioTexto}>Quando houver novidades elas aparecerão aqui.</Text>
          </View> : null}
      </ScrollView>
      <BarraNavegacao />
    </TelaAnimada>;
}
