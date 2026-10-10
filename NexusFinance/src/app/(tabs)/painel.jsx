import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import BarraNavegacao from "../../componentes/BarraNavegacao";
import CartaoPainel from "../../componentes/CartaoPainel";
import { TelaAnimada } from "../../componentes/TelaAnimada";
import VisaoFinanceira from "../../componentes/VisaoFinanceira";
import { useEstilosTema } from "../../contextos/ContextoTema";
import { useEstilosApp } from "../../style/style";
import { useResumoFinanceiro } from "../../ganchos/useResumoFinanceiro";
import { exportarDashboard } from "../../servicos/relatorio";
import { formatarReais } from "../../servicos/financeiro";

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const rotuloMes = periodo => `${MESES[Number(periodo.slice(5, 7)) - 1]}/${periodo.slice(2, 4)}`;

function GraficoReceitasDespesas({ historico, cores, estilos }) {
  const maximo = Math.max(1, ...historico.flatMap(item => [Number(item.receitas) || 0, Number(item.despesas) || 0]));
  return <View accessibilityLabel="Gráfico de barras comparando receitas e despesas dos últimos seis meses" style={estilos.areaGrafico}>
    <View pointerEvents="none" style={estilos.linhasGrafico}>
      <View style={estilos.linhaGrafico} /><View style={estilos.linhaGrafico} /><View style={estilos.linhaGrafico} />
    </View>
    <View style={estilos.barrasLinha}>
      {historico.map(item => <View key={item.periodo} style={estilos.grupoMes}>
        <View style={estilos.parBarras}>
          <View style={[estilos.barra, { height: `${Math.max(3, (Number(item.receitas) || 0) / maximo * 100)}%`, backgroundColor: cores.sucesso }]} />
          <View style={[estilos.barra, { height: `${Math.max(3, (Number(item.despesas) || 0) / maximo * 100)}%`, backgroundColor: cores.perigo }]} />
        </View>
        <Text style={estilos.rotuloMes}>{rotuloMes(item.periodo)}</Text>
      </View>)}
    </View>
  </View>;
}

export default function Painel() {
  const { cores, estilosPainel: estilos, estilosCompartilhados } = useEstilosApp();
  const estilosPagina = useEstilosTema(criarEstilosPagina);
  const { width: largura, fontScale } = useWindowDimensions();
  const { dados, erro, carregando, recarregar } = useResumoFinanceiro();
  const [exportando, setExportando] = useState(false);
  const [erroExportacao, setErroExportacao] = useState('');
  const historico = (dados.historico || []).slice(-6);
  const atual = dados.atual || { totalReceitas: 0, totalDespesas: 0, saldo: 0 };
  const taxaEconomia = Number(atual.totalReceitas) > 0 ? Number(atual.saldo) / Number(atual.totalReceitas) * 100 : null;
  const percentualAnterior = dados.economia?.percentual;
  const mudancaDespesas = percentualAnterior == null ? null : Number(percentualAnterior);
  const progressoMeta = Number(dados.meta?.objetivo) > 0 ? Math.min(100, Math.max(0, (Number(dados.meta.atual) || 0) / Number(dados.meta.objetivo) * 100)) : 0;
  const duasColunas = largura >= 700 && fontScale <= 1.3;

  async function exportar(tipo = 'completo') {
    if (exportando) return;
    setExportando(true);
    setErroExportacao('');
    try {
      await exportarDashboard(tipo, dados);
    } catch (falha) {
      setErroExportacao(falha.message || 'Não foi possível gerar o PDF.');
    } finally {
      setExportando(false);
    }
  }

  return (
    <TelaAnimada style={estilos.recipiente} atraso={60}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          estilosCompartilhados.espacamentoInferior120,
          { paddingHorizontal: 16 },
        ]}
      >
        {carregando ? (
          <ActivityIndicator
            accessibilityLabel="Carregando painel financeiro"
            color={cores.primaria}
          />
        ) : erro ? (
          <View>
            <Text style={estilosCompartilhados.erroTexto}>{erro}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={recarregar}
              style={{ minHeight: 44, justifyContent: 'center' }}
            >
              <Text style={{ color: cores.textoLink }}>Tentar novamente</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 8, marginBottom: 14 }}>
              <Text style={{ color: cores.textoSecundario, fontSize: 13, flex: 1 }}>
                {dados.dataReferencia ? `Atualizado até ${dados.dataReferencia.slice(8, 10)}/${dados.dataReferencia.slice(5, 7)}/${dados.dataReferencia.slice(0, 4)}` : 'Acompanhamento financeiro do mês'}
              </Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Baixar o dashboard completo em PDF" disabled={exportando} onPress={() => exportar('completo')} style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingHorizontal: 14, borderRadius: 14, backgroundColor: cores.primaria }}>
                <Icon name={exportando ? 'hourglass-empty' : 'file-download'} size={18} color={cores.sobrePrimaria} />
                <Text style={{ color: cores.sobrePrimaria, fontSize: 13, fontWeight: '700' }}>{exportando ? 'Preparando…' : 'Baixar dashboard'}</Text>
              </Pressable>
            </View>
            {erroExportacao ? <Text accessibilityRole="alert" style={estilosCompartilhados.erroTexto}>{erroExportacao}</Text> : null}
            <CartaoPainel style={estilosPagina.cartaoGrafico}>
              <View style={estilosPagina.cabecalhoCard}>
                <View style={estilosPagina.titulosCard}>
                  <Text accessibilityRole="header" style={estilosPagina.tituloCard}>Receitas e despesas</Text>
                  <Text style={estilosPagina.legenda}>Comparativo mensal · últimos 6 meses</Text>
                </View>
                <Pressable accessibilityRole="button" accessibilityLabel="Baixar PDF de receitas e despesas" disabled={exportando} onPress={() => exportar('comparativo')} style={estilosPagina.botaoBaixar}>
                  <Icon name={exportando ? 'hourglass-empty' : 'file-download'} size={19} color={cores.primaria} />
                </Pressable>
              </View>
              {historico.length ? <>
                <GraficoReceitasDespesas historico={historico} cores={cores} estilos={estilosPagina} />
                <View style={estilosPagina.legendaGrafico}>
                  <View style={estilosPagina.itemLegenda}><View style={[estilosPagina.pontoLegenda, { backgroundColor: cores.sucesso }]} /><Text style={estilosPagina.legenda}>Receitas</Text></View>
                  <View style={estilosPagina.itemLegenda}><View style={[estilosPagina.pontoLegenda, { backgroundColor: cores.perigo }]} /><Text style={estilosPagina.legenda}>Despesas</Text></View>
                  <Text style={estilosPagina.legenda}>R$ · valores realizados</Text>
                </View>
                <View style={estilosPagina.totalizadores}>
                  <View style={estilosPagina.totalizador}><Text style={estilosPagina.legenda}>Receitas no mês</Text><Text style={[estilosPagina.valorTotal, { color: cores.sucesso }]}>{formatarReais(atual.totalReceitas)}</Text></View>
                  <View style={estilosPagina.totalizador}><Text style={estilosPagina.legenda}>Despesas no mês</Text><Text style={[estilosPagina.valorTotal, { color: cores.perigo }]}>{formatarReais(atual.totalDespesas)}</Text></View>
                </View>
              </> : <Text style={estilosPagina.vazio}>Ainda não há movimentações para comparar.</Text>}
            </CartaoPainel>

            <View style={[estilosPagina.grade, duasColunas && estilosPagina.duasColunas]}>
              <CartaoPainel style={[estilosPagina.cartaoInfo, duasColunas && estilosPagina.flexColuna]}>
                <View style={estilosPagina.cabecalhoCard}>
                  <View style={estilosPagina.titulosCard}>
                    <Text accessibilityRole="header" style={estilosPagina.tituloCard}>Progresso da meta</Text>
                    <Text style={estilosPagina.legenda}>{dados.meta?.nome || 'Acompanhe uma meta financeira'}</Text>
                  </View>
                  <Pressable accessibilityRole="button" accessibilityLabel="Baixar PDF do progresso da meta" disabled={exportando} onPress={() => exportar('meta')} style={estilosPagina.botaoBaixar}>
                    <Icon name={exportando ? 'hourglass-empty' : 'file-download'} size={19} color={cores.primaria} />
                  </Pressable>
                </View>
                {Number(dados.meta?.objetivo) > 0 ? <>
                  <View style={estilosPagina.metaValores}><Text style={estilosPagina.valorMeta}>{formatarReais(dados.meta.atual)}</Text><Text style={estilosPagina.metaObjetivo}>de {formatarReais(dados.meta.objetivo)}</Text></View>
                  <View style={estilosPagina.trilho}><View style={[estilosPagina.preenchimento, { width: `${progressoMeta}%`, backgroundColor: cores.primaria }]} /></View>
                  <View style={estilosPagina.metaRodape}><Text style={estilosPagina.legenda}>{progressoMeta.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}% concluído</Text><Pressable accessibilityRole="button" onPress={() => router.push('/metas')}><Text style={estilosPagina.link}>Ver meta</Text></Pressable></View>
                </> : <Pressable accessibilityRole="button" onPress={() => router.push('/metas')} style={estilosPagina.criarMeta}>
                  <View style={estilosPagina.iconeAcao}><Icon name="flag" size={20} color={cores.primaria} /></View>
                  <Text style={estilosPagina.textoAcao}>Criar uma meta para acompanhar seu progresso</Text>
                  <Icon name="arrow-forward" size={18} color={cores.primaria} />
                </Pressable>}
              </CartaoPainel>

              <CartaoPainel style={[estilosPagina.cartaoInfo, duasColunas && estilosPagina.flexColuna]}>
                <View style={estilosPagina.cabecalhoCard}>
                  <View style={estilosPagina.titulosCard}>
                    <Text accessibilityRole="header" style={estilosPagina.tituloCard}>Leituras do mês</Text>
                    <Text style={estilosPagina.legenda}>O que os números mostram</Text>
                  </View>
                  <Pressable accessibilityRole="button" accessibilityLabel="Baixar PDF das leituras do mês" disabled={exportando} onPress={() => exportar('indicadores')} style={estilosPagina.botaoBaixar}>
                    <Icon name={exportando ? 'hourglass-empty' : 'file-download'} size={19} color={cores.primaria} />
                  </Pressable>
                </View>
                <View style={estilosPagina.leituraLinha}>
                  <View style={[estilosPagina.iconeLeitura, { backgroundColor: cores.sucesso + '18' }]}><Icon name="savings" size={20} color={cores.sucesso} /></View>
                  <View style={estilosPagina.leituraTexto}>
                    <Text style={estilosPagina.rotuloLeitura}>Taxa de economia</Text>
                    <View style={estilosPagina.valorLeituraLinha}><Text style={estilosPagina.valorLeitura}>{taxaEconomia === null ? '—' : `${taxaEconomia.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`}</Text><View style={[estilosPagina.selo, { backgroundColor: cores.sucesso + '18' }]}><Text style={[estilosPagina.textoSelo, { color: cores.sucesso }]}>{taxaEconomia === null ? 'Sem receitas' : taxaEconomia >= 20 ? 'Boa reserva' : taxaEconomia > 0 ? 'Saldo positivo' : 'Atenção'}</Text></View></View>
                    <Text style={estilosPagina.legenda}>Quanto da receita restou após as despesas.</Text>
                  </View>
                </View>
                <View style={estilosPagina.divisor} />
                <View style={estilosPagina.leituraLinha}>
                  <View style={[estilosPagina.iconeLeitura, { backgroundColor: cores.primaria + '18' }]}><Icon name="compare-arrows" size={20} color={cores.primaria} /></View>
                  <View style={estilosPagina.leituraTexto}>
                    <Text style={estilosPagina.rotuloLeitura}>Despesas vs. mês anterior</Text>
                    <View style={estilosPagina.valorLeituraLinha}><Text style={estilosPagina.valorLeitura}>{Number.isFinite(mudancaDespesas) ? `${mudancaDespesas > 0 ? '+' : ''}${mudancaDespesas.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%` : '—'}</Text><View style={[estilosPagina.selo, { backgroundColor: mudancaDespesas != null && mudancaDespesas <= 0 ? cores.sucesso + '18' : cores.perigo + '18' }]}><Text style={[estilosPagina.textoSelo, { color: mudancaDespesas != null && mudancaDespesas <= 0 ? cores.sucesso : cores.perigo }]}>{mudancaDespesas == null ? 'Sem comparação' : mudancaDespesas > 0 ? 'Subiram' : mudancaDespesas < 0 ? 'Diminuíram' : 'Estáveis'}</Text></View></View>
                    <Text style={estilosPagina.legenda}>{mudancaDespesas == null ? 'Ainda não há mês anterior completo para comparar.' : mudancaDespesas > 0 ? 'Os gastos cresceram em relação ao mês anterior.' : mudancaDespesas < 0 ? 'Os gastos caíram em relação ao mês anterior.' : 'Os gastos ficaram no mesmo nível do mês anterior.'}</Text>
                  </View>
                </View>
              </CartaoPainel>
            </View>

            <VisaoFinanceira dados={dados} aoExportar={exportar} exportando={exportando} />
          </>
        )}
      </ScrollView>
      <BarraNavegacao />
    </TelaAnimada>
  );
}

const criarEstilosPagina = cores => StyleSheet.create({
  cartaoGrafico: { marginTop: 8 },
  cartaoInfo: { minWidth: 0 },
  flexColuna: { flex: 1 },
  grade: { gap: 16, marginTop: 16 },
  duasColunas: { flexDirection: 'row', alignItems: 'stretch' },
  cabecalhoCard: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 },
  titulosCard: { flex: 1, gap: 3 },
  tituloCard: { color: cores.textoPrincipal, fontSize: 17, lineHeight: 23, fontWeight: '700' },
  legenda: { color: cores.textoSecundario, fontSize: 12, lineHeight: 18 },
  botaoBaixar: { width: 38, height: 38, borderRadius: 13, borderWidth: 1, borderColor: cores.borda, alignItems: 'center', justifyContent: 'center' },
  areaGrafico: { height: 174, overflow: 'hidden', position: 'relative', marginTop: 2 },
  linhasGrafico: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', paddingBottom: 28, paddingTop: 5 },
  linhaGrafico: { height: 1, backgroundColor: cores.divisor, opacity: 0.75 },
  barrasLinha: { height: 174, flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-around' },
  grupoMes: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 8 },
  parBarras: { height: 140, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 5 },
  barra: { width: 12, maxHeight: '100%', minHeight: 4, borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  rotuloMes: { height: 22, color: cores.textoSecundario, fontSize: 10 },
  legendaGrafico: { flexDirection: 'row', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginTop: 8 },
  itemLegenda: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pontoLegenda: { width: 8, height: 8, borderRadius: 4 },
  totalizadores: { flexDirection: 'row', gap: 20, flexWrap: 'wrap', marginTop: 18, paddingTop: 15, borderTopWidth: 1, borderTopColor: cores.divisor },
  totalizador: { flex: 1, minWidth: 125, gap: 3 },
  valorTotal: { fontSize: 17, fontWeight: '700' },
  vazio: { marginVertical: 16, color: cores.textoSecundario, fontSize: 14, lineHeight: 21 },
  metaValores: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: 7, marginTop: 4, marginBottom: 13 },
  valorMeta: { color: cores.textoPrincipal, fontSize: 22, fontWeight: '800' },
  metaObjetivo: { color: cores.textoSecundario, fontSize: 13 },
  trilho: { height: 10, borderRadius: 6, backgroundColor: cores.superficieElevada, overflow: 'hidden' },
  preenchimento: { height: '100%', borderRadius: 6 },
  metaRodape: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  link: { color: cores.textoLink, fontSize: 13, fontWeight: '700' },
  criarMeta: { minHeight: 90, flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconeAcao: { width: 42, height: 42, borderRadius: 14, backgroundColor: cores.primariaSuave, alignItems: 'center', justifyContent: 'center' },
  textoAcao: { flex: 1, color: cores.textoPrincipal, fontSize: 14, lineHeight: 20, fontWeight: '600' },
  leituraLinha: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 5 },
  iconeLeitura: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  leituraTexto: { flex: 1, gap: 5 },
  rotuloLeitura: { color: cores.textoSecundario, fontSize: 12, fontWeight: '600' },
  valorLeituraLinha: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 9 },
  valorLeitura: { color: cores.textoPrincipal, fontSize: 20, fontWeight: '800' },
  selo: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999 },
  textoSelo: { fontSize: 10, fontWeight: '700' },
  divisor: { height: 1, backgroundColor: cores.divisor, marginVertical: 12 },
});
