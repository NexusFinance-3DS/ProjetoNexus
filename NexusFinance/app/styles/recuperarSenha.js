import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  content: {
    width: "100%",
    alignItems: "center",
  },

  title: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 15,
  },

  descricao: {
    color: "#B0B0B0",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },

  inputContainer1: {
    width: "100%",
    marginBottom: 20,
  },

  input: {
    width: "100%",
    height: 55,
    backgroundColor: "#1c1c1c",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#000",
    marginTop: 25,
  },

  button: {
    width: "100%",
    height: 45,
    backgroundColor: "#635bff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },

  voltar: {
    color: "#FFF",
    fontSize: 16,
    marginTop: 20,
    textDecorationLine: "underline",
  },

  erro: {
    color: "#ff6b6b",
    fontSize: 13,
    marginTop: 8,
  },
});

export default styles;