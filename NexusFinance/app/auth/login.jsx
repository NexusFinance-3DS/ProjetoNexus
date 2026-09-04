import React, { useState } from "react";
import { router } from "expo-router";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { AnimatedCard, AnimatedScreen } from '../components/AnimatedScreen';
import { apiRequest } from "../../services/api";
import { useSession } from "../../contexts/SessionContext";
import { keyboardStyles, loginStyles as styles, sharedStyles } from "../styles/styles";

export default function Login() {
  const { iniciarSessao } = useSession();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function criarConta() {
    router.push("/auth/cadastro");
  }

  function recuperarSenha() {
    router.push("/auth/recuperarSenha");
  }

  async function entrar() {
    if (!email || !senha) {
      setErro("Preencha email e senha.");
      return;
    }

    setCarregando(true);
    setErro("");
    try {
      const resposta = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, senha }),
      });
      await iniciarSessao(resposta.token, resposta.usuario);
      router.replace("/inicial");
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (

    <AnimatedScreen style={styles.container} delay={60}>
      <KeyboardAvoidingView
        style={keyboardStyles.avoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={keyboardStyles.centeredScrollContent}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
          showsVerticalScrollIndicator={false}
        >
      <Image
        source={require("../../assets/images/foto.png")}
        style={sharedStyles.loginLogo}
      />
      <AnimatedCard delay={80}>
      <Text style={styles.titulo}>Entrar</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        placeholder="Digite seu email"
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#666"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        value={senha}
        placeholder="Digite sua senha"
        onChangeText={setSenha}
        secureTextEntry
        placeholderTextColor="#666"
      />

      <TouchableOpacity>
        <Text style={styles.link2} onPress={recuperarSenha}>
          Esqueceu sua senha?
        </Text>
      </TouchableOpacity>

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <TouchableOpacity style={styles.botao} onPress={entrar} disabled={carregando}>
        <Text style={styles.textoBotao}>{carregando ? "Entrando..." : "Entrar"}</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.link} onPress={criarConta}>
          Ainda não tenho conta
        </Text>
      </TouchableOpacity>
      </AnimatedCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </AnimatedScreen>
  );
}
