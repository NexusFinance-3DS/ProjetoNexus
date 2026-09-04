import React, { useState } from 'react';
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { View, Text, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialIcons';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { inicioStyles as styles, colors, gradients, sharedStyles } from '../styles/styles';
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

function QuickCard({ icon, iconColor, iconBg, title, value, delta, deltaColor, onPress, delay }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400).springify()} style={animStyle}>
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.95, { damping: 12, stiffness: 220 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 10, stiffness: 200 }); }}
        onPress={onPress}
      >
        <View style={styles.card}>
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
  const [saldoVisivel, setSaldoVisivel] = useState(true);
  const { usuario } = useSession();
  const { dados, erro } = useResumoFinanceiro();
  const totals = dados.atual;
  const economiaComp = { percent: dados.economia.percentual, diff: dados.economia.diferenca };

  const renda = totals.totalReceitas;
  const despesa = totals.totalDespesas;
  const valorMeta = dados.meta?.atual || 0;
  const valorTotalMeta = dados.meta?.objetivo || 0;
  const porcentagem = valorTotalMeta > 0 ? Math.min((valorMeta / valorTotalMeta) * 100, 100) : 0;
  const titleMeta = dados.meta?.nome || "Nenhuma meta cadastrada";
  const categoryColors = [colors.primary, colors.danger, colors.success, "#FF9800", "#7C6BFF"];
  const distribuicao = dados.categorias.map((item, index) => ({
    label: item.nome,
    valor: item.valor,
    cor: categoryColors[index % categoryColors.length],
    percentual: renda > 0 ? (item.valor / renda) * 100 : 0,
  }));
  const totalDistribuido = distribuicao.reduce((sum, item) => sum + item.valor, 0);
  const saldoAtual = renda - despesa;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={sharedStyles.paddingBottom130}>

        <View style={styles.header}>
          <Animated.View entering={FadeInUp.duration(400)} style={sharedStyles.screenHeaderRow}>
            <Pressable onPress={() => router.push('/perfil')} style={styles.profileContaine}>
              <View style={styles.profileCircle}>
                <Icon name="person-outline" size={36} color={colors.primary} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.greetingLabel}>{getSaudacao()},</Text>
                <Text style={styles.nome} numberOfLines={1}>{usuario?.nome || "Usuário"}</Text>
              </View>
            </Pressable>

            <Pressable style={styles.bellButton} onPress={() => router.push('/notificacoes')}>
              <Icon name="notifications-none" size={22} color={colors.textPrimary} />
              <View style={styles.bellDot} />
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
                  <Text style={styles.titleSaldo}>Saldo atual</Text>
                  <Pressable
                    hitSlop={10}
                    onPress={(e) => { e.stopPropagation?.(); setSaldoVisivel((v) => !v); }}
                  >
                    <Icon name={saldoVisivel ? "visibility" : "visibility-off"} size={20} color="#fff" />
                  </Pressable>
                </View>
                <Text style={styles.valor}>{saldoVisivel ? formatBRL(saldoAtual) : "••••••"}</Text>
                <View style={styles.saldoFooterRow}>
                  <Icon name="swap-horiz" size={16} color="#fff" />
                  <Text style={styles.saldoFooterText}>Toque para ver o fluxo financeiro</Text>
                </View>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>

        <View style={styles.content}>
          {erro ? <Text style={sharedStyles.errorText}>{erro}</Text> : null}
          <Text style={styles.title}>Visão Rápida</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={sharedStyles.paddingRight16}
          >
            <QuickCard
              delay={0}
              icon="arrow-upward"
              iconColor={colors.success}
              iconBg={colors.successSoft}
              title="Receitas"
              value={formatBRL(renda)}
              onPress={() => router.push({ pathname: '/fluxoFinanceiro', params: { aba: 'Receitas' } })}
            />
            <QuickCard
              delay={80}
              icon="arrow-downward"
              iconColor={colors.danger}
              iconBg={colors.dangerSoft}
              title="Despesas"
              value={formatBRL(despesa)}
              onPress={() => router.push({ pathname: '/fluxoFinanceiro', params: { aba: 'Despesas' } })}
            />
            <QuickCard
              delay={160}
              icon="savings"
              iconColor={colors.primary}
              iconBg={colors.primarySoft}
              title="Economia"
              value={formatBRL(totals.totalReceitas - totals.totalDespesas)}
              delta={`${economiaComp.percent >= 0 ? '+' : '-'}${Math.abs(economiaComp.percent).toFixed(1)}% vs. mês anterior`}
              deltaColor={economiaComp.diff >= 0 ? colors.success : colors.dangerStrong}
              onPress={() => router.push('/dashboard')}
            />
          </ScrollView>

          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.sectionCard}>
            <View style={styles.metaHeaderRow}>
              <Text style={styles.metaHeaderTitle}>Metas em andamento</Text>
              <Text style={styles.verMetasBadge} onPress={() => router.push('/metas')}>Ver metas</Text>
            </View>
            <View style={styles.graficos}>
              <AnimatedCircularProgress
                size={104}
                width={9}
                fill={porcentagem}
                tintColor={colors.primary}
                backgroundColor={colors.surfaceElevated}
                rotation={0}
                lineCap="round"
              >
                {() => (
                  <Text style={sharedStyles.progressPercent}>
                    {Math.round(porcentagem)}%
                  </Text>
                )}
              </AnimatedCircularProgress>
              <View style={styles.metaInfoCol}>
                <Text style={styles.metaTituloTexto}>{titleMeta}</Text>
                <View style={styles.metaBarraFundo}>
                  <View style={[styles.metaBarraPreenchida, { width: `${porcentagem}%` }]} />
                </View>
                <Text style={styles.metaValoresTexto}>{formatBRL(valorMeta)} / {formatBRL(valorTotalMeta)}</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(280).duration(400)} style={styles.sectionCard}>
            <View style={styles.distribuicaoHeader}>
              <Text style={styles.distribuicaoTitle}>Distribuição da renda</Text>
              <Text style={sharedStyles.mutedCaption}>mês atual</Text>
            </View>

            <View style={styles.distribuicaoLista}>
              {distribuicao.map((item) => (
                <View key={item.label} style={styles.distribuicaoItem}>
                  <View style={styles.distribuicaoLabelRow}>
                    <View style={[styles.colorDot, { backgroundColor: item.cor }]} />
                    <Text style={styles.distribuicaoLabel}>{item.label}</Text>
                    <Text style={styles.distribuicaoValor}>{formatBRL(item.valor)}</Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${Math.min(item.percentual, 100)}%`, backgroundColor: item.cor }]} />
                  </View>
                  <Text style={styles.percentText}>{item.percentual.toFixed(1)}% da renda</Text>
                </View>
              ))}
            </View>

            <View style={styles.distribuicaoFooter}>
              <Text style={styles.footerText}>
                Restante no mês: {formatBRL(renda - totalDistribuido)}
              </Text>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      <BarraNavegacao />
    </View>
  );
}
