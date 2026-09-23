import FinancialOverview from '../../components/FinancialOverview';
import { AnimatedScreen } from '../components/AnimatedScreen';
import React, { useState } from 'react';
import AnimatedCircularProgress from '../../components/ProgressRing';
import {
  ActivityIndicator,
  View,
  Text,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialIcons';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { useAppStyles } from '../styles/styles';
import BarraNavegacao from '../components/BarraNavegacao';
import { formatBRL } from '../../services/financeiro';
import { useResumoFinanceiro } from '../../hooks/useResumoFinanceiro';
import { useSession } from '../../contexts/SessionContext';

function getSaudacao() {
  const hora = new Date().getHours();
  if (hora < 12) return 'Bom dia';
  if (hora < 18) return 'Boa tarde';
  return 'Boa noite';
}

function QuickCard({
  icon,
  iconColor,
  iconBg,
  title,
  value,
  delta,
  deltaColor,
  onPress,
  delay,
  width,
}) {
  const { inicioStyles: styles } = useAppStyles();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400).springify()} style={animStyle}>
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.95, { damping: 12, stiffness: 220 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 10, stiffness: 200 });
        }}
        onPress={onPress}
      >
        <View style={[styles.card, { width }]}>
          <View style={[styles.cardIconBadge, { backgroundColor: iconBg }]}>
            <Icon name={icon} size={22} color={iconColor} />
          </View>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardValue}>{value}</Text>
          {delta ? <Text style={[styles.cardDelta, { color: deltaColor }]}>{delta}</Text> : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function Inicial() {
  const { inicioStyles: styles, colors, gradients, sharedStyles } = useAppStyles();
  const { width, fontScale } = useWindowDimensions();
  const compact = width < 380 || fontScale > 1.3;
  const [quickWidth, setQuickWidth] = useState(160);
  const [saldoVisivel, setSaldoVisivel] = useState(true);
  const { usuario } = useSession();
  const { dados, erro, carregando, recarregar } = useResumoFinanceiro();
  const amount = (value) => (saldoVisivel ? formatBRL(value) : '******');
  const totals = dados.atual;
  const economiaComp = { percent: dados.economia.percentual, diff: dados.economia.diferenca };

  const renda = totals.totalReceitas;
  const despesa = totals.totalDespesas;
  const valorMeta = dados.meta?.atual || 0;
  const valorTotalMeta = dados.meta?.objetivo || 0;
  const porcentagem = valorTotalMeta > 0 ? Math.min((valorMeta / valorTotalMeta) * 100, 100) : 0;
  const titleMeta = dados.meta?.nome || 'Nenhuma meta em andamento';
  const saldoAtual = dados.saldoDisponivel;

  return (
    <AnimatedScreen style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={sharedStyles.paddingBottom130}
      >
        <View style={styles.header}>
          <Animated.View entering={FadeInUp.duration(400)} style={sharedStyles.screenHeaderRow}>
            <Pressable onPress={() => router.push('/perfil')} style={styles.profileContaine}>
              <View style={styles.profileCircle}>
                <Icon name="person-outline" size={36} color={colors.primary} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.greetingLabel}>{getSaudacao()},</Text>
                <Text style={styles.nome} numberOfLines={1}>
                  {usuario?.nome || 'Usuário'}
                </Text>
              </View>
            </Pressable>

            <Pressable style={styles.bellButton} onPress={() => router.push('/notificacoes')}>
              <Icon name="notifications-none" size={22} color={colors.textPrimary} />
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(80).duration(400)}>
            <Pressable onPress={() => router.push('/fluxoFinanceiro')}>
              <LinearGradient
                colors={gradients.brand}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.saldoContainer}
              >
                <View style={styles.saldoTopRow}>
                  <Text style={styles.titleSaldo}>Saldo disponível</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={saldoVisivel ? 'Ocultar valores' : 'Mostrar valores'}
                    hitSlop={10}
                    onPress={(e) => {
                      e.stopPropagation?.();
                      setSaldoVisivel((v) => !v);
                    }}
                  >
                    <Icon
                      name={saldoVisivel ? 'visibility' : 'visibility-off'}
                      size={20}
                      color={colors.onPrimary}
                    />
                  </Pressable>
                </View>
                <Text style={styles.valor}>
                  {carregando ? 'Carregando...' : erro ? 'Indisponível' : amount(saldoAtual)}
                </Text>
                <View style={styles.saldoFooterRow}>
                  <Icon name="swap-horiz" size={16} color={colors.onPrimary} />
                  <Text style={styles.saldoFooterText}>Toque para ver o fluxo financeiro</Text>
                </View>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>

        <View style={styles.content}>
          {carregando ? (
            <ActivityIndicator
              accessibilityLabel="Carregando resumo financeiro"
              color={colors.primary}
            />
          ) : null}
          {erro ? (
            <View>
              <Text style={sharedStyles.errorText}>{erro}</Text>
              <Pressable
                accessibilityRole="button"
                onPress={recarregar}
                style={{ minHeight: 44, justifyContent: 'center' }}
              >
                <Text style={{ color: colors.textLink }}>Tentar novamente</Text>
              </Pressable>
            </View>
          ) : null}
          {!carregando && !erro ? (
            <>
             <Text style={[styles.title, { marginTop: -10 }]}>
  Visão Rápida
</Text>
              <Text style={{color: '#bdbdbd', marginTop: -15, marginBottom: 10}}>Realizado no mês até hoje</Text>
              <ScrollView
                horizontal
                onLayout={({ nativeEvent }) =>
                  setQuickWidth(Math.max(160, Math.floor((nativeEvent.layout.width - 36) / 3)))
                }
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={sharedStyles.paddingRight16}
              >
                <QuickCard
                  width={190}
                  delay={0}
                  icon="arrow-upward"
                  iconColor={colors.success}
                  iconBg={colors.successSoft}
                  title="Receitas realizadas"
                  value={amount(renda)}
                  onPress={() =>
                    router.push({ pathname: '/fluxoFinanceiro', params: { aba: 'Receitas' } })
                  }
                />
                <QuickCard
                  width={190}
                  delay={80}
                  icon="arrow-downward"
                  iconColor={colors.danger}
                  iconBg={colors.dangerSoft}
                  title="Despesas realizadas"
                  value={amount(despesa)}
                  onPress={() =>
                    router.push({ pathname: '/fluxoFinanceiro', params: { aba: 'Despesas' } })
                  }
                />
                <QuickCard
                  width={190}
                  height={150}
                  delay={160}
                  icon="savings"
                  iconColor={colors.primary}
                  iconBg={colors.primarySoft}
                  title="Resultado mensal"
                  value={amount(totals.saldo)}
                  delta={
                    !saldoVisivel
                      ? 'Comparação oculta'
                      : economiaComp.percent === null
                        ? 'Sem base de comparação'
                        : `${economiaComp.percent >= 0 ? '+' : '-'}${Math.abs(economiaComp.percent).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}% vs. mês anterior`
                  }
                  deltaColor={economiaComp.diff >= 0 ? colors.success : colors.dangerStrong}
                  onPress={() => router.push('/dashboard')}
                />
              </ScrollView>

              <FinancialOverview dados={dados} visible={saldoVisivel} home />

              <Animated.View
                entering={FadeInDown.delay(200).duration(400)}
                style={styles.sectionCard}
              >
                <View style={styles.metaHeaderRow}>
                  <Text style={styles.metaHeaderTitle}>Metas em andamento</Text>
                  <Text style={styles.verMetasBadge} onPress={() => router.push('/metas')}>
                    Ver metas
                  </Text>
                </View>
                <View
                  style={[
                    styles.graficos,
                    compact && { flexDirection: 'column', alignItems: 'stretch' },
                  ]}
                >
                  <AnimatedCircularProgress
                    size={104}
                    width={9}
                    fill={saldoVisivel ? porcentagem : 0}
                    tintColor={colors.primary}
                    backgroundColor={colors.surfaceElevated}
                    rotation={0}
                    lineCap="round"
                  >
                    {() => (
                      <Text style={sharedStyles.progressPercent}>
                        {saldoVisivel ? `${Math.round(porcentagem)}%` : '•••'}
                      </Text>
                    )}
                  </AnimatedCircularProgress>
                  <View style={[styles.metaInfoCol, compact && { marginLeft: 0, marginTop: 16 }]}>
                    <Text style={styles.metaTituloTexto}>{titleMeta}</Text>
                    <View style={styles.metaBarraFundo}>
                      <View
                        style={[
                          styles.metaBarraPreenchida,
                          { width: `${saldoVisivel ? porcentagem : 0}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.metaValoresTexto}>
                      {amount(valorMeta)} / {amount(valorTotalMeta)}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            </>
          ) : null}
        </View>
      </ScrollView>

      <BarraNavegacao />
    </AnimatedScreen>
  );
}
