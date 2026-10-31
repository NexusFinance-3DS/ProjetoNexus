import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useIsFocused, useLocalSearchParams } from 'expo-router';
import BarraNavegacao from "../../componentes/BarraNavegacao";
import { CartaoAnimado, TelaAnimada } from "../../componentes/TelaAnimada";
import { useEstilosApp } from "../../style/style";
import { apiAutenticada, formatarReais, formatarData } from "../../servicos/financeiro";
import { abrirAnexo } from "../../servicos/arquivos";

function OpcoesFiltro({ opcoes, selecionado, aoSelecionar, cores }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
      {opcoes.map(({ valor, rotulo }) => {
        const ativo = selecionado === valor;
        return (
          <TouchableOpacity
            key={valor}
            accessibilityRole="button"
            accessibilityState={{ selected: ativo }}
            onPress={() => aoSelecionar(valor)}
            style={{
              minHeight: 44,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1.5,
              borderColor: ativo ? cores.primaria : cores.borda,
              borderRadius: 999,
              paddingHorizontal: 16,
              paddingVertical: 9,
              backgroundColor: ativo ? cores.primaria : 'transparent',
            }}
          >
            <Text style={{ color: ativo ? cores.sobrePrimaria : cores.textoPrincipal, fontSize: 14, fontWeight: '600' }}>
              {rotulo}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function FluxoFinanceiro() {
  const {
    cores,
    estilosFluxoFinanceiro: estilos,
    estilosCompartilhados
  } = useEstilosApp();
  const [filtroAberto, setFiltroAberto] = useState(false);
  const [statusFiltro, setStatusFiltro] = useState('Todos');
  const [statusRascunho, setStatusRascunho] = useState('Todos');
  const {
    aba
  } = useLocalSearchParams();
  const estaEmFoco = useIsFocused();
  const [abaSelecionada, setAbaSelecionada] = useState(aba || 'Geral');
  const [transacoes, setTransacoes] = useState([]);
  const [contaFiltro, setContaFiltro] = useState('Todos');
  const [contaRascunho, setContaRascunho] = useState('Todos');
  const [mesFiltro, setMesFiltro] = useState('Todos');
  const [mesRascunho, setMesRascunho] = useState('Todos');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');
  const [categoriaRascunho, setCategoriaRascunho] = useState('Todos');
  const [categoriasCatalogo, setCategoriasCatalogo] = useState([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(false);
  const [erroCategorias, setErroCategorias] = useState('');
  const [tipoOutrosAberto, setTipoOutrosAberto] = useState(null);
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
  const categoriasPorTipo = useMemo(() => {
    const tipos = ['Receitas', 'Despesas'];
    return Object.fromEntries(tipos.map(tipo => {
      const nomes = [
        ...categoriasCatalogo.filter(item => item.tipo === tipo).map(item => item.nome),
        ...transacoes.filter(item => item.tipo === tipo).map(item => item.categoria),
      ];
      return [tipo, [...new Set(nomes.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'))];
    }));
  }, [categoriasCatalogo, transacoes]);
  const categoriasPrincipaisPorTipo = useMemo(() => {
    const preferidas = {
      Receitas: ['Salário', 'Freelance', 'Investimentos', 'Presentes'],
      Despesas: ['Alimentação', 'Moradia', 'Transporte', 'Saúde'],
    };
    return Object.fromEntries(['Receitas', 'Despesas'].map(tipo => {
      const contagem = transacoes.filter(item => item.tipo === tipo && item.categoria)
        .reduce((mapa, item) => mapa.set(item.categoria, (mapa.get(item.categoria) || 0) + 1), new Map());
      const frequentes = [...contagem].sort((a, b) => b[1] - a[1]).map(([nome]) => nome);
      return [tipo, [...new Set([...preferidas[tipo], ...frequentes])]
        .filter(nome => categoriasPorTipo[tipo].includes(nome)).slice(0, 4)];
    }));
  }, [categoriasPorTipo, transacoes]);
  const tiposCategoriaExibidos = abaSelecionada === 'Geral' ? ['Receitas', 'Despesas'] : [abaSelecionada];
  const contasDisponiveis = useMemo(() => [...new Set(
    transacoes.map(item => item.tipoConta).filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, 'pt-BR')), [transacoes]);
  const mesesDisponiveis = useMemo(() => [...new Set(
    transacoes.map(item => String(item.data || '').slice(0, 7)).filter(Boolean)
  )].sort((a, b) => b.localeCompare(a)), [transacoes]);
  const filtrosAtivos = [statusFiltro !== 'Todos', contaFiltro !== 'Todos', mesFiltro !== 'Todos', categoriaFiltro !== 'Todos'].filter(Boolean).length;

  function abrirFiltros() {
    setStatusRascunho(statusFiltro);
    setContaRascunho(contaFiltro);
    setMesRascunho(mesFiltro);
    setCategoriaRascunho(categoriaFiltro);
    const [tipoSelecionado, nomeSelecionado] = categoriaFiltro.split('::');
    setTipoOutrosAberto(categoriaFiltro !== 'Todos' && !categoriasPrincipaisPorTipo[tipoSelecionado]?.includes(nomeSelecionado) ? tipoSelecionado : null);
    setErroCategorias('');
    setFiltroAberto(true);
    const tipos = abaSelecionada === 'Geral'
      ? ['Receita', 'Despesa']
      : [abaSelecionada === 'Receitas' ? 'Receita' : 'Despesa'];
    setCarregandoCategorias(true);
    Promise.all(tipos.map(tipo => apiAutenticada(`/financeiro/opcoes?tipo=${encodeURIComponent(tipo)}`)))
      .then(respostas => {
        const categorias = respostas.flatMap((resposta, indice) =>
          resposta.categorias.map(categoria => ({
            nome: categoria.nome,
            tipo: tipos[indice] === 'Receita' ? 'Receitas' : 'Despesas',
          }))
        );
        setCategoriasCatalogo(categorias);
      })
      .catch(falha => setErroCategorias(falha.message || 'Não foi possível carregar as categorias.'))
      .finally(() => setCarregandoCategorias(false));
  }

  function aplicarFiltros() {
    setStatusFiltro(statusRascunho);
    setContaFiltro(contaRascunho);
    setMesFiltro(mesRascunho);
    setCategoriaFiltro(categoriaRascunho);
    setFiltroAberto(false);
  }

  function selecionarCategoria(tipo, nome) {
    setCategoriaRascunho(`${tipo}::${nome}`);
  }

  function selecionarTodasCategorias() {
    setCategoriaRascunho('Todos');
    setTipoOutrosAberto(null);
  }

  function limparFiltros() {
    setStatusFiltro('Todos');
    setStatusRascunho('Todos');
    setContaFiltro('Todos');
    setContaRascunho('Todos');
    setMesFiltro('Todos');
    setMesRascunho('Todos');
    setCategoriaFiltro('Todos');
    setCategoriaRascunho('Todos');
    setTipoOutrosAberto(null);
    setFiltroAberto(false);
  }

  const transacoesFiltradas = useMemo(() => {
    return transacoes.filter(item => {
      const tipoCorresponde =
        abaSelecionada === 'Geral' || item.tipo === abaSelecionada;

      const statusCorresponde =
        statusFiltro === 'Todos' || item.status === statusFiltro;

      const contaCorresponde =
        contaFiltro === 'Todos' || item.tipoConta === contaFiltro;

      const mesCorresponde =
        mesFiltro === 'Todos' || String(item.data).slice(0, 7) === mesFiltro;

      const categoriaCorresponde = categoriaFiltro === 'Todos' ||
        `${item.tipo}::${item.categoria}` === categoriaFiltro;

      return tipoCorresponde && statusCorresponde && contaCorresponde && mesCorresponde && categoriaCorresponde;
    });
  }, [abaSelecionada, statusFiltro, contaFiltro, mesFiltro, categoriaFiltro, transacoes]);

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
            onPress={abrirFiltros}
            style={estilos.botaoFiltro}
          >
            <Text style={estilos.textoFiltro}>{filtrosAtivos ? `Filtrar · ${filtrosAtivos}` : 'Filtrar'}</Text>
          </TouchableOpacity>
        </View>
        {erro ? <View><Text accessibilityRole="alert" style={estilos.dadosTexto}>{erro}</Text><TouchableOpacity accessibilityRole="button" onPress={recarregar} style={{ minHeight: 44, justifyContent: 'center' }}><Text style={{ color: cores.textoLink }}>Tentar novamente</Text></TouchableOpacity></View> : null}
        {carregando ? <ActivityIndicator accessibilityLabel="Carregando transações" color={cores.primaria} /> : null}
        {gruposMes.map(([mes, itens]) => <View key={mes}>
          <Text accessibilityRole="header" style={{ color: cores.textoPrincipal, fontSize: 15, fontWeight: '700', textTransform: 'capitalize', marginTop: 10, marginBottom: 4, backgroundColor: "#251eae", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, }}> {nomeMes(mes)}</Text>
          {itens.map((item, index) => <CartaoAnimado key={item.id} style={estilos.transacaoItem} atraso={260 + index * 30}>
            <View style={[estilosCompartilhados.flexivel, { flex: 1, flexShrink: 1, maxWidth: '60%', marginRight: 8 }]}>
              <Text style={[estilos.transacaoDescricao, { flexShrink: 1 }]}>
                {item.descricao}
              </Text>
              <Text style={estilos.transacaoCategoria}>
                {item.categoria}
              </Text>
              <Text style={estilos.transacaoConta}>
                {item.conta || item.tipoConta}
              </Text>
            </View>
            <View style={[estilos.transacaoDireita, { flexShrink: 0 }, ]}>
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
        {!carregando && !erro && transacoesFiltradas.length === 0 ? <Text style={estilos.dadosTexto}>{transacoes.length ? 'Nenhuma movimentação corresponde aos filtros. Ajuste ou limpe os filtros.' : 'Nenhuma movimentação cadastrada.'}</Text> : null}
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
            width: '100%',
            maxWidth: 600,
            maxHeight: '90%',
            alignSelf: 'center',
          }}
        >
          <Text accessibilityRole="header" style={estilos.dadosTitulo}>Filtros</Text>
          <ScrollView
            style={{ flexShrink: 1 }}
            contentContainerStyle={{ paddingBottom: 14 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >

            <Text style={{ color: cores.textoPrincipal, fontSize: 16, fontWeight: '700', }}>
              Situação
            </Text>
            <OpcoesFiltro
              opcoes={[
                { valor: 'Todos', rotulo: 'Todas' },
                { valor: 'Confirmada', rotulo: 'Efetuadas' },
                { valor: 'Pendente', rotulo: 'Pendentes' },
                { valor: 'Cancelada', rotulo: 'Canceladas' },
              ]}
              selecionado={statusRascunho}
              aoSelecionar={setStatusRascunho}
              cores={cores}
            />

            <Text style={{ color: cores.textoPrincipal, fontSize: 16, fontWeight: '700', marginTop: 18 }}>
              Mês
            </Text>
            <OpcoesFiltro
              opcoes={[
                { valor: 'Todos', rotulo: 'Todos os meses' },
                ...mesesDisponiveis.map(mes => ({
                  valor: mes,
                  rotulo: nomeMes(mes),
                })),
              ]}
              selecionado={mesRascunho}
              aoSelecionar={setMesRascunho}
              cores={cores}
            />

            <Text style={{ color: cores.textoPrincipal, fontSize: 16, fontWeight: '700', marginTop: 18 }}>
              Conta
            </Text>
            <OpcoesFiltro
              opcoes={[
                { valor: 'Todos', rotulo: 'Todas' },
                ...contasDisponiveis.map(conta => ({
                  valor: conta,
                  rotulo: conta === 'Conta Corrente' ? 'Corrente' : conta === 'Investimento' ? 'Investimentos' : conta,
                })),
              ]}
              selecionado={contaRascunho}
              aoSelecionar={setContaRascunho}
              cores={cores}
            />

            <Text style={{ color: cores.textoPrincipal, fontSize: 16, fontWeight: '700', marginTop: 18 }}>
              Categoria
            </Text>
            <OpcoesFiltro
              opcoes={[{ valor: 'Todos', rotulo: 'Todas as categorias' }]}
              selecionado={categoriaRascunho}
              aoSelecionar={selecionarTodasCategorias}
              cores={cores}
            />
            {tiposCategoriaExibidos.map(tipo => {
              const estaAberto = tipoOutrosAberto === tipo;
              const selecionadoForaDosPrincipais = categoriaRascunho.startsWith(`${tipo}::`) &&
                !categoriasPrincipaisPorTipo[tipo].some(nome => `${tipo}::${nome}` === categoriaRascunho);
              return (
                <View key={tipo} style={{ marginTop: 14 }}>
                  <Text style={{ color: cores.textoPrincipal, fontSize: 14, fontWeight: '700' }}>{tipo}</Text>
                  <OpcoesFiltro
                    opcoes={categoriasPrincipaisPorTipo[tipo].map(nome => ({ valor: `${tipo}::${nome}`, rotulo: nome }))}
                    selecionado={categoriaRascunho}
                    aoSelecionar={valor => selecionarCategoria(tipo, valor.slice(tipo.length + 2))}
                    cores={cores}
                  />
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityState={{ expanded: estaAberto, selected: estaAberto || selecionadoForaDosPrincipais }}
                    onPress={() => setTipoOutrosAberto(estaAberto ? null : tipo)}
                    style={{
                      minHeight: 40,
                      alignSelf: 'flex-start',
                      justifyContent: 'center',
                      borderWidth: .5,
                      borderColor: estaAberto || selecionadoForaDosPrincipais ? cores.primaria : cores.borda,
                      borderRadius: 999,
                      paddingHorizontal: 15,
                      marginTop: 10,
                      backgroundColor: estaAberto || selecionadoForaDosPrincipais ? cores.primaria : 'transparent',
                    }}
                  >
                    <Text style={{ color: estaAberto || selecionadoForaDosPrincipais ? cores.sobrePrimaria : cores.textoPrincipal, fontSize: 13, fontWeight: '600' }}>
                      {estaAberto ? 'Ocultar outras' : 'Outros'}
                    </Text>
                  </TouchableOpacity>
                  {estaAberto ? (
                    <View style={{ marginTop: 100, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: cores.borda, backgroundColor: cores.superficieSecundaria }}>
                      {carregandoCategorias ? <ActivityIndicator accessibilityLabel="Carregando categorias" color={cores.primaria} style={{ marginVertical: 12 }} /> : null}
                      {erroCategorias ? <Text accessibilityRole="alert" style={{ color: cores.perigo, fontSize: 13, marginTop: 8 }}>{erroCategorias}</Text> : null}
                      {categoriasPorTipo[tipo].length ? (
                        <OpcoesFiltro
                          opcoes={categoriasPorTipo[tipo].map(nome => ({ valor: `${tipo}::${nome}`, rotulo: nome }))}
                          selecionado={categoriaRascunho}
                          aoSelecionar={valor => selecionarCategoria(tipo, valor.slice(tipo.length + 2))}
                          cores={cores}
                        />
                      ) : !carregandoCategorias ? (
                        <Text style={{ color: cores.textoSecundario, fontSize: 13, marginTop: 8 }}>Nenhuma categoria disponível.</Text>
                      ) : null}
                    </View>
                  ) : null}
                </View>
              );
            })}
          </ScrollView>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingTop: 12, borderTopWidth: 1, borderTopColor: cores.borda }}>
            <TouchableOpacity accessibilityRole="button" onPress={limparFiltros} style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 }}>
              <Text style={{ color: cores.perigo, fontWeight: '600' }}>Limpar</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity accessibilityRole="button" onPress={() => setFiltroAberto(false)} style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 12 }}>
                <Text style={{ color: cores.textoSecundario }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity accessibilityRole="button" onPress={aplicarFiltros} style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 18, borderRadius: 12, backgroundColor: cores.primaria }}>
                <Text style={{ color: cores.sobrePrimaria, fontWeight: '700' }}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
    <BarraNavegacao />
  </TelaAnimada>;
}
