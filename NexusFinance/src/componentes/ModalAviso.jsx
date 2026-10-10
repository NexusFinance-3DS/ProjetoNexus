import { useEffect, useRef } from 'react';
import { Animated, Keyboard, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTema } from "../contextos/ContextoTema";
export default function ModalAviso({
  visivel,
  titulo,
  mensagem,
  tipo = 'sucesso',
  textoBotao = 'Entendi',
  aoFechar
}) {
  const {
    cores
  } = useTema();
  const margensSeguras = useSafeAreaInsets();
  const animacao = useRef(new Animated.Value(0)).current;
  const cor = tipo === 'erro' ? cores.perigo : tipo === 'informacao' ? cores.primaria : cores.sucesso;
  const fundoBotao = tipo === 'erro' ? cores.perigo : cores.primaria;
  const fundoIcone = tipo === 'erro' ? cores.perigoSuave : tipo === 'informacao' ? cores.primariaSuave : cores.sucessoSuave;
  const icone = tipo === 'erro' ? 'error-outline' : tipo === 'informacao' ? 'info-outline' : 'check';
  useEffect(() => {
    if (!visivel) return;
    Keyboard.dismiss();
    animacao.setValue(0);
    const movimento = Animated.spring(animacao, {
      toValue: 1,
      useNativeDriver: true,
      friction: 7,
      tension: 80
    });
    movimento.start();
    return () => movimento.stop();
  }, [visivel, animacao]);
  return <Modal visible={visivel} transparent animationType="fade" statusBarTranslucent onRequestClose={aoFechar}>
      <View style={[estilos.fundo, {
      backgroundColor: cores.sobreposicao,
      paddingTop: 24 + margensSeguras.top,
      paddingBottom: 24 + margensSeguras.bottom
    }]}>
        <ScrollView contentContainerStyle={estilos.rolagem} showsVerticalScrollIndicator={false} bounces={false}>
          <Animated.View accessibilityViewIsModal accessibilityRole="alert" style={[estilos.cartao, {
          backgroundColor: cores.superficie,
          borderColor: cores.borda,
          opacity: animacao,
          transform: [{
            scale: animacao.interpolate({
              inputRange: [0, 1],
              outputRange: [0.9, 1]
            })
          }]
        }]}>
            <View style={[estilos.circuloExterno, {
            backgroundColor: fundoIcone
          }]}>
              <View style={[estilos.circuloInterno, {
              backgroundColor: cor
            }]}>
                <Icon name={icone} size={38} color={cores.sobrePrimaria} />
              </View>
            </View>
            <Text accessibilityRole="header" style={[estilos.titulo, {
            color: cores.textoPrincipal
          }]}>{titulo}</Text>
            <Text accessibilityLiveRegion={tipo === 'erro' ? 'assertive' : 'polite'} style={[estilos.texto, {
            color: cores.textoSecundario
          }]}>{mensagem}</Text>
            <Pressable accessibilityRole="button" onPress={aoFechar} style={({
            pressed
          }) => [estilos.botao, {
            backgroundColor: fundoBotao,
            opacity: pressed ? 0.8 : 1
          }]}>
              <Text style={[estilos.textoBotao, {
              color: cores.sobrePrimaria
            }]}>{textoBotao}</Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </View>
    </Modal>;
}
const estilos = StyleSheet.create({
  fundo: {
    flex: 1,
    paddingHorizontal: 25
  },
  rolagem: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cartao: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.25,
    shadowRadius: 10
  },
  circuloExterno: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  circuloInterno: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titulo: {
    fontSize: 21,
    fontWeight: '700',
    textAlign: 'center'
  },
  texto: {
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 8
  },
  botao: {
    marginTop: 20,
    width: '100%',
    minHeight: 48,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textoBotao: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center'
  }
});
