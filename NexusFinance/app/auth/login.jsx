import React, { useState } from "react";
import { router } from "expo-router";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert, } from "react-native";
import { AnimatedCard, AnimatedScreen } from '../components/AnimatedScreen';
import styles from "../styles/login";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function criarConta() {
    router.push("/auth/cadastro");
  }

  function recuperarSenha() {
    router.push("/auth/recuperarSenha");
  }

  function entrar() {
    if (!email || !senha) {
      setErro("Preencha email e senha.");
      return;
    }
    setErro("");
    router.push("/inicial");
  }

  return (

    <AnimatedScreen style={styles.container} delay={60}>
      <Image
        source={require("../../assets/images/foto.png")}
        style={{
          alignSelf: "center",
          width: 150,
          height: 150,
          marginBottom: 60,
        }}
      />
      <AnimatedCard delay={80}>
      <Text style={styles.titulo}>Entrar</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        placeholder="Digite seu email"
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#666"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        value={senha}
        placeholder="Digite sua senha"
        onChangeText={setSenha}
        secureTextEntry
        placeholderTextColor="#666"
      />

      <TouchableOpacity>
        <Text style={styles.link2} onPress={recuperarSenha}>
          Esqueceu sua senha?
        </Text>
      </TouchableOpacity>

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <TouchableOpacity style={styles.botao} onPress={entrar}>
        <Text style={styles.textoBotao}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.link} onPress={criarConta}>
          Ainda não tenho conta
        </Text>
      </TouchableOpacity>
      </AnimatedCard>
    </AnimatedScreen>
  );
}