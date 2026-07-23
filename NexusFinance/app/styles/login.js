import { StyleSheet } from "react-native";

export default StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  titulo: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
  },
  label: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#1c1c1c",
    borderRadius: 10,
    padding: 12,
    color: "#fff",
    fontSize: 15,
  },
  botao: {
    backgroundColor: "#635bff",
    borderRadius: 10,
    padding: 14,
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
    marginTop: 16,
    textAlign: "center",
  },

  link2: {
    color: "#635bff",
    fontSize: 12,
    marginTop: 16,
    textAlign: "left",
  },

  erro: {
    color: "#ff6b6b",
    fontSize: 13,
    marginTop: 8,
  },
});