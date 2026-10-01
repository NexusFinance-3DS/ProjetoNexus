import React from 'react';
import { Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { CartaoAnimado, TelaAnimada } from "../componentes/TelaAnimada";
import { useEstilosApp } from "../estilos/estilos";
export default function BoasVindas() {
  const {
    estilosBoasVindas: estilos,
    estilosTeclado
  } = useEstilosApp();
  function criarConta() {
    router.push('/auth/cadastro');
  }
  return <TelaAnimada larguraMaxima={560} style={estilos.tela} atraso={60}>
      <ScrollView contentContainerStyle={estilosTeclado.centralizadoRolagemConteudo} showsVerticalScrollIndicator={false}>
        <Image source={require('../../assets/images/moedas.png')} style={estilos.ilustracao} />
        <CartaoAnimado style={estilos.cartao} atraso={80}>
          <Text style={estilos.titulo}>Organize seus gastos de uma maneira mais eficiente!</Text>
          <Text style={estilos.subtitulo}>
            Controle seu orçamento e alcance suas metas financeiras com facilidade.
          </Text>

          <TouchableOpacity style={estilos.botao} onPress={criarConta}>
            <Text style={estilos.textoBotao}>Criar Conta</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={estilos.link}>Já tenho uma conta</Text>
          </TouchableOpacity>
        </CartaoAnimado>
      </ScrollView>
    </TelaAnimada>;
}
