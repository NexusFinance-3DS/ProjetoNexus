import { KeyboardArea, FormScrollView, FormInput } from "../../components/FormLayout";
import { useState } from "react";
import {
  Text,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { AnimatedCard, AnimatedScreen } from '../components/AnimatedScreen';
import { apiRequest } from "../../services/api";
import { limparCadastroPendente, obterCadastroPendente } from "../../services/authFlow";
import { erroSenha } from "../../services/validations";
import { useAppStyles } from "../styles/styles";

const CriarSenha = () => {
  const { colors, criarSenhaStyles: styles, keyboardStyles } = useAppStyles();
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

        <Text style={styles.label}>Senha</Text>
        <FormInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor={colors.placeholder}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <Text style={styles.label}>Confirme sua senha</Text>
        <FormInput
          style={styles.input}
          placeholder="Confirme sua senha"
          placeholderTextColor={colors.placeholder}
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
    </FormScrollView>
    </KeyboardArea>
    </AnimatedScreen>
  );
};

export default CriarSenha;
