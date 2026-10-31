import ModalAviso from "../../componentes/ModalAviso";
import CampoData from "../../componentes/CampoData";
import { SeletoresTransacao, AnexoTransacao } from "../../componentes/OpcoesTransacao";
import { useOpcoesTransacao } from "../../ganchos/useOpcoesTransacao";
import { AreaTeclado as KeyboardAvoidingView, RolagemFormulario as ScrollView, CampoFormulario as TextInput } from "../../componentes/LayoutFormulario";
import React, { useState, useRef } from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialIcons';
import { TelaAnimada } from "../../componentes/TelaAnimada";
import { useEstilosApp } from "../../style/style";
import { apiAutenticada, formatarReais, hoje } from "../../servicos/financeiro";
export default function NovaReceita() {
  const {
    cores,
    estilosTeclado,
    estilosNovaReceita: estilos,
    estilosCompartilhados
  } = useEstilosApp();
  const opcoes = useOpcoesTransacao('Receita');
  const travaEnvio = useRef(false);
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dados, setData] = useState(hoje());
  const [recebida, setRecebida] = useState(true);
  const [recorrente, setRecorrente] = useState(false);
  const [parcelada, setParcelada] = useState(false);
  const [parcelas, setParcelas] = useState('2');
  const [observacao, setObservacao] = useState('');
  const [enviarParaMeta, setEnviarParaMeta] = useState(false);
  const [metas, setMetas] = useState([]);
  const [metaId, setMetaId] = useState('');
  const [carregandoMetas, setCarregandoMetas] = useState(false);
  const [erroMetas, setErroMetas] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  async function carregarMetas() {
    setCarregandoMetas(true);
    setErroMetas('');
    try {
      const resposta = await apiAutenticada('/metas');
      const metasAtivas = (resposta.metas || []).filter(meta => meta.status === 'em_andamento');
      setMetas(metasAtivas);
      setMetaId(atual => metasAtivas.some(meta => meta.id === atual) ? atual : '');
    } catch (falha) {
      setErroMetas(falha.message || 'Não foi possível carregar as metas.');
    } finally {
      setCarregandoMetas(false);
    }
  }
  async function alterarEnvioParaMeta(ativo) {
    setEnviarParaMeta(ativo);
    setErro('');
    if (!ativo) {
      setMetaId('');
      setErroMetas('');
      return;
    }
    if (!metas.length) await carregarMetas();
  }
  async function salvar() {
    if (travaEnvio.current || mensagemSucesso) return;
    if (enviarParaMeta && !recebida) {
      setErro('Confirme o recebimento antes de enviar para uma meta.');
      return;
    }
    if (enviarParaMeta && !metaId) {
      setErro('Selecione uma meta para receber esta receita.');
      return;
    }
    travaEnvio.current = true;
    setSalvando(true);
    setErro('');
    try {
      const resposta = await apiAutenticada('/financeiro/transacoes', opcoes.prepararEnvio({
        tipo: 'Receita',
        valor,
        descricao,
        data: dados,
        recorrente,
        parcelas: parcelada ? Number(parcelas) : 1,
        observacao,
        status: recebida ? 'Confirmada' : 'Pendente',
        ...(enviarParaMeta && metaId && !parcelada ? {
          metaId
        } : {})
      }));
      setMensagemSucesso(resposta.mensagem || 'Receita salva!');
    } catch (falha) {
      setErro(falha.message);
    } finally {
      travaEnvio.current = false;
      setSalvando(false);
    }
  }
  return <>
    <TelaAnimada style={estilos.recipiente} atraso={60}>
      <KeyboardAvoidingView style={estilosTeclado.desvioArea}>
        <ScrollView contentContainerStyle={estilosTeclado.rolagemConteudo} keyboardShouldPersistTaps="handled">
          <View style={estilos.adicionarValor}>
            <Text style={estilos.titulo}>{parcelada ? 'Valor total da receita:' : 'Adicione o valor:'}</Text>
            <TextInput style={[estilos.campoValor, estilosCompartilhados.textoAlinhamentoDireita]} value={valor} onChangeText={setValor} mask="currency" keyboardType="decimal-pad" placeholder="R$ 0,00" placeholderTextColor={cores.textoIndicativo} />
          </View>
          <View style={estilos.campoCompleto}>
            <View style={estilos.campoCaixa}>
              <View style={estilos.campoLinha}>
                <View style={estilos.campoIcone}><Icon name="title" size={18} color={cores.textoPrincipal} /></View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={estilos.campoRotulo}>Título</Text>
                  <TextInput style={estilos.campoInterno} placeholder="Ex.: Salário" placeholderTextColor={cores.textoIndicativo} maxLength={255} value={descricao} onChangeText={setDescricao} />
                </View>
              </View>
            </View>
          </View>
          <View style={estilos.campoCompleto}>
            <View style={estilos.campoCaixa}>
              <View style={estilos.campoLinha}>
                <CampoData style={estilos.campoInterno} placeholder="Data" placeholderTextColor={cores.textoIndicativo} value={dados} onChangeText={setData} />
              </View>
            </View>
          </View>
          <SeletoresTransacao opcoes={opcoes} desabilitado={salvando} />
          <View style={estilos.listaItem}>
            <View style={estilos.iconeCaixa}><Icon name="credit-card" size={20} color={cores.textoPrincipal} /></View>
            <View style={estilosCompartilhados.flexivel}>
              <Text style={estilos.listaItemTexto}>Receita parcelada</Text>
              <Text style={estilos.listaItemSecundario}>O valor informado será dividido em parcelas mensais</Text>
            </View>
            <Switch value={parcelada} disabled={salvando} onValueChange={ativo => { setParcelada(ativo); if (ativo) { setRecorrente(false); setEnviarParaMeta(false); setMetaId(''); } }} />
          </View>
          {parcelada ? <View style={estilos.campoCompleto}>
            <View style={estilos.campoCaixa}>
              <Text style={estilos.campoRotulo}>Número de parcelas (2 a 60)</Text>
              <View style={estilos.campoLinha}>
                <View style={estilos.campoIcone}><Icon name="format-list-numbered" size={18} color={cores.textoPrincipal} /></View>
                <TextInput style={estilos.campoInterno} value={parcelas} onChangeText={setParcelas} keyboardType="number-pad" maxLength={2} placeholder="Ex.: 6" placeholderTextColor={cores.textoIndicativo} />
              </View>
            </View>
          </View> : null}
          <View style={estilos.listaItem}>
            <View style={estilos.iconeCaixa}>
              <Icon name="check-circle" size={20} color={cores.textoPrincipal} />
            </View>
            <View style={estilosCompartilhados.flexivel}>
              <Text style={estilos.listaItemTexto}>Receita recebida</Text>
              <Text style={estilos.listaItemSecundario}>{recebida ? 'Confirmada' : 'Pendente'}</Text>
            </View>
            <Switch accessibilityLabel="Receita recebida" value={recebida} disabled={salvando} onValueChange={valorAuxiliar => {
              setRecebida(valorAuxiliar);
              if (!valorAuxiliar) {
                setEnviarParaMeta(false);
                setMetaId('');
              }
            }} />
          </View>
          <View style={estilos.listaItem}>
            <View style={estilos.iconeCaixa}>
              <Icon name="repeat" size={20} color={cores.textoPrincipal} />
            </View>
            <View style={estilosCompartilhados.flexivel}>
              <Text style={estilos.listaItemTexto}>Receita fixa</Text>
              <Text style={estilos.listaItemSecundario}>Próximos meses serão lançados como pendentes</Text>
            </View>
            <Switch value={recorrente} onValueChange={ativo => { setRecorrente(ativo); if (ativo) setParcelada(false); }} disabled={salvando || parcelada} />
          </View>

          <View style={estilos.listaItem}>
            <View style={estilos.iconeCaixa}>
              <Icon name="flag" size={20} color={cores.textoPrincipal} />
            </View>
            <View style={estilosCompartilhados.flexivel}>
              <Text style={estilos.listaItemTexto}>Enviar para uma meta</Text>
              <Text style={estilos.listaItemSecundario}>Destinar esta receita para uma meta</Text>
            </View>
            <Switch value={enviarParaMeta} onValueChange={alterarEnvioParaMeta} disabled={salvando || !recebida || parcelada} />
          </View>

          {enviarParaMeta ? <View style={estilos.campoCompleto}>
              <Text style={estilos.campoRotulo}>Escolha a meta</Text>
              {carregandoMetas ? <Text style={estilos.listaItemSecundario}>Carregando metas...</Text> : null}
              {erroMetas ? <TouchableOpacity style={estilos.listaItem} onPress={carregarMetas} disabled={carregandoMetas || salvando}>
                  <View style={estilos.iconeCaixa}>
                    <Icon name="refresh" size={20} color={cores.textoPrincipal} />
                  </View>
                  <View style={estilosCompartilhados.flexivel}>
                    <Text style={estilos.listaItemTexto}>Tentar novamente</Text>
                    <Text style={estilosCompartilhados.erroTexto}>{erroMetas}</Text>
                  </View>
                </TouchableOpacity> : null}
              {!carregandoMetas && !erroMetas && metas.length === 0 ? <Text style={estilos.listaItemSecundario}>Nenhuma meta em andamento.</Text> : null}
              {!carregandoMetas && !erroMetas ? metas.map(meta => {
              const selecionada = meta.id === metaId;
              return <TouchableOpacity key={meta.id} style={estilos.listaItem} onPress={() => setMetaId(meta.id)} disabled={salvando}>
                        <View style={estilos.iconeCaixa}>
                          <Icon name={selecionada ? 'radio-button-checked' : 'radio-button-unchecked'} size={20} color={selecionada ? cores.primaria : cores.textoPrincipal} />
                        </View>
                        <View style={estilosCompartilhados.flexivel}>
                          <Text style={estilos.listaItemTexto}>{meta.nome}</Text>
                          <Text style={estilos.listaItemSecundario}>
                            {formatarReais(meta.atual)} de {formatarReais(meta.objetivo)}
                          </Text>
                        </View>
                        {selecionada ? <Icon name="check" size={20} color={cores.primaria} /> : null}
                      </TouchableOpacity>;
            }) : null}
            </View> : null}

          <View style={estilos.campoCompleto}>
            <View style={[estilos.campoCaixa, {marginTop: 10}]}>
              <Text style={estilos.campoRotulo}>Observação (opcional)</Text>
              <View style={estilos.campoLinha}>
                <View style={estilos.campoIcone}><Icon name="notes" size={18} color={cores.textoPrincipal} /></View>
                <TextInput style={[estilos.campoInterno, { minHeight: 60, textAlignVertical: 'top' }]} placeholder="Observação" placeholderTextColor={cores.textoIndicativo} multiline value={observacao} onChangeText={setObservacao} />
              </View>
            </View>
          </View>
          <AnexoTransacao opcoes={opcoes} desabilitado={salvando} />
          {erro ? <Text style={estilosCompartilhados.erroTexto}>{erro}</Text> : null}
          <View style={estilos.salvarEnvoltorio}>
            <TouchableOpacity style={estilos.salvarBotao} onPress={salvar} disabled={salvando || opcoes.carregando || !!opcoes.erroOpcoes || !opcoes.categoriaId || !opcoes.tipoContaId || enviarParaMeta && (!metaId || carregandoMetas || !!erroMetas)}>
              <Text style={estilos.salvarBotaoTexto}>
                {salvando ? 'Salvando...' : 'Salvar receita'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TelaAnimada>
    <ModalAviso visivel={Boolean(mensagemSucesso)} titulo="Receita salva!" mensagem={mensagemSucesso} textoBotao="Ver fluxo financeiro" aoFechar={() => {
      setMensagemSucesso('');
      router.replace('/fluxoFinanceiro');
    }} />
    </>;
}
