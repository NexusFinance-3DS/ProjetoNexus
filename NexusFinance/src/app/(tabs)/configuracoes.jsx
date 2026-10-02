import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialIcons';
import BarraNavegacao from "../../componentes/BarraNavegacao";
import { CartaoAnimado, TelaAnimada } from "../../componentes/TelaAnimada";
import { useEstilosApp } from "../../style/style";
import { apiAutenticada } from "../../servicos/financeiro";
import { exportarCSV } from "../../servicos/arquivos";
import { useTema } from "../../contextos/ContextoTema";
export default function Configuracoes() {
  const {
    tema,
    alterarTema,
    salvandoTema,
    erroTema
  } = useTema();
  const {
    cores,
    estilosConfiguracoes: estilos,
    estilosCompartilhados
  } = useEstilosApp();
  const [notificacoes, setNotificacoes] = useState(true);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [erro, setErro] = useState('');
  useFocusEffect(useCallback(() => {
    let ativo = true;
    setCarregando(true);
    apiAutenticada('/configuracoes').then(dados => {
      if (ativo) {
        setNotificacoes(dados.notificacoes);
        setErro('');
      }
    }).catch(falha => ativo && setErro(falha.message)).finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, []));
  async function alterarNotificacoes(valor) {
    if (salvando) return;
    setSalvando(true);
    setErro('');
    try {
      const dados = await apiAutenticada('/configuracoes', {
        method: 'PUT',
        body: JSON.stringify({
          notificacoes: valor
        })
      });
      setNotificacoes(dados.notificacoes);
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setSalvando(false);
    }
  }
  async function exportar() {
    if (exportando) return;
    setExportando(true);
    setErro('');
    try {
      const {
        transacoes
      } = await apiAutenticada('/financeiro/transacoes');
      await exportarCSV(transacoes);
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setExportando(false);
    }
  }
  function item(icone, rotulo, acao, desabilitado = false) {
    return <TouchableOpacity accessibilityRole="button" style={estilos.item} onPress={acao} disabled={desabilitado}>
        <View style={estilos.itemEsquerda}>
          <Icon name={icone} size={26} color={cores.primaria} />
          <Text style={estilos.itemTexto}>{rotulo}</Text>
        </View>
        <Icon name="chevron-right" size={26} color={cores.textoSecundario} />
      </TouchableOpacity>;
  }
  return <TelaAnimada style={estilos.recipiente} atraso={60}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilosCompartilhados.espacamentoInferior120}>
        {erro ? <Text style={estilosCompartilhados.erroTexto}>{erro}</Text> : null}
        <CartaoAnimado style={estilos.cartao} atraso={40}>
          <Text style={estilos.cartaoTitulo}>Preferências</Text>
          <View style={estilos.item}>
            <View style={estilos.itemEsquerda}>
              <Icon name="notifications" size={26} color={cores.primaria} />
              <Text style={estilos.itemTexto}>Avisos financeiros no app</Text>
            </View>
            <Switch accessibilityLabel="Avisos financeiros no app" value={notificacoes} disabled={carregando || salvando} onValueChange={alterarNotificacoes} thumbColor={cores.sobrePrimaria} trackColor={{
            false: cores.interruptorDesligado,
            true: cores.primaria
          }} />
          </View>
          <View style={estilos.divisor} />
          <View style={estilos.item}>
            <View style={estilos.itemEsquerda}>
              <Icon name={tema === 'escuro' ? 'dark-mode' : 'light-mode'} size={26} color={cores.primaria} />
              <Text style={estilos.itemTexto}>Aparência</Text>
            </View>
          </View>
          <View accessibilityRole="radiogroup" accessibilityLabel="Tema do aplicativo" style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
          paddingHorizontal: 18,
          paddingBottom: 18
        }}>
            {[{
            value: 'claro',
            label: 'Claro',
            icon: 'light-mode'
          }, {
            value: 'escuro',
            label: 'Escuro',
            icon: 'dark-mode'
          }].map(opcao => <TouchableOpacity key={opcao.value} accessibilityRole="radio" accessibilityLabel={`Tema ${opcao.label.toLowerCase()}`} accessibilityState={{
            checked: tema === opcao.value,
            disabled: salvandoTema
          }} disabled={salvandoTema} onPress={() => alterarTema(opcao.value)} style={{
            flex: 1,
            minWidth: 100,
            minHeight: 50,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: tema === opcao.value ? cores.primaria : cores.borda,
            backgroundColor: tema === opcao.value ? cores.primaria : cores.campo,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8
          }}>
                <Icon name={opcao.icon} size={22} color={tema === opcao.value ? cores.sobrePrimaria : cores.textoPrincipal} />
                <Text style={{
              color: tema === opcao.value ? cores.sobrePrimaria : cores.textoPrincipal,
              fontSize: 16
            }}>
                  {opcao.label}
                </Text>
              </TouchableOpacity>)}
          </View>
          {salvandoTema ? <Text style={{
          color: cores.textoSecundario,
          marginHorizontal: 18,
          marginBottom: 12
        }}>
              Salvando tema...
            </Text> : null}
          {erroTema ? <Text style={[estilosCompartilhados.erroTexto, {
          marginHorizontal: 18
        }]}>{erroTema}</Text> : null}
        </CartaoAnimado>
        <CartaoAnimado style={estilos.cartao} atraso={120}>
          <Text style={estilos.cartaoTitulo}>Conta</Text>
          {item('person-outline', 'Meu cadastro', () => router.push('/menus/meuCadastro'))}
          <View style={estilos.divisor} />
          {item('lock', 'Alterar senha', () => router.push('/auth/recuperarSenha'))}
        </CartaoAnimado>
        <CartaoAnimado style={estilos.cartao} atraso={180}>
          <Text style={estilos.cartaoTitulo}>Dados e ajuda</Text>
          {item('download', exportando ? 'Exportando...' : 'Exportar transações (CSV)', exportar, exportando)}
          <View style={estilos.divisor} />
          {item('picture-as-pdf', 'Relatórios em PDF', () => router.push('/relatorios'))}
          <View style={estilos.divisor} />
          {item('help-outline', 'Central de ajuda', () => router.push('/menus/centralAjuda'))}
          <View style={estilos.divisor} />
          {item('info', 'Sobre o aplicativo', () => router.push('/menus/sobreApp'))}
        </CartaoAnimado>
      </ScrollView>
      <BarraNavegacao />
    </TelaAnimada>;
}
