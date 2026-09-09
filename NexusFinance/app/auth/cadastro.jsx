import { KeyboardArea, FormScrollView, FormInput } from "../../components/FormLayout";
import { useState } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { AnimatedScreen } from '../components/AnimatedScreen';
import { salvarCadastroPendente } from "../../services/authFlow";
import { validarCpf, validarDataNascimento, validarEmail } from "../../services/validations";
import { useAppStyles } from "../styles/styles";

export default function Cadastro() {
  const { colors, cadastroStyles: styles, keyboardStyles, sharedStyles } = useAppStyles();
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
      <Image source={require("../../assets/images/foto.png")} style={sharedStyles.loginLogo} resizeMode="contain" accessibilityLabel="Imagem de perfil" />
      <View style={keyboardStyles.authForm}>


        <FormInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.placeholder}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <FormInput
          style={styles.input}
          placeholder="CPF"
          placeholderTextColor={colors.placeholder}
          keyboardType="numeric"
          value={cpf}
          onChangeText={setCpf}
        />

        <FormInput
          style={styles.input}
          placeholder="Nome completo"
          placeholderTextColor={colors.placeholder}
          value={nome}
          onChangeText={setNome}
        />

        <FormInput
          style={styles.input}
          placeholder="Data de nascimento (DD/MM/AAAA)"
          placeholderTextColor={colors.placeholder}
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
      </View>
      </FormScrollView>
      </KeyboardArea>
    </AnimatedScreen>
  );
}
