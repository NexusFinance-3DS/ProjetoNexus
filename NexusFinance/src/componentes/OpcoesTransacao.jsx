import React, { useState } from 'react';
import { ActivityIndicator, Keyboard, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useTema, useEstilosTema } from "../contextos/ContextoTema";
import { CampoFormulario, RolagemFormulario, AreaTeclado } from "./LayoutFormulario";
function SeletorOpcao({
  rotulo,
  itens,
  valor,
  aoAlterar,
  desabilitado
}) {
  const {
    cores
  } = useTema();
  const estilos = useEstilosTema(criarEstilos);
  const [aberto, setAberto] = useState(false);
  return <>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <Pressable disabled={desabilitado} accessibilityRole="button" accessibilityLabel={rotulo} accessibilityState={{
      disabled: desabilitado,
      expanded: aberto
    }} onPress={() => {
      Keyboard.dismiss();
      setAberto(true);
    }} style={[estilos.seletor, desabilitado && estilos.desabilitado]}>
        <Text style={estilos.valor}>
          {itens.find(item => item.id === valor)?.nome || 'Selecione uma opção'}
        </Text>
        <Icon name="expand-more" color={cores.textoPrincipal} size={24} />
      </Pressable>
      <Modal visible={aberto} transparent animationType="fade" onRequestClose={() => setAberto(false)}>
        <View style={estilos.sobreposicao}>
          <View style={estilos.dialogo}>
            <View style={estilos.cabecalho}>
              <Text accessibilityRole="header" style={estilos.titulo}>Selecione {rotulo.toLowerCase()}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Fechar opções" onPress={() => setAberto(false)} style={estilos.iconeBotao}>
                <Icon name="close" color={cores.textoPrincipal} size={24} />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator>
              {itens.map(item => <Pressable key={item.id} accessibilityRole="radio" accessibilityState={{
              checked: item.id === valor
            }} onPress={() => {
              aoAlterar(item.id);
              setAberto(false);
            }} style={estilos.option}>
                  <Text style={estilos.valor}>{item.nome}</Text>
                  <Icon name={item.id === valor ? 'radio-button-checked' : 'radio-button-unchecked'} color={item.id === valor ? cores.textoLink : cores.textoSuave} size={23} />
                </Pressable>)}
              {!itens.length && <Text style={estilos.legenda}>Nenhuma opção cadastrada.</Text>}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>;
}
export function SeletoresTransacao({
  opcoes,
  desabilitado,
  mostrarTipoConta = true
}) {
  const {
    cores
  } = useTema();
  const estilos = useEstilosTema(criarEstilos);
  const [aberto, setAberto] = useState(false);
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  async function salvarCategoria() {
    if (salvando) return;
    if (nome.trim().length < 2) {
      setErro('Digite pelo menos 2 caracteres para o nome da categoria.');
      return;
    }
    setSalvando(true);
    setErro('');
    try {
      await opcoes.criarCategoria(nome);
      setAberto(false);
      setNome('');
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setSalvando(false);
    }
  }
  return <View style={estilos.campos}>
      {opcoes.carregando && <ActivityIndicator color={cores.textoLink} accessibilityLabel="Carregando opções" />}
      {opcoes.erroOpcoes ? <View>
          <Text style={estilos.erro}>{opcoes.erroOpcoes}</Text>
          <Pressable accessibilityRole="button" onPress={opcoes.carregar} disabled={opcoes.carregando} style={estilos.tentarNovamente}>
            <Text style={estilos.link}>Tentar novamente</Text>
          </Pressable>
        </View> : null}
      {mostrarTipoConta && <SeletorOpcao rotulo="Tipo de conta" itens={opcoes.tiposConta} valor={opcoes.tipoContaId} aoAlterar={opcoes.setTipoContaId} desabilitado={desabilitado || opcoes.carregando} />}
      <SeletorOpcao rotulo="Categoria" itens={opcoes.categorias} valor={opcoes.categoriaId} aoAlterar={opcoes.setCategoriaId} desabilitado={desabilitado || opcoes.carregando} />
      <Pressable accessibilityRole="button" disabled={desabilitado || opcoes.carregando || !!opcoes.erroOpcoes} onPress={() => {
      Keyboard.dismiss();
      setErro('');
      setNome('');
      setAberto(true);
    }} style={estilos.adicionar}>
        <Icon name="add-circle-outline" color={cores.textoLink} size={21} />
        <Text style={estilos.link}>Adicionar nova categoria</Text>
      </Pressable>
      <Modal visible={aberto} transparent animationType="fade" onRequestClose={() => {
      if (!salvando) setAberto(false);
    }}>
        <AreaTeclado modal style={estilos.modalFundo}>
          <RolagemFormulario contentContainerStyle={estilos.modalConteudo}>
            <View style={estilos.categoriaDialogo}>
              <Text style={estilos.titulo}>Nova categoria</Text>
              <Text style={estilos.rotulo}>Nome da categoria</Text>
              <CampoFormulario accessibilityLabel="Nome da categoria" placeholder="Ex.: Trabalho extra" placeholderTextColor={cores.textoIndicativo} value={nome} onChangeText={setNome} maxLength={100} style={estilos.nomeCampo} editable={!salvando} />
              <Text style={estilos.legenda}>
                Ficará disponível nas suas próximas transações deste tipo.
              </Text>
              {erro ? <Text style={estilos.erro}>{erro}</Text> : null}
              <View style={estilos.acoes}>
                <Pressable disabled={salvando} accessibilityRole="button" onPress={() => setAberto(false)} style={estilos.secundario}>
                  <Text style={estilos.valor}>Cancelar</Text>
                </Pressable>
                <Pressable disabled={salvando} accessibilityRole="button" onPress={salvarCategoria} style={estilos.primario}>
                  <Text style={estilos.botaoTexto}>
                    {salvando ? 'Salvando...' : 'Salvar categoria'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </RolagemFormulario>
        </AreaTeclado>
      </Modal>
    </View>;
}
export function AnexoTransacao({
  opcoes,
  desabilitado
}) {
  const {
    cores
  } = useTema();
  const estilos = useEstilosTema(criarEstilos);
  return <View style={estilos.campos}>
      <Text style={estilos.rotulo}>Arquivo (opcional)</Text>
      <View style={estilos.anexo}>
        <Pressable accessibilityRole="button" accessibilityLabel={opcoes.arquivo ? 'Trocar arquivo' : 'Adicionar arquivo'} disabled={desabilitado} onPress={opcoes.selecionarArquivo} style={estilos.arquivoBotao}>
          <Icon name="attach-file" size={23} color={cores.textoPrincipal} />
          <View style={estilos.arquivoTexto}>
            <Text style={estilos.valor}>{opcoes.arquivo?.name || 'Adicionar arquivo'}</Text>
            <Text style={estilos.legenda}>
              {opcoes.arquivo ? `${Math.ceil((opcoes.arquivo.size || 0) / 1024)} KB · Toque para trocar` : 'Até 10 MB'}
            </Text>
          </View>
        </Pressable>
        {opcoes.arquivo && <Pressable accessibilityRole="button" accessibilityLabel="Remover arquivo" disabled={desabilitado} onPress={opcoes.removerArquivo} style={estilos.iconeBotao}>
            <Icon name="close" color={cores.perigo} size={23} />
          </Pressable>}
      </View>
      {opcoes.erroArquivo ? <Text style={estilos.erro}>{opcoes.erroArquivo}</Text> : null}
    </View>;
}
const criarEstilos = cores => StyleSheet.create({
  campos: {
    paddingHorizontal: 16,
    marginBottom: 12
  },
  rotulo: {
    color: cores.textoPrincipal,
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 6
  },
  seletor: {
    minHeight: 50,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: cores.campo,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14
  },
  valor: {
    color: cores.textoPrincipal,
    fontSize: 15,
    flexShrink: 1
  },
  desabilitado: {
    opacity: 0.5
  },
  adicionar: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    minHeight: 44
  },
  link: {
    color: cores.textoLink,
    fontSize: 15,
    flexShrink: 1
  },
  tentarNovamente: {
    minHeight: 44,
    justifyContent: 'center'
  },
  sobreposicao: {
    flex: 1,
    backgroundColor: cores.sobreposicao,
    justifyContent: 'center',
    padding: 24
  },
  dialogo: {
    width: '100%',
    maxWidth: 380,
    maxHeight: '80%',
    alignSelf: 'center',
    borderRadius: 18,
    padding: 20,
    backgroundColor: cores.superficie
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8
  },
  titulo: {
    color: cores.textoPrincipal,
    fontSize: 21,
    fontWeight: '600',
    flexShrink: 1,
    marginBottom: 14
  },
  iconeBotao: {
    width: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center'
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    minHeight: 52,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: cores.divisor
  },
  modalFundo: {
    backgroundColor: cores.sobreposicao
  },
  modalConteudo: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24
  },
  categoriaDialogo: {
    width: '100%',
    maxWidth: 380,
    alignSelf: 'center',
    padding: 20,
    backgroundColor: cores.superficie,
    borderRadius: 18
  },
  nomeCampo: {
    color: cores.textoPrincipal,
    fontSize: 16,
    backgroundColor: cores.campo,
    borderRadius: 10,
    paddingHorizontal: 12
  },
  legenda: {
    color: cores.textoSecundario,
    fontSize: 12,
    marginTop: 5,
    marginBottom: 8
  },
  erro: {
    color: cores.perigo,
    fontSize: 14,
    marginVertical: 10
  },
  acoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16
  },
  secundario: {
    flexGrow: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  primario: {
    flexGrow: 1,
    minHeight: 48,
    backgroundColor: cores.primaria,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  botaoTexto: {
    color: cores.sobrePrimaria,
    fontSize: 15,
    fontWeight: '600'
  },
  anexo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.campo,
    borderRadius: 10
  },
  arquivoBotao: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    minHeight: 60
  },
  arquivoTexto: {
    flex: 1,
    minWidth: 0
  }
});
