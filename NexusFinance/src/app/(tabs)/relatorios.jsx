import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from '@expo/vector-icons/MaterialIcons';
import BarraNavegacao from "../../componentes/BarraNavegacao";
import { CartaoAnimado, TelaAnimada } from "../../componentes/TelaAnimada";
import { useEstilosApp } from "../../style/style";
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
    carregando,
    recarregar
  } = useResumoFinanceiro();
  const [exportando, setExportando] = useState(false);
  const [erroExportacao, setErroExportacao] = useState('');
  const [periodoSelecionado, setPeriodoSelecionado] = useState(null);
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
  const maximoGrafico = Math.max(1, ...historico.flatMap(item => [Number(item.receitas) || 0, Number(item.despesas) || 0]));
  const temDadosGrafico = historico.some(item => Number(item.receitas) > 0 || Number(item.despesas) > 0);
  const mesSelecionado = historico.find(item => item.periodo === periodoSelecionado) || historico[historico.length - 1];
  async function exportar() {
    if (exportando) return;
    setExportando(true);
    setErroExportacao('');
    try {
      await exportarRelatorio(periodo === 'Mês' ? 'Mês atual' : 'Últimos 12 meses', totaisRelatorio, historico);
    } catch (falha) {
      setErroExportacao(falha.message);
    } finally {
      setExportando(false);
    }
  }
  return <TelaAnimada style={estilos.recipiente} atraso={60}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilosCompartilhados.espacamentoInferior120}>
        {erro ? <View><Text accessibilityRole="alert" style={estilosCompartilhados.erroTexto}>{erro}</Text><TouchableOpacity accessibilityRole="button" onPress={recarregar} style={{ minHeight: 44, justifyContent: 'center' }}><Text style={{ color: cores.textoLink }}>Tentar novamente</Text></TouchableOpacity></View> : null}
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
              <Picker.Item label="Últimos 12 meses" value="Ano" />
            </Picker>
          </View>
        </CartaoAnimado>

        <CartaoAnimado style={estilos.cartao} atraso={120}>
          <Text style={estilos.cartaoTitulo}>Receitas e despesas realizadas</Text>
          <Text style={estilosCompartilhados.suaveLegenda}>Barras lado a lado facilitam a comparação. Toque em um mês para ver os valores.</Text>
          {historico.length && temDadosGrafico ? <>
            <View accessibilityLabel={`Comparativo de receitas e despesas. Maior valor no gráfico: ${formatarReais(maximoGrafico)}.`} style={{ height: 190, flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-around', marginTop: 18 }}>
              {historico.map(item => {
                const receitas = Number(item.receitas) || 0;
                const despesas = Number(item.despesas) || 0;
                const ativo = (mesSelecionado?.periodo === item.periodo);
                return <Pressable key={item.periodo} accessibilityRole="button" accessibilityState={{ selected: ativo }} accessibilityLabel={`${item.periodo}. Receitas ${formatarReais(receitas)}. Despesas ${formatarReais(despesas)}.`} onPress={() => setPeriodoSelecionado(item.periodo)} style={{ flex: 1, minWidth: 18, alignItems: 'center', justifyContent: 'flex-end', gap: 8, borderRadius: 10, backgroundColor: ativo ? cores.primariaSuave : 'transparent' }}>
                  <View style={{ height: 150, flexDirection: 'row', alignItems: 'flex-end', gap: 2 }}>
                    <View style={{ width: 8, height: receitas ? Math.max(2, receitas / maximoGrafico * 145) : 0, backgroundColor: cores.sucesso, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} />
                    <View style={{ width: 8, height: despesas ? Math.max(2, despesas / maximoGrafico * 145) : 0, backgroundColor: cores.perigo, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} />
                  </View>
                  <Text style={{ color: cores.textoSecundario, fontSize: 9, lineHeight: 12, textAlign: 'center' }}>{new Date(Date.UTC(Number(item.periodo.slice(0, 4)), Number(item.periodo.slice(5, 7)) - 1, 1)).toLocaleDateString('pt-BR', { month: 'short', timeZone: 'UTC' }).replace('.', '')}{'\n'}{item.periodo.slice(2, 4)}</Text>
                </Pressable>;
              })}
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 12 }}>
              <Text style={{ color: cores.sucesso }}>● Receitas</Text><Text style={{ color: cores.perigo }}>● Despesas</Text><Text style={estilosCompartilhados.suaveLegenda}>Escala proporcional</Text>
            </View>
            {mesSelecionado ? <View style={{ marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: cores.divisor, gap: 7 }}>
              <Text style={estilos.cartaoTitulo}>{mesSelecionado.periodo.slice(5)}/{mesSelecionado.periodo.slice(0, 4)}</Text>
              <Text style={{ color: cores.sucesso }}>Receitas: {formatarReais(mesSelecionado.receitas)}</Text>
              <Text style={{ color: cores.perigo }}>Despesas: {formatarReais(mesSelecionado.despesas)}</Text>
              <Text style={{ color: cores.textoPrincipal, fontWeight: '700' }}>Resultado: {formatarReais(mesSelecionado.saldo)}</Text>
            </View> : null}
          </> : <Text style={estilosCompartilhados.erroTexto}>
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
