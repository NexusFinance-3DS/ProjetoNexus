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
import { cadastroStyles as styles, keyboardStyles } from "../styles/styles";

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  const continuar = () => {
    router.push("/auth/criarSenha");
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
        <Text style={styles.title}>Crie sua conta</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="CPF"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={cpf}
          onChangeText={setCpf}
        />

        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          placeholderTextColor="#999"
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          placeholder="Data de nascimento"
          placeholderTextColor="#999"
          value={dataNascimento}
          onChangeText={setDataNascimento}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={continuar}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </AnimatedCard>
      </ScrollView>
      </KeyboardAvoidingView>
    </AnimatedScreen>
  );
}
