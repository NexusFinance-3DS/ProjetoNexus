// Estilos do NexusFinance. Valores originais preservados por tela.
import { StyleSheet } from "react-native";

// Tema central do NexusFinance
// Reúne as cores já usadas no projeto em um único lugar, para manter
// consistência visual entre a tela inicial, a barra de navegação e,
// futuramente, as demais telas.

export const colors = {
  // Fundo
  background: "#0f0f0f",
  backgroundAlt: "#0f0f13",
  surface: "#1c1c1c",
  surfaceAlt: "#181820",
  surfaceElevated: "#222226",
  // Marca / destaque (indigo-violeta)
  primary: "#5145FF",
  primaryDark: "#1809e0",
  primaryDeep: "#4800FF",
  primarySoft: "rgba(81, 69, 255, 0.16)",
  // Estados
  success: "#2ED573",
  successSoft: "rgba(46, 213, 115, 0.16)",
  danger: "#FF6B6B",
  dangerStrong: "#FF4D4D",
  dangerSoft: "rgba(255, 107, 107, 0.16)",
  warning: "#FFC542",
  // Texto
  textPrimary: "#FFFFFF",
  textSecondary: "#A5A5A5",
  textMuted: "#9fa8c3",
  textLink: "#cfd8ff",
  // Bordas / linhas
  border: "#201f2c",
  divider: "#2a2a32",
  overlay: "rgba(0,0,0,0.55)"
};
export const gradients = {
  brand: ["#6C5CE7", "#5145FF", "#1809e0"],
  brandSoft: ["#2A2470", "#1c1c2e"],
  success: ["#2ED573", "#17A863"],
  danger: ["#FF6B6B", "#E23E3E"],
  navBar: ["rgba(24,24,32,0.97)", "rgba(12,12,16,0.99)"],
  fab: ["#7C6CFF", "#4800FF"],
  header: ["#171433", "#0f0f0f"]
};
export const radii = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 28,
  pill: 999
};
export const shadow = {
  soft: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6
  },
  glowPrimary: {
    shadowColor: "#5145FF",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.55,
    shadowRadius: 14,
    elevation: 10
  }
};

// barraNavegacao
export const barraNavegacaoStyles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    width: "94%",
    maxWidth: 420,
    height: 76,
    borderWidth: 1,
    borderColor: "#201f2c",
    backgroundColor: "#0f0f13",
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 8,
    alignSelf: "center",
    zIndex: 10,
    elevation: 6
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 58,
    paddingHorizontal: 4
  },
  tabLabel: {
    fontSize: 10,
    color: "#ffffff",
    fontWeight: "500",
    marginTop: 3,
    textAlign: "center"
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
    backgroundColor: "#101015",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 9,
    borderWidth: 1,
    borderColor: "#201f2c",
    alignSelf: "center"
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 8
  },
  itemMenu: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 56,
    paddingVertical: 4
  }
});

// boasVindas
export const boasVindasStyles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 60
  },
  titulo: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center"
  },
  subtitulo: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    paddingLeft: 20,
    paddingRight: 20
  },
  botao: {
    backgroundColor: "#635bff",
    borderRadius: 10,
    paddingLeft: "35%",
    paddingBottom: 20,
    paddingTop: 20,
    paddingRight: "35%",
    marginTop: 20,
    alignItems: "center"
  },
  textoBotao: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold"
  },
  link: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 10,
    marginBottom: 15,
    textAlign: "center"
  }
});

// cadastro
export const cadastroStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    justifyContent: "center",
    paddingHorizontal: 24
  },
  content: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 12,
    marginBottom: 4
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 100
  },
  input: {
    width: "100%",
    height: 52,
    backgroundColor: "#1c1c1c",
    color: "#fff",
    fontSize: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 18
  },
  button: {
    backgroundColor: "#635bff",
    borderRadius: 10,
    padding: 14,
    marginTop: 20,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold"
  }
});

// centralAjuda
export const centralAjudaStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    alignItems: "stretch",
    marginLeft: -10,
    marginRight: -10,
    paddingHorizontal: 10
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 55,
    marginBottom: 20
  },
  title: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold"
  },
  subtitle: {
    color: "#B8C0D4",
    fontSize: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    lineHeight: 22
  },
  card: {
    backgroundColor: "#11151D",
    marginHorizontal: 18,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#303030",
    paddingVertical: 12,
    overflow: "hidden"
  },
  cardTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 12
  },
  itemMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 18
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  itemText: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 15,
    flexShrink: 1
  },
  divider: {
    height: 1,
    backgroundColor: "#3b3b3b",
    marginHorizontal: 18
  },
  cardInfo: {
    backgroundColor: "#1c1c1c",
    marginHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#303030",
    padding: 18,
    marginBottom: 20
  },
  cardInfoTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },
  cardInfoText: {
    color: "#B8C0D4",
    fontSize: 15,
    lineHeight: 22
  },
  contactButton: {
    backgroundColor: "#635bff",
    marginHorizontal: 18,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  contactText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 10
  }
});

// configuracoes
export const configuracoesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    alignItems: "stretch",
    marginLeft: -10,
    marginRight: -10,
    paddingHorizontal: 10
  },
  card: {
    backgroundColor: "#1c1c1c",
    marginHorizontal: 18,
    marginTop: 18,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#222",
    paddingVertical: 5,
    overflow: "hidden"
  },
  cardTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 12
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 18
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  itemText: {
    color: "#FFF",
    fontSize: 17,
    marginLeft: 15,
    fontWeight: "500"
  },
  divider: {
    height: 1,
    backgroundColor: "#383838"
  }
});

// criarSenha
export const criarSenhaStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    justifyContent: "center",
    paddingHorizontal: 24
  },
  content: {
    width: "100%",
    alignItems: "center"
  },
  title: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 15
  },
  descricao: {
    color: "#B0B0B0",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22
  },
  label: {
    width: "100%",
    color: "#FFF",
    fontSize: 15,
    marginTop: 11,
    fontWeight: "600"
  },
  input: {
    width: "100%",
    height: 55,
    backgroundColor: "#1c1c1c",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#000",
    marginTop: 15
  },
  button: {
    width: "100%",
    height: 45,
    backgroundColor: "#635bff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold"
  },
  voltar: {
    color: "#FFF",
    fontSize: 16,
    marginTop: 20,
    textDecorationLine: "underline"
  },
  erro: {
    color: "#ff6b6b",
    fontSize: 13,
    marginTop: 8
  }
});

// dashboard
export const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    alignItems: "stretch",
    marginLeft: -10,
    marginRight: -10,
    paddingHorizontal: 10
  },
  card: {
    backgroundColor: "#1c1c1c",
    marginHorizontal: 18,
    marginTop: 18,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#222",
    paddingVertical: 5,
    overflow: "hidden"
  },
  cardTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 12
  },
  resumoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginLeft: 18
  },
  iconGreen: {
    width: 45,
    height: 45,
    borderRadius: 16,
    backgroundColor: "#1D2638",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15
  },
  iconRed: {
    width: 45,
    height: 45,
    borderRadius: 16,
    backgroundColor: "#1D2638",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15
  },
  resumoTitulo: {
    color: "#BFC4D2",
    fontSize: 15
  },
  resumoValor: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 2,
    marginBottom: 10
  },
  progress: {
    width: "90%",
    height: 8,
    backgroundColor: "#222B3A",
    borderRadius: 10,
    overflow: "hidden"
  },
  progressFill: {
    height: 8,
    backgroundColor: "#5145FF",
    borderRadius: 10
  },
  percent: {
    color: "#BFC4D2",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 30
  },
  // ---------- PIE CHART ----------

  legendaContainer: {
    marginTop: 10
  },
  legendaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  legendaCor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10
  },
  legendaTexto: {
    color: "#FFF",
    fontSize: 15,
    flex: 1
  },
  legendaValor: {
    color: "#888",
    fontSize: 13
  },
  // ---------- LINHA ----------

  graficoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginTop: 1,
    paddingHorizontal: 10
  },
  pieWrapper: {
    width: 200,
    height: 120,
    borderRadius: 100,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginRight: -20
  },
  pieChart: {
    borderRadius: 100,
    overflow: "hidden"
  },
  // ---------- RESUMO ----------

  resumoContainer: {
    marginTop: 5
  },
  // ---------- GERAL ----------

  shadow: {
    shadowColor: "#5145FF",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5
  },
  legenda: {
    flex: 1,
    marginLeft: 10
  },
  itemLegenda: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14
  },
  corLegenda: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10
  },
  textoLegenda: {
    color: "#FFF",
    fontSize: 15
  }
});

// fluxoFinanceiro
export const fluxoFinanceiroStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    alignItems: "stretch",
    marginLeft: -10,
    marginRight: -10,
    paddingHorizontal: 10
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginTop: 20,
    marginBottom: 12,
    marginLeft: 10
  },
  filtroContainer: {
    flexDirection: "row",
    backgroundColor: "#1c1c1c",
    borderRadius: 30,
    padding: 3,
    marginTop: 10,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#201f2c"
  },
  botaoFiltro: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center"
  },
  botaoAtivo: {
    backgroundColor: "#4b3df2"
  },
  textoFiltro: {
    color: "#fff",
    fontSize: 14
  },
  textoAtivo: {
    fontWeight: "bold"
  },
  resumoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 20,
    marginHorizontal: 20
  },
  resumoCard: {
    flex: 1,
    backgroundColor: "#1c1c1c",
    borderRadius: 16,
    padding: 14,
    minWidth: 100,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  resumoLabel: {
    color: "#9aa0b8",
    fontSize: 12,
    marginBottom: 8
  },
  resumoValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700"
  },
  dados: {
    marginTop: 20,
    backgroundColor: "#1c1c1c",
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20
  },
  dadosTitulo: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16
  },
  dadosTexto: {
    color: "#a0a0a0",
    fontSize: 14,
    marginTop: 12
  },
  transacaoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)"
  },
  transacaoDescricao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  },
  transacaoCategoria: {
    color: "#9aa0b8",
    fontSize: 12,
    marginTop: 4
  },
  transacaoDireita: {
    alignItems: "flex-end"
  },
  transacaoValor: {
    fontSize: 16,
    fontWeight: "700"
  },
  receita: {
    color: "#2ed573"
  },
  despesa: {
    color: "#ff6b6b"
  },
  transacaoData: {
    color: "#9aa0b8",
    fontSize: 12,
    marginTop: 4
  }
});

// inicio
export const inicioStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  // Cabeçalho com gradiente
  header: {
    paddingTop: 18,
    paddingBottom: 26,
    paddingHorizontal: 16,
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl
  },
  profileContaine: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    marginRight: 12,
    minWidth: 0
  },
  profileCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2.5,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surfaceAlt
  },
  profileInfo: {
    marginLeft: 16,
    flexShrink: 1,
    minWidth: 0
  },
  greetingLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "500"
  },
  nome: {
    color: colors.textPrimary,
    fontSize: 21,
    fontWeight: "bold",
    marginTop: 1
  },
  email: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2
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
    borderColor: colors.border
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
    borderColor: colors.surfaceAlt
  },
  // Saldo
  saldoContainer: {
    marginTop: 20,
    padding: 20,
    borderRadius: radii.xl,
    minHeight: 140,
    ...shadow.glowPrimary
  },
  saldoTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  titleSaldo: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(255,255,255,0.85)"
  },
  valor: {
    marginTop: 10,
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff"
  },
  saldoFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14
  },
  saldoFooterText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    marginLeft: 6
  },
  // Conteúdo
  content: {
    paddingHorizontal: 16
  },
  title: {
    fontSize: 18,
    marginTop: 22,
    marginBottom: 12,
    fontWeight: "700",
    color: colors.textPrimary
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
    justifyContent: 'flex-start'
  },
  cardIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary
  },
  cardValue: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary
  },
  cardDelta: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: "600"
  },
  // Metas
  sectionCard: {
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: radii.lg,
    marginTop: 18,
    borderWidth: 1,
    borderColor: colors.border
  },
  metaHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6
  },
  metaHeaderTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "700"
  },
  verMetasBadge: {
    color: "#fff",
    backgroundColor: colors.primaryDeep,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: "600",
    overflow: "hidden"
  },
  graficos: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18
  },
  metaInfoCol: {
    flexDirection: "column",
    marginLeft: 18,
    flex: 1
  },
  metaTituloTexto: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10
  },
  metaBarraFundo: {
    width: "100%",
    height: 7,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
    overflow: "hidden"
  },
  metaBarraPreenchida: {
    height: 7,
    backgroundColor: colors.primary,
    borderRadius: 10
  },
  metaValoresTexto: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 8
  },
  // Distribuição de renda
  distribuicaoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14
  },
  distribuicaoTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "700"
  },
  distribuicaoLista: {
    gap: 12
  },
  distribuicaoItem: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.md,
    padding: 12
  },
  distribuicaoLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8
  },
  distribuicaoLabel: {
    flex: 1,
    color: "#f2f2f2",
    fontSize: 14,
    fontWeight: "600"
  },
  distribuicaoValor: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "700"
  },
  progressTrack: {
    height: 7,
    backgroundColor: colors.surface,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 4
  },
  progressFill: {
    height: "100%",
    borderRadius: 10
  },
  percentText: {
    color: colors.textMuted,
    fontSize: 12
  },
  distribuicaoFooter: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.divider
  },
  footerText: {
    color: colors.textLink,
    fontSize: 13,
    fontWeight: "600"
  }
});

// layout
export const layoutStyles = StyleSheet.create({
  header: {
    backgroundColor: "#000"
  },
  titulo: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600"
  },
  tela: {
    backgroundColor: "#000"
  }
});

// login
export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    justifyContent: "center",
    paddingHorizontal: 24
  },
  titulo: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16
  },
  label: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 12,
    marginBottom: 4
  },
  input: {
    backgroundColor: "#1c1c1c",
    borderRadius: 10,
    padding: 12,
    color: "#fff",
    fontSize: 15
  },
  botao: {
    backgroundColor: "#635bff",
    borderRadius: 10,
    padding: 14,
    marginTop: 20,
    alignItems: "center"
  },
  textoBotao: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold"
  },
  link: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 16,
    textAlign: "center"
  },
  link2: {
    color: "#635bff",
    fontSize: 12,
    marginTop: 16,
    textAlign: "left"
  },
  erro: {
    color: "#ff6b6b",
    fontSize: 13,
    marginTop: 8
  }
});

// metas
export const metasStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    alignItems: "stretch",
    marginLeft: -10,
    marginRight: -10,
    paddingHorizontal: 10
  },
  title: {
    color: "#FFF",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 25,
    paddingHorizontal: 10
  },
  card: {
    backgroundColor: "#171717",
    borderRadius: 20,
    padding: 18,
    marginHorizontal: '5%',
    marginBottom: 18
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15
  },
  nomeMeta: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
    flex: 1
  },
  progressBackground: {
    width: "100%",
    height: 10,
    backgroundColor: "#333",
    borderRadius: 50,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#5145FF",
    borderRadius: 50
  },
  infoLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12
  },
  valor: {
    color: "#BFC4D2",
    fontSize: 15
  },
  porcentagem: {
    color: "#5145FF",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 12,
    textAlign: "right"
  },
  botaoAdicionar: {
    position: "absolute",
    bottom: 95,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#635bff",
    paddingHorizontal: 25,
    height: 55,
    borderRadius: 30,
    elevation: 10
  },
  botaoTexto: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 8
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25
  },
  modal: {
    width: "100%",
    backgroundColor: "#171717",
    borderRadius: 25,
    padding: 22
  },
  modalTitulo: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
  },
  input: {
    width: "100%",
    height: 55,
    backgroundColor: "#262626",
    borderRadius: 14,
    paddingHorizontal: 15,
    color: "#FFF",
    fontSize: 16,
    marginBottom: 15
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  },
  cancelar: {
    width: "47%",
    height: 50,
    borderWidth: 1,
    borderColor: "#6C3EF4",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center"
  },
  cancelarTexto: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16
  },
  salvar: {
    width: "47%",
    height: 50,
    backgroundColor: "#635bff",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center"
  },
  salvarTexto: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16
  }
});

// meuCadastro
export const meuCadastroStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    alignItems: "stretch",
    marginLeft: -10,
    marginRight: -10,
    paddingHorizontal: 10
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 55,
    marginBottom: 20
  },
  title: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold"
  },
  card: {
    marginTop: 20,
    backgroundColor: "#1c1c1c",
    marginHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#303030",
    padding: 18
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20
  },
  profileCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: "#5145FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    backgroundColor: "#0E1119"
  },
  profileInfo: {
    flex: 1
  },
  profileName: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold"
  },
  profileEmail: {
    color: "#A5A5A5",
    fontSize: 14,
    marginTop: 4
  },
  profileSubtitle: {
    color: "#B8C0D4",
    fontSize: 14,
    lineHeight: 20
  },
  cardTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 18
  },
  input: {
    width: "100%",
    height: 55,
    backgroundColor: "#111010",
    color: "#FFF",
    fontSize: 16,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#3c3c3c"
  },
  itemButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#111010",
    borderRadius: 14
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  itemText: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 14
  },
  saveButton: {
    backgroundColor: "#635bff",
    padding: 14,
    marginHorizontal: 18,
    marginTop: 10,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center"
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold"
  }
});

// notificacoes
export const notificacoesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    alignItems: "stretch",
    marginLeft: -10,
    marginRight: -10,
    paddingHorizontal: 10
  },
  header: {
    marginTop: 1,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  subTitle: {
    color: "#9AA4BF",
    fontSize: 16,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 15
  },
  card: {
    backgroundColor: "#1c1c1c",
    marginHorizontal: 18,
    marginBottom: 15,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#303030"
  },
  cardNova: {
    borderLeftWidth: 5,
    borderLeftColor: "#4b3df2"
  },
  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15
  },
  textContainer: {
    flex: 1
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  cardTitle: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
    flex: 1
  },
  descricao: {
    color: "#B5BDD2",
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20
  },
  hora: {
    color: "#7B8193",
    fontSize: 13,
    marginLeft: 10
  },
  bolinha: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4b3df2",
    marginLeft: 10,
    alignSelf: "flex-start",
    marginTop: 8
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    marginTop: 80
  },
  emptyTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20
  },
  emptyText: {
    color: "#8C93A8",
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22
  }
});

// novaDespesa
export const novaDespesaStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    alignItems: "stretch",
    marginLeft: -10,
    marginRight: -10,
    paddingHorizontal: 10
  },
  titulo: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 19,
    fontWeight: "600"
  },
  addValor: {
    flexDirection: "row",
    backgroundColor: "#161616",
    padding: 12,
    margin: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: 'space-between'
  },
  InputValor: {
    color: "#55ff00",
    borderRadius: 10,
    width: "50%",
    backgroundColor: "#1b1b1b",
    height: 46,
    paddingHorizontal: 10,
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: 17
  },
  valorWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    marginLeft: 12
  },
  currency: {
    color: '#55ff00',
    fontWeight: '700',
    marginRight: 8,
    fontSize: 18
  },
  input: {
    width: "100%",
    height: 46,
    backgroundColor: "#1b1b1b",
    color: "#fff",
    fontSize: 15,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 14
  },
  inputFull: {
    paddingHorizontal: 16,
    marginBottom: 4
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161616',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#1f1f1f',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  listItemText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600'
  },
  listItemSub: {
    color: '#9b9b9b',
    fontSize: 13,
    marginTop: 4
  },
  saveWrapper: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 84
  },
  saveButton: {
    backgroundColor: '#5a39ff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15
  }
});

// novaReceita
export const novaReceitaStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    alignItems: "stretch",
    marginLeft: -10,
    marginRight: -10,
    paddingHorizontal: 10
  },
  titulo: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 19,
    fontWeight: "600"
  },
  addValor: {
    flexDirection: "row",
    backgroundColor: "#161616",
    padding: 12,
    margin: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: 'space-between'
  },
  InputValor: {
    color: "#55ff00",
    borderRadius: 10,
    width: "50%",
    backgroundColor: "#1b1b1b",
    height: 46,
    paddingHorizontal: 10,
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: 17
  },
  valorWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    marginLeft: 12
  },
  currency: {
    color: '#55ff00',
    fontWeight: '700',
    marginRight: 8,
    fontSize: 18
  },
  input: {
    width: "100%",
    height: 46,
    backgroundColor: "#1b1b1b",
    color: "#fff",
    fontSize: 15,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 14
  },
  inputFull: {
    paddingHorizontal: 16,
    marginBottom: 4
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161616',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#1f1f1f',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  listItemText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600'
  },
  listItemSub: {
    color: '#9b9b9b',
    fontSize: 13,
    marginTop: 4
  },
  saveWrapper: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 84
  },
  saveButton: {
    backgroundColor: '#5a39ff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15
  }
});

// novaSenha
export const novaSenhaStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    justifyContent: "center",
    paddingHorizontal: 24
  },
  content: {
    width: "100%",
    alignItems: "center"
  },
  title: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 15
  },
  descricao: {
    color: "#B0B0B0",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22
  },
  label: {
    width: "100%",
    color: "#FFF",
    fontSize: 15,
    marginTop: 11,
    fontWeight: "600"
  },
  input: {
    width: "100%",
    height: 55,
    backgroundColor: "#1c1c1c",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#000",
    marginTop: 15
  },
  button: {
    width: "100%",
    height: 45,
    backgroundColor: "#635bff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold"
  },
  voltar: {
    color: "#FFF",
    fontSize: 16,
    marginTop: 20,
    textDecorationLine: "underline"
  },
  erro: {
    color: "#ff6b6b",
    fontSize: 13,
    marginTop: 8
  }
});

// perfil
export const perfilStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    alignItems: "stretch",
    marginLeft: -10,
    marginRight: -10,
    paddingHorizontal: 10
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 55,
    marginBottom: 30
  },
  title: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold"
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 30
  },
  profileCircle: {
    width: 85,
    height: 85,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#FFF",
    justifyContent: "center",
    alignItems: "center"
  },
  profileInfo: {
    marginLeft: 18,
    flex: 1
  },
  settingsButton: {
    marginLeft: "auto",
    padding: 8,
    justifyContent: "center",
    alignItems: "center"
  },
  nome: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold"
  },
  email: {
    color: "#A5A5A5",
    fontSize: 15,
    marginTop: 4
  },
  resumoCard: {
    backgroundColor: "#1c1c1c",
    marginHorizontal: 15,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#303030",
    marginBottom: 25
  },
  resumoTitulo: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20
  },
  resumoRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  itemResumo: {
    alignItems: "center",
    flex: 1
  },
  labelResumo: {
    color: "#8D96AA",
    fontSize: 12,
    marginTop: 8,
    marginBottom: 5,
    textAlign: "center"
  },
  valorResumo: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 13,
    textAlign: "center"
  },
  menuCard: {
    backgroundColor: "#1c1c1c",
    marginHorizontal: 15,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#303030",
    marginBottom: 20,
    overflow: "hidden"
  },
  itemMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#303030"
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  itemTexto: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 15
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center"
  },
  modal: {
    width: "85%",
    backgroundColor: "#1c1c1c",
    borderRadius: 25,
    padding: 25,
    alignItems: "center"
  },
  modalIcon: {
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: "#5145FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20
  },
  modalTitulo: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold"
  },
  modalTexto: {
    color: "#AAA",
    fontSize: 16,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 30
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  cancelar: {
    width: "47%",
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#5145FF",
    justifyContent: "center",
    alignItems: "center"
  },
  cancelarTexto: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold"
  },
  sair: {
    width: "47%",
    height: 50,
    borderRadius: 15,
    backgroundColor: "#635bff",
    justifyContent: "center",
    alignItems: "center"
  },
  sairTexto: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold"
  }
});

// recuperarSenha
export const recuperarSenhaStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    justifyContent: "center",
    paddingHorizontal: 24
  },
  content: {
    width: "100%",
    alignItems: "center"
  },
  title: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 15
  },
  descricao: {
    color: "#B0B0B0",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22
  },
  inputContainer1: {
    width: "100%",
    marginBottom: 20
  },
  input: {
    width: "100%",
    height: 55,
    backgroundColor: "#1c1c1c",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#000",
    marginTop: 25
  },
  button: {
    width: "100%",
    height: 45,
    backgroundColor: "#635bff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold"
  },
  voltar: {
    color: "#FFF",
    fontSize: 16,
    marginTop: 20,
    textDecorationLine: "underline"
  },
  erro: {
    color: "#ff6b6b",
    fontSize: 13,
    marginTop: 8
  }
});

// relatorios
export const relatoriosStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    alignItems: "stretch",
    marginLeft: -10,
    marginRight: -10,
    paddingHorizontal: 10
  },
  card: {
    backgroundColor: "#1c1c1c",
    marginHorizontal: 18,
    marginBottom: 5,
    marginTop: 20,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#303030"
  },
  cardTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15
  },
  pickerContainer: {
    backgroundColor: "#1c1c1c",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#303030",
    overflow: "hidden"
  },
  picker: {
    color: "#FFF",
    height: 55
  },
  itemResumo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#303030"
  },
  textos: {
    marginLeft: 15,
    flex: 1
  },
  label: {
    color: "#B8C0D4",
    fontSize: 15,
    marginBottom: 3
  },
  valor: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold"
  },
  button: {
    backgroundColor: "#635bff",
    padding: 14,
    marginHorizontal: 18,
    marginTop: 10,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  buttonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 10
  }
});

// sobreApp
export const sobreAppStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    alignItems: "stretch",
    marginLeft: -10,
    marginRight: -10,
    paddingHorizontal: 10
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 55,
    marginBottom: 20
  },
  title: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold"
  },
  mainCard: {
    backgroundColor: "#1c1c1c",
    marginHorizontal: 18,
    marginTop: 10,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#303030"
  },
  appName: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "600"
  },
  featuresCard: {
    backgroundColor: "#1c1c1c",
    marginHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#303030",
    padding: 16,
    marginBottom: 18
  },
  featuresTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12
  },
  featureTexts: {
    flex: 1
  },
  featureTitle: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700"
  },
  featureText: {
    color: "#B8C0D4",
    fontSize: 13,
    marginTop: 4
  },
  infoCard: {
    backgroundColor: "#1c1c1c",
    marginHorizontal: 18,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#303030"
  },
  infoTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6
  },
  infoText: {
    color: "#B8C0D4",
    fontSize: 13
  },
  link: {
    color: "#4B6DFF",
    marginTop: 8,
    fontWeight: "700"
  },
  contactCard: {
    backgroundColor: "#1c1c1c",
    marginHorizontal: 18,
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#303030",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  contactLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  contactText: {
    color: "#FFF",
    fontSize: 15,
    marginLeft: 10
  },
  footer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30
  },
  footerApp: {
    color: "#B8C0D4",
    fontSize: 14,
    marginBottom: 6
  },
  footerCopy: {
    color: "#7B8193",
    fontSize: 12
  }
});

// Estilos extraidos dos componentes (incluindo estados e animacoes).
export const settingsContentStyle = {
  paddingBottom: 10
};
export const bottomSpacerStyle = {
  height: 100
};
export const navigationContentStyle = {
  paddingBottom: 120
};
export const pieChartConfig = {
  color: () => "#FFF"
};
export function legendColorStyle(item) {
  return {
    backgroundColor: item.color
  };
}
export const balanceChartConfig = {
  backgroundGradientFrom: "#1c1c1c",
  backgroundGradientTo: "#1c1c1c",
  decimalPlaces: 0,
  color: () => "#5145FF",
  labelColor: () => "#AAA"
};
export const dashboardChartStyle = {
  borderRadius: 15,
  marginTop: 10,
  marginBottom: 10,
  marginLeft: 10,
  marginRight: -25
};
export const flexFillStyle = {
  flex: 1
};
export function incomeProgressStyle(receitasPercent) {
  return {
    width: `${receitasPercent}%`
  };
}
export function expenseProgressStyle(despesasPercent) {
  return {
    width: `${despesasPercent}%`
  };
}
export function scaleAnimationStyle(scale) {
  "worklet";

  return {
    transform: [{
      scale: scale.value
    }]
  };
}
export function cardIconBackgroundStyle(iconBg) {
  return {
    backgroundColor: iconBg
  };
}
export function cardDeltaColorStyle(deltaColor) {
  return {
    color: deltaColor
  };
}
export const homeContentStyle = {
  paddingBottom: 130
};
export const rowBetweenStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between'
};
export const horizontalCardsContentStyle = {
  paddingRight: 16
};
export const balanceValueStyle = {
  color: colors.textPrimary,
  fontSize: 22,
  fontWeight: 'bold'
};
export function economyPercentageStyle(porcentagem) {
  return {
    width: `${porcentagem}%`
  };
}
export const economyCaptionStyle = {
  color: colors.textMuted,
  fontSize: 12
};
export function categoryColorStyle(item) {
  return {
    backgroundColor: item.cor
  };
}
export function categoryProgressStyle(item) {
  return {
    width: `${Math.min(item.percentual, 100)}%`,
    backgroundColor: item.cor
  };
}
export function goalProgressStyle(porcentagem) {
  return {
    width: `${porcentagem}%`
  };
}
export const goalsContentStyle = {
  paddingBottom: 150
};
export const rowCenterStyle = {
  flexDirection: 'row',
  alignItems: 'center'
};
export const incomeColorStyle = {
  color: "#2ED573"
};
export const expenseColorStyle = {
  color: "#FF4D4D"
};
export const reportContentStyle = {
  paddingBottom: -100
};
export const reportChartConfig = {
  backgroundGradientFrom: "#1c1c1c",
  backgroundGradientTo: "#1c1c1c",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(81,69,255,${opacity})`,
  labelColor: () => "#FFF",
  propsForBackgroundLines: {
    stroke: "#303030"
  }
};
export const reportChartStyle = {
  borderRadius: 15,
  marginTop: 10,
  marginBottom: 5
};
export const secondaryButtonSpacingStyle = {
  marginTop: 15
};
export const welcomeLogoStyle = {
  alignSelf: "center",
  width: 200,
  height: 180,
  marginBottom: 60
};
export const welcomeCardStyle = {
  backgroundColor: "#171717a5",
  borderRadius: 20,
  alignItems: "center"
};
export const loginLogoStyle = {
  alignSelf: "center",
  width: 150,
  height: 150,
  marginBottom: 60
};
export const addTabButtonStyle = {
  alignItems: "center",
  justifyContent: "center",
  flex: 1
};
export const floatingAddButtonStyle = {
  width: 70,
  height: 70,
  borderRadius: 35,
  alignItems: "center",
  justifyContent: "center",
  marginTop: -30,
  backgroundColor: colors.primary,
  borderWidth: 4,
  borderColor: colors.backgroundAlt,
  ...shadow.soft
};
export const tabButtonStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  minHeight: 58
};
export const centerItemsStyle = {
  alignItems: "center"
};
export function tabBadgeStyle(isActive, isOpen) {
  return {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: radii.pill,
    backgroundColor: isActive || isOpen ? colors.primarySoft : "transparent"
  };
}
export function tabLabelStyle(isActive, isOpen) {
  return {
    fontSize: 10,
    marginTop: 3,
    fontWeight: isActive ? "700" : "500",
    color: isActive || isOpen ? colors.primary : colors.textSecondary
  };
}
export const activeTabDotStyle = {
  width: 4,
  height: 4,
  borderRadius: 2,
  backgroundColor: colors.primary,
  marginTop: 3
};
export function menuAnimationStyle(progress) {
  "worklet";

  return {
    opacity: progress.value,
    transform: [{
      translateY: (1 - progress.value) * 14
    }]
  };
}
export const expandedMenuStyle = {
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
  ...shadow.soft
};
export function menuActionStyle(pressed) {
  return {
    alignItems: "center",
    justifyContent: "center",
    width: "22%",
    paddingVertical: 10,
    marginVertical: 4,
    borderRadius: radii.md,
    backgroundColor: pressed ? colors.primarySoft : "transparent"
  };
}
export const menuIconStyle = {
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: colors.primarySoft,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 6
};
export const menuLabelStyle = {
  color: colors.textPrimary,
  fontSize: 11,
  fontWeight: "600",
  textAlign: "center"
};
export const navigationOverlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: colors.overlay,
  zIndex: 8
};
export const navigationBarStyle = {
  position: "absolute",
  bottom: 8,
  alignSelf: "center",
  width: "94%",
  maxWidth: 420,
  zIndex: 10,
  flexDirection: "row",
  height: 76,
  borderRadius: radii.xl,
  borderWidth: 1,
  borderColor: colors.border,
  paddingHorizontal: 6,
  alignItems: "center",
  backgroundColor: colors.backgroundAlt,
  ...shadow.soft
};
export const amountAlignmentStyle = {
  textAlign: 'right'
};
export const transactionLabelStyle = {
  color: "#fff",
  marginLeft: 10,
  marginBottom: 5,
  fontSize: 16
};
export const notesInputStyle = {
  height: 90
};
export const aboutInfoIconStyle = {
  backgroundColor: "#4C4CF0"
};
export const aboutContactIconStyle = {
  backgroundColor: "#2EA6FF"
};
export const aboutPrivacyIconStyle = {
  backgroundColor: "#7B61FF"
};
export const aboutTermsIconStyle = {
  backgroundColor: "#FF6B6B"
};
export const stackScreenOptions = {
  headerStyle: {
    backgroundColor: "#141414"
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "600"
  },
  contentStyle: {
    backgroundColor: "#000"
  }
};

// Estrutura de rolagem: flexGrow preserva a centralizacao e permite telas pequenas.
export const keyboardStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background
  },
  scroll: {
    flex: 1
  },
  content: {
    flex: 0,
    flexGrow: 1
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)'
  },
  modalContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25
  }
});

// Elementos novos conectados à API, usando as cores existentes.
export const chartPalette = ['#6C63FF', '#5145FF', '#7C6BFF', '#291CFF', '#666'];
export const apiStyles = StyleSheet.create({
  error: {
    color: '#ff6b6b',
    margin: 16,
    fontSize: 14
  },
  message: {
    color: '#aaa',
    margin: 16,
    fontSize: 14
  },
  link: {
    color: '#635bff',
    margin: 12,
    fontSize: 14
  },
  picker: {
    color: '#fff',
    backgroundColor: '#1c1c1c',
    minHeight: 52,
    borderRadius: 12
  },
  card: {
    backgroundColor: '#171717',
    borderRadius: 20,
    padding: 18,
    margin: 16
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16
  },
  label: {
    color: '#aaa',
    marginTop: 12,
    marginBottom: 4
  },
  input: {
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    fontSize: 15,
    marginBottom: 12
  },
  button: {
    backgroundColor: '#635bff',
    borderRadius: 10,
    padding: 14,
    marginTop: 20,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  content: {
    padding: 24,
    paddingBottom: 120
  }
});
