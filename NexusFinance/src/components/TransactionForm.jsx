import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import Icon from '@expo/vector-icons/MaterialIcons';
import { api } from '../api/client';
import { download, uploadAttachment } from '../api/files';
import { useFinance } from '../data/Finance';
import { moneyInput, isoDate, displayDate, localDate } from '../data/format';
import KeyboardForm from './KeyboardForm';
import DataStatus from './DataStatus';
import { novaReceitaStyles, novaDespesaStyles, navigationContentStyle, amountAlignmentStyle, transactionLabelStyle, notesInputStyle, flexFillStyle, apiStyles } from '../styles';
export default function TransactionForm({
  kind,
  id
}) {
  const styles = kind === 'Receita' ? novaReceitaStyles : novaDespesaStyles;
  const {
    contas,
    categorias,
    catalogos,
    refresh
  } = useFinance();
  const [form, setForm] = useState({
    valor: '',
    descricao: '',
    data_transacao: displayDate(localDate()),
    observacao: '',
    id_conta: null,
    id_categoria: null,
    confirmado: false,
    recorrente: false
  });
  const [attachments, setAttachments] = useState([]);
  const [asset, setAsset] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [savedId, setSavedId] = useState(null);
  const [recurrenceSaved, setRecurrenceSaved] = useState(false);
  const [loaded, setLoaded] = useState(!id);
  const type = catalogos.tipos_transacao?.find(x => x.nome === kind);
  const options = categorias.filter(x => x.id_tipo_transacao === type?.id_tipo_transacao && x.ativa);
  const activeAccounts = contas.filter(x => x.ativa);
  const set = (key, value) => setForm(f => ({
    ...f,
    [key]: value
  }));
  useEffect(() => {
    if (!id) return;
    let active = true;
    Promise.all([api('/transacoes/' + id), api('/transacoes/' + id + '/anexos')]).then(([item, files]) => {
      if (!active) return;
      if (item.tipo !== kind) throw new Error('Tipo de lançamento inválido.');
      setForm({
        ...item,
        valor: String(item.valor).replace('.', ','),
        data_transacao: displayDate(item.data_transacao),
        confirmado: item.status === 'Confirmada',
        recorrente: false
      });
      setAttachments(files);
      setLoaded(true);
    }).catch(e => {
      if (active) setError(e.message);
    });
    return () => {
      active = false;
    };
  }, [id, kind]);
  async function save() {
    if (busy || !loaded) return;
    setBusy(true);
    setError('');
    try {
      const state = catalogos.status_transacao?.find(x => x.nome === (form.confirmado ? 'Confirmada' : 'Pendente'));
      if (!type || !state) throw new Error('Aguarde o carregamento dos dados.');
      const body = {
        descricao: form.descricao,
        valor: moneyInput(form.valor),
        data_transacao: isoDate(form.data_transacao),
        observacao: form.observacao || null,
        id_conta: Number(form.id_conta || activeAccounts[0]?.id_conta),
        id_categoria: Number(form.id_categoria || options[0]?.id_categoria),
        id_tipo_transacao: type.id_tipo_transacao,
        id_status_transacao: state.id_status_transacao
      };
      const key = id || savedId;
      const transaction = await api(key ? '/transacoes/' + key : '/transacoes', {
        method: key ? 'PUT' : 'POST',
        body
      });
      setSavedId(transaction.id_transacao);
      if (form.recorrente && !id && !recurrenceSaved) {
        await api('/recorrencias', {
          method: 'POST',
          body: {
            id_transacao_origem: transaction.id_transacao,
            frequencia: 'mensal',
            data_inicio: body.data_transacao
          }
        });
        setRecurrenceSaved(true);
      }
      if (asset) {
        await uploadAttachment(transaction.id_transacao, asset);
        setAsset(null);
      }
      await refresh();
      router.replace('/fluxoFinanceiro');
    } catch (e) {
      setError(e.message + (savedId ? ' O lançamento já foi salvo; tente novamente para concluir.' : ''));
    } finally {
      setBusy(false);
    }
  }
  async function cancel() {
    if (busy) return;
    setBusy(true);
    try {
      await api('/transacoes/' + id, {
        method: 'DELETE'
      });
      await refresh();
      router.replace('/fluxoFinanceiro');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const pick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/png', 'image/jpeg'],
        copyToCacheDirectory: true
      });
      if (!result.canceled) setAsset(result.assets[0]);
    } catch (e) {
      setError(e.message);
    }
  };
  return <View style={styles.container}><KeyboardForm contentContainerStyle={navigationContentStyle}>
    <DataStatus />
    <View style={styles.addValor}><Text style={styles.titulo}>Adicione o valor:</Text>
      <TextInput style={[styles.InputValor, amountAlignmentStyle]} value={form.valor} onChangeText={v => set('valor', v)} keyboardType="decimal-pad" placeholder="R$ 0,00" placeholderTextColor="#3f3f3f" /></View>
    <View style={styles.inputFull}><Text style={transactionLabelStyle}>Descrição</Text>
      <TextInput style={styles.input} placeholder="Descrição" placeholderTextColor="#999" value={form.descricao} onChangeText={v => set('descricao', v)} /></View>
    <View style={styles.listItem}><View style={styles.iconBox}><Icon name="gavel" size={20} color="#fff" /></View>
      <View style={flexFillStyle}><Text style={styles.listItemText}>Status</Text><Text style={styles.listItemSub}>{form.confirmado ? kind === 'Receita' ? 'Recebida' : 'Paga' : 'Pendente'}</Text></View>
      <Switch value={form.confirmado} onValueChange={v => set('confirmado', v)} /></View>
    <View style={styles.inputFull}><Text style={transactionLabelStyle}>Data</Text>
      <TextInput style={styles.input} placeholder="DD/MM/AAAA" placeholderTextColor="#999" value={form.data_transacao} onChangeText={v => set('data_transacao', v)} keyboardType="numbers-and-punctuation" /></View>
    <View style={styles.inputFull}><Text style={transactionLabelStyle}>Categoria</Text>
      <Picker style={apiStyles.picker} dropdownIconColor="#fff" selectedValue={form.id_categoria || options[0]?.id_categoria} onValueChange={v => set('id_categoria', v)}>
        {options.map(x => <Picker.Item key={x.id_categoria} label={x.nome} value={x.id_categoria} />)}</Picker>
      <TouchableOpacity onPress={() => router.push('/categoria')}><Text style={apiStyles.link}>Gerenciar categorias</Text></TouchableOpacity></View>
    <View style={styles.inputFull}><Text style={transactionLabelStyle}>Conta</Text>
      <Picker style={apiStyles.picker} dropdownIconColor="#fff" selectedValue={form.id_conta || activeAccounts[0]?.id_conta} onValueChange={v => set('id_conta', v)}>
        {activeAccounts.map(x => <Picker.Item key={x.id_conta} label={x.nome} value={x.id_conta} />)}</Picker>
      <TouchableOpacity onPress={() => router.push('/contas')}><Text style={apiStyles.link}>Gerenciar contas</Text></TouchableOpacity></View>
    {!id && <View style={styles.listItem}><View style={flexFillStyle}><Text style={styles.listItemText}>{kind} fixa</Text><Text style={styles.listItemSub}>Repetir mensalmente como pendente</Text></View><Switch value={form.recorrente} onValueChange={v => set('recorrente', v)} /></View>}
    <View style={styles.inputFull}><Text style={transactionLabelStyle}>Observação (opcional)</Text><TextInput style={[styles.input, notesInputStyle]} multiline placeholder="Observação" placeholderTextColor="#999" value={form.observacao || ''} onChangeText={v => set('observacao', v)} /></View>
    <TouchableOpacity style={styles.listItem} onPress={pick}><Icon name="attach-file" size={20} color="#fff" /><Text style={styles.listItemText}>{asset?.name || 'Anexar PDF ou imagem'}</Text></TouchableOpacity>
    {attachments.map(x => <TouchableOpacity key={x.id_anexo} onPress={() => download('/anexos/' + x.id_anexo + '/download', x.nome_arquivo).catch(e => setError(e.message))}><Text style={apiStyles.link}>{x.nome_arquivo}</Text></TouchableOpacity>)}
    {!!error && <Text style={apiStyles.error}>{error}</Text>}
    <View style={styles.saveWrapper}><TouchableOpacity style={styles.saveButton} disabled={busy || !loaded} onPress={save}><Text style={styles.saveButtonText}>{busy ? 'Salvando...' : 'Salvar ' + kind.toLowerCase()}</Text></TouchableOpacity></View>
    {!!id && <TouchableOpacity disabled={busy} onPress={cancel}><Text style={apiStyles.error}>Cancelar lançamento</Text></TouchableOpacity>}
  </KeyboardForm></View>;
}
