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

  title: {
    color: "#FFF",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 25,
    paddingHorizontal: 10,
  },

  card: {
    backgroundColor: "#171717",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    marginLeft: '5%',
    marginRight: '5%',
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  nomeMeta: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
    flex: 1,
  },

  progressBackground: {
    width: "100%",
    height: 10,
    backgroundColor: "#333",
    borderRadius: 50,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#5145FF",
    borderRadius: 50,
  },

  infoLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  valor: {
    color: "#BFC4D2",
    fontSize: 15,
  },

  porcentagem: {
    color: "#5145FF",
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
    backgroundColor: "#635bff",
    paddingHorizontal: 25,
    height: 55,
    borderRadius: 30,
    elevation: 10,
  },

  botaoTexto: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 8,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },

  modal: {
    width: "100%",
    backgroundColor: "#171717",
    borderRadius: 25,
    padding: 22,
  },

  modalTitulo: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    width: "100%",
    height: 55,
    backgroundColor: "#262626",
    borderRadius: 14,
    paddingHorizontal: 15,
    color: "#FFF",
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
    height: 50,
    borderWidth: 1,
    borderColor: "#6C3EF4",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  cancelarTexto: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },

  salvar: {
    width: "47%",
    height: 50,
    backgroundColor: "#635bff",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  salvarTexto: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default styles;