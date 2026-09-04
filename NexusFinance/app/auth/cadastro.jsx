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
import { salvarCadastroPendente } from "../../services/authFlow";
import { validarCpf, validarDataNascimento, validarEmail } from "../../services/validations";
import { cadastroStyles as styles, keyboardStyles } from "../styles/styles";

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [erro, setErro] = useState("");

  const continuar = () => {
    if (nome.trim().length < 3) return setErro("Informe o nome completo.");
    if (!validarEmail(email)) return setErro("Informe um e-mail válido.");
    if (!validarCpf(cpf)) return setErro("Informe um CPF válido.");
    if (!validarDataNascimento(dataNascimento)) return setErro("Use uma data válida no formato DD/MM/AAAA.");

    setErro("");
    salvarCadastroPendente({
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      cpf,
      dataNascimento,
    });
    router.push("/auth/criarSenha");
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
          placeholder="Data de nascimento (DD/MM/AAAA)"
          placeholderTextColor="#999"
          value={dataNascimento}
          onChangeText={setDataNascimento}
        />

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

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
