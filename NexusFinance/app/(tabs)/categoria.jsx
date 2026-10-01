import { useTema } from "../../contextos/ContextoTema";
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { TelaAnimada } from "../componentes/TelaAnimada";
import { SeletoresTransacao } from "../../componentes/OpcoesTransacao";
import { useOpcoesTransacao } from "../../ganchos/useOpcoesTransacao";
function CategoriasDoTipo({
  tipo
}) {
  const opcoes = useOpcoesTransacao(tipo);
  return <SeletoresTransacao opcoes={opcoes} mostrarTipoConta={false} />;
}
export default function Categorias() {
  const {
    cores
  } = useTema();
  const [tipo, setTipo] = useState('Receita');
  return <TelaAnimada larguraMaxima={560} style={{
    flex: 1,
    backgroundColor: cores.fundo
  }}>
      <ScrollView contentContainerStyle={{
      paddingVertical: 20,
      paddingBottom: 60
    }}>
        <View style={{
        flexDirection: 'row',
        gap: 12,
        marginHorizontal: 16,
        marginBottom: 24
      }}>
          {['Receita', 'Despesa'].map(item => <Pressable key={item} accessibilityRole="tab" accessibilityState={{
          selected: tipo === item
        }} onPress={() => setTipo(item)} style={{
          flex: 1,
          padding: 14,
          borderRadius: 12,
          backgroundColor: tipo === item ? cores.primaria : cores.campo
        }}>
              <Text style={{
            color: tipo === item ? cores.sobrePrimaria : cores.textoPrincipal,
            fontSize: 16,
            textAlign: 'center'
          }}>
                {item === 'Receita' ? 'Receitas' : 'Despesas'}
              </Text>
            </Pressable>)}
        </View>
        <CategoriasDoTipo key={tipo} tipo={tipo} />
      </ScrollView>
    </TelaAnimada>;
}
