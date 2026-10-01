import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import BarraNavegacao from "../componentes/BarraNavegacao";
import { TelaAnimada } from "../componentes/TelaAnimada";
import VisaoFinanceira from "../../componentes/VisaoFinanceira";
import { useEstilosApp } from "../estilos/estilos";
import { useResumoFinanceiro } from "../../ganchos/useResumoFinanceiro";
export default function Painel() {
  const {
    cores,
    estilosPainel: estilos,
    estilosCompartilhados
  } = useEstilosApp();
  const {
    dados,
    erro,
    carregando,
    recarregar
  } = useResumoFinanceiro();
  return <TelaAnimada style={estilos.recipiente} atraso={60}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[estilosCompartilhados.espacamentoInferior120, {
      paddingHorizontal: 16
    }]}>
        {carregando ? <ActivityIndicator accessibilityLabel="Carregando painel financeiro" color={cores.primaria} /> : erro ? <View>
            <Text style={estilosCompartilhados.erroTexto}>{erro}</Text>
            <Pressable accessibilityRole="button" onPress={recarregar} style={{
          minHeight: 44,
          justifyContent: 'center'
        }}>
              <Text style={{
            color: cores.textoLink
          }}>Tentar novamente</Text>
            </Pressable>
          </View> : <VisaoFinanceira dados={dados} />}
      </ScrollView>
      <BarraNavegacao />
    </TelaAnimada>;
}
