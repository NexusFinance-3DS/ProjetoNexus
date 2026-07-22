import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -90,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    width: "85%",
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
    marginBottom: 35,
    lineHeight: 22,
  },

  label: {
    width: "100%",
    color: "#FFF",
    fontSize: 15,
    marginBottom: 8,
    fontWeight: "600",
  },

  input: {
    width: "100%",
    height: 55,
    backgroundColor: "#1c1c1c",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#000",
    marginBottom: 20,
  },

  button: {
    width: "100%",
    height: 55,
    backgroundColor: "#6C3EF4",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default styles;