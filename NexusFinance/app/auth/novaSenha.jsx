import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { AnimatedCard, AnimatedScreen } from '../components/AnimatedScreen';
import { apiRequest } from "../../services/api";
import { limparRecuperacaoPendente, obterRecuperacaoPendente } from "../../services/authFlow";
import { erroSenha } from "../../services/validations";
import { keyboardStyles, novaSenhaStyles as styles } from "../styles/styles";

export default function NovaSenha() {
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const alterarSenha = async () => {
    const recuperacao = obterRecuperacaoPendente();
    if (!recuperacao) return setErro("Valide o código de recuperação novamente.");
    const mensagemSenha = erroSenha(senha);
    if (mensagemSenha) return setErro(mensagemSenha);
    if (senha !== confirmarSenha) return setErro("As senhas não coincidem.");

    setCarregando(true);
    setErro("");
    try {
      await apiRequest("/auth/nova-senha", {
        method: "POST",
        body: JSON.stringify({ ...recuperacao, senha, confirmarSenha }),
      });
      limparRecuperacaoPendente();
      alert("Senha alterada com sucesso!");
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
        <Text style={styles.title}>Nova senha</Text>

        <Text style={styles.descricao}>
          Crie uma nova senha para acessar sua conta.
        </Text>

        <Text style={styles.label}>Nova senha</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite sua nova senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <Text style={styles.label}>Confirmar senha</Text>

        <TextInput
          style={styles.input}
          placeholder="Confirme sua nova senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={alterarSenha}
          disabled={carregando}
        >
          <Text style={styles.buttonText}>{carregando ? "Salvando..." : "Salvar senha"}</Text>
        </TouchableOpacity>
      </AnimatedCard>
    </ScrollView>
    </KeyboardAvoidingView>
    </AnimatedScreen>
  );
}
