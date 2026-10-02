import React from 'react';
import { CampoFormulario } from "./LayoutFormulario";
import { formatarEntradaData } from "../servicos/entradaData.mjs";
export default function CampoData({
  value: valor,
  onChangeText: aoAlterarTexto,
  placeholder = 'DD/MM/AAAA',
  ...propriedades
}) {
  return <CampoFormulario {...propriedades} placeholder={placeholder} accessibilityLabel={propriedades.accessibilityLabel || placeholder} keyboardType="number-pad" inputMode="numeric" maxLength={10} autoCorrect={false} value={formatarEntradaData(valor)} onChangeText={texto => aoAlterarTexto(formatarEntradaData(texto))} />;
}
