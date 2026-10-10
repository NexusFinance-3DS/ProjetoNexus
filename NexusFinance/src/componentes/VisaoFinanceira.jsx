import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from '@expo/vector-icons/MaterialIcons';
import GraficoMedido from './GraficoMedido';
import CartaoPainel from './CartaoPainel';
import { useEstilosTema } from '../contextos/ContextoTema';
import { useEstilosApp } from '../style/style';
import { formatarReais } from '../servicos/financeiro';

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const rotuloMes = periodo => `${MESES[Number(periodo.slice(5, 7)) - 1]}/${periodo.slice(2, 4)}`;

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

export default function VisaoFinanceira({ dados, aoExportar, exportando = false }) {
  const estilos = useEstilosTema(criarEstilos);
  const { cores } = useEstilosApp();
  const { width: largura, fontScale } = useWindowDimensions();
  const larga = largura >= 900 && fontScale <= 1.3;
  const historico = (dados.historico || []).slice(-6);
  const atual = dados.atual || { totalReceitas: 0, totalDespesas: 0, saldo: 0 };
  const previsao = dados.previsao || { totalReceitas: 0, totalDespesas: 0, saldo: 0 };
  const categorias = dados.categorias || [];
  const coresCategorias = [cores.primaria, cores.graficoRoxo, cores.graficoAzul, cores.graficoLaranja, cores.perigo, cores.sucesso];
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

  return <View style={estilos.visaoGeral}>
    <View style={[estilos.grade, larga && estilos.duasColunas]}>
      <Cartao titulo="Evolução do resultado" subtitulo="Receitas menos despesas realizadas" aoExportar={aoExportar ? () => aoExportar('resultados') : undefined} exportando={exportando} style={larga && estilos.coluna}>
        {historico.length ? <GraficoMedido>
          {width => <LineChart data={{ labels: historico.map(item => rotuloMes(item.periodo)), datasets: [{ data: historico.map(item => Number(item.saldo) || 0) }] }} width={width} height={210} fromZero withShadow={false} withOuterLines={false} bezier formatYLabel={valor => Number(valor).toLocaleString('pt-BR', { notation: 'compact', maximumFractionDigits: 1 })} chartConfig={chartPalette} style={estilos.chartKit} />}
        </GraficoMedido> : <Text style={estilos.vazio}>Ainda não há histórico suficiente para exibir a evolução.</Text>}
        {!!historico.length && <Text style={estilos.nota}>O mês atual considera os valores até a data de referência.</Text>}
      </Cartao>

      <Cartao titulo="Projeção do mês" subtitulo={`Estimativa até o fim do mês · ${referencia}`} aoExportar={aoExportar ? () => aoExportar('indicadores') : undefined} exportando={exportando} style={larga && estilos.coluna}>
        {[
          ['Receitas estimadas', previsao.totalReceitas, cores.sucesso],
          ['Despesas estimadas', previsao.totalDespesas, cores.perigo],
          ['Resultado estimado', previsao.saldo, Number(previsao.saldo) < 0 ? cores.perigo : cores.textoLink],
        ].map(([nome, valor, cor]) => <View key={nome} style={estilos.linhaResumo}>
          <Text style={estilos.rotulo}>{nome}</Text>
          <Text style={[estilos.valorResumo, { color: cor }]}>{formatarReais(valor)}</Text>
        </View>)}
        <Text style={estilos.nota}>Inclui valores realizados e lançamentos previstos.</Text>
      </Cartao>
    </View>

    <View style={[estilos.grade, larga && estilos.duasColunas]}>
      <Cartao titulo="Despesas por categoria" subtitulo="Distribuição das despesas realizadas" aoExportar={aoExportar ? () => aoExportar('categorias') : undefined} exportando={exportando} style={larga && estilos.coluna}>
        {categorias.length ? categorias.map((item, index) => {
          const percentual = Number(atual.totalDespesas) > 0 ? Number(item.valor) / Number(atual.totalDespesas) * 100 : 0;
          return <View key={item.nome} style={estilos.categoria}>
            <View style={estilos.categoriaCabecalho}><Text style={estilos.rotulo}>{item.nome}</Text><Text style={estilos.valorResumo}>{formatarReais(item.valor)}</Text></View>
            <View style={estilos.trilho}><View style={[estilos.preenchimento, { width: `${Math.min(100, percentual)}%`, backgroundColor: coresCategorias[index % coresCategorias.length] }]} /></View>
            <Text style={estilos.pequeno}>{percentual.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}% das despesas</Text>
          </View>;
        }) : <Text style={estilos.vazio}>Nenhuma despesa realizada neste mês.</Text>}
      </Cartao>
    </View>
  </View>;
}

const criarEstilos = cores => StyleSheet.create({
  visaoGeral: { gap: 16, marginTop: 16 },
  grade: { gap: 16 },
  duasColunas: { flexDirection: 'row', alignItems: 'stretch' },
  coluna: { flex: 1, minWidth: 0 },
  cabecalho: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 },
  titulos: { flex: 1, gap: 3 },
  titulo: { fontSize: 17, lineHeight: 23, fontWeight: '700', color: cores.textoPrincipal },
  legenda: { fontSize: 12, lineHeight: 18, color: cores.textoSecundario },
  botaoBaixar: { width: 38, height: 38, borderRadius: 13, borderWidth: 1, borderColor: cores.borda, alignItems: 'center', justifyContent: 'center' },
  chartKit: { borderRadius: 12, paddingRight: 8 },
  nota: { color: cores.textoSecundario, fontSize: 12, lineHeight: 18, marginTop: 10 },
  linhaResumo: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: cores.divisor, gap: 8 },
  rotulo: { color: cores.textoPrincipal, fontSize: 14, fontWeight: '600', flexShrink: 1 },
  valorResumo: { color: cores.textoPrincipal, fontSize: 15, fontWeight: '700', flexShrink: 1 },
  pequeno: { color: cores.textoSecundario, fontSize: 11, lineHeight: 17 },
  categoria: { gap: 7, marginTop: 14 },
  categoriaCabecalho: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  trilho: { height: 8, borderRadius: 5, backgroundColor: cores.superficieElevada, overflow: 'hidden' },
  preenchimento: { height: '100%', borderRadius: 5 },
  vazio: { marginVertical: 16, color: cores.textoSecundario, fontSize: 14, lineHeight: 21 },
});
