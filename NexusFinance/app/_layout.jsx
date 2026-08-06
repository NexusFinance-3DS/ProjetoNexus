import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#141414",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "600",
        },
        contentStyle: {
          backgroundColor: "#000",
        },
      }}
    >
      <Stack.Screen name="auth/boasVindas" options={{ title: "Bem-vindo" }} />
      <Stack.Screen name="auth/login" options={{ title: "Entrar" }} />
      <Stack.Screen name="auth/cadastro" options={{ title: "Criar conta" }} />
      <Stack.Screen name="auth/criarSenha" options={{ title: "Criar senha" }} />
      <Stack.Screen name="auth/recuperarSenha" options={{ title: "Recuperar senha" }} />
      <Stack.Screen name="auth/novaSenha" options={{ title: "Nova senha" }} />

      <Stack.Screen name="receita/novaReceita" options={{ title: "Nova receita" }} />
      <Stack.Screen name="receita/editarReceita" options={{ title: "Editar receita" }} />

      <Stack.Screen name="despesa/novaDespesa" options={{ title: "Nova despesa" }} />
      <Stack.Screen name="despesa/editarDespesa" options={{ title: "Editar despesa" }} />

      <Stack.Screen name="menus/centralAjuda" options={{ title: "Central de ajuda" }} />
      <Stack.Screen name="menus/meuCadastro" options={{ title: "Meu cadastro" }} />
      <Stack.Screen name="menus/notificações" options={{ title: "Notificações" }} />
      <Stack.Screen name="menus/relatorios" options={{ title: "Relatórios" }} />
      <Stack.Screen name="menus/sobreApp" options={{ title: "Sobre o app" }} />

      <Stack.Screen name="(tabs)/configuracoes" options={{ title: "Configurações" }} />
      <Stack.Screen name="(tabs)/dashboard" options={{ title: "Dashboard" }} />
      <Stack.Screen name="(tabs)/fluxoFinanceiro" options={{ title: "Fluxo financeiro" }} />
      <Stack.Screen name="(tabs)/inicial" options={{ title: "Início" }} />
      <Stack.Screen name="(tabs)/metas" options={{ title: "Metas" }} />
      <Stack.Screen name="(tabs)/notificacoes" options={{ title: "Notificações" }} />
      <Stack.Screen name="(tabs)/perfil" options={{ title: "Perfil" }} />
      <Stack.Screen name="(tabs)/relatorios" options={{ title: "Relatórios" }} />
    </Stack>
  );
}
