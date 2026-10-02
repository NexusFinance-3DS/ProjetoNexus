import React from 'react';
import { Platform, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
export default function AnelProgresso(propriedades) {
  if (Platform.OS !== 'web') return <AnimatedCircularProgress {...propriedades} />;
  // O atributo de origem da transformação SVG da biblioteca é inválido no React DOM.
  const {
    size: tamanho,
    width: largura,
    fill: preenchimento,
    tintColor: corPreenchimento,
    backgroundColor,
    children: filhos
  } = propriedades;
  const progresso = Math.max(0, Math.min(100, Number(preenchimento) || 0));
  const raio = (tamanho - largura) / 2;
  const comprimento = 2 * Math.PI * raio;
  return <View style={{
    width: tamanho,
    height: tamanho
  }} accessibilityRole="progressbar" accessibilityValue={{
    min: 0,
    max: 100,
    now: progresso
  }}>
      <Svg width={tamanho} height={tamanho} viewBox={`0 0 ${tamanho} ${tamanho}`}>
        <Circle cx={tamanho / 2} cy={tamanho / 2} r={raio} stroke={backgroundColor} strokeWidth={largura} fill="none" />
        <Circle cx={tamanho / 2} cy={tamanho / 2} r={raio} stroke={corPreenchimento} strokeWidth={largura} fill="none" strokeDasharray={`${comprimento} ${comprimento}`} strokeDashoffset={comprimento * (1 - progresso / 100)} strokeLinecap="round" transform={`rotate(-90 ${tamanho / 2} ${tamanho / 2})`} />
      </Svg>
      <View style={{
      position: 'absolute',
      inset: 0,
      alignItems: 'center',
      justifyContent: 'center'
    }}>
        {typeof filhos === 'function' ? filhos(progresso) : filhos}
      </View>
    </View>;
}
