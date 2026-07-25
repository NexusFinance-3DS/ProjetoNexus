import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    backgroundColor: "#05070D",
    marginLeft: -10,
    marginRight: -10,
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
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
  },

  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 30,
  },

  profileCircle: {
    width: 85,
    height: 85,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },

  profileInfo: {
    marginLeft: 18,
  },

  nome: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
  },

  email: {
    color: "#A5A5A5",
    fontSize: 15,
    marginTop: 4,
  },

  resumoCard: {
    backgroundColor: "#11151D",
    marginHorizontal: 15,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#242B3D",
    marginBottom: 25,
  },

  resumoTitulo: {
    color: "#FFF",
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
    color: "#8D96AA",
    fontSize: 12,
    marginTop: 8,
    marginBottom: 5,
    textAlign: "center",
  },

  valorResumo: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },

  menuCard: {
    backgroundColor: "#11151D",
    marginHorizontal: 15,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#242B3D",
    marginBottom: 120,
    overflow: "hidden",
  },

  itemMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#1F2431",
  },

  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  itemTexto: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 15,
  },

  modalBackground: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.65)",
  justifyContent: "center",
  alignItems: "center",
},

modal: {
  width: "85%",
  backgroundColor: "#161B22",
  borderRadius: 25,
  padding: 25,
  alignItems: "center",
},

modalIcon: {
  width: 75,
  height: 75,
  borderRadius: 40,
  backgroundColor: "#5145FF",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 20,
},

modalTitulo: {
  color: "#FFF",
  fontSize: 24,
  fontWeight: "bold",
},

modalTexto: {
  color: "#AAA",
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
  height: 50,
  borderRadius: 15,
  borderWidth: 1,
  borderColor: "#5145FF",
  justifyContent: "center",
  alignItems: "center",
},

cancelarTexto: {
  color: "#FFF",
  fontSize: 16,
  fontWeight: "bold",
},

sair: {
  width: "47%",
  height: 50,
  borderRadius: 15,
  backgroundColor: "#5145FF",
  justifyContent: "center",
  alignItems: "center",
},

sairTexto: {
  color: "#FFF",
  fontSize: 16,
  fontWeight: "bold",
},
});

export default styles;