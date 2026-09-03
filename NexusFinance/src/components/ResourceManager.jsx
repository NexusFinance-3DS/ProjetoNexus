import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { api } from '../api/client';
import { useFinance } from '../data/Finance';
import { formatBRL, moneyInput } from '../data/format';
import KeyboardForm from './KeyboardForm';
import DataStatus from './DataStatus';
import { apiStyles as styles, keyboardStyles } from '../styles';
export default function ResourceManager({
  kind
}) {
  const finance = useFinance();
  const isAccount = kind === 'contas';
  const items = isAccount ? finance.contas : finance.categorias;
  const catalog = isAccount ? finance.catalogos.tipos_conta : finance.catalogos.tipos_transacao;
  const typeKey = isAccount ? 'id_tipo_conta' : 'id_tipo_transacao';
  const idKey = isAccount ? 'id_conta' : 'id_categoria';
  const [selected, setSelected] = useState(null);
  const [nome, setNome] = useState('');
  const [type, setType] = useState(null);
  const [balance, setBalance] = useState('0');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  function edit(item) {
    setSelected(item);
    setNome(item.nome);
    setType(item[typeKey]);
    setBalance(String(item.saldo_inicial || '0'));
  }
  function clear() {
    setSelected(null);
    setNome('');
    setType(null);
    setBalance('0');
  }
  async function save() {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const body = {
        nome,
        [typeKey]: Number(type || catalog?.[0]?.[typeKey]),
        ativa: true,
        ...(isAccount ? {
          saldo_inicial: moneyInput(balance)
        } : {
          icone: selected?.icone || 'category',
          cor: selected?.cor || '#5145FF'
        })
      };
      await api('/' + kind + (selected ? '/' + selected[idKey] : ''), {
        method: selected ? 'PUT' : 'POST',
        body
      });
      clear();
      await finance.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function archive(item) {
    if (busy) return;
    setBusy(true);
    try {
      await api('/' + kind + '/' + item[idKey], {
        method: 'DELETE'
      });
      await finance.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return <View style={keyboardStyles.screen}><KeyboardForm contentContainerStyle={styles.content}><DataStatus />
    <Text style={styles.title}>{selected ? 'Editar' : 'Adicionar'} {isAccount ? 'conta' : 'categoria'}</Text>
    <TextInput style={styles.input} placeholder="Nome" placeholderTextColor="#999" value={nome} onChangeText={setNome} />
    <Picker style={styles.picker} dropdownIconColor="#fff" selectedValue={type || catalog?.[0]?.[typeKey]} onValueChange={setType}>
      {(catalog || []).map(x => <Picker.Item key={x[typeKey]} label={x.nome} value={x[typeKey]} />)}</Picker>
    {isAccount && <><Text style={styles.label}>Saldo inicial</Text><TextInput style={styles.input} keyboardType="decimal-pad" value={balance} onChangeText={setBalance} /></>}
    {!!error && <Text style={styles.error}>{error}</Text>}
    <TouchableOpacity style={styles.button} disabled={busy} onPress={save}><Text style={styles.buttonText}>{busy ? 'Salvando...' : 'Salvar'}</Text></TouchableOpacity>
    {!!selected && <TouchableOpacity onPress={clear}><Text style={styles.link}>Cancelar edição</Text></TouchableOpacity>}
    {items.map(item => <View style={styles.card} key={item[idKey]}>
      <Text style={styles.title}>{item.nome}{!item.ativa ? ' (arquivada)' : ''}</Text>
      {isAccount && <Text style={styles.message}>Saldo: {formatBRL(item.saldo_atual)}</Text>}
      {!isAccount && item.padrao ? <Text style={styles.message}>Categoria padrão</Text> : <View style={styles.row}><TouchableOpacity onPress={() => edit(item)}><Text style={styles.link}>Editar</Text></TouchableOpacity>
          {item.ativa && <TouchableOpacity disabled={busy} onPress={() => archive(item)}><Text style={styles.error}>Arquivar</Text></TouchableOpacity>}</View>}
    </View>)}
  </KeyboardForm></View>;
}
