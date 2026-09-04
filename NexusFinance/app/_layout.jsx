import { Stack } from "expo-router";
import { SessionProvider, useSession } from "../contexts/SessionContext";
import { navigationScreenOptions } from "./styles/styles";

function Routes() {
  const { autenticado, carregando } = useSession();
  if (carregando) return null;

  return (
    <Stack screenOptions={navigationScreenOptions}>
      <Stack.Screen name="index" options={{ headerShown: false }} />

      <Stack.Protected guard={!autenticado}>
        <Stack.Screen name="auth/boasVindas" options={{ title: "Bem-vindo" }} />
        <Stack.Screen name="auth/login" options={{ title: "Entrar" }} />
        <Stack.Screen name="auth/cadastro" options={{ title: "Criar conta" }} />
        <Stack.Screen name="auth/criarSenha" options={{ title: "Criar senha" }} />
      </Stack.Protected>

      <Stack.Screen name="auth/recuperarSenha" options={{ title: "Recuperar senha" }} />
      <Stack.Screen name="auth/novaSenha" options={{ title: "Nova senha" }} />

      <Stack.Protected guard={autenticado}>
        <Stack.Screen name="receita/novaReceita" options={{ title: "Nova receita" }} />
        <Stack.Screen name="receita/editarReceita" options={{ title: "Editar receita" }} />
        <Stack.Screen name="despesa/novaDespesa" options={{ title: "Nova despesa" }} />
        <Stack.Screen name="despesa/editarDespesa" options={{ title: "Editar despesa" }} />
        <Stack.Screen name="menus/centralAjuda" options={{ title: "Central de ajuda" }} />
        <Stack.Screen name="menus/meuCadastro" options={{ title: "Meu cadastro" }} />
        <Stack.Screen name="menus/sobreApp" options={{ title: "Sobre o app" }} />
        <Stack.Screen name="(tabs)/configuracoes" options={{ title: "Configurações" }} />
        <Stack.Screen name="(tabs)/dashboard" options={{ title: "Dashboard" }} />
        <Stack.Screen name="(tabs)/fluxoFinanceiro" options={{ title: "Fluxo financeiro" }} />
        <Stack.Screen name="(tabs)/inicial" options={{ title: "Inicio" }} />
        <Stack.Screen name="(tabs)/metas" options={{ title: "Metas" }} />
        <Stack.Screen name="(tabs)/notificacoes" options={{ title: "Notificações" }} />
        <Stack.Screen name="(tabs)/perfil" options={{ title: "Perfil" }} />
        <Stack.Screen name="(tabs)/relatorios" options={{ title: "Relatórios" }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SessionProvider>
      <Routes />
    </SessionProvider>
  );
}
