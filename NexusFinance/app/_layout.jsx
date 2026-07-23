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
      <Stack.Screen
        name="auth/boasVindas"
        options={{ title: "Bem-vindo" }}
      />

      <Stack.Screen
        name="auth/login"
        options={{ title: "Entrar" }}
      />
      <Stack.Screen
        name="auth/cadastro"
        options={{ title: "Criar Conta" }}
      />
      <Stack.Screen
        name="(tabs)/inicial"
        options={{ title: "Início" }}
      />
      <Stack.Screen
        name="(tabs)/fluxoFinanceiro"
        options={{ title: "Fluxo Financeiro" }}
      />
      <Stack.Screen
        name="(tabs)/metas"
        options={{ title: "Metas" }}
      />
    </Stack>
  );
}