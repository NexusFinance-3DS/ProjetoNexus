import { useSession } from '../../src/data/Session';
import { apiStyles, keyboardStyles, criarSenhaStyles as styles } from '../../src/styles';
import KeyboardForm from '../../src/components/KeyboardForm';
import { useState } from "react";
import { Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AnimatedCard, AnimatedScreen } from '../../src/components/AnimatedScreen';
const CriarSenha = () => {
  const session = useSession();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const Continuar = async () => {
    if (busy) return;
    setBusy(true);
    setMessage('');
    try {
      if (!session.draft) throw new Error('Volte e preencha o cadastro.');
      if (senha !== confirmarSenha) throw new Error('As senhas não conferem.');
      await session.register({
        ...session.draft,
        senha
      });
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
        <Text style={styles.title}>Crie sua senha</Text>

        <Text style={styles.label}>Senha</Text>
        <TextInput style={styles.input} placeholder="Digite sua senha" placeholderTextColor="#777" secureTextEntry value={senha} onChangeText={setSenha} />

        <Text style={styles.label}>Confirme sua senha</Text>
        <TextInput style={styles.input} placeholder="Confirme sua senha" placeholderTextColor="#777" secureTextEntry value={confirmarSenha} onChangeText={setConfirmarSenha} />

        <TouchableOpacity style={styles.button} disabled={busy} onPress={Continuar}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </AnimatedCard>
    </SafeAreaView>
    {!!message && <Text style={apiStyles.error}>{message}</Text>}
      {busy && <Text style={apiStyles.message}>Aguarde...</Text>}
    </KeyboardForm>
    </AnimatedScreen>;
};
export default CriarSenha;
