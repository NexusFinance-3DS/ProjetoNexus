import { AnimatedScreen } from "../components/AnimatedScreen";
import { KeyboardArea, FormScrollView, FormInput } from "../../components/FormLayout";
import React, { useCallback, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import Icon from "@expo/vector-icons/MaterialIcons";
import { useAppStyles } from "../styles/styles";
import { apiAutenticada } from "../../services/financeiro";
import { useSession } from "../../contexts/SessionContext";

export default function MeuCadastro() {
  const { colors, keyboardStyles, meuCadastroStyles: styles, sharedStyles } = useAppStyles();
  const { setUsuario } = useSession();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useFocusEffect(useCallback(() => {
    let active = true;
    apiAutenticada("/usuarios/me").then(({ usuario }) => {
      if (!active) return;
      setNome(usuario.nome || "");
      setEmail(usuario.email || "");
      setCpf(usuario.cpf || "");
      setTelefone(usuario.telefone || "");
      setNascimento(usuario.dataNascimento || "");
    }).catch((error) => active && setErro(error.message));
    return () => { active = false; };
  }, []));

  async function salvarCadastro() {
    setSalvando(true);
    setErro("");
    try {
      const response = await apiAutenticada("/usuarios/me", {
        method: "PUT",
        body: JSON.stringify({ nome, email, telefone, dataNascimento: nascimento }),
      });
      setUsuario((current) => ({ ...current, nome, email }));
      Alert.alert("Sucesso", response.mensagem);
      router.replace("/perfil");
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <AnimatedScreen maxWidth={560} style={styles.container}>
    <KeyboardArea>
      <FormScrollView showsVerticalScrollIndicator={false} contentContainerStyle={keyboardStyles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={styles.profileRow}><View style={styles.profileCircle}><Icon name="person" size={32} color={colors.primary} /></View><View style={styles.profileInfo}><Text style={styles.profileName}>{nome || "Usuário"}</Text><Text style={styles.profileEmail}>{email}</Text></View></View>
          <Text style={styles.profileSubtitle}>Estes dados são carregados diretamente do seu cadastro.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informações pessoais</Text>
          <FormInput style={styles.input} placeholder="Nome completo" placeholderTextColor={colors.placeholder} value={nome} onChangeText={setNome} />
          <FormInput style={styles.input} placeholder="Email" placeholderTextColor={colors.placeholder} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          <FormInput style={styles.input} placeholder="CPF" placeholderTextColor={colors.placeholder} value={cpf} editable={false} />
          <FormInput style={styles.input} placeholder="Telefone" placeholderTextColor={colors.placeholder} keyboardType="phone-pad" value={telefone} onChangeText={setTelefone} />
          <FormInput style={styles.input} placeholder="Data (AAAA-MM-DD)" placeholderTextColor={colors.placeholder} value={nascimento} onChangeText={setNascimento} />
        </View>
        <View style={styles.card}><Text style={styles.cardTitle}>Segurança</Text><TouchableOpacity style={styles.itemButton} onPress={() => router.push("/auth/recuperarSenha")} activeOpacity={0.8}><View style={styles.itemLeft}><Icon name="lock-outline" size={24} color={colors.textPrimary} /><Text style={styles.itemText}>Alterar senha</Text></View><Icon name="chevron-right" size={24} color={colors.textPrimary} /></TouchableOpacity></View>
        {erro ? <Text style={sharedStyles.errorText}>{erro}</Text> : null}
        <TouchableOpacity style={styles.saveButton} activeOpacity={0.8} onPress={salvarCadastro} disabled={salvando}><Text style={styles.saveButtonText}>{salvando ? "Salvando..." : "Salvar alterações"}</Text></TouchableOpacity>
      </FormScrollView>
    </KeyboardArea>
    </AnimatedScreen>
  );
}
