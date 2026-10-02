import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { ProvedorSessao, useSessao } from "../contextos/ContextoSessao";
import { ProvedorTema } from "../contextos/ContextoTema";
import { useEstilosApp } from "../style/style";
function Rotas() {
  const {
    opcoesTelasNavegacao
  } = useEstilosApp();
  const {
    autenticado,
    carregando
  } = useSessao();
  if (carregando) return null;
  return <Stack screenOptions={opcoesTelasNavegacao}>
      <Stack.Screen name="index" options={{
      headerShown: false
    }} />

      <Stack.Protected guard={!autenticado}>
        <Stack.Screen name="auth/boasVindas" options={{
        title: 'Bem-vindo'
      }} />
        <Stack.Screen name="auth/login" options={{
        title: 'Entrar'
      }} />
        <Stack.Screen name="auth/cadastro" options={{
        title: 'Criar conta'
      }} />
        <Stack.Screen name="auth/criarSenha" options={{
        title: 'Criar senha'
      }} />
      </Stack.Protected>

      <Stack.Screen name="auth/recuperarSenha" options={{
      title: 'Recuperar senha'
    }} />
      <Stack.Screen name="auth/novaSenha" options={{
      title: 'Nova senha'
    }} />

      <Stack.Screen name="auth/alterarSenha" options={{
      title: 'Alterar senha'
    }} />

      <Stack.Protected guard={autenticado}>
        <Stack.Screen name="receita/novaReceita" options={{
        title: 'Nova receita'
      }} />
        <Stack.Screen name="receita/editarReceita" options={{
        title: 'Editar receita'
      }} />
        <Stack.Screen name="despesa/novaDespesa" options={{
        title: 'Nova despesa'
      }} />
        <Stack.Screen name="despesa/editarDespesa" options={{
        title: 'Editar despesa'
      }} />
        <Stack.Screen name="menus/centralAjuda" options={{
        title: 'Central de ajuda'
      }} />
        <Stack.Screen name="menus/meuCadastro" options={{
        title: 'Meu cadastro'
      }} />
        <Stack.Screen name="menus/sobreApp" options={{
        title: 'Sobre o app'
      }} />
        <Stack.Screen name="(tabs)/configuracoes" options={{
        title: 'Configurações'
      }} />
        <Stack.Screen name="(tabs)/categoria" options={{
        title: 'Categorias'
      }} />
        <Stack.Screen name="(tabs)/painel" options={{
        title: "Painel financeiro"
      }} />
        <Stack.Screen name="(tabs)/fluxoFinanceiro" options={{
        title: 'Fluxo financeiro'
      }} />
        <Stack.Screen name="(tabs)/inicial" options={{
        title: "In\xEDcio"
      }} />
        <Stack.Screen name="(tabs)/metas" options={{
        title: 'Metas'
      }} />
        <Stack.Screen name="(tabs)/notificacoes" options={{
        title: 'Notificações'
      }} />
        <Stack.Screen name="(tabs)/perfil" options={{
        title: 'Perfil'
      }} />
        <Stack.Screen name="(tabs)/relatorios" options={{
        title: 'Relatórios'
      }} />
      </Stack.Protected>
    </Stack>;
}
export default function LayoutPrincipal() {
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    document.documentElement.lang = 'pt-BR';
    document.documentElement.setAttribute('translate', 'no');
    document.documentElement.classList.add('notranslate');
  }, []);
  return <ProvedorSessao>
      <ProvedorTema>
        <Rotas />
      </ProvedorTema>
    </ProvedorSessao>;
}
