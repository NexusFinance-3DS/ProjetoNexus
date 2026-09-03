import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, FlatList } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { AnimatedCard, AnimatedScreen } from '../../src/components/AnimatedScreen';
import BarraNavegacao from '../../src/components/BarraNavegacao';
import KeyboardForm from '../../src/components/KeyboardForm';
import DataStatus from '../../src/components/DataStatus';
import { useFinance } from '../../src/data/Finance';
import { api } from '../../src/api/client';
import { moneyInput, formatBRL } from '../../src/data/format';
import { keyboardStyles, goalProgressStyle, goalsContentStyle, metasStyles as styles, apiStyles } from '../../src/styles';
export default function Metas() {
  const {
    metas,
    refresh
  } = useFinance();
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [inicial, setInicial] = useState('0');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  function open(mode, item = null) {
    setSelected(item);
    setModal(mode);
    setNome(item?.nome || '');
    setValor(mode === 'edit' ? String(item.objetivo) : '');
    setInicial('0');
    setError('');
  }
  async function save() {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      if (modal === 'new') await api('/metas', {
        method: 'POST',
        body: {
          nome,
          valor_objetivo: moneyInput(valor),
          valor_inicial: moneyInput(inicial || '0')
        }
      });else if (modal === 'edit') await api('/metas/' + selected.id, {
        method: 'PUT',
        body: {
          nome,
          valor_objetivo: moneyInput(valor),
          descricao: selected.descricao,
          data_inicio: selected.data_inicio,
          data_prazo: selected.data_prazo,
          status: selected.status
        }
      });else await api('/metas/' + selected.id + '/movimentacoes', {
        method: 'POST',
        body: {
          tipo: modal,
          valor: moneyInput(valor)
        }
      });
      await refresh();
      setModal(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function cancel(item) {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await api('/metas/' + item.id, {
        method: 'DELETE'
      });
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const renderItem = ({
    item,
    index
  }) => {
    const percentage = Math.min(item.atual / item.objetivo * 100, 100);
    return <AnimatedCard style={styles.card} delay={Math.min(80 + index * 60, 400)}>
      <TouchableOpacity style={styles.cardHeader} onPress={() => open('edit', item)}><Icon name="track-changes" size={32} color="#5145FF" /><Text style={styles.nomeMeta}>{item.nome}</Text></TouchableOpacity>
      <View style={styles.progressBackground}><View style={[styles.progressFill, goalProgressStyle(percentage)]} /></View>
      <View style={styles.infoLinha}><Text style={styles.valor}>{formatBRL(item.atual)}</Text><Text style={styles.valor}>{formatBRL(item.objetivo)}</Text></View>
      <Text style={styles.porcentagem}>{percentage.toFixed(0)}%</Text>
      {item.status !== 'cancelada' ? <View style={apiStyles.row}>
        <TouchableOpacity onPress={() => open('deposito', item)}><Text style={apiStyles.link}>Depositar</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => open('retirada', item)}><Text style={apiStyles.link}>Retirar</Text></TouchableOpacity>
        <TouchableOpacity disabled={busy} onPress={() => cancel(item)}><Text style={apiStyles.error}>Cancelar</Text></TouchableOpacity>
      </View> : <Text style={apiStyles.message}>Meta cancelada</Text>}
    </AnimatedCard>;
  };
  return <AnimatedScreen style={styles.container} delay={60}><Text style={styles.title}>Minhas Metas</Text><DataStatus />
    {!!error && !modal && <Text style={apiStyles.error}>{error}</Text>}
    <FlatList data={metas} renderItem={renderItem} keyExtractor={item => item.id} contentContainerStyle={goalsContentStyle} showsVerticalScrollIndicator={false} />
    <TouchableOpacity style={styles.botaoAdicionar} onPress={() => open('new')}><Icon name="add" size={25} color="#fff" /><Text style={styles.botaoTexto}>Adicionar Meta</Text></TouchableOpacity>
    <Modal visible={!!modal} transparent animationType="fade" onRequestClose={() => {
      if (!busy) setModal(null);
    }}>
      <View style={keyboardStyles.modalBackdrop}><KeyboardForm contentContainerStyle={keyboardStyles.modalContent}><View style={styles.modal}>
        <Text style={styles.modalTitulo}>{modal === 'new' ? 'Nova Meta' : modal === 'edit' ? 'Editar Meta' : modal === 'deposito' ? 'Depositar na meta' : 'Retirar da meta'}</Text>
        {['new', 'edit'].includes(modal) && <TextInput style={styles.input} placeholder="Nome da meta" placeholderTextColor="#888" value={nome} onChangeText={setNome} />}
        <TextInput style={styles.input} placeholder={['new', 'edit'].includes(modal) ? 'Valor da meta' : 'Valor'} placeholderTextColor="#888" keyboardType="decimal-pad" value={valor} onChangeText={setValor} />
        {modal === 'new' && <TextInput style={styles.input} placeholder="Quanto você já possui?" placeholderTextColor="#888" keyboardType="decimal-pad" value={inicial} onChangeText={setInicial} />}
        {!!error && <Text style={apiStyles.error}>{error}</Text>}
        <View style={styles.modalButtons}><TouchableOpacity style={styles.cancelar} disabled={busy} onPress={() => setModal(null)}><Text style={styles.cancelarTexto}>Cancelar</Text></TouchableOpacity>
          <TouchableOpacity style={styles.salvar} disabled={busy} onPress={save}><Text style={styles.salvarTexto}>{busy ? 'Salvando...' : 'Salvar'}</Text></TouchableOpacity></View>
      </View></KeyboardForm></View>
    </Modal><BarraNavegacao />
  </AnimatedScreen>;
}
