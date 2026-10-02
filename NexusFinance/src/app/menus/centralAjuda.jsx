import ModalAviso from "../../componentes/ModalAviso";
import React, { useState } from 'react';
import BarraNavegacao from "../../componentes/BarraNavegacao";
import { CartaoAnimado, TelaAnimada } from "../../componentes/TelaAnimada";
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useEstilosApp } from "../../style/style";
export default function CentralAjuda() {
  const [aviso, setAviso] = useState(null);
  const mostrarAjuda = (titulo, mensagem) => setAviso({
    titulo,
    mensagem
  });
  const {
    cores,
    estilosCentralAjuda: estilos,
    estilosCompartilhados
  } = useEstilosApp();
  return <>
    <TelaAnimada style={estilos.recipiente} atraso={60}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilosCompartilhados.espacamentoInferior120}>
        <CartaoAnimado style={estilos.cartao} atraso={40}>
          <Text style={estilos.cartaoTitulo}>Perguntas frequentes</Text>

          <TouchableOpacity style={estilos.itemMenu} activeOpacity={0.8} onPress={() => mostrarAjuda('Cadastrar uma despesa', 'Abra Nova despesa, informe o valor, a descrição e a data. Escolha o tipo de conta e a categoria. Você também pode anexar um arquivo de até 10 MB e marcar a despesa como paga ou fixa. Toque em Salvar despesa.')}>
            <View style={estilos.itemEsquerda}>
              <Icon name="help-outline" size={24} color={cores.textoPrincipal} />
              <Text style={estilos.itemTexto}>Como cadastrar uma despesa?</Text>
            </View>
            <Icon name="chevron-right" size={24} color={cores.textoPrincipal} />
          </TouchableOpacity>

          <View style={estilos.divisor} />

          <TouchableOpacity style={estilos.itemMenu} activeOpacity={0.8} onPress={() => mostrarAjuda('Criar uma meta', 'Abra Metas e toque em Adicionar Meta. Informe o nome, o valor desejado e quanto você já possui. Confirme em Salvar.')}>
            <View style={estilos.itemEsquerda}>
              <Icon name="help-outline" size={24} color={cores.textoPrincipal} />
              <Text style={estilos.itemTexto}>Como criar uma meta?</Text>
            </View>
            <Icon name="chevron-right" size={24} color={cores.textoPrincipal} />
          </TouchableOpacity>

          <View style={estilos.divisor} />

          <TouchableOpacity style={estilos.itemMenu} activeOpacity={0.8} onPress={() => mostrarAjuda('Registrar receita', 'Abra Nova receita, preencha os dados, selecione o tipo de conta e a categoria e toque em Salvar receita. Para uma categoria personalizada, toque em Adicionar nova categoria.')}>
            <View style={estilos.itemEsquerda}>
              <Icon name="help-outline" size={24} color={cores.textoPrincipal} />
              <Text style={estilos.itemTexto}>Como registrar receita?</Text>
            </View>
            <Icon name="chevron-right" size={24} color={cores.textoPrincipal} />
          </TouchableOpacity>

          <View style={estilos.divisor} />

          <TouchableOpacity style={estilos.itemMenu} activeOpacity={0.8} onPress={() => mostrarAjuda('Visualizar relatórios', 'Abra Relatórios no menu de navegação. Escolha Mês atual ou Últimos 6 meses para consultar receitas, despesas e economia.')}>
            <View style={estilos.itemEsquerda}>
              <Icon name="help-outline" size={24} color={cores.textoPrincipal} />
              <Text style={estilos.itemTexto}>Como visualizar relatórios?</Text>
            </View>
            <Icon name="chevron-right" size={24} color={cores.textoPrincipal} />
          </TouchableOpacity>
        </CartaoAnimado>

        <CartaoAnimado style={estilos.cartaoInformacoes} atraso={120}>
          <Text style={estilos.cartaoInformacoesTitulo}>Ainda precisa de ajuda?</Text>
          <Text style={estilos.cartaoInformacoesTexto}>
            Consulte as informações e os recursos do aplicativo.
          </Text>
        </CartaoAnimado>

        <TouchableOpacity style={estilos.contatoBotao} activeOpacity={0.8} onPress={() => router.push('/menus/sobreApp')}>
          <Icon name="chat-bubble-outline" size={24} color={cores.sobrePrimaria} />
          <Text style={estilos.contatoTexto}>Sobre o aplicativo</Text>
        </TouchableOpacity>
      </ScrollView>

      <BarraNavegacao />
    </TelaAnimada>
    <ModalAviso visivel={Boolean(aviso)} titulo={aviso?.titulo} mensagem={aviso?.mensagem} tipo="informacao" aoFechar={() => setAviso(null)} />
    </>;
}
