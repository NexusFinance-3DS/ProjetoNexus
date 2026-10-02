import VisaoFinanceira from "../../componentes/VisaoFinanceira";
import { TelaAnimada } from "../../componentes/TelaAnimada";
import React, { useState } from 'react';
import ProgressoCircularAnimado from "../../componentes/AnelProgresso";
import { ActivityIndicator, View, Text, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialIcons';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useEstilosApp } from "../../style/style";
import BarraNavegacao from "../../componentes/BarraNavegacao";
import { formatarReais } from "../../servicos/financeiro";
import { useResumoFinanceiro } from "../../ganchos/useResumoFinanceiro";
import { useSessao } from "../../contextos/ContextoSessao";
function obterSaudacao() {
  const hora = new Date().getHours();
  if (hora < 12) return 'Bom dia';
  if (hora < 18) return 'Boa tarde';
  return 'Boa noite';
}
function CartaoResumo({
  icone: icone,
  corIcone: corIcone,
  fundoIcone: fundoIcone,
  titulo,
  valor,
  comparacao: comparacao,
  corComparacao: corComparacao,
  aoPressionar: aoPressionar,
  atraso = 0,
  largura = '100%'
}) {
  const {
    estilosInicio: estilos
  } = useEstilosApp();
  const escala = useSharedValue(1);
  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [{
      scale: escala.value
    }]
  }));
  return <Animated.View entering={FadeInDown.delay(atraso).duration(400).springify()} style={[{
    width: '100%'
  }, estiloAnimado]}>
      <Pressable onPressIn={() => {
      escala.value = withSpring(0.95, {
        damping: 12,
        stiffness: 220
      });
    }} onPressOut={() => {
      escala.value = withSpring(1, {
        damping: 10,
        stiffness: 200
      });
    }} onPress={aoPressionar}>
        <View style={[estilos.cartao, {
        width: largura,
        marginRight: 0
      }]}>
          <View style={[estilos.cartaoIconeSelo, {
          backgroundColor: fundoIcone
        }]}>
            <Icon name={icone} size={22} color={corIcone} />
          </View>

          <Text style={estilos.cartaoTitulo}>{titulo}</Text>

          <Text style={estilos.cartaoValor}>{valor}</Text>

          {comparacao ? <Text style={[estilos.cartaoComparacao, {
          color: corComparacao
        }]}>
              {comparacao}
            </Text> : null}
        </View>
      </Pressable>
    </Animated.View>;
}
export default function Inicial() {
  const {
    estilosInicio: estilos,
    cores,
    gradientes,
    estilosCompartilhados
  } = useEstilosApp();
  const {
    width: largura,
    fontScale: escalaFonte
  } = useWindowDimensions();
  const compacto = largura < 380 || escalaFonte > 1.3;
  const [saldoVisivel, setSaldoVisivel] = useState(true);
  const {
    usuario
  } = useSessao();
  const {
    dados,
    erro,
    carregando,
    recarregar
  } = useResumoFinanceiro();
  const valorFormatado = valor => saldoVisivel ? formatarReais(valor) : '••••••';
  const totais = dados.atual;
  const comparacaoEconomia = {
    percent: dados.economia.percentual,
    diff: dados.economia.diferenca
  };
  const renda = totais.totalReceitas || 0;
  const despesa = totais.totalDespesas || 0;
  const valorMeta = Number(dados.meta?.atual) || 0;
  const valorTotalMeta = Number(dados.meta?.objetivo) || 0;
  const porcentagem = valorTotalMeta > 0 ? Math.min(valorMeta / valorTotalMeta * 100, 100) : 0;
  const tituloMeta = dados.meta?.nome || 'Nenhuma meta em andamento';
  const saldoTotal = Number(dados.saldoDisponivel) || 0;
  const saldoDisponivelSemMetas = saldoTotal - valorMeta;
  const saldoTotalComMetas = saldoDisponivelSemMetas + valorMeta;
  return <TelaAnimada style={estilos.recipiente}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilosCompartilhados.espacamentoInferior130}>
        <View style={estilos.cabecalho}>
          <Animated.View entering={FadeInUp.duration(400)} style={estilosCompartilhados.telaCabecalhoLinha}>
            <Pressable onPress={() => router.push('/perfil')} style={estilos.perfilContaine}>
              <View style={estilos.perfilCirculo}>
                <Icon name="person-outline" size={36} color={cores.primaria} />
              </View>

              <View style={estilos.perfilInformacoes}>
                <Text style={estilos.saudacaoRotulo}>
                  {obterSaudacao()},
                </Text>

                <Text style={estilos.nome} numberOfLines={1}>
                  {usuario?.nome || 'Usuário'}
                </Text>
              </View>
            </Pressable>

            <Pressable style={estilos.sinoBotao} onPress={() => router.push('/notificacoes')}>
              <Icon name="notifications-none" size={22} color={cores.textoPrincipal} />
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(80).duration(400)}>
            <Pressable onPress={() => router.push('/fluxoFinanceiro')}>
              <LinearGradient colors={gradientes.brand} start={{
              x: 0,
              y: 0
            }} end={{
              x: 1,
              y: 1
            }} style={estilos.saldoRecipiente}>
                <View style={estilos.saldoSuperiorLinha}>
                  <Text style={estilos.tituloSaldo}>
                    Saldo disponível
                  </Text>

                  <Pressable accessibilityRole="button" accessibilityLabel={saldoVisivel ? 'Ocultar valores' : 'Mostrar valores'} hitSlop={10} onPress={e => {
                  e.stopPropagation?.();
                  setSaldoVisivel(v => !v);
                }}>
                    <Icon name={saldoVisivel ? 'visibility' : 'visibility-off'} size={20} color={cores.sobrePrimaria} />
                  </Pressable>
                </View>

                <Text style={estilos.valor}>
                  {carregando ? 'Carregando...' : erro ? 'Indisponível' : valorFormatado(saldoDisponivelSemMetas)}
                </Text>

                <View style={estilos.saldoRodapeLinha}>
                  <Icon name="swap-horiz" size={16} color={cores.sobrePrimaria} />

                  <Text style={estilos.saldoRodapeTexto}>
                    Toque para ver o fluxo financeiro
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>

        <View style={estilos.conteudo}>
          {carregando ? <ActivityIndicator accessibilityLabel="Carregando resumo financeiro" color={cores.primaria} /> : null}

          {erro ? <View>
              <Text style={estilosCompartilhados.erroTexto}>
                {erro}
              </Text>

              <Pressable accessibilityRole="button" onPress={recarregar} style={{
            minHeight: 44,
            justifyContent: 'center'
          }}>
                <Text style={{
              color: cores.textoLink
            }}>
                  Tentar novamente
                </Text>
              </Pressable>
            </View> : null}

          {!carregando && !erro ? <>
              <Text style={estilos.titulo}>
                Visão Rápida
              </Text>

              <Text style={estilosCompartilhados.suaveLegenda}>
                Realizado no mês até hoje
              </Text>

              {/* Dois cards lado a lado */}
              <View style={{
            flexDirection: 'row',
            gap: 12,
            marginTop: 12,
            alignItems: 'stretch'
          }}>
                <View style={{
              flex: 1,
              minWidth: 0
            }}>
                  <CartaoResumo atraso={80} icone="arrow-upward" corIcone={cores.sucesso} fundoIcone={cores.sucessoSuave} titulo="Receitas realizadas" valor={valorFormatado(renda)} aoPressionar={() => router.push({
                pathname: '/fluxoFinanceiro',
                params: {
                  aba: 'Receitas'
                }
              })} />
                </View>

                <View style={{
              flex: 1,
              minWidth: 0
            }}>
                  <CartaoResumo atraso={120} icone="arrow-downward" corIcone={cores.perigo} fundoIcone={cores.perigoSuave} titulo="Despesas realizadas" valor={valorFormatado(despesa)} aoPressionar={() => router.push({
                pathname: '/fluxoFinanceiro',
                params: {
                  aba: 'Despesas'
                }
              })} />
                </View>
              </View>

              {/* Resultado mensal abaixo dos dois cards */}
              <View style={{
            width: '100%',
            marginTop: 12,
            marginBottom: 8
          }}>
                <CartaoResumo atraso={160} icone="savings" corIcone={cores.primaria} fundoIcone={cores.primariaSuave} titulo="Resultado mensal total" valor={valorFormatado(saldoTotalComMetas)} comparacao={!saldoVisivel ? 'Comparação oculta' : comparacaoEconomia.percent === null ? 'Sem base de comparação' : `${comparacaoEconomia.percent >= 0 ? '+' : '-'}${Math.abs(comparacaoEconomia.percent).toLocaleString('pt-BR', {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1
            })}% vs. mês anterior`} corComparacao={comparacaoEconomia.diff >= 0 ? cores.sucesso : cores.perigoIntenso} aoPressionar={() => router.push("/painel")} />
              </View>

              <VisaoFinanceira dados={dados} visivel={saldoVisivel} inicio />

              <Animated.View entering={FadeInDown.delay(200).duration(400)} style={estilos.secaoCartao}>
                <View style={estilos.metaCabecalhoLinha}>
                  <Text style={estilos.metaCabecalhoTitulo}>
                    Metas em andamento
                  </Text>

                  <Text style={[estilos.metaHeaderLink, {
                color: "#B5ACFF"
              }]} onPress={() => router.push('/metas')}>
                    Ver metas
                  </Text>
                </View>

                <View style={[estilos.graficos, compacto && {
              flexDirection: 'column',
              alignItems: 'stretch'
            }]}>
                  <ProgressoCircularAnimado size={104} width={9} fill={saldoVisivel ? porcentagem : 0} tintColor={cores.primaria} backgroundColor={cores.superficieElevada} rotation={0} lineCap="round">
                    {() => <Text style={estilosCompartilhados.progressoPercentual}>
                        {saldoVisivel ? `${Math.round(porcentagem)}%` : '•••'}
                      </Text>}
                  </ProgressoCircularAnimado>

                  <View style={[estilos.metaInformacoesColuna, compacto && {
                marginLeft: 0,
                marginTop: 16
              }]}>
                    <Text style={estilos.metaTituloTexto}>
                      {tituloMeta}
                    </Text>

                    <View style={estilos.metaBarraFundo}>
                      <View style={[estilos.metaBarraPreenchida, {
                    width: `${saldoVisivel ? porcentagem : 0}%`
                  }]} />
                    </View>

                    <Text style={estilos.metaValoresTexto}>
                      {valorFormatado(valorMeta)} / {valorFormatado(valorTotalMeta)}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            </> : null}
        </View>
      </ScrollView>

      <BarraNavegacao />
    </TelaAnimada>;
}
