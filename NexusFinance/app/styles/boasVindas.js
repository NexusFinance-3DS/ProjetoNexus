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
    marginBottom: 16,
    textAlign: "center",
  },

  subtitulo: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 30,
  },

  botao: {
    backgroundColor: "#635bff",
    borderRadius: 10,
    padding: 14,
    marginTop: 20,
    alignItems: "center",
    width: "100%",
  },

  textoBotao: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },

  link: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 16,
    textAlign: "center",
  },

  erro: {
    color: "#ff6b6b",
    fontSize: 13,
    marginTop: 8,
  },
});