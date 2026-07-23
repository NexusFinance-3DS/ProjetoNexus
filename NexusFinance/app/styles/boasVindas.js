import { StyleSheet } from "react-native";

export default StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  logo: {
    width: 150,
    height: 150,
    marginBottom: 60,
  },

  titulo: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
  },

  subtitulo: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    paddingLeft: 20,
    paddingRight:20,
  },

  botao: {
    backgroundColor: "#635bff",
    borderRadius: 10,
    paddingLeft: "35%",
    paddingBottom: 20,
    paddingTop: 20,
    paddingRight:"35%",
    marginTop: 20,
    alignItems: "center",
  },

  textoBotao: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },

  link: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 10,
    marginBottom: 15,
    textAlign: "center",
  },
});