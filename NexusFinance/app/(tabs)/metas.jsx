import { AreaTeclado, RolagemFormulario, CampoFormulario } from "../../componentes/LayoutFormulario";
import React, { useCallback, useRef, useState } from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialIcons';
import BarraNavegacao from "../componentes/BarraNavegacao";
import { CartaoAnimado, TelaAnimada } from "../componentes/TelaAnimada";
import { useEstilosApp } from "../estilos/estilos";
import { apiAutenticada, formatarReais } from "../../servicos/financeiro";
function valorParaInput(valor) {
  return Number(valor || 0).toFixed(2).replace('.', ',');
}
function moedaParaNumero(valor) {
  const texto = String(valor ?? '').trim().replace(/\s/g, '').replace(/^R\$/i, '');
  if (!texto) return Number.NaN;
  if (texto.includes(',')) {
    return Number(texto.replace(/\./g, '').replace(',', '.'));
  }

  // A máscara brasileira produz valores inteiros como "R$ 1.000".
  // Nesse caso o ponto é separador de milhar, não casa decimal.
  if (/^\d{1,3}(?:\.\d{3})+$/.test(texto)) {
    return Number(texto.replace(/\./g, ''));
  }
  return Number(texto);
}
export default function Metas() {
  const {
    cores,
    estilosTeclado,
    estilosMetas: estilos,
    estilosCompartilhados
  } = useEstilosApp();
  const travaEnvio = useRef(false);
  const [modalVisivel, setModalVisivel] = useState(false);
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
      const resposta = await apiAutenticada('/metas');
      setMetas(resposta.metas);
      setErro('');
    } catch (falha) {
      setErro(falha.message);
    }
  }, []);
  useFocusEffect(useCallback(() => {
    carregarMetas();
  }, [carregarMetas]));
  function limparFormulario() {
    setNomeMeta('');
    setValorMeta('');
    setValorAtual('');
    setMetaSelecionada(null);
    setModoEdicao(false);
  }
  function fecharModal() {
    setModalVisivel(false);
    setErro('');
    limparFormulario();
  }
  function abrirNovaMeta() {
    limparFormulario();
    setErro('');
    setModalVisivel(true);
  }
  function abrirEdicao(item) {
    setMetaSelecionada(item);
    setModoEdicao(true);
    setNomeMeta(item.nome);
    setValorMeta(valorParaInput(item.objetivo));
    setValorAtual(valorParaInput(item.atual));
    setErro('');
    setModalVisivel(true);
  }
  async function salvarMeta() {
    if (travaEnvio.current) return;
    const objetivoNumerico = moedaParaNumero(valorMeta);
    const atualNumerico = valorAtual ? moedaParaNumero(valorAtual) : 0;
    if (!Number.isFinite(objetivoNumerico) || objetivoNumerico <= 0) {
      setErro('Informe um valor válido para a meta.');
      return;
    }
    if (!Number.isFinite(atualNumerico) || atualNumerico < 0) {
      setErro('Informe um valor atual válido.');
      return;
    }
    travaEnvio.current = true;
    setSalvando(true);
    setErro('');
    try {
      const caminho = modoEdicao ? `/metas/${metaSelecionada.id}` : '/metas';
      await apiAutenticada(caminho, {
        method: modoEdicao ? 'PUT' : 'POST',
        body: JSON.stringify({
          nome: nomeMeta,
          objetivo: objetivoNumerico,
          atual: atualNumerico
        })
      });
      fecharModal();
      await carregarMetas();
    } catch (falha) {
      setErro(falha.message);
    } finally {
      travaEnvio.current = false;
      setSalvando(false);
    }
  }
  async function excluirMeta() {
    if (!metaParaExcluir || travaEnvio.current) return;
    travaEnvio.current = true;
    setExcluindo(true);
    setErro('');
    try {
      await apiAutenticada(`/metas/${metaParaExcluir.id}`, {
        method: 'DELETE'
      });
      setMetaParaExcluir(null);
      await carregarMetas();
    } catch (falha) {
      setMetaParaExcluir(null);
      setErro(falha.message);
    } finally {
      travaEnvio.current = false;
      setExcluindo(false);
    }
  }
  function renderizarItem({
    item,
    index
  }) {
    const porcentagem = item.objetivo > 0 ? Math.min(item.atual / item.objetivo * 100, 100) : 0;
    const concluida = item.status === 'concluida' || porcentagem >= 100;
    return <CartaoAnimado style={[estilos.cartao, concluida && estilos.cartaoConcluida]} atraso={80 + index * 60}>
        <View style={estilos.cartaoCabecalho}>
          <Icon name={concluida ? 'check-circle' : 'track-changes'} size={32} color={concluida ? cores.sucesso : cores.primaria} />
          <Text style={estilos.nomeMeta}>{item.nome}</Text>
          <View style={estilos.acoesCartao}>
            <TouchableOpacity style={estilos.botaoAcao} onPress={() => abrirEdicao(item)} accessibilityLabel={`Editar meta ${item.nome}`}>
              <Icon name="edit" size={21} color={cores.primaria} />
            </TouchableOpacity>
            <TouchableOpacity style={estilos.botaoAcao} onPress={() => setMetaParaExcluir(item)} accessibilityLabel={`Excluir meta ${item.nome}`}>
              <Icon name="delete-outline" size={22} color={cores.perigo} />
            </TouchableOpacity>
          </View>
        </View>

        {concluida ? <View style={estilos.concluidaSelo}>
            <Icon name="check" size={17} color={cores.sucesso} />
            <Text style={estilos.concluidaTexto}>Meta concluída</Text>
          </View> : null}

        <View style={estilos.progressoFundo}>
          <View style={[estilos.progressoFill, concluida && estilos.progressoFillConcluida, {
          width: `${porcentagem}%`
        }]} />
        </View>
        <View style={estilos.informacoesLinha}>
          <Text style={estilos.valor}>{formatarReais(item.atual)}</Text>
          <Text style={estilos.valor}>{formatarReais(item.objetivo)}</Text>
        </View>
        <Text style={[estilos.statusMeta, concluida && estilos.statusConcluida]}>
          {concluida ? 'Concluída' : item.status === 'cancelada' ? 'Cancelada' : 'Em andamento'}
        </Text>
        <Text style={[estilos.porcentagem, concluida && estilos.porcentagemConcluida]}>
          {porcentagem.toFixed(0)}%
        </Text>
      </CartaoAnimado>;
  }
  return <TelaAnimada style={estilos.recipiente} atraso={60}>
      {erro && !modalVisivel ? <Text style={estilosCompartilhados.erroTexto}>{erro}</Text> : null}
      <FlatList data={metas} contentContainerStyle={estilosCompartilhados.espacamentoInferior150} renderItem={renderizarItem} keyExtractor={item => item.id} showsVerticalScrollIndicator={false} ListEmptyComponent={<Text style={estilosCompartilhados.erroTexto}>Nenhuma meta cadastrada.</Text>} />
      <TouchableOpacity style={estilos.botaoAdicionar} onPress={abrirNovaMeta}>
        <Icon name="add" size={25} color={cores.sobrePrimaria} />
        <Text style={estilos.botaoTexto}>Adicionar Meta</Text>
      </TouchableOpacity>

      <Modal visible={modalVisivel} transparent animationType="fade" onRequestClose={fecharModal}>
        <AreaTeclado modal style={estilosTeclado.desvioArea}>
          <RolagemFormulario contentContainerStyle={[estilos.modalFundo, estilosTeclado.modalRolagemConteudo]} keyboardShouldPersistTaps="handled">
            <CartaoAnimado style={estilos.modal} atraso={30}>
              <Text style={estilos.modalTitulo}>{modoEdicao ? 'Editar Meta' : 'Nova Meta'}</Text>
              <CampoFormulario style={estilos.campo} maxLength={150} placeholder="Nome da meta" placeholderTextColor={cores.textoIndicativo} value={nomeMeta} onChangeText={setNomeMeta} />
              <CampoFormulario style={estilos.campo} placeholder="Valor da meta" placeholderTextColor={cores.textoIndicativo} keyboardType="decimal-pad" value={valorMeta} onChangeText={setValorMeta} mask="currency" />
              <CampoFormulario style={estilos.campo} placeholder="Quanto você já possui?" placeholderTextColor={cores.textoIndicativo} keyboardType="decimal-pad" value={valorAtual} onChangeText={setValorAtual} mask="currency" />
              {erro ? <Text style={estilosCompartilhados.erroTexto}>{erro}</Text> : null}
              <View style={estilos.modalBotoes}>
                <TouchableOpacity style={estilos.cancelar} onPress={fecharModal} disabled={salvando}>
                  <Text style={estilos.cancelarTexto}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilos.salvar} onPress={salvarMeta} disabled={salvando}>
                  <Text style={estilos.salvarTexto}>
                    {salvando ? 'Salvando...' : modoEdicao ? 'Salvar alterações' : 'Salvar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </CartaoAnimado>
          </RolagemFormulario>
        </AreaTeclado>
      </Modal>

      <Modal visible={Boolean(metaParaExcluir)} transparent animationType="fade" onRequestClose={() => !excluindo && setMetaParaExcluir(null)}>
        <View style={estilos.modalFundoExcluir}>
          <CartaoAnimado style={estilos.modalExcluir} atraso={30}>
            <View style={estilos.iconeExcluir}>
              <Icon name="delete-outline" size={30} color={cores.perigo} />
            </View>
            <Text style={estilos.modalTitulo}>Excluir meta?</Text>
            <Text style={estilos.textoConfirmacao}>
              A meta “{metaParaExcluir?.nome}” e todo o histórico ligado a ela serão excluídos.
            </Text>
            <View style={estilos.modalBotoes}>
              <TouchableOpacity style={estilos.cancelar} onPress={() => setMetaParaExcluir(null)} disabled={excluindo}>
                <Text style={estilos.cancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={estilos.excluir} onPress={excluirMeta} disabled={excluindo}>
                <Text style={estilos.excluirTexto}>{excluindo ? 'Excluindo...' : 'Excluir'}</Text>
              </TouchableOpacity>
            </View>
          </CartaoAnimado>
        </View>
      </Modal>

      <BarraNavegacao />
    </TelaAnimada>;
}
