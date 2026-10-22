import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from '@expo/vector-icons/MaterialIcons';
import GraficoMedido from './GraficoMedido';
import CartaoPainel from './CartaoPainel';
import { useSessao } from '../contextos/ContextoSessao';
import { useEstilosTema } from '../contextos/ContextoTema';
import { useEstilosApp } from '../style/style';
import { useSessao } from '../contextos/ContextoSessao';
import { useEstilosTema } from '../contextos/ContextoTema';
import { useEstilosApp } from '../style/style';
import { apiAutenticada, formatarReais } from '../servicos/financeiro';
import { router } from 'expo-router';

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const rotuloMes = periodo => `${MESES[Number(periodo.slice(5, 7)) - 1]}/${periodo.slice(2, 4)}`;

function obterCorPorPercentual(percentual, cores) {
  if (!Number.isFinite(percentual) || percentual <= 0) return cores.sucesso;
  if (percentual >= 100) return cores.perigo;
  if (percentual >= 90) return cores.graficoLaranja;
  if (percentual >= 70) return cores.aviso;
  return cores.sucesso;
}

function obterSituacaoPorPercentual(percentual) {
  if (!Number.isFinite(percentual) || percentual <= 0) return 'Dentro do planejado';
  if (percentual >= 100) return 'Limite atingido ou ultrapassado';
  if (percentual >= 90) return 'Perto de estourar';
  if (percentual >= 70) return 'Atenção aos gastos';
  return 'Dentro do planejado';
}

function Cartao({ titulo, subtitulo, children, style, aoExportar, exportando }) {
  const estilos = useEstilosTema(criarEstilos);
  const { cores } = useEstilosApp();
  return <CartaoPainel style={style}>
    <View style={estilos.cabecalho}>
      <View style={estilos.titulos}>
        <Text accessibilityRole="header" style={estilos.titulo}>{titulo}</Text>
        {!!subtitulo && <Text style={estilos.legenda}>{subtitulo}</Text>}
      </View>
      {aoExportar && <Pressable accessibilityRole="button" accessibilityLabel={`Baixar PDF de ${titulo}`} disabled={exportando} onPress={aoExportar} style={estilos.botaoBaixar}>
        <Icon name={exportando ? 'hourglass-empty' : 'file-download'} size={19} color={cores.primaria} />
      </Pressable>}
    </View>
    {children}
  </CartaoPainel>;
}


export default function VisaoFinanceira({ dados, aoExportar, exportando = false, aoAdicionarLimite }) {
  const estilos = useEstilosTema(criarEstilos);
  const { cores } = useEstilosApp();
  const { autenticado } = useSessao();
  const { width: largura, fontScale } = useWindowDimensions();
  const [modalLimiteVisivel, setModalLimiteVisivel] = useState(false);
  const [valorTotalLimite, setValorTotalLimite] = useState('');
  const [limiteTotal, setLimiteTotal] = useState(0);
  const [mostrarTodasCategorias, setMostrarTodasCategorias] = useState(false);

  useEffect(() => {
    if (!autenticado) {
      setLimiteTotal(0);
      return;
    }

    let ativo = true;
    async function carregarLimite() {
      try {
        const configuracoes = await apiAutenticada('/configuracoes');
        if (!ativo) return;
        setLimiteTotal(Number(configuracoes?.limiteGastoTotal || 0));
      } catch {
        if (ativo) setLimiteTotal(0);
      }
    }

    carregarLimite();
    return () => {
      ativo = false;
    };
  }, [autenticado]);

  const larguraGrande = largura >= 900 && fontScale <= 1.3;
  const historico = (dados.historico || []).slice(-6);
  const previsao = dados.previsao || { totalReceitas: 0, totalDespesas: 0, saldo: 0 };
  const categorias = dados.categorias || [];
  const referencia = dados.dataReferencia ? `${dados.dataReferencia.slice(8, 10)}/${dados.dataReferencia.slice(5, 7)}/${dados.dataReferencia.slice(0, 4)}` : 'Mês atual';
  const chartPalette = {
    backgroundGradientFrom: cores.superficie,
    backgroundGradientTo: cores.superficie,
    decimalPlaces: 0,
    color: () => cores.primaria,
    labelColor: () => cores.textoSecundario,
    propsForBackgroundLines: { stroke: cores.divisor, strokeDasharray: '4 6' },
    propsForLabels: { fontSize: 10 },
  };

  const abrirModalLimite = () => {
    if (typeof aoAdicionarLimite === 'function') {
      aoAdicionarLimite();
      return;
    }
    setModalLimiteVisivel(true);
  };

  const fecharModalLimite = () => {
    setModalLimiteVisivel(false);
    setValorTotalLimite('');
  };

  const salvarLimite = async () => {
    const valorNumerico = Number(String(valorTotalLimite).replace(/[R$\s.]/g, '').replace(',', '.'));

    if (Number.isNaN(valorNumerico) || valorNumerico <= 0) return;

    setLimiteTotal(valorNumerico);
    if (autenticado) {
      try {
        await apiAutenticada('/configuracoes', {
          method: 'PUT',
          body: JSON.stringify({ limiteGastoTotal: valorNumerico })
        });
      } catch {
      }
    }
    fecharModalLimite();
  };

  const listaLimites = categorias.length ? categorias.map(item => ({ nome: item.nome, valor: Number(item.valor) || 0 })) : [];
  const listaLimitesOrdenada = [...listaLimites].sort((a, b) => b.valor - a.valor);
  const categoriasVisiveis = mostrarTodasCategorias ? listaLimitesOrdenada : listaLimitesOrdenada.slice(0, 5);
  const temCategorias = listaLimitesOrdenada.length > 0;
  const totalGasto = listaLimitesOrdenada.reduce((acumulador, item) => acumulador + item.valor, 0);
  const valorDisponivel = (limiteTotal || 0) - totalGasto;
  const percentualUtilizado = limiteTotal > 0 ? (totalGasto / limiteTotal) * 100 : 0;
  const corGastoTotal = obterCorPorPercentual(percentualUtilizado, cores);
  const situacaoGastoTotal = obterSituacaoPorPercentual(percentualUtilizado);
  const existemMaisCategorias = listaLimitesOrdenada.length > 5;
  const textoBotaoLimite = Number(limiteTotal) > 0 ? 'Editar' : 'Adicionar';

  return <View style={estilos.visaoGeral}>
    <View style={[estilos.grade, larguraGrande && estilos.duasColunas]}>
      <Cartao titulo="Evolução do resultado" subtitulo="Receitas menos despesas realizadas" aoExportar={aoExportar ? () => aoExportar('resultados') : undefined} exportando={exportando} style={larguraGrande && estilos.coluna}>
        {historico.length ? <GraficoMedido>
          {width => <LineChart data={{ labels: historico.map(item => rotuloMes(item.periodo)), datasets: [{ data: historico.map(item => Number(item.saldo) || 0) }] }} width={width} height={210} fromZero withShadow={false} withOuterLines={false} bezier formatYLabel={valor => Number(valor).toLocaleString('pt-BR', { notation: 'compact', maximumFractionDigits: 1 })} chartConfig={chartPalette} style={estilos.chartKit} />}
        </GraficoMedido> : <Text style={estilos.vazio}>Ainda não há histórico suficiente para exibir a evolução.</Text>}
        {!!historico.length && <Text style={estilos.nota}>O mês atual considera os valores até a data de referência.</Text>}
      </Cartao>

      <Cartao titulo="Projeção do mês" subtitulo={`Estimativa até o fim do mês · ${referencia}`} aoExportar={aoExportar ? () => aoExportar('indicadores') : undefined} exportando={exportando} style={larguraGrande && estilos.coluna}>
        {[
          ['Receitas estimadas', previsao.totalReceitas, cores.sucesso],
          ['Despesas estimadas', previsao.totalDespesas, cores.perigo],
          ['Resultado estimado', previsao.saldo, Number(previsao.saldo) < 0 ? cores.perigo : cores.textoLink],
        ].map(([nome, valor, cor]) => <View key={nome} style={estilos.linhaResumo}>
          <Text style={estilos.rotulo}>{nome}</Text>
          <Text style={[estilos.valorResumo, { color: cor }]}>{formatarReais(valor)}</Text>
        </View>)}
        <Text style={estilos.nota}>Já realizado: receitas {formatarReais(previsao.receitasRealizadas || 0)} · despesas {formatarReais(previsao.despesasRealizadas || 0)}</Text>
        <Text style={estilos.nota}>Ainda previsto: receitas {formatarReais(previsao.receitasPrevistas || 0)} · despesas {formatarReais(previsao.despesasPrevistas || 0)}</Text>
        <Text style={estilos.nota}>Considera apenas lançamentos cadastrados até o fim do mês; não prevê gastos ou receitas ainda não registrados.</Text>
      </Cartao>
    </View>

    <View style={[estilos.grade, larguraGrande && estilos.duasColunas]}>
      <Cartao
        titulo="Limites de gastos"
        subtitulo="Acompanhe seu orçamento por categoria"
        style={[larguraGrande && estilos.coluna]}
      >
        {(() => {
          const limites = dados.limites || {};
          const limiteMensal = Number(limites.total) || 0;

          const totalGasto = categorias.reduce(
            (total, item) => total + (Number(item.valor) || 0),
            0
          );

          const percentualTotal =
            limiteMensal > 0
              ? (totalGasto / limiteMensal) * 100
              : 0;

          const restante = limiteMensal - totalGasto;

          return (
            <>
              <View style={estilos.resumoLimite}>
                <View style={estilos.cabecalhoLimite}>
                  <Text style={estilos.pequeno}>
                    Limite mensal total
                  </Text>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Adicionar limite mensal"
                    onPress={() => router.push('/metas')}
                    style={estilos.botaoAdicionarLimite}
                  >
                    <Icon name="add" size={18} color={cores.textoLink} />
                    <Text style={estilos.textoAdicionarLimite}>
                      Adicionar limite
                    </Text>
                  </Pressable>
                </View>

                <Text style={estilos.valorLimite}>
                  {limiteMensal > 0 ? formatarReais(limiteMensal) : 'Não definido'}
                </Text>

                {limiteMensal > 0 ? (
                  <>
                    <View style={estilos.trilho}>
                      <View
                        style={[
                          estilos.preenchimento,
                          {
                            width: `${Math.min(100, percentualTotal)}%`,
                            backgroundColor:
                              percentualTotal >= 100
                                ? cores.perigo
                                : percentualTotal >= 80
                                  ? cores.graficoLaranja
                                  : cores.primaria,
                          },
                        ]}
                      />
                    </View>

                    <View style={estilos.categoriaCabecalho}>
                      <Text style={estilos.pequeno}>
                        Gasto: {formatarReais(totalGasto)}
                      </Text>

                      <Text
                        style={[
                          estilos.pequeno,
                          { color: restante < 0 ? cores.perigo : cores.sucesso },
                        ]}
                      >
                        {restante < 0
                          ? `Excedido: ${formatarReais(Math.abs(restante))}`
                          : `Restam: ${formatarReais(restante)}`}
                      </Text>
                    </View>
                  </>
                ) : (
                  <Text style={estilos.nota}>
                    Defina um limite mensal para acompanhar seus gastos.
                  </Text>
                )}
              </View>

              <View style={estilos.separadorLimites} />

              <Text style={estilos.rotulo}>
                Despesas por categoria
              </Text>

              {categorias.length ? categorias.map((item, index) => {
                const gasto = Number(item.valor) || 0;
                const limite = Number(limites.categorias?.[item.nome]) || 0;

                const percentual = limite > 0 ? (gasto / limite) * 100 : 0;

                const cor =
                  percentual >= 100
                    ? cores.perigo
                    : percentual >= 80
                      ? cores.graficoLaranja
                      : coresCategorias[index % coresCategorias.length];

                return (
                  <View key={item.nome} style={estilos.categoria}>
                    <View style={estilos.categoriaCabecalho}>
                      <Text style={estilos.rotulo}>{item.nome}</Text>

                      <Text style={estilos.valorResumo}>
                        {formatarReais(gasto)}
                      </Text>
                    </View>

                    <View style={estilos.trilho}>
                      <View
                        style={[
                          estilos.preenchimento,
                          {
                            width: `${Math.min(100, limite > 0 ? percentual : 0)}%`,
                            backgroundColor: cor,
                          },
                        ]}
                      />
                    </View>

                    {limite > 0 ? (
                      <View style={estilos.categoriaCabecalho}>
                        <Text style={estilos.pequeno}>
                          {percentual.toLocaleString('pt-BR', {
                            maximumFractionDigits: 1,
                          })}% do limite
                        </Text>

                        <Text style={[estilos.pequeno, { color: cor }]}>
                          {gasto > limite
                            ? `Excedido em ${formatarReais(gasto - limite)}`
                            : `${formatarReais(limite - gasto)} restantes`}
                        </Text>
                      </View>
                    ) : (
                      <Text style={estilos.pequeno}>
                        Limite não definido para esta categoria.
                      </Text>
                    )}
                  </View>
                );
              }) : (
                <Text style={estilos.vazio}>
                  Nenhuma despesa realizada neste mês.
                </Text>
              )}
            </>
          );
        })()}
      </Cartao>
    </View>

    <Modal visible={modalLimiteVisivel} transparent animationType="fade" statusBarTranslucent onRequestClose={fecharModalLimite}>
      <Pressable style={estilos.fundoModal} onPress={fecharModalLimite}>
        <Pressable style={estilos.modalCartao} onPress={evento => evento.stopPropagation()}>
          <Text style={estilos.modalTitulo}>Adicionar limite de gastos</Text>
          <Text style={estilos.modalDescricao}>Informe o valor total disponível para gastar no mês, como por exemplo seu salário.</Text>

          <Text style={estilos.labelCampo}>Valor total do limite</Text>
          <TextInput
            style={estilos.campo}
            placeholder="R$ 0,00"
            placeholderTextColor={cores.textoIndicativo}
            value={valorTotalLimite}
            onChangeText={setValorTotalLimite}
            keyboardType="decimal-pad"
          />

          <View style={estilos.modalAcoes}>
            <Pressable style={[estilos.botaoModal, estilos.botaoSecundario]} onPress={fecharModalLimite}>
              <Text style={[estilos.textoBotaoModal, { color: cores.textoPrincipal }]}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[
                estilos.botaoModal,
                { backgroundColor: cores.primaria },
                (!valorTotalLimite || Number(String(valorTotalLimite).replace(/[R$\s.]/g, '').replace(',', '.')) <= 0) && estilos.botaoDesabilitado,
              ]}
              onPress={salvarLimite}
              disabled={!valorTotalLimite || Number(String(valorTotalLimite).replace(/[R$\s.]/g, '').replace(',', '.')) <= 0}
            >
              <Text style={[estilos.textoBotaoModal, { color: cores.sobrePrimaria }]}>Salvar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  </View>;
}

const criarEstilos = cores => StyleSheet.create({
  cabecalhoLimite: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },

  botaoAdicionarLimite: {
    minHeight: 42,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

  textoAdicionarLimite: {
    color: cores.textoLink,
    fontSize: 13,
    fontWeight: '700',
  },
  resumoLimite: { gap: 10, marginBottom: 4 },
  valorLimite: { color: cores.textoPrincipal, fontSize: 26, fontWeight: '700' },
  separadorLimites: { height: 1, backgroundColor: cores.divisor, marginVertical: 8 },
  visaoGeral: { gap: 16, marginTop: 16, maxWidth: '100%' },
  grade: { gap: 16, width: '100%' },
  duasColunas: { flexDirection: 'row', alignItems: 'stretch', flexWrap: 'wrap' },
  coluna: { flex: 1, minWidth: 0 },
  cabecalho: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16, flexWrap: 'wrap' },
  titulos: { flex: 1, gap: 3, minWidth: 0 },
  titulo: { fontSize: 17, lineHeight: 23, fontWeight: '700', color: cores.textoPrincipal, flexShrink: 1 },
  legenda: { fontSize: 12, lineHeight: 18, color: cores.textoSecundario, flexShrink: 1 },
  botaoBaixar: { width: 38, height: 38, borderRadius: 13, borderWidth: 1, borderColor: cores.borda, alignItems: 'center', justifyContent: 'center' },
  cabecalhoLimite: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8, flexWrap: 'wrap' },
  totalLimiteBox: { flex: 1, minWidth: 0, gap: 3 },
  valorTotalLimite: { color: cores.textoPrincipal, fontSize: 18, fontWeight: '800', flexShrink: 1 },
  botaoAdicionarContainer: { alignSelf: 'flex-end', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, backgroundColor: cores.primariaSuave, marginTop: 2, maxWidth: '100%' },
  areaVazia: { minHeight: 130, alignItems: 'center', justifyContent: 'center', marginVertical: 8 },
  botaoAdicionarCentralizado: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 999, backgroundColor: cores.primariaSuave, alignItems: 'center', justifyContent: 'center', maxWidth: '100%' },
  textoBotaoLimite: { color: cores.primaria, fontSize: 12, fontWeight: '700', textAlign: 'center' },
  textoBotaoAdicionarVazio: { color: cores.primaria, fontSize: 12, fontWeight: '700', textAlign: 'center' },
  chartKit: { borderRadius: 12, paddingRight: 8 },
  nota: { color: cores.textoSecundario, fontSize: 12, lineHeight: 18, marginTop: 10, flexShrink: 1 },
  linhaResumo: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: cores.divisor, gap: 8, flexShrink: 1 },
  rotulo: { color: cores.textoPrincipal, fontSize: 14, fontWeight: '600', flexShrink: 1 },
  valorResumo: { color: cores.textoPrincipal, fontSize: 15, fontWeight: '700', flexShrink: 1 },
  pequeno: { color: cores.textoSecundario, fontSize: 11, lineHeight: 17, flexShrink: 1 },
  categoria: { gap: 7, marginTop: 14, minWidth: 0 },
  categoriaCabecalho: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, minWidth: 0 },
  trilho: { height: 8, borderRadius: 5, backgroundColor: cores.superficieElevada, overflow: 'hidden', minWidth: 0 },
  preenchimento: { height: '100%', borderRadius: 5 },
  rodapeLimite: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 18, gap: 12, flexWrap: 'wrap' },
  resumoLimite: { flex: 1, minWidth: 0 },
  resumoLimiteRight: { flex: 1, alignItems: 'flex-end', minWidth: 0 },
  rotuloResumo: { color: cores.textoSecundario, fontSize: 12, lineHeight: 18, flexShrink: 1 },
  valorResumoTotal: { color: cores.textoPrincipal, fontSize: 16, fontWeight: '700', marginTop: 4, flexShrink: 1 },
  valorResumoDisponivel: { fontSize: 16, fontWeight: '700', marginTop: 4, flexShrink: 1 },
  usoLimiteWrap: { marginTop: 12, minWidth: 0 },
  trilhoResumo: { height: 8, borderRadius: 5, backgroundColor: cores.superficieElevada, overflow: 'hidden', minWidth: 0 },
  preenchimentoResumo: { height: '100%', borderRadius: 5, backgroundColor: cores.primaria },
  botaoOutrasCategorias: { minHeight: 40, flexDirection: 'row', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, borderRadius: 12, backgroundColor: cores.primariaSuave, gap: 5, paddingVertical: 10, marginTop: 5 },
  textoBotaoOutrasCategorias: { color: cores.textoPrincipal, fontWeight: '700', fontSize: 12, textAlign: 'center' },
  vazio: { marginVertical: 16, color: cores.textoSecundario, fontSize: 14, lineHeight: 21, flexShrink: 1 },
  fundoModal: { flex: 1, backgroundColor: cores.sobreposicao, justifyContent: 'center', paddingHorizontal: 20 },
  modalCartao: { backgroundColor: cores.superficie, borderRadius: 18, borderWidth: 1, borderColor: cores.borda, padding: 20, maxWidth: 520, width: '100%', alignSelf: 'center' },
  modalTitulo: { color: cores.textoPrincipal, fontSize: 20, fontWeight: '700', marginBottom: 6, flexShrink: 1 },
  modalDescricao: { color: cores.textoSecundario, fontSize: 13, lineHeight: 19, marginBottom: 16, flexShrink: 1 },
  labelCampo: { color: cores.textoPrincipal, fontSize: 13, fontWeight: '600', marginBottom: 8, flexShrink: 1 },
  campo: { minHeight: 46, backgroundColor: cores.fundo, borderWidth: 1, borderColor: cores.borda, borderRadius: 10, paddingHorizontal: 12, color: cores.textoPrincipal, marginBottom: 14 },
  modalAcoes: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8, flexWrap: 'wrap' },
  botaoModal: { minHeight: 44, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flex: 1, minWidth: 110 },
  botaoSecundario: { backgroundColor: cores.superficieElevada },
  botaoDesabilitado: { opacity: 0.5 },
  textoBotaoModal: { fontWeight: '700', fontSize: 14, textAlign: 'center' },
});
