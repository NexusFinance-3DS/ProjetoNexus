import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { AnimatedCard, AnimatedScreen } from '../components/AnimatedScreen';
import { apiRequest } from "../../services/api";
import { salvarRecuperacaoPendente } from "../../services/authFlow";
import { keyboardStyles, recuperarSenhaStyles as styles } from "../styles/styles";

export default function RecuperarSenha() {
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
        <Text style={styles.title}>Recuperar senha</Text>

        <Text style={styles.descricao}>
          Digite seu e-mail para receber um código de recuperação.
        </Text>
        <View style={styles.inputContainer1}>
        <TextInput

          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#999"
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

        <TextInput
          style={styles.input}
          placeholder="Digite o código"
          placeholderTextColor="#999"
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
    </ScrollView>
    </KeyboardAvoidingView>
    </AnimatedScreen>
  );
}
