import { StyleSheet } from "react-native";
import { colors, radii, shadow } from "./theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Cabeçalho com gradiente
  header: {
    paddingTop: 18,
    paddingBottom: 26,
    paddingHorizontal: 16,
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
  },

  profileContaine: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    marginRight: 12,
    minWidth: 0,
  },
  profileCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2.5,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
  },
  profileInfo: {
    marginLeft: 16,
    flexShrink: 1,
    minWidth: 0,
  },
  greetingLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "500",
  },
  nome: {
    color: colors.textPrimary,
    fontSize: 21,
    fontWeight: "bold",
    marginTop: 1,
  },
  email: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  bellButton: {
    width: 44,
    height: 44,
    flexShrink: 0,
    borderRadius: 22,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  bellDot: {
    position: "absolute",
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: colors.surfaceAlt,
  },

  // Saldo
  saldoContainer: {
    marginTop: 20,
    padding: 20,
    borderRadius: radii.xl,
    minHeight: 140,
    ...shadow.glowPrimary,
  },
  saldoTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleSaldo: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(255,255,255,0.85)",
  },
  valor: {
    marginTop: 10,
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  saldoFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },
  saldoFooterText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    marginLeft: 6,
  },

  // Conteúdo
  content: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    marginTop: 22,
    marginBottom: 12,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  card: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: radii.lg,
    marginRight: 12,
    width: 160,
    height: 150,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'flex-start',
  },
  cardIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  cardValue: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  cardDelta: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: "600",
  },

  // Metas
  sectionCard: {
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: radii.lg,
    marginTop: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metaHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  metaHeaderTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "700",
  },
  verMetasBadge: {
    color: "#fff",
    backgroundColor: colors.primaryDeep,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: "600",
    overflow: "hidden",
  },
  graficos: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },
  metaInfoCol: {
    flexDirection: "column",
    marginLeft: 18,
    flex: 1,
  },
  metaTituloTexto: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  metaBarraFundo: {
    width: "100%",
    height: 7,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
    overflow: "hidden",
  },
  metaBarraPreenchida: {
    height: 7,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  metaValoresTexto: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 8,
  },

  // Distribuição de renda
  distribuicaoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  distribuicaoTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "700",
  },
  distribuicaoLista: {
    gap: 12,
  },
  distribuicaoItem: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.md,
    padding: 12,
  },
  distribuicaoLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  distribuicaoLabel: {
    flex: 1,
    color: "#f2f2f2",
    fontSize: 14,
    fontWeight: "600",
  },
  distribuicaoValor: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  progressTrack: {
    height: 7,
    backgroundColor: colors.surface,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressFill: {
    height: "100%",
    borderRadius: 10,
  },
  percentText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  distribuicaoFooter: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  footerText: {
    color: colors.textLink,
    fontSize: 13,
    fontWeight: "600",
  },
});
