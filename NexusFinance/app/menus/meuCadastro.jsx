import React, { useCallback, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import Icon from "@expo/vector-icons/MaterialIcons";
import { keyboardStyles, meuCadastroStyles as styles, sharedStyles } from "../styles/styles";
import { apiAutenticada } from "../../services/financeiro";
import { useSession } from "../../contexts/SessionContext";

export default function MeuCadastro() {
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
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={keyboardStyles.scrollContent} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}>
        <View style={styles.card}>
          <View style={styles.profileRow}><View style={styles.profileCircle}><Icon name="person" size={32} color="#5145FF" /></View><View style={styles.profileInfo}><Text style={styles.profileName}>{nome || "Usuário"}</Text><Text style={styles.profileEmail}>{email}</Text></View></View>
          <Text style={styles.profileSubtitle}>Estes dados são carregados diretamente do seu cadastro.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informações pessoais</Text>
          <TextInput style={styles.input} placeholder="Nome completo" placeholderTextColor="#999" value={nome} onChangeText={setNome} />
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#999" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          <TextInput style={styles.input} placeholder="CPF" placeholderTextColor="#999" value={cpf} editable={false} />
          <TextInput style={styles.input} placeholder="Telefone" placeholderTextColor="#999" keyboardType="phone-pad" value={telefone} onChangeText={setTelefone} />
          <TextInput style={styles.input} placeholder="Data (AAAA-MM-DD)" placeholderTextColor="#999" value={nascimento} onChangeText={setNascimento} />
        </View>
        <View style={styles.card}><Text style={styles.cardTitle}>Segurança</Text><TouchableOpacity style={styles.itemButton} onPress={() => router.push("/auth/recuperarSenha")} activeOpacity={0.8}><View style={styles.itemLeft}><Icon name="lock-outline" size={24} color="#FFF" /><Text style={styles.itemText}>Alterar senha</Text></View><Icon name="chevron-right" size={24} color="#FFF" /></TouchableOpacity></View>
        {erro ? <Text style={sharedStyles.errorText}>{erro}</Text> : null}
        <TouchableOpacity style={styles.saveButton} activeOpacity={0.8} onPress={salvarCadastro} disabled={salvando}><Text style={styles.saveButtonText}>{salvando ? "Salvando..." : "Salvar alterações"}</Text></TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
