import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    alignItems: "stretch",
    marginLeft: -10,
    marginRight: -10,
    paddingHorizontal: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginTop: 20,
    marginBottom: 12,
    marginLeft: 10,
  },

  filtroContainer: {
    flexDirection: "row",
    backgroundColor: "#1c1c1c",
    borderRadius: 30,
    padding: 3,
    marginTop: 10,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#201f2c",
  },

  botaoFiltro: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },

  botaoAtivo: {
    backgroundColor: "#4b3df2",
  },

  textoFiltro: {
    color: "#fff",
    fontSize: 14,
  },

  textoAtivo: {
    fontWeight: "bold",
  },

  resumoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 20,
    marginHorizontal: 20,
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
    elevation: 4,
  },

  resumoLabel: {
    color: "#9aa0b8",
    fontSize: 12,
    marginBottom: 8,
  },

  resumoValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  dados: {
    marginTop: 20,
    backgroundColor: "#1c1c1c",
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },

  dadosTitulo: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },

  dadosTexto: {
    color: "#a0a0a0",
    fontSize: 14,
    marginTop: 12,
  },

  transacaoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },

  transacaoDescricao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  transacaoCategoria: {
    color: "#9aa0b8",
    fontSize: 12,
    marginTop: 4,
  },

  transacaoDireita: {
    alignItems: "flex-end",
  },

  transacaoValor: {
    fontSize: 16,
    fontWeight: "700",
  },

  receita: {
    color: "#2ed573",
  },

  despesa: {
    color: "#ff6b6b",
  },

  transacaoData: {
    color: "#9aa0b8",
    fontSize: 12,
    marginTop: 4,
  },
});
