import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AnimatedCard, AnimatedScreen } from '../components/AnimatedScreen';
import styles from "../styles/recuperarSenha";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");

  const enviarCodigo = () => {

    alert("Código enviado para o e-mail!");
  };

  const verificarCodigo = () => {
    router.push("/auth/novaSenha");
  };

  return (
    <AnimatedScreen style={styles.container} delay={60}>
    <SafeAreaView style={styles.container}>
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
        >
          <Text style={styles.buttonText}>Enviar código</Text>
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

        <TouchableOpacity
          style={styles.button}
          onPress={verificarCodigo}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>


        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.voltar}>
            Voltar para o login
          </Text>
        </TouchableOpacity>
      </AnimatedCard>
    </SafeAreaView>
    </AnimatedScreen>
  );
}