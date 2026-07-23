import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    alignItems: "stretch",
    marginLeft: -10,
    marginRight: -10,
    paddingHorizontal: 10,
    paddingBottom: 80,
  },

  // Saldo geral
  saldoContainer: {
    marginTop: 16,
    marginLeft: 10,
    marginRight: 10,
    padding: 12,
    backgroundColor: "#281fa8",
    height: 150,
    width: "95%",
    borderRadius: 8,
  },
  titleSaldo: {
    marginTop: 10,
    fontSize: 19,
    fontWeight: "600",
    color: "#fff",
  },
  valor: {
    marginTop: 16,
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },

  // Conteúdo principal
  content: {
    width: "110%",
  },
  title: {
    flexDirection: "row",
    fontSize: 20,
    marginTop: 16,
    marginLeft: 20,
    marginBottom: 5,
    fontWeight: "600",
    color: "#fff",
  },
  visaoRapidaContainer: {
    marginTop: 16,
    width: "95%",
    marginLeft: 10,
    marginRight: 10,
  },
  card: {
    backgroundColor: "#1c1c1c",
    padding: 16,
    borderRadius: 30,
    marginRight: 9,
    width: "35%",
    height: 130,
  },
  cardTitle: {
    flexDirection: "row",
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    marginBottom: -6,
  },
  cardValue: {
    marginTop: 8,
    fontSize: 23,
    width: "110%",
    fontWeight: "bold",
    color: "#fff",
  },

  // Metas
  metasContainer: {
    marginTop: 16,
  },
  metaCard: {
    backgroundColor: "#1c1c1c",
    padding: 16,
    marginLeft: 10,
    marginRight: 10,
    width: "86%",
    minHeight: 200,
    borderRadius: 14,
    marginBottom: 10,
  },
  metaTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  metaValue: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#fff",
  },
  graficos: {
    flexDirection: "row",
    marginTop: 30,
  },

  // Distribuição de renda
  distribuicaoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  distribuicaoTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  totalBadge: {
    backgroundColor: "#4800fff9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  totalBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  distribuicaoLista: {
    gap: 10,
  },
  distribuicaoItem: {
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 10,
  },
  distribuicaoLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
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
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  progressTrack: {
    height: 7,
    backgroundColor: "#343434",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressFill: {
    height: "100%",
    borderRadius: 10,
  },
  percentText: {
    color: "#9fa8c3",
    fontSize: 12,
  },
  distribuicaoFooter: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  footerText: {
    color: "#cfd8ff",
    fontSize: 13,
    fontWeight: "600",
  },
});
