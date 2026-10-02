import React, { useState } from 'react';
import { View } from 'react-native';

// Mede o conteúdo do cartão, inclusive ao dividir ou girar a tela.
export default function GraficoMedido({
  children: filhos
}) {
  const [largura, setLargura] = useState(0);
  return <View style={{
    width: '100%',
    overflow: 'hidden'
  }} onLayout={({
    nativeEvent: eventoNativo
  }) => setLargura(Math.floor(eventoNativo.layout.width))}>
      {largura > 0 ? filhos(largura) : null}
    </View>;
}
