import { useSession } from '../../src/data/Session';
import { apiStyles, keyboardStyles, loginLogoStyle, loginStyles as styles } from '../../src/styles';
import KeyboardForm from '../../src/components/KeyboardForm';
import { useState } from "react";
import { router } from "expo-router";
import { Text, Image, TextInput, TouchableOpacity } from "react-native";
import { AnimatedCard, AnimatedScreen } from '../../src/components/AnimatedScreen';
export default function Login() {
  const session = useSession();
  const [busy, setBusy] = useState(false);
  const [message] = useState('');
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  function criarConta() {
    router.push("/auth/cadastro");
  }
  function recuperarSenha() {
    router.push("/auth/recuperarSenha");
  }
  async function entrar() {
    if (busy) return;
    setBusy(true);
    setErro('');
    try {
      await session.login({
        email,
        senha
      });
    } catch (e) {
      setErro(e.message);
    } finally {
      setBusy(false);
    }
  }
  return <AnimatedScreen style={keyboardStyles.screen} delay={60}>
      <KeyboardForm contentContainerStyle={styles.container}>
      <Image source={require("../../assets/images/foto.png")} style={loginLogoStyle} />
      <AnimatedCard delay={80}>
      <Text style={styles.titulo}>Entrar</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} placeholder="Digite seu email" onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholderTextColor="#666" />

      <Text style={styles.label}>Senha</Text>
      <TextInput style={styles.input} value={senha} placeholder="Digite sua senha" onChangeText={setSenha} secureTextEntry placeholderTextColor="#666" />

      <TouchableOpacity>
        <Text style={styles.link2} onPress={recuperarSenha}>
          Esqueceu sua senha?
        </Text>
      </TouchableOpacity>

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <TouchableOpacity style={styles.botao} disabled={busy} onPress={entrar}>
        <Text style={styles.textoBotao}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.link} onPress={criarConta}>
          Ainda não tenho conta
        </Text>
      </TouchableOpacity>
      </AnimatedCard>
    {!!message && <Text style={apiStyles.error}>{message}</Text>}
      {busy && <Text style={apiStyles.message}>Aguarde...</Text>}
    </KeyboardForm>
    </AnimatedScreen>;
}
