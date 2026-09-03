import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { api } from '../src/api/client';
import { useFinance } from '../src/data/Finance';
import { apiStyles as styles, keyboardStyles } from '../src/styles';
export default function Recorrencias() {
  const finance = useFinance();
  const [items, setItems] = useState([]),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const load = () => api('/recorrencias').then(setItems);
  useEffect(() => {
    load().catch(e => setError(e.message));
  }, []);
  async function action(path, method) {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await api(path, {
        method
      });
      await load();
      await finance.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return <View style={keyboardStyles.screen}><ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.title}>Lançamentos recorrentes</Text>
    <Text style={styles.message}>As repetições são lançadas como pendentes. Confirme o pagamento ou recebimento no fluxo financeiro.</Text>
    <TouchableOpacity style={styles.button} disabled={busy} onPress={() => action('/recorrencias/processar', 'POST')}><Text style={styles.buttonText}>Processar vencimentos</Text></TouchableOpacity>
    {!!error && <Text style={styles.error}>{error}</Text>}
    {items.map(item => <View key={item.id_recorrencia} style={styles.card}>
      <Text style={styles.title}>{finance.transacoes.find(x => x.id_transacao === item.id_transacao_origem)?.descricao || 'Transação'}</Text>
      <Text style={styles.message}>{item.frequencia} · {item.ativa ? 'Ativa' : 'Encerrada'}</Text>
      {item.ativa && <TouchableOpacity disabled={busy} onPress={() => action('/recorrencias/' + item.id_recorrencia, 'DELETE')}><Text style={styles.error}>Encerrar recorrência</Text></TouchableOpacity>}
    </View>)}
  </ScrollView></View>;
}
