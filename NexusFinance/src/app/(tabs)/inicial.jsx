import VisaoFinanceira from "../../componentes/VisaoFinanceira";
import { TelaAnimada } from "../../componentes/TelaAnimada";
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, View, Text, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialIcons';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useEstilosApp } from "../../style/style";
import BarraNavegacao from "../../componentes/BarraNavegacao";
import CartaoPainel from "../../componentes/CartaoPainel";
import { apiAutenticada, formatarReais } from "../../servicos/financeiro";
import { useResumoFinanceiro } from "../../ganchos/useResumoFinanceiro";
import { useSessao } from "../../contextos/ContextoSessao";

function obterSaudacao() {
  const hora = new Date().getHours();
  if (hora < 12) return 'Bom dia';
  if (hora < 18) return 'Boa tarde';
  return 'Boa noite';
}

function CartaoResumo({
  icone,
  corIcone,
  fundoIcone,
  titulo,
  valor,
  comparacao,
  corComparacao,
  aoPressionar,
  atraso = 0,
  largura = '100%'
}) {
  const { estilosInicio: estilos } = useEstilosApp();
  const escala = useSharedValue(1);
  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [{ scale: escala.value }]
  }));

  return (
    <Animated.View entering={FadeInDown.delay(atraso).duration(400).springify()} style={[{ width: '100%' }, estiloAnimado]}>
      <Pressable
        onPressIn={() => {
          escala.value = withSpring(0.95, { damping: 12, stiffness: 220 });
        }}
        onPressOut={() => {
          escala.value = withSpring(1, { damping: 10, stiffness: 200 });
        }}
        onPress={aoPressionar}
      >
        <CartaoPainel style={{ width: largura, minHeight: 150, justifyContent: 'flex-start' }}>
          <View style={[estilos.cartaoIconeSelo, { backgroundColor: fundoIcone }]}>
            <Icon name={icone} size={22} color={corIcone} />
          </View>

          <Text style={estilos.cartaoTitulo}>{titulo}</Text>
          <Text style={estilos.cartaoValor}>{valor}</Text>

          {comparacao ? (
            <Text style={[estilos.cartaoComparacao, { color: corComparacao }]}>
              {comparacao}
            </Text>
          ) : null}
        </CartaoPainel>
      </Pressable>
    </Animated.View>
  );
}

export default function Inicial() {
  const {
    estilosInicio: estilos,
    cores,
    gradientes,
    estilosCompartilhados
  } = useEstilosApp();
  const { width: largura, fontScale: escalaFonte } = useWindowDimensions();
  const compacto = largura < 380 || escalaFonte > 1.3;
  const [saldoVisivel, setSaldoVisivel] = useState(true);
  const [metas, setMetas] = useState([]);
  const [erroMetas, setErroMetas] = useState('');
  const [carregandoMetas, setCarregandoMetas] = useState(true);
  const { usuario } = useSessao();
  const { dados, erro, carregando, recarregar } = useResumoFinanceiro();

  useFocusEffect(useCallback(() => {
    let ativo = true;
    setCarregandoMetas(true);

    apiAutenticada('/metas')
      .then(resposta => {
        if (ativo) {
          setMetas(Array.isArray(resposta?.metas) ? resposta.metas : []);
          setErroMetas('');
        }
      })
      .catch(falha => {
        if (ativo) {
          setErroMetas(falha.message || 'Não foi possível carregar suas metas.');
        }
      })
      .finally(() => {
        if (ativo) setCarregandoMetas(false);
      });

    return () => { ativo = false; };
  }, []));

  const valorFormatado = valor => saldoVisivel ? formatarReais(valor) : '••••••';
  const totais = dados.atual || { totalReceitas: 0, totalDespesas: 0, saldo: 0 };
  const renda = totais.totalReceitas || 0;
  const despesa = totais.totalDespesas || 0;

  const metasProximas = metas
    .map(meta => ({
      ...meta,
      progresso: Number(meta.objetivo) > 0 ? Math.min(100, Math.max(0, Number(meta.atual || 0) / Number(meta.objetivo) * 100)) : 0,
    }))
    .filter(meta => meta.status !== 'cancelada' && meta.status !== 'concluida' && meta.progresso < 100)
    .sort((a, b) => b.progresso - a.progresso)
    .slice(0, 3);

  const previsao = dados.previsao || { totalReceitas: 0, totalDespesas: 0, saldo: 0 };
  const categoriaPrincipal = dados.categorias?.[0];
  const percentualCategoria = categoriaPrincipal && despesa > 0 ? Number(categoriaPrincipal.valor) / despesa * 100 : 0;

  return (
    <TelaAnimada style={estilos.recipiente}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilosCompartilhados.espacamentoInferior130}>
        <View style={estilos.cabecalho}>
          <Animated.View entering={FadeInUp.duration(400)} style={estilosCompartilhados.telaCabecalhoLinha}>
            <Pressable onPress={() => router.push('/perfil')} style={estilos.perfilContaine}>
              <View style={estilos.perfilCirculo}>
                <Icon name="person-outline" size={36} color={cores.primaria} />
              </View>

              <View style={estilos.perfilInformacoes}>
                <Text style={estilos.saudacaoRotulo}>{obterSaudacao()},</Text>
                <Text style={estilos.nome} numberOfLines={1}>{usuario?.nome || 'Usuário'}</Text>
              </View>
            </Pressable>

            <Pressable style={estilos.sinoBotao} onPress={() => router.push('/notificacoes')}>
              <Icon name="notifications-none" size={22} color={cores.textoPrincipal} />
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(80).duration(400)}>
            <Pressable onPress={() => router.push('/fluxoFinanceiro')}>
              <LinearGradient
                colors={gradientes.brand}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={estilos.saldoRecipiente}
              >
                <View style={estilos.saldoSuperiorLinha}>
                  <Text style={estilos.tituloSaldo}>Saldo disponível</Text>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={saldoVisivel ? 'Ocultar valores' : 'Mostrar valores'}
                    hitSlop={10}
                    onPress={e => {
                      e.stopPropagation?.();
                      setSaldoVisivel(v => !v);
                    }}
                  >
                    <Icon name={saldoVisivel ? 'visibility' : 'visibility-off'} size={20} color={cores.sobrePrimaria} />
                  </Pressable>
                </View>

                <Text style={estilos.valor}>
                  {carregando ? 'Carregando...' : erro ? 'Indisponível' : valorFormatado(dados.saldoDisponivel)}
                </Text>

                <View style={estilos.saldoRodapeLinha}>
                  <Icon name="swap-horiz" size={16} color={cores.sobrePrimaria} />
                  <Text style={estilos.saldoRodapeTexto}>Toque para ver o fluxo financeiro</Text>
                </View>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>

        <View style={estilos.conteudo}>
          {carregando ? <ActivityIndicator accessibilityLabel="Carregando resumo financeiro" color={cores.primaria} /> : null}

          {erro ? (
            <View>
              <Text style={estilosCompartilhados.erroTexto}>{erro}</Text>
              <Pressable accessibilityRole="button" onPress={recarregar} style={{ minHeight: 44, justifyContent: 'center' }}>
                <Text style={{ color: cores.textoLink }}>Tentar novamente</Text>
              </Pressable>
            </View>
          ) : null}

          {!carregando && !erro ? (
            <>
              <Text style={estilos.titulo}>Visão Rápida</Text>
              <Text style={estilosCompartilhados.suaveLegenda}>Realizado no mês até hoje</Text>

              <View style={{ flexDirection: 'row', gap: 12, marginTop: 12, alignItems: 'stretch' }}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <CartaoResumo
                    atraso={80}
                    icone="arrow-upward"
                    corIcone={cores.sucesso}
                    fundoIcone={cores.sucessoSuave}
                    titulo="Receitas realizadas"
                    valor={valorFormatado(renda)}
                    aoPressionar={() => router.push({ pathname: '/fluxoFinanceiro', params: { aba: 'Receitas' } })}
                  />
                </View>

                <View style={{ flex: 1, minWidth: 0 }}>
                  <CartaoResumo
                    atraso={120}
                    icone="arrow-downward"
                    corIcone={cores.perigo}
                    fundoIcone={cores.perigoSuave}
                    titulo="Despesas realizadas"
                    valor={valorFormatado(despesa)}
                    aoPressionar={() => router.push({ pathname: '/fluxoFinanceiro', params: { aba: 'Despesas' } })}
                  />
                </View>
              </View>

              <Animated.View entering={FadeInDown.delay(200).duration(400)} style={{ marginTop: 18, marginBottom: 25 }}>
                <CartaoPainel>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: cores.textoPrincipal, fontSize: 18, lineHeight: 24, fontWeight: '800' }}>Próximas conquistas</Text>
                      <Text style={{ color: cores.textoSecundario, fontSize: 12, lineHeight: 18, marginTop: 3 }}>Suas 3 metas com maior progresso</Text>
                    </View>

                    <Pressable
                      accessibilityRole="button"
                      onPress={() => router.push('/metas')}
                      style={{ minHeight: 40, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#251eae', flexDirection: 'row', alignItems: 'center', gap: 5 }}
                    >
                      <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '700' }}>Ver todas</Text>
                      <Icon name="arrow-forward" size={15} color="#ffffff" />
                    </Pressable>
                  </View>

                  {carregandoMetas ? <ActivityIndicator accessibilityLabel="Carregando metas" color={cores.primaria} /> : null}
                  {erroMetas && metas.length === 0 ? <Text style={estilosCompartilhados.erroTexto}>{erroMetas}</Text> : null}

                  {metasProximas.length ? (
                    metasProximas.map((meta, index) => (
                      <Pressable
                        key={meta.id || `${meta.nome}-${index}`}
                        accessibilityRole="button"
                        accessibilityLabel={`Abrir meta ${meta.nome}, ${Math.round(meta.progresso)} por cento concluída`}
                        onPress={() => router.push('/metas')}
                        style={{ paddingVertical: 13, borderTopWidth: index === 0 ? 0 : 1, borderTopColor: cores.divisor }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: cores.primariaSuave, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: cores.textoLink, fontSize: 13, fontWeight: '800' }}>{index + 1}</Text>
                          </View>

                          <View style={{ flex: 1, minWidth: 0 }}>
                            <Text numberOfLines={1} style={{ color: cores.textoPrincipal, fontSize: 14, fontWeight: '700' }}>{meta.nome}</Text>
                            <Text style={{ color: cores.textoSecundario, fontSize: 11, marginTop: 3 }}>{valorFormatado(meta.atual)} de {valorFormatado(meta.objetivo)}</Text>
                          </View>

                          <View style={{ paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999, backgroundColor: cores.primariaSuave }}>
                            <Text style={{ color: cores.textoLink, fontSize: 11, fontWeight: '800' }}>{saldoVisivel ? `${Math.round(meta.progresso)}%` : '•••'}</Text>
                          </View>
                        </View>

                        <View style={{ height: 7, marginTop: 11, marginLeft: 44, borderRadius: 5, backgroundColor: cores.superficieElevada, overflow: 'hidden' }}>
                          <View style={{ width: `${saldoVisivel ? meta.progresso : 0}%`, height: '100%', borderRadius: 5, backgroundColor: cores.primaria }} />
                        </View>

                        <Text style={{ color: cores.textoSecundario, fontSize: 10, marginTop: 5, marginLeft: 44 }}>
                          {valorFormatado(Math.max(0, Number(meta.objetivo) - Number(meta.atual || 0)))} para concluir
                        </Text>
                      </Pressable>
                    ))
                  ) : !erroMetas && !carregandoMetas ? (
                    <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                      <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: cores.primariaSuave, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                        <Icon name="flag" size={24} color={cores.primaria} />
                      </View>
                      <Text style={{ color: cores.textoPrincipal, fontSize: 14, fontWeight: '700' }}>Nenhuma meta em andamento</Text>
                      <Text style={{ color: cores.textoSecundario, fontSize: 12, textAlign: 'center', marginTop: 4 }}>
                        Crie uma meta e acompanhe seu progresso por aqui.
                      </Text>
                      <Pressable accessibilityRole="button" onPress={() => router.push('/metas')} style={{ minHeight: 42, justifyContent: 'center', paddingHorizontal: 12 }}>
                        <Text style={{ color: cores.textoLink, fontSize: 13, fontWeight: '700' }}>Criar primeira meta</Text>
                      </Pressable>
                    </View>
                  ) : null}
                </CartaoPainel>
              </Animated.View>

              <CartaoPainel>
                <Text style={{ color: cores.textoPrincipal, fontSize: 17, fontWeight: '700', marginBottom: 14 }}>Ações rápidas</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {[
                    { icone: 'add-circle-outline', titulo: 'Nova receita', rota: '/receita/novaReceita', cor: cores.sucesso, fundo: cores.sucessoSuave },
                    { icone: 'remove-circle-outline', titulo: 'Nova despesa', rota: '/despesa/novaDespesa', cor: cores.perigo, fundo: cores.perigoSuave },
                    { icone: 'insights', titulo: 'Ver painel', rota: '/painel', cor: cores.primaria, fundo: cores.primariaSuave },
                  ].map(acao => (
                    <Pressable
                      key={acao.titulo}
                      accessibilityRole="button"
                      onPress={() => router.push(acao.rota)}
                      style={{ flex: 1, minHeight: 92, alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 16, backgroundColor: acao.fundo, paddingHorizontal: 6, paddingVertical: 10 }}
                    >
                      <Icon name={acao.icone} size={23} color={acao.cor} />
                      <Text style={{ color: cores.textoPrincipal, fontSize: 11, fontWeight: '600', textAlign: 'center' }}>{acao.titulo}</Text>
                    </Pressable>
                  ))}
                </View>
              </CartaoPainel>

              <CartaoPainel style={{ marginTop: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <View style={{ width: 38, height: 38, borderRadius: 13, backgroundColor: cores.primariaSuave, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="auto-awesome" size={20} color={cores.primaria} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: cores.textoPrincipal, fontSize: 17, fontWeight: '700' }}>Destaques do mês</Text>
                    <Text style={{ color: cores.textoSecundario, fontSize: 12, marginTop: 2 }}>Uma visão rápida do que vem pela frente</Text>
                  </View>
                </View>

                <Pressable accessibilityRole="button" onPress={() => router.push('/painel')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingVertical: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: cores.textoSecundario, fontSize: 12 }}>Resultado estimado no fechamento</Text>
                    <Text style={{ color: Number(previsao.saldo) < 0 ? cores.perigo : cores.textoPrincipal, fontSize: 18, fontWeight: '700', marginTop: 3 }}>
                      {valorFormatado(previsao.saldo)}
                    </Text>
                  </View>
                  <Icon name="arrow-forward-ios" size={15} color={cores.textoSecundario} />
                </Pressable>

                <View style={{ height: 1, backgroundColor: cores.divisor }} />

                <Pressable accessibilityRole="button" onPress={() => router.push('/painel')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingVertical: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: cores.textoSecundario, fontSize: 12 }}>Maior categoria de despesa</Text>
                    <Text style={{ color: cores.textoPrincipal, fontSize: 14, fontWeight: '700', marginTop: 3 }}>
                      {categoriaPrincipal?.nome || 'Sem despesas registradas'}
                    </Text>
                  </View>
                  {categoriaPrincipal ? (
                    <Text style={{ color: cores.perigo, fontSize: 13, fontWeight: '700' }}>
                      {percentualCategoria.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%
                    </Text>
                  ) : null}
                </Pressable>
              </CartaoPainel>

              <View style={[{ marginTop: 16 }, compacto && { marginTop: 12 }]}> 
                <VisaoFinanceira dados={dados} />
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>

      <BarraNavegacao />
    </TelaAnimada>
  );
}
