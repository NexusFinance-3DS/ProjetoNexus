import React, { useState } from 'react';
import BarraNavegacao from "../../componentes/BarraNavegacao";
import { CartaoAnimado, TelaAnimada } from "../../componentes/TelaAnimada";
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useEstilosApp } from "../../style/style";
export default function CentralAjuda() {
  const [perguntaAberta, setPerguntaAberta] = useState(null);
  const {
    cores,
    estilosCentralAjuda: estilos,
    estilosCompartilhados
  } = useEstilosApp();
  const perguntas = [
    {
      id: 'receita', icone: 'trending-up', pergunta: 'Como registro uma receita?',
      resposta: 'Em qualquer tela, toque no botão + no centro da barra inferior e escolha Receitas. No formulário, informe a descrição, o valor e a data; depois escolha a conta e a categoria. Se a categoria não existir, você pode criá-la por ali. Toque em Salvar receita para incluir o recebimento no Fluxo.',
      rota: '/receita/novaReceita', acao: 'Cadastrar receita',
    },
    {
      id: 'despesa', icone: 'trending-down', pergunta: 'Como registro uma despesa?',
      resposta: 'Em qualquer tela, toque no botão + no centro da barra inferior e escolha Despesas. No formulário, informe a descrição, o valor e o vencimento; depois escolha a conta, a categoria e se a despesa já foi paga. Toque em Salvar despesa. Os lançamentos aparecem no Fluxo para você acompanhar.',
      rota: '/despesa/novaDespesa', acao: 'Cadastrar despesa',
    },
    {
      id: 'parcelas', icone: 'credit-card', pergunta: 'Como funciona um lançamento parcelado?',
      resposta: 'Toque no botão + no centro da barra inferior e escolha Receitas ou Despesas. No formulário do lançamento, ative a opção de parcelamento e informe a quantidade de parcelas. Depois de salvar, cada parcela aparece no Fluxo financeiro com sua posição no total, por exemplo, 2 de 6.',
      rota: '/fluxoFinanceiro', acao: 'Ver fluxo financeiro',
    },
    {
      id: 'fluxo', icone: 'swap-horiz', pergunta: 'Como acompanho o que está pago ou pendente?',
      resposta: 'Toque em Fluxo na barra inferior (ícone de setas). No alto da tela, escolha Geral, Receitas ou Despesas. Para filtrar, toque em Filtrar, selecione situação, conta ou categoria e toque em Aplicar. Lançamentos pendentes podem ser confirmados na própria lista quando essa opção estiver disponível.',
      rota: '/fluxoFinanceiro', acao: 'Abrir fluxo financeiro',
    },
    {
      id: 'categorias', icone: 'category', pergunta: 'Posso criar minhas próprias categorias?',
      resposta: 'Toque no botão + no centro da barra inferior e escolha Categoria. Nessa tela, adicione a categoria e indique se ela pertence a uma receita ou despesa. Depois ela estará disponível nos formulários de lançamento e nos filtros do Fluxo.',
      rota: '/categoria', acao: 'Gerenciar categorias',
    },
    {
      id: 'metas', icone: 'flag', pergunta: 'Como crio e acompanho uma meta?',
      resposta: 'Toque em Metas na barra inferior. Na tela de metas, escolha adicionar meta e informe o nome, o valor que deseja alcançar e quanto já guardou. O progresso também aparece no Painel financeiro.',
      rota: '/metas', acao: 'Abrir metas',
    },
    {
      id: 'painel', icone: 'bar-chart', pergunta: 'O que encontro no Painel financeiro?',
      resposta: 'Toque em Mais na barra inferior e escolha Painel financeiro. Lá você encontra receitas e despesas realizadas, evolução mensal, previsão do saldo, gastos por categoria, comparação com o período anterior e progresso das metas. Os valores previstos são estimativas; os realizados vêm dos lançamentos registrados.',
      rota: '/painel', acao: 'Abrir painel financeiro',
    },
  ];
  return <>
    <TelaAnimada style={estilos.recipiente} atraso={60}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilosCompartilhados.espacamentoInferior120}>
        <CartaoAnimado style={estilos.cartao} atraso={40}>
          <View style={{ paddingHorizontal: 18, paddingTop: 18, paddingBottom: 14 }}>
            <View style={{ width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: cores.primaria + '18', marginBottom: 12 }}>
              <Icon name="support-agent" size={26} color={cores.primaria} />
            </View>
            <Text style={[estilos.cartaoTitulo, { marginHorizontal: 0, marginTop: 0, marginBottom: 8 }]}>Como podemos ajudar?</Text>
            <Text style={estilos.cartaoInformacoesTexto}>Encontre orientações rápidas para organizar seus lançamentos, metas e análises financeiras.</Text>
          </View>
          <View style={{ marginHorizontal: 18, marginBottom: 16, padding: 14, borderRadius: 14, backgroundColor: cores.superficie, borderWidth: 1, borderColor: cores.borda }}>
            <Text style={{ color: cores.textoPrincipal, fontSize: 14, fontWeight: '700', marginBottom: 6 }}>Como se localizar no app</Text>
            <Text style={{ color: cores.textoSecundario, fontSize: 13, lineHeight: 20 }}>
              A barra de navegação fica na parte inferior. Toque em +, no centro, para abrir Receitas, Despesas ou Categorias. Use Fluxo para consultar movimentações, Metas para acompanhar objetivos e Mais para acessar o Painel financeiro, Perfil e Configurações.
            </Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 18, paddingBottom: 18 }}>
            {[
              { titulo: 'Nova receita', icone: 'trending-up', rota: '/receita/novaReceita' },
              { titulo: 'Nova despesa', icone: 'trending-down', rota: '/despesa/novaDespesa' },
              { titulo: 'Ver meu painel', icone: 'bar-chart', rota: '/painel' },
            ].map(atalho => (
              <TouchableOpacity key={atalho.rota} accessibilityRole="button" onPress={() => router.push(atalho.rota)} style={{ flexGrow: 1, minWidth: 140, minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 12, borderRadius: 14, backgroundColor: cores.primaria, }}>
                <Icon name={atalho.icone} size={19} color={cores.sobrePrimaria} />
                <Text style={{ color: cores.sobrePrimaria, fontSize: 13, fontWeight: '700' }}>{atalho.titulo}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={estilos.divisor} />
          <Text style={estilos.cartaoTitulo}>Dúvidas frequentes</Text>
          {perguntas.map((item, indice) => {
            const aberta = perguntaAberta === item.id;
            return <View key={item.id}>
              {indice > 0 ? <View style={estilos.divisor} /> : null}
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={{ expanded: aberta }}
                onPress={() => setPerguntaAberta(aberta ? null : item.id)}
                style={estilos.itemMenu}
              >
                <View style={estilos.itemEsquerda}>
                  <Icon name={item.icone} size={23} color={cores.primaria} />
                  <Text style={estilos.itemTexto}>{item.pergunta}</Text>
                </View>
                <Icon name={aberta ? 'expand-less' : 'expand-more'} size={24} color={cores.textoSecundario} />
              </TouchableOpacity>
              {aberta ? <View style={{ paddingHorizontal: 18, paddingBottom: 16 }}>
                <Text style={{ color: cores.textoSecundario, fontSize: 14, lineHeight: 21 }}>{item.resposta}</Text>
                <TouchableOpacity accessibilityRole="button" onPress={() => router.push(item.rota)} style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginTop: 6 }}>
                  <Text style={{ color: cores.textoLink, fontSize: 14, fontWeight: '700' }}>{item.acao}</Text>
                  <Icon name="arrow-forward" size={17} color={cores.textoLink} />
                </TouchableOpacity>
              </View> : null}
            </View>;
          })}
        </CartaoAnimado>

        <CartaoAnimado style={estilos.cartaoInformacoes} atraso={120}>
          <Text style={estilos.cartaoInformacoesTitulo}>Sobre o Nexus Finance</Text>
          <Text style={estilos.cartaoInformacoesTexto}>
            Consulte informações sobre o aplicativo e os recursos disponíveis.
          </Text>
        </CartaoAnimado>

        <TouchableOpacity accessibilityRole="button" style={estilos.contatoBotao} activeOpacity={0.8} onPress={() => router.push('/menus/sobreApp')}>
          <Icon name="info-outline" size={22} color={cores.sobrePrimaria} />
          <Text style={estilos.contatoTexto}>Ver informações do app</Text>
        </TouchableOpacity>
      </ScrollView>

      <BarraNavegacao />
    </TelaAnimada>
    </>;
}
