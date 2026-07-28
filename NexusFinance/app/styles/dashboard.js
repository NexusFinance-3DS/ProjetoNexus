import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    alignItems: "stretch",
    marginLeft: -10,
    marginRight: -10,
    paddingHorizontal: 10,
    paddingBottom: 80,
  },

  back: {
    marginTop: 30,
    marginLeft: 15,
    marginBottom: 10,
  },

  title: {
    color: "#FFF",
    fontSize: 34,
    fontWeight: "bold",
    marginLeft: 18,
    marginBottom: 18,
  },

  card: {
    backgroundColor: "#11151D",
    marginHorizontal: 15,
    marginBottom: 18,
    borderRadius: 25,
    padding: 18,
    borderWidth: 1,
    borderColor: "#232B3C",
  },

  cardTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },

  resumoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  iconGreen: {
    width: 55,
    height: 55,
    borderRadius: 16,
    backgroundColor: "#1D2638",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  iconRed: {
    width: 55,
    height: 55,
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
    width: "100%",
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
    marginLeft: 10,
  },

  // ---------- PIE CHART ----------

  legendaContainer: {
    marginTop: 15,
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
    alignItems: "center",
    justifyContent: "center",
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

  graficoContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 15,
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