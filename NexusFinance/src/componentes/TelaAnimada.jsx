import { useTema } from "../contextos/ContextoTema";
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import CabecalhoTela, { ContextoAlturaCabecalho } from "./CabecalhoTela";
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
export function TelaAnimada({
  children: filhos,
  style: estilo,
  atraso = 0,
  direcao = 'up',
  larguraMaxima = 960,
  animada = true
}) {
  const {
    cores
  } = useTema();
  const [alturaCabecalho, setAlturaCabecalho] = useState(0);
  const margensSeguras = useSafeAreaInsets();
  const animacaoEntrada = direcao === 'down' ? FadeInDown.delay(atraso).duration(420).springify() : FadeInUp.delay(atraso).duration(420);
  const Recipiente = animada ? Animated.View : View;
  return <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={{
    flex: 1,
    backgroundColor: StyleSheet.flatten(estilo)?.backgroundColor || cores.fundo
  }}>
      <View style={{
      flex: 1,
      width: '100%',
      maxWidth: larguraMaxima,
      alignSelf: 'center'
    }}>
        <CabecalhoTela onLayout={({
        nativeEvent: eventoNativo
      }) => setAlturaCabecalho(eventoNativo.layout.height)} />
        <ContextoAlturaCabecalho.Provider value={alturaCabecalho + margensSeguras.top}>
          <Recipiente {...animada ? {
          entering: animacaoEntrada
        } : {}} style={[estilo, {
          flex: 1,
          width: '100%',
          maxWidth: larguraMaxima,
          alignSelf: 'center'
        }]}>
            {filhos}
          </Recipiente>
        </ContextoAlturaCabecalho.Provider>
      </View>
    </SafeAreaView>;
}
export function CartaoAnimado({
  children: filhos,
  style: estilo,
  atraso = 0,
  direcao = 'down'
}) {
  const animacaoEntrada = direcao === 'up' ? FadeInUp.delay(atraso).duration(420) : FadeInDown.delay(atraso).duration(420).springify();
  return <Animated.View entering={animacaoEntrada} style={estilo}>
      {filhos}
    </Animated.View>;
}
