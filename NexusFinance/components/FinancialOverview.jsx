import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { router } from 'expo-router';
import MeasuredChart from './MeasuredChart';
import { useThemedStyles } from '../contexts/ThemeContext';
import { useAppStyles } from '../app/styles/styles';
import { formatBRL } from '../services/financeiro';

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const monthLabel = (period) => `${MONTHS[Number(period.slice(5, 7)) - 1]}/${period.slice(2, 4)}`;

function Card({ title, subtitle, children, style, action, onPress }) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.card, style]}>
      <View style={styles.heading}>
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        {action ? (
          <Pressable accessibilityRole="button" onPress={onPress} style={styles.link}>
            <Text style={styles.linkText}>{action}</Text>
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.caption}>{subtitle}</Text>
      {children}
    </View>
  );
}

export default function FinancialOverview({ dados, visible = true, home = false }) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppStyles();
  const { width, fontScale } = useWindowDimensions();
  const wide = width >= 900 && fontScale <= 1.3;
  const amount = (value) => (visible ? formatBRL(value) : '••••••');
  const current = dados.atual;
  const forecast = dados.previsao;
  const hasHistory = dados.historico.some((item) => item.receitas !== 0 || item.despesas !== 0);
  const palette = [
    colors.primary,
    colors.chartPurple,
    colors.chartBlue,
    colors.chartOrange,
    colors.danger,
    colors.success,
  ];
  const reference = dados.dataReferencia
    ? `Até ${dados.dataReferencia.slice(8, 10)}/${dados.dataReferencia.slice(5, 7)}/${dados.dataReferencia.slice(0, 4)}`
    : 'Mês atual';
  const comparison =
    dados.economia.percentual === null
      ? 'Sem base de comparação'
      : `${dados.economia.percentual >= 0 ? '+' : ''}${dados.economia.percentual.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}% em relação ao mês anterior completo`;

  return (
    <View style={styles.overview}>
      <View style={[styles.grid, wide && styles.columns]}>
        <Card
          title="Resumo financeiro"
          subtitle={`${reference} · valores realizados e previsão do mês`}
          style={wide && styles.column}
          action={home ? 'Ver relatórios' : undefined}
          onPress={() => router.push('/relatorios')}
        >
          {[
            ['Receitas', current.totalReceitas, forecast.totalReceitas, colors.success],
            ['Despesas', current.totalDespesas, forecast.totalDespesas, colors.danger],
            [
              'Resultado do mês',
              current.saldo,
              forecast.saldo,
              current.saldo < 0 ? colors.danger : colors.textLink,
            ],
          ].map(([label, realized, predicted, color]) => (
            <View key={label} style={styles.summaryRow}>
              <Text style={styles.rowLabel}>{label}</Text>
              <View style={styles.values}>
                <View style={styles.valueColumn}>
                  <Text style={styles.small}>Realizado</Text>
                  <Text style={[styles.amount, { color }]}>{amount(realized)}</Text>
                </View>
                <View style={styles.valueColumn}>
                  <Text style={styles.small}>Previsto no mês</Text>
                  <Text style={styles.amount}>{amount(predicted)}</Text>
                </View>
              </View>
            </View>
          ))}
          <Text style={styles.caption}>{visible ? comparison : 'Comparação oculta'}</Text>
          <View style={styles.forecast}>
            <Text style={styles.rowLabel}>Saldo previsto no fim do mês</Text>
            <Text
              style={[
                styles.bigAmount,
                { color: dados.saldoPrevisto < 0 ? colors.danger : colors.textLink },
              ]}
            >
              {amount(dados.saldoPrevisto)}
            </Text>
            <Text style={styles.caption}>
              Saldo disponível + valores a realizar até o fim do mês, incluindo pendências
              anteriores.
            </Text>
          </View>
        </Card>

        <Card
          title="Evolução dos resultados"
          subtitle="Últimos 6 meses · receitas menos despesas realizadas"
          style={wide && styles.column}
          action={home ? 'Ver dashboard' : undefined}
          onPress={() => router.push('/dashboard')}
        >
          {!visible ? (
            <Text style={styles.empty}>Gráfico oculto para proteger seus valores.</Text>
          ) : (
            <>
              {!hasHistory ? (
                <Text style={styles.empty}>
                  Nenhuma movimentação realizada nos últimos seis meses.
                </Text>
              ) : null}
              {dados.historico.length > 0 ? (
                <MeasuredChart>
                  {(chartWidth) => (
                    <LineChart
                      data={{
                        labels: dados.historico.map((item) => monthLabel(item.periodo)),
                        datasets: [{ data: dados.historico.map((item) => item.saldo) }],
                      }}
                      width={chartWidth}
                      height={210}
                      fromZero
                      withShadow={false}
                      withOuterLines={false}
                      formatYLabel={(value) =>
                        Number(value).toLocaleString('pt-BR', {
                          notation: 'compact',
                          maximumFractionDigits: 1,
                        })
                      }
                      chartConfig={{
                        backgroundGradientFrom: colors.surface,
                        backgroundGradientTo: colors.surface,
                        decimalPlaces: 0,
                        color: () => colors.primary,
                        labelColor: () => colors.textSecondary,
                        propsForBackgroundLines: { stroke: colors.divider },
                        propsForLabels: { fontSize: 10 },
                      }}
                    />
                  )}
                </MeasuredChart>
              ) : null}
              <Text style={styles.small}>
                Valores em reais (R$). O mês atual considera somente até hoje.
              </Text>
              <View style={styles.history}>
                {dados.historico.map((item) => (
                  <View style={styles.historyRow} key={item.periodo}>
                    <Text style={styles.caption}>{monthLabel(item.periodo)}</Text>
                    <Text
                      style={[
                        styles.historyValue,
                        { color: item.saldo < 0 ? colors.danger : colors.textPrimary },
                      ]}
                    >
                      {formatBRL(item.saldo)}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </Card>
      </View>

      <Card title="Gastos por categoria" subtitle="Participação nas despesas realizadas do mês">
        {!visible ? (
          <Text style={styles.empty}>Distribuição oculta para proteger seus valores.</Text>
        ) : dados.categorias.length === 0 ? (
          <Text style={styles.empty}>
            Nenhuma despesa realizada neste mês. Despesas pendentes aparecem apenas na previsão.
          </Text>
        ) : (
          dados.categorias.map((item, index) => {
            const percent =
              current.totalDespesas > 0 ? (item.valor / current.totalDespesas) * 100 : 0;
            return (
              <View key={item.nome} style={styles.category}>
                <View style={styles.categoryHeading}>
                  <Text style={styles.rowLabel}>{item.nome}</Text>
                  <Text style={styles.amount}>{formatBRL(item.valor)}</Text>
                </View>
                <View style={styles.track}>
                  <View
                    style={[
                      styles.fill,
                      {
                        width: `${Math.min(100, percent)}%`,
                        backgroundColor: palette[index % palette.length],
                      },
                    ]}
                  />
                </View>
                <Text style={styles.small}>
                  {percent.toLocaleString('pt-BR', {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                  % das despesas
                </Text>
              </View>
            );
          })
        )}
      </Card>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    overview: { gap: 16, marginTop: 18 },
    grid: { gap: 16 },
    columns: { flexDirection: 'row', alignItems: 'stretch' },
    column: { flex: 1, minWidth: 0 },
    card: {
      padding: 18,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    heading: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: 4,
    },
    title: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, flexShrink: 1 },
    caption: { fontSize: 13, lineHeight: 20, color: colors.textSecondary },
    link: { minHeight: 44, justifyContent: 'center' },
    linkText: { color: colors.textLink, fontWeight: '600', fontSize: 13 },
    summaryRow: {
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
      gap: 8,
    },
    rowLabel: { color: colors.textPrimary, fontSize: 14, fontWeight: '600', flexShrink: 1 },
    values: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
    valueColumn: { flex: 1, minWidth: 105, gap: 4 },
    small: { color: colors.textSecondary, fontSize: 12, lineHeight: 18 },
    amount: { color: colors.textPrimary, fontSize: 16, fontWeight: '700', flexShrink: 1 },
    forecast: {
      marginTop: 16,
      padding: 14,
      borderRadius: 14,
      backgroundColor: colors.surfaceElevated,
      gap: 8,
    },
    bigAmount: { fontSize: 24, fontWeight: '700' },
    empty: { marginVertical: 20, fontSize: 14, lineHeight: 22, color: colors.textSecondary },
    history: { marginTop: 12, gap: 6 },
    historyRow: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 },
    historyValue: { fontSize: 13, fontWeight: '600' },
    category: { marginTop: 18, gap: 8 },
    categoryHeading: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 8,
    },
    track: {
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.surfaceElevated,
      overflow: 'hidden',
    },
    fill: { height: '100%', borderRadius: 4 },
  });
