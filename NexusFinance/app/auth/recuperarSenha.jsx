import { useSession } from '../../src/data/Session';
import { api } from '../../src/api/client';
import { apiStyles, keyboardStyles, recuperarSenhaStyles as styles } from '../../src/styles';
import KeyboardForm from '../../src/components/KeyboardForm';
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AnimatedCard, AnimatedScreen } from '../../src/components/AnimatedScreen';
export default function RecuperarSenha() {
  const session = useSession();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const enviarCodigo = async () => {
    if (busy) return;
    setBusy(true);
    setMessage('');
    try {
      const result = await api('/auth/recuperar-senha', {
        method: 'POST',
        body: {
          email
        }
      });
      setMessage(result.mensagem);
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  };
  const verificarCodigo = async () => {
    if (busy) return;
    setBusy(true);
    setMessage('');
    try {
      await api('/auth/verificar-codigo', {
        method: 'POST',
        body: {
          email,
          codigo
        }
      });
      session.setRecovery({
        email,
        codigo
      });
      router.push('/auth/novaSenha');
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
        <Text style={styles.title}>Recuperar senha</Text>

        <Text style={styles.descricao}>
          Digite seu e-mail para receber um código de recuperação.
        </Text>
        <View style={styles.inputContainer1}>
        <TextInput style={styles.input} placeholder="Digite seu e-mail" placeholderTextColor="#999" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />

        <TouchableOpacity style={styles.button} disabled={busy} onPress={enviarCodigo}>
          <Text style={styles.buttonText}>Enviar código</Text>
        </TouchableOpacity>
        </View>

        <TextInput style={styles.input} placeholder="Digite o código" placeholderTextColor="#999" autoCapitalize="none" autoCorrect={false} value={codigo} onChangeText={setCodigo} />

        <TouchableOpacity style={styles.button} disabled={busy} onPress={verificarCodigo}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.voltar}>
            Voltar para o login
          </Text>
        </TouchableOpacity>
      </AnimatedCard>
    </SafeAreaView>
    {!!message && <Text style={apiStyles.error}>{message}</Text>}
      {busy && <Text style={apiStyles.message}>Aguarde...</Text>}
    </KeyboardForm>
    </AnimatedScreen>;
}
