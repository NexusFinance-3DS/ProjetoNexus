import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CampoFormulario } from "./LayoutFormulario";
import { useTema } from "../contextos/ContextoTema";
import { formatarEntradaData } from "../servicos/entradaData.mjs";

function converterParaData(valor) {
  const texto = String(valor || '');
  const partes = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!partes) return new Date();
  const [, dia, mes, ano] = partes;
  const data = new Date(Number(ano), Number(mes) - 1, Number(dia));
  return Number.isNaN(data.getTime()) ? new Date() : data;
}

function converterParaTexto(data) {
  if (!(data instanceof Date) || Number.isNaN(data.getTime())) return '';
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

export default function CampoData({
  value: valor,
  onChangeText: aoAlterarTexto,
  placeholder = 'DD/MM/AAAA',
  style: estilo,
  ...propriedades
}) {
  const { cores } = useTema();
  const [mostrarCalendario, setMostrarCalendario] = React.useState(false);

  const lidarAlteracao = texto => {
    if (!aoAlterarTexto) return;
    aoAlterarTexto(formatarEntradaData(texto));
  };

  const aoSelecionarData = (_, data) => {
    setMostrarCalendario(false);
    if (!data || !aoAlterarTexto) return;
    aoAlterarTexto(converterParaTexto(data));
  };

  return <>
      <View style={estilos.container}>
        <Pressable accessibilityRole="button" accessibilityLabel={`Selecionar data ${placeholder}`} hitSlop={8} onPress={() => setMostrarCalendario(true)} style={estilos.botaoCalendario}>
          <Icon name="calendar-today" size={18} color={cores.primaria} />
        </Pressable>
        <View style={estilos.textoContainer}>
          <Text style={estilos.rotulo}>{placeholder}</Text>
          <CampoFormulario {...propriedades} style={[estilo, estilos.campo]} placeholder={placeholder} accessibilityLabel={propriedades.accessibilityLabel || placeholder} keyboardType="number-pad" inputMode="numeric" maxLength={10} autoCorrect={false} value={formatarEntradaData(valor)} onChangeText={lidarAlteracao} />
        </View>
      </View>
      {mostrarCalendario ? <DateTimePicker value={converterParaData(valor)} mode="date" display="default" onChange={aoSelecionarData} /> : null}
    </>;
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 10,
    overflow: 'hidden'
  },
  botaoCalendario: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(108, 92, 231, 0.10)',
    marginRight: 8
  },
  textoContainer: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center'
  },
  rotulo: {
    color: '#8B93A7',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    marginBottom: 2
  },
  campo: {
    flex: 1,
    minHeight: 24,
    paddingVertical: 0,
    paddingLeft: 0,
    paddingRight: 4,
    textAlign: 'left'
  }
});
