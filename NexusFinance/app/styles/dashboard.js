import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    alignItems: "stretch",
    marginLeft: -10,
    marginRight: -10,
    paddingHorizontal: 10,
  },

  card: {
    backgroundColor: "#1c1c1c",
    marginHorizontal: 18,
    marginTop: 18,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#222",
    paddingVertical: 5,
    overflow: "hidden",
  },

  cardTitle: {
    color: "#FFF",
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
    backgroundColor: "#1D2638",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  iconRed: {
    width: 45,
    height: 45,
    borderRadius: 16,
    backgroundColor: "#1D2638",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  resumoTitulo: {
    color: "#BFC4D2",
    fontSize: 15,
  },

  resumoValor: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 2,
    marginBottom: 10,
  },

  progress: {
    width: "90%",
    height: 8,
    backgroundColor: "#222B3A",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: 8,
    backgroundColor: "#5145FF",
    borderRadius: 10,
  },

  percent: {
    color: "#BFC4D2",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 30,
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
    color: "#FFF",
    fontSize: 15,
    flex: 1,
  },

  legendaValor: {
    color: "#888",
    fontSize: 13,
  },

  // ---------- LINHA ----------

  graficoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginTop: 1,
    paddingHorizontal: 10,
  },

  pieWrapper: {
    borderRadius: 100, 
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginRight: -20,
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
    shadowColor: "#5145FF",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  legenda: {
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
  color: "#FFF",
  fontSize: 15,
},
    
});

export default styles;