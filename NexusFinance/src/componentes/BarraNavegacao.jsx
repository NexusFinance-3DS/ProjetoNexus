import { ContextoAlturaCabecalho } from "./CabecalhoTela";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, Pressable, TouchableWithoutFeedback, Keyboard, ScrollView, useWindowDimensions } from 'react-native';
import { router, usePathname } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, FadeIn, FadeOut } from 'react-native-reanimated';
import { useEstilosApp } from "../style/style";
const ABAS = [{
  key: 'inicial',
  route: '/inicial',
  label: 'Início',
  icon: 'home'
}, {
  key: 'fluxoFinanceiro',
  route: '/fluxoFinanceiro',
  label: 'Fluxo',
  icon: 'swap-horiz'
}, {
  key: 'add',
  route: null,
  label: '',
  icon: 'add'
}, {
  key: 'metas',
  route: '/metas',
  label: 'Metas',
  icon: 'radar'
}, {
  key: 'more',
  route: null,
  label: 'Mais',
  icon: 'menu'
}];
const ACOES_ADICIONAR = [{
  label: 'Receitas',
  icon: 'attach-money',
  route: '/receita/novaReceita'
}, {
  label: 'Despesas',
  icon: 'receipt',
  route: '/despesa/novaDespesa'
}, {
  label: 'Categoria',
  icon: 'category',
  route: '/categoria'
}, {
  label: 'Metas',
  icon: 'flag',
  route: '/metas'
}];
const MAIS_ACOES = [{
  label: "Painel financeiro",
  icon: 'bar-chart',
  route: "/painel"
}, {
  label: 'Relatórios',
  icon: 'description',
  route: '/relatorios'
}, {
  label: 'Perfil',
  icon: 'person',
  route: '/perfil'
}, {
  label: 'Config.',
  icon: 'settings',
  route: '/configuracoes'
}];
function BotaoAbaAnimado({
  tab: aba,
  isActive: estaAtivo,
  isOpen: estaAberto,
  onPress
}) {
  const {
    estilosBarraNavegacao: estilos,
    cores
  } = useEstilosApp();
  const escala = useSharedValue(1);
  const estilo = useAnimatedStyle(() => ({
    transform: [{
      scale: escala.value
    }]
  }));
  const aoPressionar = () => {
    escala.value = withTiming(0.92, {
      duration: 90
    });
  };
  const aoSoltar = () => {
    escala.value = withTiming(1, {
      duration: 120
    });
  };
  if (aba.key === 'add') {
    return <Pressable accessibilityRole="button" accessibilityLabel="Adicionar" onPressIn={aoPressionar} onPressOut={aoSoltar} onPress={onPress} hitSlop={10} style={estilos.botaoFlutuantePressionavel}>
        <Animated.View style={[estilo, estilos.botaoFlutuante]}>
          <Icon name="add" size={37} color={cores.sobrePrimaria} />
        </Animated.View>
      </Pressable>;
  }
  return <Pressable accessibilityRole="button" accessibilityLabel={aba.label} onPressIn={aoPressionar} onPressOut={aoSoltar} onPress={onPress} hitSlop={8} style={estilos.abaPressionavel}>
      <Animated.View style={[estilo, estilos.abaAnimadoConteudo]}>
        <View style={[estilos.abaCapsula, {
        backgroundColor: estaAtivo || estaAberto ? cores.primariaSuave : 'transparent'
      }]}>
          <Icon name={aba.key === 'more' && estaAberto ? 'close' : aba.icon} size={24} color={estaAtivo || estaAberto ? cores.primaria : cores.textoSecundario} />
        </View>
        <Text style={[estilos.abaTexto, {
        fontWeight: estaAtivo ? '700' : '500',
        color: estaAtivo || estaAberto ? cores.primaria : cores.textoSecundario
      }]}>
          {aba.label}
        </Text>
        {estaAtivo && <View style={estilos.ativoPonto} />}
      </Animated.View>
    </Pressable>;
}
function MenuExpandido({
  items: itens,
  onSelect: aoSelecionar
}) {
  const {
    estilosBarraNavegacao: estilos,
    cores
  } = useEstilosApp();
  const {
    height: altura
  } = useWindowDimensions();
  const alturaCabecalho = React.useContext(ContextoAlturaCabecalho);
  const margensSeguras = useSafeAreaInsets();
  const progresso = useSharedValue(0);
  React.useEffect(() => {
    progresso.value = withTiming(1, {
      duration: 200
    });
  }, [progresso]);
  const estiloAnimado = useAnimatedStyle(() => ({
    opacity: progresso.value,
    transform: [{
      translateY: (1 - progresso.value) * 14
    }]
  }));
  return <Animated.View style={[estiloAnimado, estilos.expandidoMenu]}>
      <ScrollView style={{
      maxHeight: Math.max(80, altura - alturaCabecalho - margensSeguras.bottom - 110),
      width: '100%'
    }} contentContainerStyle={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around'
    }}>
        {itens.map(item => <Pressable key={item.label} onPress={() => aoSelecionar(item.route)} style={({
        pressed
      }) => [estilos.expandidoMenuItem, {
        backgroundColor: pressed ? cores.primariaSuave : 'transparent'
      }]}>
            <View style={estilos.expandidoMenuIcone}>
              <Icon name={item.icon} size={22} color={cores.primaria} />
            </View>
            <Text style={estilos.expandidoMenuRotulo}>{item.label}</Text>
          </Pressable>)}
      </ScrollView>
    </Animated.View>;
}
export default function BarraNavegacao() {
  const {
    estilosBarraNavegacao: estilos
  } = useEstilosApp();
  const [menuAberto, setMenuAberto] = useState(null);
  const caminhoRota = usePathname();
  const [tecladoVisivel, setTecladoVisivel] = useState(Keyboard.isVisible());
  React.useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => {
      setTecladoVisivel(true);
      setMenuAberto(null);
    });
    const ocultar = Keyboard.addListener('keyboardDidHide', () => setTecladoVisivel(false));
    return () => {
      show.remove();
      ocultar.remove();
    };
  }, []);
  const irPara = rota => {
    setMenuAberto(null);
    if (rota) router.push(rota);
  };
  const aoPressionarAba = aba => {
    if (Haptics?.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    if (aba.key === 'add' || aba.key === 'more') {
      setMenuAberto(prev => prev === aba.key ? null : aba.key);
    } else {
      irPara(aba.route);
    }
  };
  if (tecladoVisivel) return null;
  return <>
      {menuAberto != null && <TouchableWithoutFeedback onPress={() => setMenuAberto(null)}>
          <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(150)} style={estilos.atualSobreposicao} />
        </TouchableWithoutFeedback>}

      {menuAberto === 'add' && <MenuExpandido items={ACOES_ADICIONAR} onSelect={irPara} />}
      {menuAberto === 'more' && <MenuExpandido items={MAIS_ACOES} onSelect={irPara} />}

      <View style={estilos.atualAbaBarra}>
        {ABAS.map(aba => <BotaoAbaAnimado key={aba.key} tab={aba} isActive={aba.route ? caminhoRota?.includes(aba.route) : false} isOpen={menuAberto === aba.key} onPress={() => aoPressionarAba(aba)} />)}
      </View>
    </>;
}
