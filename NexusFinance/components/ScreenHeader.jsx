import React, { createContext } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useTheme, useThemedStyles } from '../contexts/ThemeContext';

export const ScreenHeaderHeightContext = createContext(0);

const titles = {
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
  dashboard: 'Dashboard',
  fluxoFinanceiro: 'Fluxo financeiro',
  metas: 'Minhas metas',
  notificacoes: 'Notificações',
  perfil: 'Perfil',
  relatorios: 'Relatórios',
};

export default function ScreenHeader({ onLayout }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const route = useRoute();
  const name = route.name.replace(/^\(tabs\)\//, '');
  const title = titles[name];
  // Home and welcome already have their own introductory content.
  if (!title) return null;

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace(name.startsWith('auth/') ? '/auth/boasVindas' : '/inicial');
  }

  return (
    <View style={styles.header} onLayout={onLayout}>
      <Pressable accessibilityRole="button" accessibilityLabel="Voltar" onPress={goBack} style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
        <Icon name="arrow-back" size={26} color={colors.textPrimary} />
      </Pressable>
      <Text accessibilityRole="header" style={styles.title}>{title}</Text>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  header: { minHeight: 60, paddingHorizontal: 12, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 8 },
  back: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  pressed: { backgroundColor: colors.pressed },
  title: { flex: 1, color: colors.textPrimary, fontSize: 21, fontWeight: '600' },
});
