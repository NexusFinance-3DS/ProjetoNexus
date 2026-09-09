import { StyleSheet } from "react-native";

import { useTheme } from '../../contexts/ThemeContext';

function createAppStyles(colors) {
const gradients = {
  brand: ["#6C5CE7", "#5145FF", "#1809e0"],
  brandSoft: [colors.primarySoft, colors.surfaceAlt],
  success: ["#2ED573", "#17A863"],
  danger: ["#FF6B6B", "#E23E3E"],
  navBar: [colors.surfaceAlt, colors.backgroundAlt],
  fab: ["#7C6CFF", "#4800FF"],
  header: [colors.surfaceAlt, colors.background],
};

const radii = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 28,
  pill: 999,
};

const shadow = {
  soft: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  glowPrimary: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 14,
    elevation: 10,
  },
};

// barraNavegacao
const barraNavegacaoStyles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    width: "94%",
    maxWidth: 420,
    height: 76,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 8,
    alignSelf: "center",
    zIndex: 10,
    elevation: 6,
  },

  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 58,
    paddingHorizontal: 4,
  },

  tabLabel: {
    fontSize: 10,
    color: colors.textPrimary,
    fontWeight: "500",
    marginTop: 3,
    textAlign: "center",
  },

  // Menu expandido e navegação
  menuExpandido: {
    position: "absolute",
    bottom: 65,
    width: "94%",
    height: "15%",
    maxWidth: 420,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: colors.surfaceAlt,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 9,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: "center",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    zIndex: 8,
  },

  itemMenu: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 56,
    paddingVertical: 4,
  },
  fabPressable: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  fab: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -30,
    backgroundColor: colors.primary,
    borderWidth: 4,
    borderColor: colors.backgroundAlt,
    ...shadow.soft,
  },
  tabPressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 58,
  },
  tabAnimatedContent: {
    alignItems: "center",
  },
  tabPill: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  tabText: {
    fontSize: 10,
    marginTop: 3,
    textAlign: "center",
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 3,
  },
  expandedMenu: {
    position: "absolute",
    bottom: 92,
    width: "94%",
    maxWidth: 420,
    alignSelf: "center",
    paddingHorizontal: 8,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.lg,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    zIndex: 9,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.soft,
  },
  expandedMenuItem: {
    alignItems: "center",
    justifyContent: "center",
    width: "22%",
    paddingVertical: 10,
    marginVertical: 4,
    borderRadius: radii.md,
  },
  expandedMenuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  expandedMenuLabel: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  currentOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    zIndex: 8,
  },
  currentTabBar: {
    position: "absolute",
    bottom: 8,
    alignSelf: "center",
    width: "94%",
    maxWidth: 420,
    zIndex: 10,
    flexDirection: "row",
    minHeight: 76, paddingVertical: 6,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 6,
    alignItems: "center",
    backgroundColor: colors.backgroundAlt,
    ...shadow.soft,
  },
});

// boasVindas
const boasVindasStyles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "stretch",
    paddingHorizontal: 24,
  },

  logo: {
    width: 150,
    height: 150,
    marginBottom: 60,
  },
  illustration: {
    alignSelf: "center",
    width: 200,
    height: 180,
    marginBottom: 60,
  },
  card: {
    width: "100%",
    backgroundColor: colors.surfaceMuted,
    borderRadius: 20,
    alignItems: "center",
  },

  titulo: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
  },

  subtitulo: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    paddingLeft: 20,
    paddingRight:20,
  },

  botao: {
    width: "100%", minHeight: 48,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingLeft: 24,
    paddingBottom: 20,
    paddingTop: 20,
    paddingRight: 24,
    marginTop: 20,
    alignItems: "center",
  },

  textoBotao: {
    color: colors.onPrimary,
    fontSize: 15,
    fontWeight: "bold",
  },

  link: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 10,
    marginBottom: 15,
    textAlign: "center",
  },
});

// cadastro
const cadastroStyles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  content: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 12,
    marginBottom: 4,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 32,
  },

  input: {
    width: "100%",
    minHeight: 52,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    fontSize: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 18,
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 14,
    marginTop: 20,
    alignItems: "center",
  },

  buttonText: {
    color: colors.onPrimary,
    fontSize: 15,
    fontWeight: "bold",
  },

  erro: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 4,
  },

});

// centralAjuda
const centralAjudaStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "stretch",
    paddingHorizontal: 10,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },

  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: "bold",
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    lineHeight: 22,
  },

  card: {
    backgroundColor: colors.surfaceAlt,
    marginHorizontal: 18,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    overflow: "hidden",
  },

  cardTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 12,
  },

  itemMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 18,
  },

  itemLeft: {
    flex: 1, minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
  },

  itemText: {
    color: colors.textPrimary,
    fontSize: 16,
    marginLeft: 15,
    flexShrink: 1,
  },

  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginHorizontal: 18,
  },

  cardInfo: {
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 20,
  },

  cardInfoTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  cardInfoText: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },

  contactButton: {
    backgroundColor: colors.primary,
    marginHorizontal: 18,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  contactText: {
    color: colors.onPrimary,
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

// configuracoes
const configuracoesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "stretch",
    paddingHorizontal: 10,
  },


  card: {
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    marginTop: 18,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.border,
    paddingVertical: 5,
    overflow: "hidden",
  },

  cardTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 12,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  itemLeft: {
    flex: 1, minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
  },

  itemText: {
    flexShrink: 1,
    color: colors.textPrimary,
    fontSize: 17,
    marginLeft: 15,
    fontWeight: "500",
  },

  divider: {
    height: 1,
    backgroundColor: colors.divider,
  },

});

// criarSenha
const criarSenhaStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  content: {
    width: "100%",
    alignItems: "center",
  },

  title: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 15,
  },

  descricao: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },

  label: {
    width: "100%",
    color: colors.textPrimary,
    fontSize: 15,
    marginTop: 11,
    fontWeight: "600",
  },

  input: {
    width: "100%",
    minHeight: 55,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: colors.textPrimary,
    marginTop: 15,
  },

  button: {
    width: "100%",
    height: 45,
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: colors.onPrimary,
    fontSize: 15,
    fontWeight: "bold",
  },

  voltar: {
    color: colors.textPrimary,
    fontSize: 16,
    marginTop: 20,
    textDecorationLine: "underline",
  },

  erro: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 8,
  },
});

// dashboard
const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "stretch",
    paddingHorizontal: 10,
  },

  card: {
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    marginTop: 18,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.border,
    paddingVertical: 5,
    overflow: "hidden",
  },

  cardTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 12,
  },

  resumoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginLeft: 18,
  },

  iconGreen: {
    width: 45,
    height: 45,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  iconRed: {
    width: 45,
    height: 45,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  resumoTitulo: {
    color: colors.textSecondary,
    fontSize: 15,
  },

  resumoValor: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 2,
    marginBottom: 10,
  },

  progress: {
    width: "90%",
    height: 8,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: 8,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },

  percent: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 12, marginLeft: 8,
  },

  // ---------- PIE CHART ----------

  legendaContainer: {
    marginTop: 10,
  },

  legendaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  legendaCor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },

  legendaTexto: {
    color: colors.textPrimary,
    fontSize: 15,
    flex: 1,
  },

  legendaValor: {
    color: colors.textSecondary,
    fontSize: 13,
  },

  // ---------- LINHA ----------

  graficoContainer: {
    flexWrap: "wrap", gap: 12,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginTop: 1,
    paddingHorizontal: 10,
  },

  pieWrapper: {
    width: 200,
    height: 120,
    borderRadius: 100, 
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 0,
  },

  pieChart: {
    borderRadius: 100,
    overflow: "hidden",
  },

  // ---------- RESUMO ----------

  resumoContainer: {
    marginTop: 5,
  },

  // ---------- GERAL ----------

  shadow: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  legenda: {
    minWidth: 140, paddingRight: 12,
    flex: 1,
    marginLeft: 10,
  },

itemLegenda: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 14,
},

corLegenda: {
  width: 14,
  height: 14,
  borderRadius: 7,
  marginRight: 10,
},

textoLegenda: {
    flexShrink: 1,
  color: colors.textPrimary,
  fontSize: 15,
},
    
});

// fluxoFinanceiro
const fluxoFinanceiroStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "stretch",
    paddingHorizontal: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 12,
    marginLeft: 10,
  },

  filtroContainer: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 30,
    padding: 3,
    marginTop: 10,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },

  botaoFiltro: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },

  botaoAtivo: {
    backgroundColor: colors.primary,
  },

  textoFiltro: {
    color: colors.textPrimary,
    fontSize: 14,
  },

  textoAtivo: {
    color: colors.onPrimary,
    fontWeight: "bold",
  },

  resumoContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 20,
    marginHorizontal: 20,
  },

  resumoCard: {
    flexGrow: 1, flexBasis: 160,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    minWidth: 100,
    shadowColor: colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  resumoLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
  },

  resumoValue: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },

  dados: {
    marginTop: 20,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },

  dadosTitulo: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },

  dadosTexto: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 12,
  },

  transacaoItem: {
    flexWrap: "wrap", gap: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  transacaoDescricao: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },

  transacaoCategoria: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },

  transacaoDireita: {
    flexGrow: 1, flexShrink: 1,
    alignItems: "flex-end",
  },

  transacaoValor: {
    fontSize: 16,
    fontWeight: "700",
  },

  receita: {
    color: colors.success,
  },

  despesa: {
    color: colors.danger,
  },

  transacaoData: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
});

// inicio
const inicioStyles = StyleSheet.create({
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
    color: colors.onPrimary,
  },
  valor: {
    marginTop: 10,
    fontSize: 36,
    fontWeight: "bold",
    color: colors.onPrimary,
  },
  saldoFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },
  saldoFooterText: {
    flexShrink: 1,
    color: colors.onPrimary,
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
    minHeight: 150,
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
    flexWrap: "wrap", gap: 8,
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
    color: colors.onPrimary,
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
    flexWrap: "wrap", gap: 8,
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
    flexWrap: "wrap", rowGap: 8,
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
    color: colors.textPrimary,
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

// layout
const layoutStyles = StyleSheet.create({
  header: {
    backgroundColor: colors.background,
  },

  titulo: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
  },

  tela: {
    backgroundColor: colors.background,
  },
});

// login
const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  titulo: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 12,
    color: colors.textPrimary,
    fontSize: 15,
  },
  botao: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 14,
    marginTop: 20,
    alignItems: "center",
  },
  textoBotao: {
    color: colors.onPrimary,
    fontSize: 15,
    fontWeight: "bold",
  },
  link: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 16,
    textAlign: "center",
  },

  link2: {
    color: colors.textLink,
    fontSize: 12,
    marginTop: 16,
    textAlign: "left",
  },

  erro: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 8,
  },
});

// metas
const metasStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "stretch",
    paddingHorizontal: 10,
  },

  title: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 25,
    paddingHorizontal: 10,
  },

  card: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 20,
    padding: 18,
    marginHorizontal: '5%',
    marginBottom: 18,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  nomeMeta: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
    flex: 1,
  },

  progressBackground: {
    width: "100%",
    height: 10,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 50,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 50,
  },

  infoLinha: {
    flexWrap: "wrap", gap: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  valor: {
    color: colors.textSecondary,
    fontSize: 15,
  },

  porcentagem: {
    color: colors.textLink,
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 12,
    textAlign: "right",
  },

  botaoAdicionar: {
    position: "absolute",
    bottom: 95,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 25,
    height: 55,
    borderRadius: 30,
    elevation: 10,
  },

  botaoTexto: {
    color: colors.onPrimary,
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 8,
  },

  modalBackground: {
    flexGrow: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },

  modal: {
    maxWidth: 520,
    width: "100%",
    backgroundColor: colors.surfaceMuted,
    borderRadius: 25,
    padding: 22,
  },

  modalTitulo: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    width: "100%",
    minHeight: 55,
    backgroundColor: colors.input,
    borderRadius: 14,
    paddingHorizontal: 15,
    color: colors.textPrimary,
    fontSize: 16,
    marginBottom: 15,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  cancelar: {
    width: "47%",
    minHeight: 50, paddingVertical: 12, paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  cancelarTexto: {
    color: colors.textPrimary,
    fontWeight: "bold",
    fontSize: 16,
  },

  salvar: {
    width: "47%",
    minHeight: 50, paddingVertical: 12, paddingHorizontal: 8,
    backgroundColor: colors.primary,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  salvarTexto: {
    color: colors.onPrimary,
    fontWeight: "bold",
    fontSize: 16,
  },
});

// meuCadastro
const meuCadastroStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "stretch",
    paddingHorizontal: 10,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },

  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: "bold",
  },

  card: {
    marginTop: 20,
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  profileCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    backgroundColor: colors.surfaceAlt,
  },

  profileInfo: {
    flex: 1,
  },

  profileName: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "bold",
  },

  profileEmail: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },

  profileSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },

  cardTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 18,
  },

  input: {
    width: "100%",
    minHeight: 55,
    backgroundColor: colors.input,
    color: colors.textPrimary,
    fontSize: 16,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },

  itemButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: colors.input,
    borderRadius: 14,
  },

  itemLeft: {
    flex: 1, minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
  },

  itemText: {
    flexShrink: 1,
    color: colors.textPrimary,
    fontSize: 16,
    marginLeft: 14,
  },

  saveButton: {
    backgroundColor: colors.primary,
    padding: 14,
    marginHorizontal: 18,
    marginTop: 10,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  saveButtonText: {
    color: colors.onPrimary,
    fontSize: 15,
    fontWeight: "bold",
  },
});

// notificacoes
const notificacoesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "stretch",
    paddingHorizontal: 10,
  },

  header: {
    marginTop: 1,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  subTitle: {
    color: colors.textSecondary,
    fontSize: 16,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },

  card: {
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    marginBottom: 15,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  cardNova: {
    borderLeftWidth: 5,
    borderLeftColor: colors.primary,
  },

  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  textContainer: {
    flex: 1,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "bold",
    flex: 1,
  },

  descricao: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },

  hora: {
    color: colors.textSecondary,
    fontSize: 13,
    marginLeft: 10,
  },

  bolinha: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginLeft: 10,
    alignSelf: "flex-start",
    marginTop: 8,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    marginTop: 80,
  },

  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
  },

  emptyText: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },
});

// novaDespesa
const novaDespesaStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "stretch",
    paddingHorizontal: 10,
  },
  titulo:{
    flexShrink: 1,
    color: colors.textPrimary,
    marginLeft:10,
    fontSize: 19,
    fontWeight: "600",
  },
  addValor:{
    flexWrap: "wrap", gap: 12,
    flexDirection: "row",
    backgroundColor: colors.surfaceMuted,
    padding: 12,
    margin: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: 'space-between',
  },

  InputValor:{
    color: colors.danger,
    borderRadius: 10,
    flexGrow: 1, flexBasis: 140, minWidth: 0,
    backgroundColor: colors.input,
    minHeight: 46,
    paddingHorizontal: 10,
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: 17,
  },
  valorWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    marginLeft: 12,
  },
  currency: {
    color: colors.danger,
    fontWeight: '700',
    marginRight: 8,
    fontSize: 18,
  },
  input: {
    width: "100%",
    minHeight: 46,
    backgroundColor: colors.input,
    color: colors.textPrimary,
    fontSize: 15,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  inputFull: {
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  listItemText: {
    flexShrink: 1,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  listItemSub: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  saveWrapper: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.onPrimary,
    fontWeight: '600',
    fontSize: 15,
  },
})

// novaReceita
const novaReceitaStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "stretch",
    paddingHorizontal: 10,
  },
  titulo:{
    flexShrink: 1,
    color: colors.textPrimary,
    marginLeft:10,
    fontSize: 19,
    fontWeight: "600",
  },
  addValor:{
    flexWrap: "wrap", gap: 12,
    flexDirection: "row",
    backgroundColor: colors.surfaceMuted,
    padding: 12,
    margin: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: 'space-between',
  },

  InputValor:{
    color: colors.success,
    borderRadius: 10,
    flexGrow: 1, flexBasis: 140, minWidth: 0,
    backgroundColor: colors.input,
    minHeight: 46,
    paddingHorizontal: 10,
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: 17,
  },
  valorWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    marginLeft: 12,
  },
  currency: {
    color: colors.success,
    fontWeight: '700',
    marginRight: 8,
    fontSize: 18,
  },
  input: {
    width: "100%",
    minHeight: 46,
    backgroundColor: colors.input,
    color: colors.textPrimary,
    fontSize: 15,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  inputFull: {
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  listItemText: {
    flexShrink: 1,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  listItemSub: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  saveWrapper: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.onPrimary,
    fontWeight: '600',
    fontSize: 15,
  },
})

// novaSenha
const novaSenhaStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  content: {
    width: "100%",
    alignItems: "center",
  },

  title: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 15,
  },

  descricao: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },

  label: {
    width: "100%",
    color: colors.textPrimary,
    fontSize: 15,
    marginTop: 11,
    fontWeight: "600",
  },

  input: {
    width: "100%",
    minHeight: 55,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: colors.textPrimary,
    marginTop: 15,
  },

  button: {
    width: "100%",
    height: 45,
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: colors.onPrimary,
    fontSize: 15,
    fontWeight: "bold",
  },

  voltar: {
    color: colors.textPrimary,
    fontSize: 16,
    marginTop: 20,
    textDecorationLine: "underline",
  },

  erro: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 8,
  },
});

// perfil
const perfilStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "stretch",
    paddingHorizontal: 10,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 55,
    marginBottom: 30,
  },

  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "bold",
  },

  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 30,
  },

  profileCircle: {
    width: 85,
    height: 85,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },

  profileInfo: {
    marginLeft: 18,
    flex: 1,
  },

  settingsButton: {
    marginLeft: "auto",
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  nome: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "bold",
  },

  email: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 4,
  },

  resumoCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 15,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 25,
  },

  resumoTitulo: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },

  resumoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  itemResumo: {
    alignItems: "center",
    flex: 1,
  },

  labelResumo: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 8,
    marginBottom: 5,
    textAlign: "center",
  },

  valorResumo: {
    color: colors.textPrimary,
    fontWeight: "bold",
    fontSize: 13,
    textAlign: "center",
  },

  menuCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 15,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
    overflow: "hidden",
  },

  itemMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  itemLeft: {
    flex: 1, minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
  },

  itemTexto: {
    flexShrink: 1,
    color: colors.textPrimary,
    fontSize: 16,
    marginLeft: 15,
  },

  modalBackground: {
  flex: 1,
  backgroundColor: colors.overlay,
  justifyContent: "center",
  alignItems: "center",
},

modal: {
    maxWidth: 520,
  width: "85%",
  backgroundColor: colors.surface,
  borderRadius: 25,
  padding: 25,
  alignItems: "center",
},

modalIcon: {
  width: 75,
  height: 75,
  borderRadius: 40,
  backgroundColor: colors.primary,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 20,
},

modalTitulo: {
  color: colors.textPrimary,
  fontSize: 24,
  fontWeight: "bold",
},

modalTexto: {
  color: colors.textSecondary,
  fontSize: 16,
  textAlign: "center",
  marginTop: 12,
  marginBottom: 30,
},

modalButtons: {
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
},

cancelar: {
  width: "47%",
  minHeight: 50, paddingVertical: 12, paddingHorizontal: 8,
  borderRadius: 15,
  borderWidth: 1,
  borderColor: colors.primary,
  justifyContent: "center",
  alignItems: "center",
},

cancelarTexto: {
  color: colors.textPrimary,
  fontSize: 16,
  fontWeight: "bold",
},

sair: {
  width: "47%",
  minHeight: 50, paddingVertical: 12, paddingHorizontal: 8,
  borderRadius: 15,
  backgroundColor: colors.primary,
  justifyContent: "center",
  alignItems: "center",
},

sairTexto: {
  color: colors.onPrimary,
  fontSize: 16,
  fontWeight: "bold",
},
});

// recuperarSenha
const recuperarSenhaStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  content: {
    width: "100%",
    alignItems: "center",
  },

  title: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 15,
  },

  descricao: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },

  inputContainer1: {
    width: "100%",
    marginBottom: 20,
  },

  input: {
    width: "100%",
    minHeight: 55,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: colors.textPrimary,
    marginTop: 25,
  },

  button: {
    width: "100%",
    height: 45,
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: colors.onPrimary,
    fontSize: 15,
    fontWeight: "bold",
  },

  voltar: {
    color: colors.textPrimary,
    fontSize: 16,
    marginTop: 20,
    textDecorationLine: "underline",
  },

  erro: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 8,
  },
});

// relatorios
const relatoriosStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "stretch",
    paddingHorizontal: 10,
  },

  card: {
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    marginBottom: 5,
    marginTop: 20,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },

  cardTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  pickerContainer: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },

  picker: {
    color: colors.textPrimary,
    height: 55,
  },

  itemResumo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  textos: {
    marginLeft: 15,
    flex: 1,
  },

  label: {
    color: colors.textSecondary,
    fontSize: 15,
    marginBottom: 3,
  },

  valor: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "bold",
  },

  button: {
     backgroundColor: colors.primary,
    padding: 14,
    marginHorizontal: 18,
    marginTop: 10,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  buttonText: {
    color: colors.onPrimary,
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

// sobreApp
const sobreAppStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "stretch",
    paddingHorizontal: 10,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },

  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "bold",
  },

  mainCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    marginTop: 10,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },

  appName: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: "600",
  },

  featuresCard: {
    backgroundColor: colors.featuresCard,
    marginHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 18,
  },

  featuresTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },

  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  featureTexts: {
    flex: 1,
  },

  featureTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },

  featureText: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },

  infoCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },

  infoTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },

  infoText: {
    color: colors.textSecondary,
    fontSize: 13,
  },

  link: {
    color: colors.textLink,
    marginTop: 8,
    fontWeight: "700",
  },

  contactCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 18,
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  contactLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  contactText: {
    flexShrink: 1,
    color: colors.textPrimary,
    fontSize: 15,
    marginLeft: 10,
  },

  footer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },

  footerApp: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 6,
  },

  footerCopy: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});

const keyboardStyles = StyleSheet.create({
  authScrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingTop: 24,
    paddingBottom: 48,
  },
  authForm: {
    width: "100%",
    flexShrink: 0,
  },
  avoidingView: {
    flex: 1,
  },
  centeredScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 24,
    paddingBottom: 48,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 24,
  },
});

const sharedStyles = StyleSheet.create({
  errorText: {
    color: colors.danger,
    fontSize: 14,
    marginVertical: 10,
    textAlign: "center",
  },
  flex: {
    minWidth: 0,
    flex: 1,
  },
  bottomSpacer: {
    height: 100,
  },
  paddingBottomNegative100: {
    paddingBottom: -100,
  },
  paddingBottom10: {
    paddingBottom: 10,
  },
  paddingBottom120: {
    paddingBottom: 120,
  },
  paddingBottom130: {
    paddingBottom: 130,
  },
  paddingBottom150: {
    paddingBottom: 150,
  },
  paddingRight16: {
    paddingRight: 16,
  },
  rowCentered: {
    flexDirection: "row",
    alignItems: "center",
  },
  screenHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  formLabel: {
    color: colors.textPrimary,
    marginLeft: 10,
    marginBottom: 5,
    fontSize: 16,
  },
  loginLogo: {
    flexShrink: 0,
    alignSelf: "center",
    width: 150,
    height: 150,
    marginBottom: 24,
  },
  dashboardChart: {
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  reportChart: {
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 5,
  },
  progressPercent: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "bold",
  },
  mutedCaption: {
    color: colors.textMuted,
    fontSize: 12,
  },
  textAlignRight: {
    textAlign: "right",
  },
  multilineInput: {
    minHeight: 100, textAlignVertical: "top",
  },
  positiveText: {
    color: colors.success,
  },
  negativeText: {
    color: colors.danger,
  },
  marginTop15: {
    marginTop: 15,
  },
  featurePurple: {
    backgroundColor: colors.featurePurple,
  },
  featureBlue: {
    backgroundColor: colors.featureBlue,
  },
  featureViolet: {
    backgroundColor: colors.featureViolet,
  },
  featureRed: {
    backgroundColor: colors.featureRed,
  },
});

const navigationScreenOptions = {
  headerShown: false,
  headerStyle: {
    backgroundColor: colors.background,
  },
  headerTintColor: colors.textPrimary,
  headerTitleStyle: {
    fontWeight: "600",
  },
  contentStyle: {
    backgroundColor: colors.background,
  },
};

return { colors, gradients, radii, shadow, barraNavegacaoStyles, boasVindasStyles, cadastroStyles, centralAjudaStyles, configuracoesStyles, criarSenhaStyles, dashboardStyles, fluxoFinanceiroStyles, inicioStyles, layoutStyles, loginStyles, metasStyles, meuCadastroStyles, notificacoesStyles, novaDespesaStyles, novaReceitaStyles, novaSenhaStyles, perfilStyles, recuperarSenhaStyles, relatoriosStyles, sobreAppStyles, keyboardStyles, sharedStyles, navigationScreenOptions };
}

const cache = new WeakMap();
export function useAppStyles() {
  const { colors } = useTheme();
  if (!cache.has(colors)) cache.set(colors, createAppStyles(colors));
  return cache.get(colors);
}
