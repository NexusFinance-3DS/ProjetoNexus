import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { router } from 'expo-router';
import GraficoMedido from "./GraficoMedido";
import { useEstilosTema } from "../contextos/ContextoTema";
import { useEstilosApp } from "../app/estilos/estilos";
import { formatarReais } from "../servicos/financeiro";
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const rotuloMes = periodo => `${MESES[Number(periodo.slice(5, 7)) - 1]}/${periodo.slice(2, 4)}`;
function Cartao({
  titulo,
  subtitulo,
  children: filhos,
  style: estilo,
  acao,
  aoPressionar: aoPressionar
}) {
  const estilos = useEstilosTema(criarEstilos);
  return <View style={[estilos.cartao, estilo]}>
      <View style={estilos.cabecalho}>
        <Text accessibilityRole="header" style={estilos.titulo}>
          {titulo}
        </Text>
        {acao ? <Pressable accessibilityRole="button" onPress={aoPressionar} style={estilos.link}>
            <Text style={estilos.linkTexto}>{acao}</Text>
          </Pressable> : null}
      </View>
      <Text style={estilos.legenda}>{subtitulo}</Text>
      {filhos}
    </View>;
}
export default function VisaoFinanceira({
  dados,
  visivel = true,
  inicio = false
}) {
  const estilos = useEstilosTema(criarEstilos);
  const {
    cores
  } = useEstilosApp();
  const {
    width: largura,
    fontScale: escalaFonte
  } = useWindowDimensions();
  const telaLarga = largura >= 900 && escalaFonte <= 1.3;
  const valorFormatado = valor => visivel ? formatarReais(valor) : '******';
  const atual = dados.atual;
  const previsao = dados.previsao;
  const temHistorico = dados.historico.some(item => item.receitas !== 0 || item.despesas !== 0);
  const paleta = [cores.primaria, cores.graficoRoxo, cores.graficoAzul, cores.graficoLaranja, cores.perigo, cores.sucesso];
  const referencia = dados.dataReferencia ? `Até ${dados.dataReferencia.slice(8, 10)}/${dados.dataReferencia.slice(5, 7)}/${dados.dataReferencia.slice(0, 4)}` : 'Mês atual';
  const comparacao = dados.economia.percentual === null ? 'Sem base de comparação' : `${dados.economia.percentual >= 0 ? '+' : ''}${dados.economia.percentual.toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  })}% em relação ao mês anterior completo`;
  return <View style={estilos.visaoGeral}>
      <View style={[estilos.grade, telaLarga && estilos.colunas]}>
        <Cartao titulo="Resumo financeiro" subtitulo={`${referencia} · valores realizados e previsão do mês`} style={telaLarga && estilos.coluna} acao={inicio ? 'Ver relatórios' : undefined} aoPressionar={() => router.push('/relatorios')}>
          {[['Receitas', atual.totalReceitas, previsao.totalReceitas, cores.sucesso], ['Despesas', atual.totalDespesas, previsao.totalDespesas, cores.perigo], ['Resultado do mês', atual.saldo, previsao.saldo, atual.saldo < 0 ? cores.perigo : cores.textoLink]].map(([rotulo, realizado, previsto, cor]) => <View key={rotulo} style={estilos.resumoLinha}>
              <Text style={estilos.linhaRotulo}>{rotulo}</Text>
              <View style={estilos.valores}>
                <View style={estilos.valorColuna}>
                  <Text style={estilos.pequeno}>Realizado</Text>
                  <Text style={[estilos.valor, {
                color: cor
              }]}>{valorFormatado(realizado)}</Text>
                </View>
                <View style={estilos.valorColuna}>
                  <Text style={estilos.pequeno}>Previsto no mês</Text>
                  <Text style={estilos.valor}>{valorFormatado(previsto)}</Text>
                </View>
              </View>
            </View>)}
          <Text style={estilos.legenda}>{visivel ? comparacao : 'Comparação oculta'}</Text>
          <View style={estilos.previsao}>
            <Text style={estilos.linhaRotulo}>Saldo previsto no fim do mês</Text>
            <Text style={[estilos.grandeValor, {
            color: dados.saldoPrevisto < 0 ? cores.perigo : cores.textoLink
          }]}>
              {valorFormatado(dados.saldoPrevisto)}
            </Text>
            <Text style={estilos.legenda}>
              Saldo disponível + valores a realizar até o fim do mês, incluindo pendências
              anteriores.
            </Text>
          </View>
        </Cartao>

        <Cartao titulo="Evolução dos resultados" subtitulo="Últimos 6 meses · receitas menos despesas realizadas" style={telaLarga && estilos.coluna} acao={inicio ? "Ver painel financeiro" : undefined} aoPressionar={() => router.push("/painel")}>
          {!visivel ? <Text style={estilos.vazio}>Gráfico oculto para proteger seus valores.</Text> : <>
              {!temHistorico ? <Text style={estilos.vazio}>
                  Nenhuma movimentação realizada nos últimos seis meses.
                </Text> : null}
              {dados.historico.length > 0 ? <GraficoMedido>
                  {larguraGrafico => <LineChart data={{
              labels: dados.historico.map(item => rotuloMes(item.periodo)),
              datasets: [{
                data: dados.historico.map(item => item.saldo)
              }]
            }} width={larguraGrafico} height={210} fromZero withShadow={false} withOuterLines={false} formatYLabel={valor => Number(valor).toLocaleString('pt-BR', {
              notation: 'compact',
              maximumFractionDigits: 1
            })} chartConfig={{
              backgroundGradientFrom: cores.superficie,
              backgroundGradientTo: cores.superficie,
              decimalPlaces: 0,
              color: () => cores.primaria,
              labelColor: () => cores.textoSecundario,
              propsForBackgroundLines: {
                stroke: cores.divisor
              },
              propsForLabels: {
                fontSize: 10
              }
            }} />}
                </GraficoMedido> : null}
              <Text style={estilos.pequeno}>
                Valores em reais (R$). O mês atual considera somente até hoje.
              </Text>
              <View style={estilos.history}>
                {dados.historico.map(item => <View style={estilos.historyLinha} key={item.periodo}>
                    <Text style={estilos.legenda}>{rotuloMes(item.periodo)}</Text>
                    <Text style={[estilos.historyValor, {
                color: item.saldo < 0 ? cores.perigo : cores.textoPrincipal
              }]}>
                      {formatarReais(item.saldo)}
                    </Text>
                  </View>)}
              </View>
            </>}
        </Cartao>
      </View>

      <Cartao titulo="Gastos por categoria" subtitulo="Participação nas despesas realizadas do mês">
        {!visivel ? <Text style={estilos.vazio}>Distribuição oculta para proteger seus valores.</Text> : dados.categorias.length === 0 ? <Text style={estilos.vazio}>
            Nenhuma despesa realizada neste mês. Despesas pendentes aparecem apenas na previsão.
          </Text> : dados.categorias.map((item, index) => {
        const percentual = atual.totalDespesas > 0 ? item.valor / atual.totalDespesas * 100 : 0;
        return <View key={item.nome} style={estilos.categoria}>
                <View style={estilos.categoriaCabecalho}>
                  <Text style={estilos.linhaRotulo}>{item.nome}</Text>
                  <Text style={estilos.valor}>{formatarReais(item.valor)}</Text>
                </View>
                <View style={estilos.track}>
                  <View style={[estilos.fill, {
              width: `${Math.min(100, percentual)}%`,
              backgroundColor: paleta[index % paleta.length]
            }]} />
                </View>
                <Text style={estilos.pequeno}>
                  {percentual.toLocaleString('pt-BR', {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1
            })}
                  % das despesas
                </Text>
              </View>;
      })}
      </Cartao>
    </View>;
}
const criarEstilos = cores => StyleSheet.create({
  visaoGeral: {
    gap: 16,
    marginTop: 18
  },
  grade: {
    gap: 16
  },
  colunas: {
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  coluna: {
    flex: 1,
    minWidth: 0
  },
  cartao: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie
  },
  cabecalho: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    color: cores.textoPrincipal,
    flexShrink: 1
  },
  legenda: {
    fontSize: 13,
    lineHeight: 20,
    color: cores.textoSecundario
  },
  link: {
    minHeight: 44,
    justifyContent: 'center'
  },
  linkTexto: {
    color: cores.textoLink,
    fontWeight: '600',
    fontSize: 13
  },
  resumoLinha: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: cores.divisor,
    gap: 8
  },
  linhaRotulo: {
    color: cores.textoPrincipal,
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1
  },
  valores: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16
  },
  valorColuna: {
    flex: 1,
    minWidth: 105,
    gap: 4
  },
  pequeno: {
    color: cores.textoSecundario,
    fontSize: 12,
    lineHeight: 18
  },
  valor: {
    color: cores.textoPrincipal,
    fontSize: 16,
    fontWeight: '700',
    flexShrink: 1
  },
  previsao: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: cores.superficieElevada,
    gap: 8
  },
  grandeValor: {
    fontSize: 24,
    fontWeight: '700'
  },
  vazio: {
    marginVertical: 20,
    fontSize: 14,
    lineHeight: 22,
    color: cores.textoSecundario
  },
  history: {
    marginTop: 12,
    gap: 6
  },
  historyLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8
  },
  historyValor: {
    fontSize: 13,
    fontWeight: '600'
  },
  categoria: {
    marginTop: 18,
    gap: 8
  },
  categoriaCabecalho: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: cores.superficieElevada,
    overflow: 'hidden'
  },
  fill: {
    height: '100%',
    borderRadius: 4
  }
});
