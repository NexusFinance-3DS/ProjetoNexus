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
import { apiAutenticada, hoje } from "../../servicos/financeiro";
export default function NovaDespesa() {
  const {
    cores,
    estilosTeclado,
    estilosNovaDespesa: estilos,
    estilosCompartilhados
  } = useEstilosApp();
  const opcoes = useOpcoesTransacao('Despesa');
  const travaEnvio = useRef(false);
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dados, setData] = useState(hoje());
  const [paga, setPaga] = useState(true);
  const [recorrente, setRecorrente] = useState(false);
  const [parcelada, setParcelada] = useState(false);
  const [parcelas, setParcelas] = useState('2');
  const [observacao, setObservacao] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  async function salvar() {
    if (travaEnvio.current || mensagemSucesso) return;
    travaEnvio.current = true;
    setSalvando(true);
    setErro('');
    try {
      const resposta = await apiAutenticada('/financeiro/transacoes', opcoes.prepararEnvio({
        tipo: 'Despesa',
        valor,
        descricao,
        data: dados,
        recorrente,
        parcelas: parcelada ? Number(parcelas) : 1,
        observacao,
        status: paga ? 'Confirmada' : 'Pendente'
      }));
      setMensagemSucesso(resposta.mensagem || 'Despesa salva!');
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
            <Text style={estilos.titulo}>{parcelada ? 'Valor total da despesa:' : 'Adicione o valor:'}</Text>
            <TextInput style={[estilos.campoValor, estilosCompartilhados.textoAlinhamentoDireita]} value={valor} onChangeText={setValor} mask="currency" keyboardType="decimal-pad" placeholder="R$ 0,00" placeholderTextColor={cores.textoIndicativo} />
          </View>
          <View style={estilos.campoCompleto}>
            <View style={estilos.campoCaixa}>
              <View style={estilos.campoLinha}>
                <View style={estilos.campoIcone}><Icon name="title" size={18} color={cores.textoPrincipal} /></View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={estilos.campoRotulo}>Título</Text>
                  <TextInput style={estilos.campoInterno} placeholder="Ex.: Conta de luz" placeholderTextColor={cores.textoIndicativo} maxLength={255} value={descricao} onChangeText={setDescricao} />
                </View>
              </View>
            </View>
          </View>
          <View style={estilos.campoCompleto}>
            <View style={estilos.campoCaixa}>
              <View style={estilos.campoLinha}>
                <CampoData style={estilos.campoInterno} placeholder="DD/MM/AAAA" placeholderTextColor={cores.textoIndicativo} value={dados} onChangeText={setData} />
              </View>
            </View>
          </View>
          <SeletoresTransacao opcoes={opcoes} desabilitado={salvando} />
          <View style={estilos.listaItem}>
            <View style={estilos.iconeCaixa}><Icon name="credit-card" size={20} color={cores.textoPrincipal} /></View>
            <View style={estilosCompartilhados.flexivel}>
              <Text style={estilos.listaItemTexto}>Despesa parcelada</Text>
              <Text style={estilos.listaItemSecundario}>O valor informado será dividido em parcelas mensais</Text>
            </View>
            <Switch value={parcelada} disabled={salvando} onValueChange={ativo => { setParcelada(ativo); if (ativo) setRecorrente(false); }} />
          </View>
          {parcelada ? <View style={estilos.campoCompleto}>
            <View style={estilos.campoCaixa}>
              <View style={estilos.campoLinha}>
                <View style={estilos.campoIcone}><Icon name="format-list-numbered" size={18} color={cores.textoPrincipal} /></View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={estilos.campoRotulo}>Número de parcelas (2 a 60)</Text>
                  <TextInput style={estilos.campoInterno} value={parcelas} onChangeText={setParcelas} keyboardType="number-pad" maxLength={2} placeholder="Ex.: 6" placeholderTextColor={cores.textoIndicativo} />
                </View>
              </View>
            </View>
          </View> : null}
          <View style={estilos.listaItem}>
            <View style={estilos.iconeCaixa}>
              <Icon name="check-circle" size={20} color={cores.textoPrincipal} />
            </View>
            <View style={estilosCompartilhados.flexivel}>
              <Text style={estilos.listaItemTexto}>Despesa paga</Text>
              <Text style={estilos.listaItemSecundario}>{paga ? 'Confirmada' : 'Pendente'}</Text>
            </View>
            <Switch value={paga} onValueChange={setPaga} />
          </View>
          <View style={estilos.listaItem}>
            <View style={estilos.iconeCaixa}>
              <Icon name="repeat" size={20} color={cores.textoPrincipal} />
            </View>
            <View style={estilosCompartilhados.flexivel}>
              <Text style={estilos.listaItemTexto}>Despesa fixa</Text>
              <Text style={estilos.listaItemSecundario}>Próximos meses serão lançados como pendentes</Text>
            </View>
            <Switch value={recorrente} disabled={salvando || parcelada} onValueChange={ativo => { setRecorrente(ativo); if (ativo) setParcelada(false); }} />
          </View>
          <View style={estilos.campoCompleto}>
            <View style={[estilos.campoCaixa, {marginTop: 10}]}>
              <View style={estilos.campoLinha}>
                <View style={estilos.campoIcone}><Icon name="notes" size={18} color={cores.textoPrincipal} /></View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={estilos.campoRotulo}>Observação (opcional)</Text>
                  <TextInput style={[estilos.campoInterno, { minHeight: 60, textAlignVertical: 'top' }]} placeholder="Observação" placeholderTextColor={cores.textoIndicativo} multiline value={observacao} onChangeText={setObservacao} />
                </View>
              </View>
            </View>
          </View>
          <AnexoTransacao opcoes={opcoes} desabilitado={salvando} />
          {erro ? <Text style={estilosCompartilhados.erroTexto}>{erro}</Text> : null}
          <View style={estilos.salvarEnvoltorio}>
            <TouchableOpacity style={estilos.salvarBotao} onPress={salvar} disabled={salvando || opcoes.carregando || !!opcoes.erroOpcoes || !opcoes.categoriaId || !opcoes.tipoContaId}>
              <Text style={estilos.salvarBotaoTexto}>
                {salvando ? 'Salvando...' : 'Salvar despesa'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TelaAnimada>
    <ModalAviso visivel={Boolean(mensagemSucesso)} titulo="Despesa salva!" mensagem={mensagemSucesso} textoBotao="Ver fluxo financeiro" aoFechar={() => {
      setMensagemSucesso('');
      router.replace('/fluxoFinanceiro');
    }} />
    </>;
}
