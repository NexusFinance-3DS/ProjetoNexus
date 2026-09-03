import { useSession } from '../../src/data/Session';
import { isoDate } from '../../src/data/format';
import { apiStyles, keyboardStyles, cadastroStyles as styles } from '../../src/styles';
import KeyboardForm from '../../src/components/KeyboardForm';
import { useState } from "react";
import { Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AnimatedCard, AnimatedScreen } from '../../src/components/AnimatedScreen';
export default function Cadastro() {
  const session = useSession();
  const [busy] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const continuar = async () => {
    try {
      if (!nome.trim() || !email.trim()) throw new Error('Informe nome e email.');
      session.setDraft({
        nome,
        email,
        cpf: cpf || null,
        data_nascimento: isoDate(dataNascimento)
      });
      router.push('/auth/criarSenha');
    } catch (e) {
      setMessage(e.message);
    }
  };
  return <AnimatedScreen style={keyboardStyles.screen} delay={60}>
      <KeyboardForm contentContainerStyle={styles.container}>
      <SafeAreaView style={[styles.container, keyboardStyles.content]}>
      <AnimatedCard style={styles.content} delay={80}>
        <Text style={styles.title}>Crie sua conta</Text>

        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#999" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />

        <TextInput style={styles.input} placeholder="CPF" placeholderTextColor="#999" keyboardType="numeric" value={cpf} onChangeText={setCpf} />

        <TextInput style={styles.input} placeholder="Nome completo" placeholderTextColor="#999" value={nome} onChangeText={setNome} />

        <TextInput style={styles.input} placeholder="Data de nascimento" placeholderTextColor="#999" value={dataNascimento} onChangeText={setDataNascimento} />

        <TouchableOpacity style={styles.button} disabled={busy} onPress={continuar}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </AnimatedCard>
    </SafeAreaView>
    {!!message && <Text style={apiStyles.error}>{message}</Text>}
      {busy && <Text style={apiStyles.message}>Aguarde...</Text>}
    </KeyboardForm>
    </AnimatedScreen>;
}
