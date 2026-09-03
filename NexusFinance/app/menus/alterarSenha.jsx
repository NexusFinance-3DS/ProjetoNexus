import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { api } from '../../src/api/client';
import { useSession } from '../../src/data/Session';
import KeyboardForm from '../../src/components/KeyboardForm';
import { apiStyles as styles, keyboardStyles } from '../../src/styles';
export default function AlterarSenha() {
  const session = useSession();
  const [atual, setAtual] = useState(''),
    [nova, setNova] = useState(''),
    [confirmar, setConfirmar] = useState(''),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  async function save() {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      if (nova !== confirmar) throw new Error('As senhas não conferem.');
      await api('/usuarios/me/senha', {
        method: 'PUT',
        body: {
          senha_atual: atual,
          senha: nova
        }
      });
      await session.clear();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return <View style={keyboardStyles.screen}><KeyboardForm contentContainerStyle={styles.content}>
  <Text style={styles.title}>Alterar senha</Text><Text style={styles.message}>Depois de salvar, entre novamente com a nova senha.</Text>
  <TextInput style={styles.input} secureTextEntry placeholder="Senha atual" placeholderTextColor="#999" value={atual} onChangeText={setAtual} />
  <TextInput style={styles.input} secureTextEntry placeholder="Nova senha" placeholderTextColor="#999" value={nova} onChangeText={setNova} />
  <TextInput style={styles.input} secureTextEntry placeholder="Confirmar nova senha" placeholderTextColor="#999" value={confirmar} onChangeText={setConfirmar} />
  {!!error && <Text style={styles.error}>{error}</Text>}<TouchableOpacity style={styles.button} disabled={busy} onPress={save}><Text style={styles.buttonText}>{busy ? 'Salvando...' : 'Salvar senha'}</Text></TouchableOpacity>
 </KeyboardForm></View>;
}
