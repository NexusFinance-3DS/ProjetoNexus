import { KeyboardArea, FormScrollView, FormInput } from "../../components/FormLayout";
import { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { AnimatedCard, AnimatedScreen } from '../components/AnimatedScreen';
import { apiRequest } from "../../services/api";
import { salvarRecuperacaoPendente } from "../../services/authFlow";
import { useAppStyles } from "../styles/styles";

export default function RecuperarSenha() {
  const { colors, keyboardStyles, recuperarSenhaStyles: styles } = useAppStyles();
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const enviarCodigo = async () => {
    setCarregando(true);
    setErro("");
    try {
      const resposta = await apiRequest("/auth/recuperar-senha", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      alert(resposta.mensagem);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  const verificarCodigo = async () => {
    setCarregando(true);
    setErro("");
    try {
      await apiRequest("/auth/validar-codigo", {
        method: "POST",
        body: JSON.stringify({ email, codigo }),
      });
      salvarRecuperacaoPendente({ email: email.trim().toLowerCase(), codigo });
      router.push("/auth/novaSenha");
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
          Digite seu e-mail para receber um código de recuperação.
        </Text>
        <View style={styles.inputContainer1}>
        <FormInput

          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor={colors.placeholder}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={enviarCodigo}
          disabled={carregando}
        >
          <Text style={styles.buttonText}>{carregando ? "Enviando..." : "Enviar código"}</Text>
        </TouchableOpacity>
        </View>

        <FormInput
          style={styles.input}
          placeholder="Digite o código"
          placeholderTextColor={colors.placeholder}
          keyboardType="number-pad"
          value={codigo}
          onChangeText={setCodigo}
        />

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={verificarCodigo}
          disabled={carregando}
        >
          <Text style={styles.buttonText}>{carregando ? "Aguarde..." : "Continuar"}</Text>
        </TouchableOpacity>


        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.voltar}>
            Voltar para o login
          </Text>
        </TouchableOpacity>
      </AnimatedCard>
    </FormScrollView>
    </KeyboardArea>
    </AnimatedScreen>
  );
}
