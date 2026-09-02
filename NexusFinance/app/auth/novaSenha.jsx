import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AnimatedCard, AnimatedScreen } from '../components/AnimatedScreen';
import styles from "../styles/novaSenha";

export default function NovaSenha() {
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const alterarSenha = () => {
    // Aqui será feita a alteração da senha
    alert("Senha alterada com sucesso!");
    router.replace("/auth/login");
  };

  return (
    <AnimatedScreen style={styles.container} delay={60}>
    <SafeAreaView style={styles.container}>
      <AnimatedCard style={styles.content} delay={80}>
        <Text style={styles.title}>Nova senha</Text>

        <Text style={styles.descricao}>
          Crie uma nova senha para acessar sua conta.
        </Text>

        <Text style={styles.label}>Nova senha</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite sua nova senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <Text style={styles.label}>Confirmar senha</Text>

        <TextInput
          style={styles.input}
          placeholder="Confirme sua nova senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={alterarSenha}
        >
          <Text style={styles.buttonText}>Salvar senha</Text>
        </TouchableOpacity>
      </AnimatedCard>
    </SafeAreaView>
    </AnimatedScreen>
  );
}