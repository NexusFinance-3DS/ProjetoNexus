import React, { createContext } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useTema, useEstilosTema } from "../contextos/ContextoTema";
export const ContextoAlturaCabecalho = createContext(0);
const titulos = {
  'auth/login': 'Entrar',
  'auth/cadastro': 'Criar conta',
  'auth/criarSenha': 'Criar senha',
  'auth/recuperarSenha': 'Recuperar senha',
  'auth/novaSenha': 'Nova senha',
  'receita/novaReceita': 'Nova receita',
  'receita/editarReceita': 'Editar receita',
  'despesa/novaDespesa': 'Nova despesa',
  'despesa/editarDespesa': 'Editar despesa',
  'menus/centralAjuda': 'Central de ajuda',
  'menus/meuCadastro': 'Meu cadastro',
  'menus/sobreApp': 'Sobre o app',
  configuracoes: 'Configurações',
  categoria: 'Categorias',
  painel: "Painel financeiro",
  fluxoFinanceiro: 'Fluxo financeiro',
  metas: 'Minhas metas',
  notificacoes: 'Notificações',
  perfil: 'Perfil',
  relatorios: 'Relatórios'
};
export default function CabecalhoTela({
  onLayout: aoMedir
}) {
  const {
    cores
  } = useTema();
  const estilos = useEstilosTema(criarEstilos);
  const rota = useRoute();
  const nome = rota.name.replace(/^\(tabs\)\//, '');
  const titulo = titulos[nome];
  // Início e boas-vindas já possuem seu próprio cabeçalho.
  if (!titulo) return null;
  function voltar() {
    if (router.canGoBack()) router.back();else router.replace(nome.startsWith('auth/') ? '/auth/boasVindas' : '/inicial');
  }
  return <View style={estilos.cabecalho} onLayout={aoMedir}>
      <Pressable accessibilityRole="button" accessibilityLabel="Voltar" onPress={voltar} style={({
      pressed
    }) => [estilos.voltar, pressed && estilos.pressionado]}>
        <Icon name="arrow-back" size={26} color={cores.textoPrincipal} />
      </Pressable>
      <Text accessibilityRole="header" style={estilos.titulo}>
        {titulo}
      </Text>
    </View>;
}
const criarEstilos = cores => StyleSheet.create({
  cabecalho: {
    minHeight: 60,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  voltar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pressionado: {
    backgroundColor: cores.pressionado
  },
  titulo: {
    flex: 1,
    color: cores.textoPrincipal,
    fontSize: 21,
    fontWeight: '600'
  }
});
