import ModalAviso from "../../componentes/ModalAviso";
import CampoData from "../../componentes/CampoData";
import { SeletoresTransacao, AnexoTransacao } from "../../componentes/OpcoesTransacao";
import { useOpcoesTransacao } from "../../ganchos/useOpcoesTransacao";
import { AreaTeclado as KeyboardAvoidingView, RolagemFormulario as ScrollView, CampoFormulario as TextInput } from "../../componentes/LayoutFormulario";
import React, { useState, useRef } from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialIcons';
import { TelaAnimada } from "../componentes/TelaAnimada";
import { useEstilosApp } from "../estilos/estilos";
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
            <Text style={estilos.titulo}>Adicione o valor:</Text>
            <TextInput style={[estilos.campoValor, estilosCompartilhados.textoAlinhamentoDireita]} value={valor} onChangeText={setValor} mask="currency" keyboardType="decimal-pad" placeholder="R$ 0,00" placeholderTextColor={cores.textoIndicativo} />
          </View>
          <View style={estilos.campoCompleto}>
            <Text style={estilosCompartilhados.formularioRotulo}>Descrição</Text>
            <TextInput style={estilos.campo} placeholder="Ex.: Conta de luz" placeholderTextColor={cores.textoIndicativo} maxLength={255} value={descricao} onChangeText={setDescricao} />
          </View>
          <View style={estilos.campoCompleto}>
            <Text style={estilosCompartilhados.formularioRotulo}>Data (DD/MM/AAAA)</Text>
            <CampoData style={estilos.campo} placeholder="DD/MM/AAAA" placeholderTextColor={cores.textoIndicativo} value={dados} onChangeText={setData} />
          </View>
          <SeletoresTransacao opcoes={opcoes} desabilitado={salvando} />
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
            <Switch value={recorrente} onValueChange={setRecorrente} />
          </View>
          <View style={estilos.campoCompleto}>
            <Text style={estilosCompartilhados.formularioRotulo}>Observação (opcional)</Text>
            <TextInput style={[estilos.campo, estilosCompartilhados.multilinhaCampo]} placeholder="Observação" placeholderTextColor={cores.textoIndicativo} multiline value={observacao} onChangeText={setObservacao} />
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
