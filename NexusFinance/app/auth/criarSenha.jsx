import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { AnimatedCard, AnimatedScreen } from '../components/AnimatedScreen';
import { apiRequest } from "../../services/api";
import { limparCadastroPendente, obterCadastroPendente } from "../../services/authFlow";
import { erroSenha } from "../../services/validations";
import { criarSenhaStyles as styles, keyboardStyles } from "../styles/styles";

const CriarSenha = () => {
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const continuar = async () => {
    const dadosCadastro = obterCadastroPendente();
    if (!dadosCadastro) {
      setErro("Os dados do cadastro não foram encontrados. Volte e preencha novamente.");
      return;
    }
    const mensagemSenha = erroSenha(senha);
    if (mensagemSenha) return setErro(mensagemSenha);
    if (senha !== confirmarSenha) return setErro("As senhas não coincidem.");

    setCarregando(true);
    setErro("");
    try {
      await apiRequest("/auth/cadastro", {
        method: "POST",
        body: JSON.stringify({ ...dadosCadastro, senha, confirmarSenha }),
      });
      limparCadastroPendente();
      alert("Cadastro realizado com sucesso!");
      router.replace("/auth/login");
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

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
      <AnimatedCard style={styles.content} delay={80}>
        <Text style={styles.title}>Crie sua senha</Text>

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor="#777"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <Text style={styles.label}>Confirme sua senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirme sua senha"
          placeholderTextColor="#777"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={continuar}
          disabled={carregando}
        >
          <Text style={styles.buttonText}>{carregando ? "Salvando..." : "Criar conta"}</Text>
        </TouchableOpacity>
      </AnimatedCard>
    </ScrollView>
    </KeyboardAvoidingView>
    </AnimatedScreen>
  );
};

export default CriarSenha;
