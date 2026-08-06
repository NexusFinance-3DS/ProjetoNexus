import { StyleSheet } from "react-native";

export default StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  content: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 12,
    marginBottom: 4,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 100,
  },

  input: {
    width: "100%",
    height: 52,
    backgroundColor: "#1c1c1c",
    color: "#fff",
    fontSize: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 18,
  },

  button: {
    backgroundColor: "#635bff",
    borderRadius: 10,
    padding: 14,
    marginTop: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },

});