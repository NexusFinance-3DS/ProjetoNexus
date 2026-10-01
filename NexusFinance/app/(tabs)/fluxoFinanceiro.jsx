import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import BarraNavegacao from "../componentes/BarraNavegacao";
import { CartaoAnimado, TelaAnimada } from "../componentes/TelaAnimada";
import { useEstilosApp } from "../estilos/estilos";
import { apiAutenticada, formatarReais, formatarData } from "../../servicos/financeiro";
import { abrirAnexo } from "../../servicos/arquivos";
export default function FluxoFinanceiro() {
  const {
    cores,
    estilosFluxoFinanceiro: estilos,
    estilosCompartilhados
  } = useEstilosApp();
  const {
    aba
  } = useLocalSearchParams();
  const [abaSelecionada, setAbaSelecionada] = useState(aba || 'Geral');
  const [transacoes, setTransacoes] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [confirmando, setConfirmando] = useState(null);
  const travaConfirmacao = useRef(false);
  const [abrindo, setAbrindo] = useState(null);
  useEffect(() => {
    if (['Geral', 'Receitas', 'Despesas'].includes(aba)) setAbaSelecionada(aba);
  }, [aba]);
  async function baixar(anexo) {
    if (abrindo) return;
    setAbrindo(anexo.id);
    setErro('');
    try {
      await abrirAnexo(anexo);
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setAbrindo(null);
    }
  }
  useFocusEffect(useCallback(() => {
    let ativo = true;
    setCarregando(true);
    apiAutenticada('/financeiro/transacoes').then(resposta => {
      if (ativo) {
        setTransacoes(resposta.transacoes);
        setErro('');
      }
    }).catch(falha => ativo && setErro(falha.message)).finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, []));
  async function confirmar(item) {
    if (travaConfirmacao.current) return;
    travaConfirmacao.current = true;
    setConfirmando(item.id);
    setErro('');
    try {
      await apiAutenticada('/financeiro/transacoes/' + item.id + '/confirmar', {
        method: 'PATCH'
      });
      setTransacoes(itens => itens.map(t => t.id === item.id ? {
        ...t,
        status: 'Confirmada',
        podeConfirmar: false
      } : t));
    } catch (falha) {
      setErro(falha.message);
    } finally {
      travaConfirmacao.current = false;
      setConfirmando(null);
    }
  }
  const transacoesFiltradas = useMemo(() => abaSelecionada === 'Geral' ? transacoes : transacoes.filter(item => item.tipo === abaSelecionada), [abaSelecionada, transacoes]);
  return <TelaAnimada style={estilos.recipiente} atraso={60}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilosCompartilhados.espacamentoInferior120}>
        <CartaoAnimado style={estilos.filtroRecipiente} atraso={40}>
          {['Geral', 'Receitas', 'Despesas'].map(opcao => <TouchableOpacity key={opcao} style={[estilos.botaoFiltro, abaSelecionada === opcao && estilos.botaoAtivo]} onPress={() => setAbaSelecionada(opcao)}>
              <Text style={[estilos.textoFiltro, abaSelecionada === opcao && estilos.textoAtivo]}>
                {opcao}
              </Text>
            </TouchableOpacity>)}
        </CartaoAnimado>

        <CartaoAnimado style={estilos.dados} atraso={220}>
          <Text style={estilos.dadosTitulo}>
            {abaSelecionada === 'Geral' ? 'Transações Recentes' : abaSelecionada}
          </Text>
          {erro ? <Text style={estilos.dadosTexto}>{erro}</Text> : null}
          {carregando ? <ActivityIndicator accessibilityLabel="Carregando transações" color={cores.primaria} /> : null}
          {transacoesFiltradas.map((item, index) => <CartaoAnimado key={item.id} style={estilos.transacaoItem} atraso={260 + index * 30}>
              <View style={estilosCompartilhados.flexivel}>
                <Text style={estilos.transacaoDescricao}>{item.descricao}</Text>
                <Text style={estilos.transacaoCategoria}>
                  {item.categoria} · {item.tipoConta}
                </Text>
                {item.anexos?.map(anexo => <TouchableOpacity key={anexo.id} accessibilityRole="button" accessibilityLabel={`Abrir anexo ${anexo.nome}`} disabled={!!abrindo} onPress={() => baixar(anexo)} style={{
              minHeight: 44,
              justifyContent: 'center'
            }}>
                    <Text style={{
                color: cores.textoLink,
                fontSize: 13
              }}>
                      {abrindo === anexo.id ? 'Baixando...' : `📎 ${anexo.nome}`}
                    </Text>
                  </TouchableOpacity>)}
              </View>
              <View style={estilos.transacaoDireita}>
                <Text style={[estilos.transacaoValor, item.tipo === 'Receitas' ? estilos.receita : estilos.despesa]}>
                  {item.tipo === 'Receitas' ? '+' : '-'} {formatarReais(item.valor)}
                </Text>
                <Text style={estilos.transacaoData}>{formatarData(item.data)}</Text>
                <Text style={{
              color: item.status === 'Pendente' ? cores.graficoLaranja : cores.textoSecundario,
              fontSize: 12
            }}>
                  {item.status}
                  {item.futura && item.status !== 'Cancelada' ? ' · futura' : ''}
                </Text>
                {item.podeConfirmar ? <TouchableOpacity accessibilityRole="button" accessibilityLabel={'Confirmar ' + item.descricao} disabled={!!confirmando} onPress={() => confirmar(item)} style={{
              minHeight: 44,
              justifyContent: 'center'
            }}>
                    <Text style={{
                color: cores.textoLink,
                fontSize: 13
              }}>
                      {confirmando === item.id ? 'Confirmando...' : item.tipo === 'Receitas' ? 'Marcar recebida' : 'Marcar paga'}
                    </Text>
                  </TouchableOpacity> : null}
              </View>
            </CartaoAnimado>)}
          {!carregando && !erro && transacoesFiltradas.length === 0 ? <Text style={estilos.dadosTexto}>Nenhuma transação cadastrada.</Text> : null}
        </CartaoAnimado>
      </ScrollView>
      <BarraNavegacao />
    </TelaAnimada>;
}
