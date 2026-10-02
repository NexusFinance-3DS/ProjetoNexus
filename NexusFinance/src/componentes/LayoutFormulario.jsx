import React, { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from 'react';
import { InputAccessoryView, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ContextoAlturaCabecalho } from "./CabecalhoTela";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { deslocamentoCampoFocado, sobreposicaoTeclado } from "./geometriaTeclado.mjs";
import { useTema, useEstilosTema } from "../contextos/ContextoTema";
import { aplicarMascara } from "../servicos/mascarasEntrada.mjs";
const ContextoFormulario = createContext(null);
export function AreaTeclado({
  children: filhos,
  modal = false,
  style: estilo
}) {
  const alturaCabecalho = useContext(ContextoAlturaCabecalho);
  const margensSeguras = useSafeAreaInsets();
  return <KeyboardAvoidingView style={[{
    flex: 1
  }, modal && {
    paddingTop: margensSeguras.top,
    paddingLeft: margensSeguras.left,
    paddingRight: margensSeguras.right
  }, estilo]} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={modal ? 0 : alturaCabecalho}>
      {filhos}
    </KeyboardAvoidingView>;
}

// Mede novamente o campo focado depois que o teclado redimensiona a tela.
// Também trata a troca de campos com o teclado visível.
export function RolagemFormulario({
  children: filhos,
  contentContainerStyle: estiloConteudo,
  onScroll: aoRolar,
  onScrollBeginDrag: aoIniciarRolagem,
  onLayout: aoMedir,
  onContentSizeChange: aoAlterarTamanhoConteudo,
  resetScrollOnKeyboardHide: restaurarRolagemAoOcultarTeclado = false,
  style: estilo,
  ...propriedades
}) {
  const estilos = useEstilosTema(criarEstilos);
  const rolagem = useRef(null);
  const areaVisivel = useRef(null);
  const focado = useRef(null);
  const deslocamento = useRef(0);
  const quadro = useRef(null);
  const temporizadorAjuste = useRef(null);
  const teclado = useRef(Keyboard.metrics?.());
  const rolagemManual = useRef(false);
  const [sobreposicao, setSobreposicao] = useState(0);
  const idAcessorio = useId();
  const revelar = useCallback(() => {
    cancelAnimationFrame(quadro.current);
    quadro.current = requestAnimationFrame(() => {
      areaVisivel.current?.measureInWindow((x, y, largura, altura) => {
        const limites = {
          x,
          y,
          width: largura,
          height: altura
        };
        setSobreposicao(sobreposicaoTeclado(limites, teclado.current));
        if (!teclado.current?.height || rolagemManual.current) return;
        const campo = focado.current;
        if (!campo?.isFocused()) return;
        campo.measureInWindow((posicaoCampoX, posicaoCampoY, larguraCampo, alturaCampo) => {
          if (focado.current !== campo || !campo.isFocused() || !teclado.current?.height || rolagemManual.current) return;
          const alvo = deslocamentoCampoFocado({
            viewport: limites,
            input: {
              y: posicaoCampoY,
              height: alturaCampo
            },
            keyboard: teclado.current,
            offset: deslocamento.current
          });
          if (Math.abs(alvo - deslocamento.current) > 1) rolagem.current?.scrollTo({
            y: alvo,
            animated: false
          });
        });
      });
    });
  }, []);
  useEffect(() => {
    const atualizar = evento => {
      teclado.current = evento.endCoordinates;
      rolagemManual.current = false;
      revelar();
      clearTimeout(temporizadorAjuste.current);
      // Native window resizing and iOS accessory layout may finish after the event.
      temporizadorAjuste.current = setTimeout(revelar, (evento.duration || 0) + 100);
    };
    const ocultar = () => {
      teclado.current = null;
      clearTimeout(temporizadorAjuste.current);
      cancelAnimationFrame(quadro.current);
      setSobreposicao(0);
      if (restaurarRolagemAoOcultarTeclado) {
        deslocamento.current = 0;
        rolagem.current?.scrollTo({
          y: 0,
          animated: false
        });
      }
    };
    const inscricoes = [Keyboard.addListener('keyboardDidShow', atualizar), Keyboard.addListener('keyboardDidChangeFrame', atualizar), Keyboard.addListener('keyboardDidHide', ocultar)];
    return () => {
      inscricoes.forEach(inscricao => inscricao.remove());
      clearTimeout(temporizadorAjuste.current);
      cancelAnimationFrame(quadro.current);
    };
  }, [revelar, restaurarRolagemAoOcultarTeclado]);
  return <ContextoFormulario.Provider value={{
    accessoryId: idAcessorio,
    focus: campo => {
      focado.current = campo;
      rolagemManual.current = false;
      revelar();
    }
  }}>
      <View ref={areaVisivel} collapsable={false} style={[{
      flex: 1
    }, estilo]} onLayout={evento => {
      revelar();
      aoMedir?.(evento);
    }}>
        <ScrollView {...propriedades} ref={rolagem} style={{
        flex: 1
      }} contentContainerStyle={[{
        flexGrow: 1
      }, estiloConteudo, {
        paddingBottom: (StyleSheet.flatten(estiloConteudo)?.paddingBottom ?? StyleSheet.flatten(estiloConteudo)?.paddingVertical ?? 24) + sobreposicao
      }]} keyboardShouldPersistTaps="handled" keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'} automaticallyAdjustKeyboardInsets={false} removeClippedSubviews={false} scrollEventThrottle={16} onScroll={evento => {
        deslocamento.current = evento.nativeEvent.contentOffset.y;
        aoRolar?.(evento);
      }} onScrollBeginDrag={evento => {
        rolagemManual.current = true;
        clearTimeout(temporizadorAjuste.current);
        cancelAnimationFrame(quadro.current);
        aoIniciarRolagem?.(evento);
      }} onLayout={revelar} onContentSizeChange={(largura, altura) => {
        revelar();
        aoAlterarTamanhoConteudo?.(largura, altura);
      }}>
          {filhos}
        </ScrollView>
      </View>
      {Platform.OS === 'ios' && <InputAccessoryView nativeID={idAcessorio}>
          <View style={estilos.barraFerramentas}>
            <Pressable accessibilityRole="button" onPress={Keyboard.dismiss} style={estilos.concluir}>
              <Text style={estilos.concluirTexto}>Concluir</Text>
            </Pressable>
          </View>
        </InputAccessoryView>}
    </ContextoFormulario.Provider>;
}
export function CampoFormulario({
  onFocus: aoFocar,
  onChangeText: aoAlterarTexto,
  style: estilo,
  value: valor,
  mask: mascara,
  maskOptions: opcoesMascara,
  ...propriedades
}) {
  const {
    cores,
    temaEscuro
  } = useTema();
  const estilos = useEstilosTema(criarEstilos);
  const referenciaElemento = useRef(null);
  const formulario = useContext(ContextoFormulario);
  const valorMascarado = mascara ? aplicarMascara(mascara, valor, opcoesMascara) : valor;
  return <TextInput placeholderTextColor={cores.textoIndicativo} selectionColor={cores.primaria} cursorColor={cores.primaria} keyboardAppearance={temaEscuro ? 'dark' : 'light'} {...propriedades} value={valorMascarado} onChangeText={texto => {
    const proximoValor = mascara ? aplicarMascara(mascara, texto, opcoesMascara) : texto;
    aoAlterarTexto?.(proximoValor);
  }} ref={referenciaElemento} style={[{
    color: cores.textoPrincipal
  }, estilo, estilos.campo]} inputAccessoryViewID={Platform.OS === 'ios' ? formulario?.accessoryId : undefined} onFocus={evento => {
    formulario?.focus(referenciaElemento.current);
    aoFocar?.(evento);
  }} />;
}
const criarEstilos = cores => StyleSheet.create({
  campo: {
    minHeight: 48,
    paddingVertical: 12
  },
  barraFerramentas: {
    backgroundColor: cores.superficie,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderColor: cores.borda
  },
  concluir: {
    minHeight: 44,
    paddingHorizontal: 20,
    justifyContent: 'center'
  },
  concluirTexto: {
    color: cores.textoLink,
    fontSize: 17,
    fontWeight: '600'
  }
});
