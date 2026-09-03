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
import { criarSenhaStyles as styles, keyboardStyles } from "../styles/styles";

const CriarSenha = () => {
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const Continuar = () => {
    router.push("/auth/login");
  };

  return (
    <AnimatedScreen style={styles.container} delay={60}>
    <KeyboardAvoidingView
      style={keyboardStyles.avoidingView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
    <ScrollView
      contentContainerStyle={keyboardStyles.centeredScrollContent}
      keyboardShouldPersistTaps="handled"
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

        <TouchableOpacity
          style={styles.button}
          onPress={Continuar}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </AnimatedCard>
    </ScrollView>
    </KeyboardAvoidingView>
    </AnimatedScreen>
  );
};

export default CriarSenha;
