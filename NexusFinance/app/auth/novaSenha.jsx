import { KeyboardArea, FormScrollView, FormInput } from "../../components/FormLayout";
import { useState } from "react";
import {
  Text,
  TouchableOpacity,
  } from "react-native";
import { router } from "expo-router";
import { AnimatedCard, AnimatedScreen } from '../components/AnimatedScreen';
import { apiRequest } from "../../services/api";
import { limparRecuperacaoPendente, obterRecuperacaoPendente } from "../../services/authFlow";
import { erroSenha } from "../../services/validations";
import { useAppStyles } from "../styles/styles";

export default function NovaSenha() {
  const { colors, keyboardStyles, novaSenhaStyles: styles } = useAppStyles();
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
    <AnimatedScreen maxWidth={560} style={styles.container} delay={60}>
    <KeyboardArea
      style={keyboardStyles.avoidingView}
    >
    <FormScrollView
      contentContainerStyle={keyboardStyles.centeredScrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <AnimatedCard style={styles.content} delay={80}>

        <Text style={styles.descricao}>
          Crie uma nova senha para acessar sua conta.
        </Text>

        <Text style={styles.label}>Nova senha</Text>

        <FormInput
          style={styles.input}
          placeholder="Digite sua nova senha"
          placeholderTextColor={colors.placeholder}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <Text style={styles.label}>Confirmar senha</Text>

        <FormInput
          style={styles.input}
          placeholder="Confirme sua nova senha"
          placeholderTextColor={colors.placeholder}
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
    </FormScrollView>
    </KeyboardArea>
    </AnimatedScreen>
  );
}
