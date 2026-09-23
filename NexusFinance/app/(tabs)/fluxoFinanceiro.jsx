import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';

import BarraNavegacao from '../components/BarraNavegacao';
import {
  AnimatedCard,
  AnimatedScreen,
} from '../components/AnimatedScreen';

import { useAppStyles } from '../styles/styles';

import {
  apiAutenticada,
  formatBRL,
  formatDate,
} from '../../services/financeiro';

import { abrirAnexo } from '../../services/arquivos';

export default function FluxoFinanceiro() {
  const {
    colors,
    fluxoFinanceiroStyles: styles,
    sharedStyles,
  } = useAppStyles();

  const { aba } = useLocalSearchParams();

  const abaInicial =
    typeof aba === 'string' &&
      ['Geral', 'Receitas', 'Despesas'].includes(aba)
      ? aba
      : 'Geral';

  const [abaSelecionada, setAbaSelecionada] =
    useState(abaInicial);

  const [transacoes, setTransacoes] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  const [confirmando, setConfirmando] = useState(null);
  const confirmLock = useRef(false);

  const [abrindo, setAbrindo] = useState(null);

  useEffect(() => {
    if (
      typeof aba === 'string' &&
      ['Geral', 'Receitas', 'Despesas'].includes(aba)
    ) {
      setAbaSelecionada(aba);
    }
  }, [aba]);

  async function baixar(anexo) {
    if (abrindo) return;

    setAbrindo(anexo.id);
    setErro('');

    try {
      await abrirAnexo(anexo);
    } catch (error) {
      setErro(error.message);
    } finally {
      setAbrindo(null);
    }
  }

  useFocusEffect(
    useCallback(() => {
      let active = true;

      setCarregando(true);

      apiAutenticada('/financeiro/transacoes')
        .then((response) => {
          if (!active) return;

          setTransacoes(response.transacoes || []);
          setErro('');
        })
        .catch((error) => {
          if (active) {
            setErro(error.message);
          }
        })
        .finally(() => {
          if (active) {
            setCarregando(false);
          }
        });

      return () => {
        active = false;
      };
    }, []),
  );

  async function confirmar(item) {
    if (confirmLock.current) return;

    confirmLock.current = true;
    setConfirmando(item.id);
    setErro('');

    try {
      await apiAutenticada(
        `/financeiro/transacoes/${item.id}/confirmar`,
        {
          method: 'PATCH',
        },
      );

      setTransacoes((items) =>
        items.map((transacao) =>
          transacao.id === item.id
            ? {
              ...transacao,
              status: 'Confirmada',
              podeConfirmar: false,
            }
            : transacao,
        ),
      );
    } catch (error) {
      setErro(error.message);
    } finally {
      confirmLock.current = false;
      setConfirmando(null);
    }
  }

  const transacoesFiltradas = useMemo(() => {
    if (abaSelecionada === 'Geral') {
      return transacoes;
    }

    return transacoes.filter(
      (item) => item.tipo === abaSelecionada,
    );
  }, [abaSelecionada, transacoes]);

  return (
    <AnimatedScreen
      style={styles.container}
      delay={60}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          sharedStyles.paddingBottom120
        }
      >
        {/* FILTROS */}
        <AnimatedCard
          style={styles.filtroContainer}
          delay={40}
        >
          {['Geral', 'Receitas', 'Despesas'].map(
            (option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.botaoFiltro,
                  abaSelecionada === option &&
                  styles.botaoAtivo,
                ]}
                onPress={() =>
                  setAbaSelecionada(option)
                }
              >
                <Text
                  style={[
                    styles.textoFiltro,
                    abaSelecionada === option &&
                    styles.textoAtivo,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </AnimatedCard>

        {/* TRANSAÇÕES */}
        <AnimatedCard
          style={styles.dados}
          delay={220}
        >
          <Text style={styles.dadosTitulo}>
            {abaSelecionada === 'Geral'
              ? 'Transações Recentes'
              : abaSelecionada}
          </Text>

          {erro ? (
            <Text style={styles.dadosTexto}>
              {erro}
            </Text>
          ) : null}

          {carregando ? (
            <ActivityIndicator
              accessibilityLabel="Carregando transações"
              color={colors.primary}
              style={{ marginVertical: 20 }}
            />
          ) : null}

          {transacoesFiltradas.map(
            (item, index) => (
              <AnimatedCard
                key={item.id}
                style={styles.transacaoItem}
                delay={260 + index * 30}
              >
                {/* LADO ESQUERDO */}
                <View style={sharedStyles.flex}>
                  <Text
                    style={
                      styles.transacaoDescricao
                    }
                  >
                    {item.descricao}
                  </Text>

                  <Text
                    style={
                      styles.transacaoCategoria
                    }
                  >
                    {item.categoria} ·{' '}
                    {item.tipoConta}
                  </Text>

                  {item.anexos?.map((anexo) => (
                    <TouchableOpacity
                      key={anexo.id}
                      accessibilityRole="button"
                      accessibilityLabel={`Abrir anexo ${anexo.nome}`}
                      disabled={!!abrindo}
                      onPress={() =>
                        baixar(anexo)
                      }
                      style={{
                        minHeight: 44,
                        justifyContent:
                          'center',
                      }}
                    >
                      <Text
                        style={{
                          color:
                            colors.textLink,
                          fontSize: 13,
                        }}
                      >
                        {abrindo === anexo.id
                          ? 'Baixando...'
                          : `📎 ${anexo.nome}`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* LADO DIREITO */}
                <View
                  style={styles.transacaoDireita}
                >
                  <Text
                    style={[
                      styles.transacaoValor,
                      item.tipo === 'Receitas'
                        ? styles.receita
                        : styles.despesa,
                    ]}
                  >
                    {item.tipo === 'Receitas'
                      ? '+'
                      : '-'}{' '}
                    {formatBRL(item.valor)}
                  </Text>

                  <Text
                    style={
                      styles.transacaoData
                    }
                  >
                    {formatDate(item.data)}
                  </Text>

                  {/* BOTÃO DE CONFIRMAÇÃO */}
                  {item.podeConfirmar ? (
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel={
                        item.tipo ===
                          'Receitas'
                          ? ` ${item.descricao} Recebida`
                          : ` ${item.descricao} paga`
                      }
                      disabled={
                        confirmando === item.id
                      }
                      onPress={() =>
                        confirmar(item)
                      }
                      activeOpacity={0.8}
                      style={{
                        marginTop: 10,
                        minHeight: 25,
                        minWidth: 67,

                        paddingHorizontal: 5,

                        backgroundColor:
                          '#5145FF',

                        borderRadius: 16,

                        alignItems: 'center',
                        justifyContent:
                          'center',

                        opacity:
                          confirmando ===
                            item.id
                            ? 0.7
                            : 1,
                      }}
                    >
                      {confirmando ===
                        item.id ? (
                        <ActivityIndicator
                          size="small"
                          color="#FFFFFF"
                        />
                      ) : (
                        <Text
                          style={{
                            color: '#FFFFFF',
                            fontSize: 13,
                            fontWeight: '600',
                            textAlign:
                              'center',
                          }}
                        >
                          {item.tipo ===
                            'Receitas'
                            ? 'Recebida'
                            : 'Pagar'}
                        </Text>
                      )}
                    </TouchableOpacity>
                  ) : (
                    /* DEPOIS DE CONFIRMAR */
                    <View
                      style={{
                        marginTop: 10,
                        paddingHorizontal: 12,
                        paddingVertical: 7,
                        marginRight: '-6%',
                        borderRadius: 8,

                       
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '600',

                          color:
                            item.status ===
                              'Confirmada'
                              ? '#16A34A'
                              : item.status ===
                                'Pendente'
                                ? '#EAB308'
                                : colors.textSecondary,
                        }}
                      >
                        {item.status ===
                          'Confirmada'
                          ? item.tipo ===
                            'Receitas'
                            ? '✓ Recebida'
                            : '✓ Paga'
                          : item.status}

                        {item.futura &&
                          item.status !==
                          'Cancelada'
                          ? ' · futura'
                          : ''}
                      </Text>
                    </View>
                  )}
                </View>
              </AnimatedCard>
            ),
          )}

          {!carregando &&
            !erro &&
            transacoesFiltradas.length === 0 ? (
            <Text style={styles.dadosTexto}>
              Nenhuma transação cadastrada.
            </Text>
          ) : null}
        </AnimatedCard>
      </ScrollView>

      <BarraNavegacao />
    </AnimatedScreen>
  );
}