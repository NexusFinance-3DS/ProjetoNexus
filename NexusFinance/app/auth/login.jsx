import { KeyboardArea, FormScrollView, FormInput } from "../../components/FormLayout";
import React, { useState } from "react";
import { router } from "expo-router";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { AnimatedScreen } from '../components/AnimatedScreen';
import { apiRequest } from "../../services/api";
import { useSession } from "../../contexts/SessionContext";
import { useAppStyles } from "../styles/styles";

export default function Login() {
  const { colors, keyboardStyles, loginStyles: styles, sharedStyles } = useAppStyles();
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

    <AnimatedScreen animated={false} maxWidth={560} style={styles.container}>
      <KeyboardArea
        style={keyboardStyles.avoidingView}
      >
        <FormScrollView
          contentContainerStyle={keyboardStyles.authScrollContent}
          resetScrollOnKeyboardHide
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
      <Image
        source={require("../../assets/images/foto.png")}
        style={sharedStyles.loginLogo}
        resizeMode="contain"
        accessibilityLabel="Imagem de perfil"
      />
      <View style={keyboardStyles.authForm}>


      <Text style={styles.label}>Email</Text>
      <FormInput
        style={styles.input}
        value={email}
        placeholder="Digite seu email"
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor={colors.placeholder}
      />

      <Text style={styles.label}>Senha</Text>
      <FormInput
        style={styles.input}
        value={senha}
        placeholder="Digite sua senha"
        onChangeText={setSenha}
        secureTextEntry
        placeholderTextColor={colors.placeholder}
      />

      <TouchableOpacity accessibilityRole="button" onPress={recuperarSenha}>
        <Text style={styles.link2}>
          Esqueceu sua senha?
        </Text>
      </TouchableOpacity>

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <TouchableOpacity style={styles.botao} onPress={entrar} disabled={carregando}>
        <Text style={styles.textoBotao}>{carregando ? "Entrando..." : "Entrar"}</Text>
      </TouchableOpacity>

      <TouchableOpacity accessibilityRole="button" onPress={criarConta}>
        <Text style={styles.link}>
          Ainda não tenho conta
        </Text>
      </TouchableOpacity>
      </View>
        </FormScrollView>
      </KeyboardArea>
    </AnimatedScreen>
  );
}
