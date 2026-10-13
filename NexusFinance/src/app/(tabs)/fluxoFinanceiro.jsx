import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useIsFocused, useLocalSearchParams } from 'expo-router';
import BarraNavegacao from "../../componentes/BarraNavegacao";
import { CartaoAnimado, TelaAnimada } from "../../componentes/TelaAnimada";
import { useEstilosApp } from "../../style/style";
import { apiAutenticada, formatarReais, formatarData } from "../../servicos/financeiro";
import { abrirAnexo } from "../../servicos/arquivos";

export default function FluxoFinanceiro() {
  const {
    cores,
    estilosFluxoFinanceiro: estilos,
    estilosCompartilhados
  } = useEstilosApp();
  const [filtroAberto, setFiltroAberto] = useState(false);
  const [statusFiltro, setStatusFiltro] = useState('Todos');
  const {
    aba
  } = useLocalSearchParams();
  const estaEmFoco = useIsFocused();
  const [abaSelecionada, setAbaSelecionada] = useState(aba || 'Geral');
  const [transacoes, setTransacoes] = useState([]);
  const [contaFiltro, setContaFiltro] = useState('Todos');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [confirmando, setConfirmando] = useState(null);
  const [revisao, setRevisao] = useState(0);
  const travaConfirmacao = useRef(false);
  const [abrindo, setAbrindo] = useState(null);
  const recarregar = useCallback(() => setRevisao(valor => valor + 1), []);
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
  useEffect(() => {
    if (!estaEmFoco) return undefined;
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
  }, [estaEmFoco, revisao]);
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
  const transacoesFiltradas = useMemo(() => {
    return transacoes.filter(item => {
      const tipoCorresponde =
        abaSelecionada === 'Geral' || item.tipo === abaSelecionada;

      const statusCorresponde =
        statusFiltro === 'Todos' || item.status === statusFiltro;

      const contaCorresponde =
        contaFiltro === 'Todos' || item.tipoConta === contaFiltro;

      return tipoCorresponde && statusCorresponde && contaCorresponde;
    });
  }, [abaSelecionada, statusFiltro, contaFiltro, transacoes]);

  const gruposMes = useMemo(() => {
    const grupos = new Map();
    for (const item of transacoesFiltradas) {
      const chave = String(item.data).slice(0, 7);
      if (!grupos.has(chave)) grupos.set(chave, []);
      grupos.get(chave).push(item);
    }
    return [...grupos.entries()];
  }, [transacoesFiltradas]);
  function nomeMes(chave) {
    const [ano, mes] = chave.split('-').map(Number);
    return new Date(ano, mes - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }
  return <TelaAnimada style={estilos.recipiente} atraso={60}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilosCompartilhados.espacamentoInferior120}>
      <CartaoAnimado style={estilos.filtroRecipiente} atraso={40}>
        {['Geral', 'Receitas', 'Despesas'].map(opcao => <TouchableOpacity key={opcao} accessibilityRole="button" accessibilityState={{ selected: abaSelecionada === opcao }} style={[estilos.botaoFiltro, abaSelecionada === opcao && estilos.botaoAtivo]} onPress={() => setAbaSelecionada(opcao)}>
          <Text style={[estilos.textoABA, abaSelecionada === opcao && estilos.textoAtivo]}>
            {opcao}
          </Text>
        </TouchableOpacity>)}
      </CartaoAnimado>


      <CartaoAnimado style={estilos.dados} atraso={220}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={estilos.dadosTitulo}>
            {abaSelecionada === 'Geral' ? 'Movimentações' : abaSelecionada}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Abrir filtros de movimentações"
            onPress={() => setFiltroAberto(true)}
            style={estilos.botaoFiltro}
          >
            <Text style={estilos.textoFiltro}>Filtrar</Text>
          </TouchableOpacity>
        </View>
        {erro ? <View><Text accessibilityRole="alert" style={estilos.dadosTexto}>{erro}</Text><TouchableOpacity accessibilityRole="button" onPress={recarregar} style={{ minHeight: 44, justifyContent: 'center' }}><Text style={{ color: cores.textoLink }}>Tentar novamente</Text></TouchableOpacity></View> : null}
        {carregando ? <ActivityIndicator accessibilityLabel="Carregando transações" color={cores.primaria} /> : null}
        {gruposMes.map(([mes, itens]) => <View key={mes}>
          <Text accessibilityRole="header" style={{ color: cores.textoPrincipal, fontSize: 15, fontWeight: '700', textTransform: 'capitalize', marginTop: 10, marginBottom: 4 }}>{nomeMes(mes)}</Text>
          {itens.map((item, index) => <CartaoAnimado key={item.id} style={estilos.transacaoItem} atraso={260 + index * 30}>
            <View style={estilosCompartilhados.flexivel}>
              <Text style={estilos.transacaoDescricao}>{item.descricao}</Text>
              <Text style={estilos.transacaoCategoria}>
                {item.categoria} · {item.conta || item.tipoConta}
              </Text>
              {item.observacao ? <Text style={estilos.transacaoCategoria}>{item.observacao}</Text> : null}
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
                {item.futura && item.status !== 'Cancelada' ? ' · agendada' : ''}
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
        </View>)}
        {!carregando && !erro && transacoesFiltradas.length === 0 ? <Text style={estilos.dadosTexto}>Nenhuma transação cadastrada.</Text> : null}
      </CartaoAnimado>
    </ScrollView>
    <Modal
      visible={filtroAberto}
      transparent
      animationType="fade"
      onRequestClose={() => setFiltroAberto(false)}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          padding: 24,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
        }}
      >
        <View
          style={{
            padding: 20,
            borderRadius: 16,
            backgroundColor: cores.superficie,
          }}
        >
          <Text style={estilos.dadosTitulo}>Filtrar</Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              color: cores.textoPrincipal,

            }}
          >
            Situação
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 10,
              marginTop: 12,
            }}
          >
            {[
              { valor: 'Todos', rotulo: 'Todas' },
              { valor: 'Confirmada', rotulo: 'Efetuadas' },
              { valor: 'Pendente', rotulo: 'Pendentes' },
              { valor: 'Cancelada', rotulo: 'Canceladas' },
            ].map(({ valor, rotulo }) => {
              const selecionado = statusFiltro === valor;

              return (
                <TouchableOpacity
                  key={valor}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selecionado }}
                  onPress={() => setStatusFiltro(valor)}
                  style={{
                    minHeight: 44,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1.5,
                    borderColor: selecionado ? cores.primaria : cores.borda,
                    borderRadius: 999,
                    paddingHorizontal: 16,
                    paddingVertical: 9,
                    backgroundColor: selecionado ? cores.primaria : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      color: selecionado ? cores.sobrePrimaria : cores.textoPrincipal,
                      fontSize: 14,
                      fontWeight: '600',
                    }}
                  >
                    {selecionado ? '✓  ' : ''}
                    {rotulo}
                  </Text>
                </TouchableOpacity>

              );

            })}

          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              color: cores.textoPrincipal,
              marginTop: 20,

            }}
          >
            Contas
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 10,
              marginTop: 12,
            }}
          >
            {[
              { valor: 'Todos', rotulo: 'Todas as contas' },
              { valor: 'Conta Corrente', rotulo: 'Corrente' },
              { valor: 'Poupança', rotulo: 'Poupança' },
              { valor: 'Carteira', rotulo: 'Carteira' },
              { valor: 'Investimento', rotulo: 'Investimentos' },
            ].map(({ valor, rotulo }) => {
              const selecionado = contaFiltro === valor;

              return (
                <TouchableOpacity
                  key={valor}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selecionado }}
                  onPress={() => setContaFiltro(valor)}
                  style={{
                    minHeight: 44,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1.5,
                    borderColor: selecionado ? cores.primaria : cores.borda,
                    borderRadius: 999,
                    paddingHorizontal: 16,
                    paddingVertical: 9,
                    backgroundColor: selecionado ? cores.primaria : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      color: selecionado ? cores.sobrePrimaria : cores.textoPrincipal,
                      fontSize: 14,
                      fontWeight: '600',
                    }}
                  >
                    {selecionado ? '✓  ' : ''}
                    {rotulo}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => setFiltroAberto(false)}
            style={{ minHeight: 44, justifyContent: 'center' }}
          >
            <Text style={{ color: cores.textoLink, }}>Aplicar filtro</Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => {
              setStatusFiltro('Todos');
              setContaFiltro('Todos');
              setFiltroAberto(false);
            }}
            style={{ minHeight: 44, justifyContent: 'center' }}
          >
            <Text style={{ color: cores.perigo, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 }}>Limpar filtro</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    <BarraNavegacao />
  </TelaAnimada>;
}
