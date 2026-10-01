import React from 'react';
import BarraNavegacao from "../componentes/BarraNavegacao";
import { CartaoAnimado, TelaAnimada } from "../componentes/TelaAnimada";
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useEstilosApp } from "../estilos/estilos";
export default function SobreApp() {
  const {
    cores,
    estilosCompartilhados,
    estilosSobreApp: estilos
  } = useEstilosApp();
  return <TelaAnimada style={estilos.recipiente} atraso={60}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilosCompartilhados.espacamentoInferior120}>
        <CartaoAnimado style={estilos.mainCartao} atraso={40}>
          <Text style={estilos.appNome}>Nexus Finance</Text>
        </CartaoAnimado>

        <CartaoAnimado style={estilos.featuresCartao} atraso={120}>
          <Text style={estilos.featuresTitulo}>Sua Gestão Financeira, Descomplicada</Text>

          <View style={estilos.destaqueLinha}>
            <View style={[estilos.destaqueIcone, estilosCompartilhados.destaqueRoxo]}>
              <Icon name="wallet-travel" size={22} color={cores.sobrePrimaria} />
            </View>
            <View style={estilos.destaqueTexts}>
              <Text style={estilos.destaqueTitulo}>Organização Completa</Text>
              <Text style={estilos.destaqueTexto}>
                Centralize todas as suas contas, receitas e despesas em um só lugar
              </Text>
            </View>
          </View>

          <View style={estilos.destaqueLinha}>
            <View style={[estilos.destaqueIcone, estilosCompartilhados.destaqueAzul]}>
              <Icon name="flag" size={22} color={cores.sobrePrimaria} />
            </View>
            <View style={estilos.destaqueTexts}>
              <Text style={estilos.destaqueTitulo}>Metas Financeiras</Text>
              <Text style={estilos.destaqueTexto}>Defina e acompanhe suas metas com facilidade.</Text>
            </View>
          </View>

          <View style={estilos.destaqueLinha}>
            <View style={[estilos.destaqueIcone, estilosCompartilhados.destaqueVioleta]}>
              <Icon name="insert-chart" size={22} color={cores.sobrePrimaria} />
            </View>
            <View style={estilos.destaqueTexts}>
              <Text style={estilos.destaqueTitulo}>Relatórios Detalhados</Text>
              <Text style={estilos.destaqueTexto}>Visualize seu progresso com gráficos claros.</Text>
            </View>
          </View>

          <View style={estilos.destaqueLinha}>
            <View style={[estilos.destaqueIcone, estilosCompartilhados.destaqueVermelho]}>
              <Icon name="sync-alt" size={22} color={cores.sobrePrimaria} />
            </View>
            <View style={estilos.destaqueTexts}>
              <Text style={estilos.destaqueTitulo}>Controle de Fluxo</Text>
              <Text style={estilos.destaqueTexto}>
                Entenda seu fluxo de caixa para um futuro financeiro saudável.
              </Text>
            </View>
          </View>
        </CartaoAnimado>

        <View style={estilos.informacoesCartao}>
          <View>
            <Text style={estilos.informacoesTitulo}>Seus registros</Text>
            <Text style={estilos.informacoesTexto}>
              Consulte suas receitas e despesas no Fluxo financeiro. Use Relatórios para acompanhar
              os totais por período.
            </Text>
          </View>
        </View>

        <View style={estilos.informacoesCartao}>
          <View>
            <Text style={estilos.informacoesTitulo}>Sua conta</Text>
            <Text style={estilos.informacoesTexto}>
              Suas categorias personalizadas e seus anexos ficam vinculados à sua conta. Para sair
              do aplicativo, use Encerrar sessão no Perfil.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={estilos.contatoCartao} activeOpacity={0.9} onPress={() => router.push('/menus/centralAjuda')}>
          <View style={estilos.contatoEsquerda}>
            <Icon name="person" size={20} color={cores.textoPrincipal} />
            <Text style={estilos.contatoTexto}>Central de ajuda</Text>
          </View>
          <Icon name="chevron-right" size={24} color={cores.textoPrincipal} />
        </TouchableOpacity>

        <View style={estilos.rodape}>
          <Text style={estilos.rodapeApp}>© Nexus Finance</Text>
          <Text style={estilos.rodapeCopy}>Copyright © 2026</Text>
        </View>
      </ScrollView>

      <BarraNavegacao />
    </TelaAnimada>;
}
