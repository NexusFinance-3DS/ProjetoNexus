import GraficoMedido from "../../componentes/GraficoMedido";
import React, { useState } from 'react';
import { Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { StackedBarChart } from 'react-native-chart-kit';
import Icon from '@expo/vector-icons/MaterialIcons';
import BarraNavegacao from "../componentes/BarraNavegacao";
import { CartaoAnimado, TelaAnimada } from "../componentes/TelaAnimada";
import { useEstilosApp } from "../estilos/estilos";
import { formatarReais, hoje } from "../../servicos/financeiro";
import { useResumoFinanceiro } from "../../ganchos/useResumoFinanceiro";
import { exportarRelatorio } from "../../servicos/relatorio";
export default function Relatorios() {
  const {
    cores,
    estilosRelatorios: estilos,
    estilosCompartilhados
  } = useEstilosApp();
  const [periodo, setPeriodo] = useState('Mês');
  const {
    dados,
    erro,
    carregando
  } = useResumoFinanceiro();
  const [exportando, setExportando] = useState(false);
  const [erroExportacao, setErroExportacao] = useState('');
  const totais = dados.atual;
  const historico = periodo === 'Mês' ? [{
    periodo: (dados.dataReferencia || hoje()).slice(0, 7),
    receitas: totais.totalReceitas,
    despesas: totais.totalDespesas,
    saldo: totais.saldo
  }] : dados.historico;
  const totaisRelatorio = periodo === 'Mês' ? totais : historico.reduce((soma, item) => ({
    totalReceitas: (Math.round(soma.totalReceitas * 100) + Math.round(item.receitas * 100)) / 100,
    totalDespesas: (Math.round(soma.totalDespesas * 100) + Math.round(item.despesas * 100)) / 100,
    saldo: (Math.round(soma.saldo * 100) + Math.round(item.saldo * 100)) / 100
  }), {
    totalReceitas: 0,
    totalDespesas: 0,
    saldo: 0
  });
  const dadosGrafico = {
    labels: historico.map(item => item.periodo.slice(5)),
    legend: ['Receitas', 'Despesas'],
    data: historico.map(item => [item.receitas, item.despesas]),
    barColors: [cores.sucesso, cores.perigo]
  };
  async function exportar() {
    if (exportando) return;
    setExportando(true);
    setErroExportacao('');
    try {
      await exportarRelatorio(periodo === 'Mês' ? 'Mês atual' : 'Últimos 6 meses', totaisRelatorio, historico);
    } catch (falha) {
      setErroExportacao(falha.message);
    } finally {
      setExportando(false);
    }
  }
  return <TelaAnimada style={estilos.recipiente} atraso={60}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilosCompartilhados.espacamentoInferior120}>
        {erro ? <Text style={estilosCompartilhados.erroTexto}>{erro}</Text> : null}
        <CartaoAnimado style={estilos.cartao} atraso={40}>
          <Text style={estilos.cartaoTitulo}>Período</Text>
          <View style={estilos.pickerRecipiente}>
            <Picker selectedValue={periodo} dropdownIconColor={cores.textoPrincipal} style={[estilos.picker, Platform.OS === 'web' && {
            backgroundColor: cores.superficie
          }, Platform.OS === 'ios' && {
            height: 180
          }]} itemStyle={{
            color: cores.textoPrincipal,
            fontSize: 16
          }} onValueChange={setPeriodo}>
              <Picker.Item label="Mês atual" value="Mês" />
              <Picker.Item label="Últimos 6 meses" value="Semestre" />
            </Picker>
          </View>
        </CartaoAnimado>

        <CartaoAnimado style={estilos.cartao} atraso={120}>
          <Text style={estilos.cartaoTitulo}>Receitas x Despesas (R$)</Text>
          {dadosGrafico.labels.length ? <GraficoMedido>
              {largura => <StackedBarChart data={dadosGrafico} width={largura} height={220} yAxisLabel="" formatYLabel={valor => Number(valor).toLocaleString('pt-BR', {
            notation: 'compact',
            maximumFractionDigits: 1
          })} fromZero chartConfig={{
            backgroundGradientFrom: cores.superficie,
            backgroundGradientTo: cores.superficie,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(81,69,255,${opacity})`,
            labelColor: () => cores.textoPrincipal,
            propsForBackgroundLines: {
              stroke: cores.divisor
            }
          }} style={estilosCompartilhados.relatorioGrafico} />}
            </GraficoMedido> : <Text style={estilosCompartilhados.erroTexto}>
              Ainda não existem transações para gerar o gráfico.
            </Text>}
        </CartaoAnimado>

        <CartaoAnimado style={estilos.cartao} atraso={180}>
          <Text style={estilos.cartaoTitulo}>Resumo Financeiro</Text>
          <Text style={estilosCompartilhados.suaveLegenda}>
            Somente valores realizados até a data de referência.
          </Text>
          <View style={estilos.itemResumo}>
            <Icon name="trending-up" size={30} color={cores.sucesso} />
            <View style={estilos.textos}>
              <Text style={estilos.rotulo}>Receitas</Text>
              <Text style={estilos.valor}>{formatarReais(totaisRelatorio.totalReceitas)}</Text>
            </View>
          </View>
          <View style={estilos.itemResumo}>
            <Icon name="trending-down" size={30} color={cores.perigo} />
            <View style={estilos.textos}>
              <Text style={estilos.rotulo}>Despesas</Text>
              <Text style={estilos.valor}>{formatarReais(totaisRelatorio.totalDespesas)}</Text>
            </View>
          </View>
          <View style={estilos.itemResumo}>
            <Icon name="savings" size={30} color={cores.primaria} />
            <View style={estilos.textos}>
              <Text style={estilos.rotulo}>Resultado do período</Text>
              <Text style={estilos.valor}>{formatarReais(totaisRelatorio.saldo)}</Text>
            </View>
          </View>
          {erroExportacao ? <Text style={estilosCompartilhados.erroTexto}>{erroExportacao}</Text> : null}
          <TouchableOpacity style={estilos.botao} activeOpacity={0.8} disabled={exportando || carregando || !!erro} onPress={exportar}>
            <Icon name="picture-as-pdf" size={24} color={cores.sobrePrimaria} />
            <Text style={estilos.botaoTexto}>{exportando ? 'Exportando...' : 'Exportar PDF'}</Text>
          </TouchableOpacity>
        </CartaoAnimado>
      </ScrollView>
      <BarraNavegacao />
    </TelaAnimada>;
}
