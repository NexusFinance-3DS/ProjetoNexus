import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SessionProvider, useSession } from '../src/data/Session';
import { FinanceProvider } from '../src/data/Finance';
import { stackScreenOptions, keyboardStyles } from '../src/styles';
function Routes() {
  const {
    user,
    booting
  } = useSession();
  if (booting) return <View style={keyboardStyles.screen}><ActivityIndicator color="#5145FF" /></View>;
  return <FinanceProvider key={user?.id_usuario || 'visitor'}><Navigation user={user} /></FinanceProvider>;
}
function Navigation({
  user
}) {
  return <Stack screenOptions={stackScreenOptions}>
    <Stack.Screen name="index" options={{
      headerShown: false
    }} />
    <Stack.Protected guard={!user}>
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
      <Stack.Screen name="auth/recuperarSenha" options={{
        title: 'Recuperar senha'
      }} />
      <Stack.Screen name="auth/novaSenha" options={{
        title: 'Nova senha'
      }} />
    </Stack.Protected>
    <Stack.Protected guard={!!user}>
      <Stack.Screen name="(tabs)/inicial" options={{
        title: 'Início'
      }} />
      <Stack.Screen name="(tabs)/dashboard" options={{
        title: 'Dashboard'
      }} />
      <Stack.Screen name="(tabs)/fluxoFinanceiro" options={{
        title: 'Fluxo financeiro'
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
      <Stack.Screen name="(tabs)/configuracoes" options={{
        title: 'Configurações'
      }} />
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
      <Stack.Screen name="menus/meuCadastro" options={{
        title: 'Meu cadastro'
      }} />
      <Stack.Screen name="menus/alterarSenha" options={{
        title: 'Alterar senha'
      }} />
      <Stack.Screen name="menus/centralAjuda" options={{
        title: 'Central de ajuda'
      }} />
      <Stack.Screen name="menus/sobreApp" options={{
        title: 'Sobre o app'
      }} />
      <Stack.Screen name="categoria" options={{
        title: 'Categorias'
      }} />
      <Stack.Screen name="contas" options={{
        title: 'Contas'
      }} />
      <Stack.Screen name="recorrencias" options={{
        title: 'Recorrências'
      }} />
    </Stack.Protected>
  </Stack>;
}
export default function RootLayout() {
  return <SessionProvider><KeyboardProvider><Routes /></KeyboardProvider></SessionProvider>;
}
