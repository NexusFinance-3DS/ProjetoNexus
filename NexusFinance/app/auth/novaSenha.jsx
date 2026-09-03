import { useSession } from '../../src/data/Session';
import { api } from '../../src/api/client';
import { apiStyles, keyboardStyles, novaSenhaStyles as styles } from '../../src/styles';
import KeyboardForm from '../../src/components/KeyboardForm';
import { useState } from "react";
import { Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AnimatedCard, AnimatedScreen } from '../../src/components/AnimatedScreen';
export default function NovaSenha() {
  const session = useSession();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const alterarSenha = async () => {
    if (busy) return;
    setBusy(true);
    setMessage('');
    try {
      if (!session.recovery) throw new Error('Solicite um código de recuperação antes de continuar.');
      if (senha !== confirmarSenha) throw new Error('As senhas não conferem.');
      await api('/auth/redefinir-senha', {
        method: 'POST',
        body: {
          ...session.recovery,
          senha
        }
      });
      session.setRecovery(null);
      router.replace('/auth/login');
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  };
  return <AnimatedScreen style={keyboardStyles.screen} delay={60}>
      <KeyboardForm contentContainerStyle={styles.container}>
    <SafeAreaView style={[styles.container, keyboardStyles.content]}>
      <AnimatedCard style={styles.content} delay={80}>
        <Text style={styles.title}>Nova senha</Text>

        <Text style={styles.descricao}>
          Crie uma nova senha para acessar sua conta.
        </Text>

        <Text style={styles.label}>Nova senha</Text>

        <TextInput style={styles.input} placeholder="Digite sua nova senha" placeholderTextColor="#999" secureTextEntry value={senha} onChangeText={setSenha} />

        <Text style={styles.label}>Confirmar senha</Text>

        <TextInput style={styles.input} placeholder="Confirme sua nova senha" placeholderTextColor="#999" secureTextEntry value={confirmarSenha} onChangeText={setConfirmarSenha} />

        <TouchableOpacity style={styles.button} disabled={busy} onPress={alterarSenha}>
          <Text style={styles.buttonText}>Salvar senha</Text>
        </TouchableOpacity>
      </AnimatedCard>
    </SafeAreaView>
    {!!message && <Text style={apiStyles.error}>{message}</Text>}
      {busy && <Text style={apiStyles.message}>Aguarde...</Text>}
    </KeyboardForm>
    </AnimatedScreen>;
}
