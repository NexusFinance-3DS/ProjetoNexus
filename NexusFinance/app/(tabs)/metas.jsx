import { KeyboardArea, FormScrollView, FormInput } from '../../components/FormLayout';
import React, { useCallback, useRef, useState } from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialIcons';
import BarraNavegacao from '../components/BarraNavegacao';
import { AnimatedCard, AnimatedScreen } from '../components/AnimatedScreen';
import { useAppStyles } from '../styles/styles';
import { apiAutenticada, formatBRL } from '../../services/financeiro';

function valorParaInput(valor) {
  return Number(valor || 0).toFixed(2).replace('.', ',');
}

export default function Metas() {
  const { colors, keyboardStyles, metasStyles: styles, sharedStyles } = useAppStyles();
  const submitLock = useRef(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [metaSelecionada, setMetaSelecionada] = useState(null);
  const [metaParaExcluir, setMetaParaExcluir] = useState(null);
  const [nomeMeta, setNomeMeta] = useState('');
  const [valorMeta, setValorMeta] = useState('');
  const [valorAtual, setValorAtual] = useState('');
  const [metas, setMetas] = useState([]);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const carregarMetas = useCallback(async () => {
    try {
      const response = await apiAutenticada('/metas');
      setMetas(response.metas);
      setErro('');
    } catch (error) {
      setErro(error.message);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarMetas();
    }, [carregarMetas]),
  );

  function limparFormulario() {
    setNomeMeta('');
    setValorMeta('');
    setValorAtual('');
    setMetaSelecionada(null);
    setModoEdicao(false);
  }

  function fecharModal() {
    setModalVisible(false);
    setErro('');
    limparFormulario();
  }

  function abrirNovaMeta() {
    limparFormulario();
    setErro('');
    setModalVisible(true);
  }

  function abrirEdicao(item) {
    setMetaSelecionada(item);
    setModoEdicao(true);
    setNomeMeta(item.nome);
    setValorMeta(valorParaInput(item.objetivo));
    setValorAtual(valorParaInput(item.atual));
    setErro('');
    setModalVisible(true);
  }

  async function salvarMeta() {
    if (submitLock.current) return;
    submitLock.current = true;
    setSalvando(true);
    setErro('');

    try {
      const path = modoEdicao ? `/metas/${metaSelecionada.id}` : '/metas';
      await apiAutenticada(path, {
        method: modoEdicao ? 'PUT' : 'POST',
        body: JSON.stringify({ nome: nomeMeta, objetivo: valorMeta, atual: valorAtual || 0 }),
      });
      fecharModal();
      await carregarMetas();
    } catch (error) {
      setErro(error.message);
    } finally {
      submitLock.current = false;
      setSalvando(false);
    }
  }

  async function excluirMeta() {
    if (!metaParaExcluir || submitLock.current) return;
    submitLock.current = true;
    setExcluindo(true);
    setErro('');

    try {
      await apiAutenticada(`/metas/${metaParaExcluir.id}`, { method: 'DELETE' });
      setMetaParaExcluir(null);
      await carregarMetas();
    } catch (error) {
      setMetaParaExcluir(null);
      setErro(error.message);
    } finally {
      submitLock.current = false;
      setExcluindo(false);
    }
  }

  function renderItem({ item, index }) {
    const porcentagem = item.objetivo > 0 ? Math.min((item.atual / item.objetivo) * 100, 100) : 0;
    const concluida = item.status === 'concluida' || porcentagem >= 100;

    return (
      <AnimatedCard style={[styles.card, concluida && styles.cardConcluida]} delay={80 + index * 60}>
        <View style={styles.cardHeader}>
          <Icon
            name={concluida ? 'check-circle' : 'track-changes'}
            size={32}
            color={concluida ? colors.success : colors.primary}
          />
          <Text style={styles.nomeMeta}>{item.nome}</Text>
          <View style={styles.acoesCard}>
            <TouchableOpacity
              style={styles.botaoAcao}
              onPress={() => abrirEdicao(item)}
              accessibilityLabel={`Editar meta ${item.nome}`}
            >
              <Icon name="edit" size={21} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.botaoAcao}
              onPress={() => setMetaParaExcluir(item)}
              accessibilityLabel={`Excluir meta ${item.nome}`}
            >
              <Icon name="delete-outline" size={22} color={colors.danger} />
            </TouchableOpacity>
          </View>
        </View>

        {concluida ? (
          <View style={styles.concluidaBadge}>
            <Icon name="check" size={17} color={colors.success} />
            <Text style={styles.concluidaTexto}>Meta concluída</Text>
          </View>
        ) : null}

        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              concluida && styles.progressFillConcluida,
              { width: `${porcentagem}%` },
            ]}
          />
        </View>
        <View style={styles.infoLinha}>
          <Text style={styles.valor}>{formatBRL(item.atual)}</Text>
          <Text style={styles.valor}>{formatBRL(item.objetivo)}</Text>
        </View>
        <Text style={[styles.statusMeta, concluida && styles.statusConcluida]}>
          {concluida ? 'Concluída' : item.status === 'cancelada' ? 'Cancelada' : 'Em andamento'}
        </Text>
        <Text style={[styles.porcentagem, concluida && styles.porcentagemConcluida]}>
          {porcentagem.toFixed(0)}%
        </Text>
      </AnimatedCard>
    );
  }

  return (
    <AnimatedScreen style={styles.container} delay={60}>
      {erro && !modalVisible ? <Text style={sharedStyles.errorText}>{erro}</Text> : null}
      <FlatList
        data={metas}
        contentContainerStyle={sharedStyles.paddingBottom150}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={sharedStyles.errorText}>Nenhuma meta cadastrada.</Text>}
      />
      <TouchableOpacity style={styles.botaoAdicionar} onPress={abrirNovaMeta}>
        <Icon name="add" size={25} color={colors.onPrimary} />
        <Text style={styles.botaoTexto}>Adicionar Meta</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={fecharModal}>
        <KeyboardArea modal style={keyboardStyles.avoidingView}>
          <FormScrollView
            contentContainerStyle={[styles.modalBackground, keyboardStyles.modalScrollContent]}
            keyboardShouldPersistTaps="handled"
          >
            <AnimatedCard style={styles.modal} delay={30}>
              <Text style={styles.modalTitulo}>{modoEdicao ? 'Editar Meta' : 'Nova Meta'}</Text>
              <FormInput
                style={styles.input}
                maxLength={150}
                placeholder="Nome da meta"
                placeholderTextColor={colors.placeholder}
                value={nomeMeta}
                onChangeText={setNomeMeta}
              />
              <FormInput
                style={styles.input}
                placeholder="Valor da meta"
                placeholderTextColor={colors.placeholder}
                keyboardType="decimal-pad"
                value={valorMeta}
                onChangeText={setValorMeta}
              />
              <FormInput
                style={styles.input}
                placeholder="Quanto você já possui?"
                placeholderTextColor={colors.placeholder}
                keyboardType="decimal-pad"
                value={valorAtual}
                onChangeText={setValorAtual}
              />
              {erro ? <Text style={sharedStyles.errorText}>{erro}</Text> : null}
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelar} onPress={fecharModal} disabled={salvando}>
                  <Text style={styles.cancelarTexto}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.salvar} onPress={salvarMeta} disabled={salvando}>
                  <Text style={styles.salvarTexto}>
                    {salvando ? 'Salvando...' : modoEdicao ? 'Salvar alterações' : 'Salvar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </AnimatedCard>
          </FormScrollView>
        </KeyboardArea>
      </Modal>

      <Modal
        visible={Boolean(metaParaExcluir)}
        transparent
        animationType="fade"
        onRequestClose={() => !excluindo && setMetaParaExcluir(null)}
      >
        <View style={styles.modalBackgroundExcluir}>
          <AnimatedCard style={styles.modalExcluir} delay={30}>
            <View style={styles.iconeExcluir}>
              <Icon name="delete-outline" size={30} color={colors.danger} />
            </View>
            <Text style={styles.modalTitulo}>Excluir meta?</Text>
            <Text style={styles.textoConfirmacao}>
              A meta “{metaParaExcluir?.nome}” e todo o histórico ligado a ela serão excluídos.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelar}
                onPress={() => setMetaParaExcluir(null)}
                disabled={excluindo}
              >
                <Text style={styles.cancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.excluir}
                onPress={excluirMeta}
                disabled={excluindo}
              >
                <Text style={styles.excluirTexto}>{excluindo ? 'Excluindo...' : 'Excluir'}</Text>
              </TouchableOpacity>
            </View>
          </AnimatedCard>
        </View>
      </Modal>

      <BarraNavegacao />
    </AnimatedScreen>
  );
}
