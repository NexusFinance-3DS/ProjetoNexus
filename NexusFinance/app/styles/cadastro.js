import { StyleSheet } from "react-native";

export default StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#050A12",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 100,
  },

  input: {
    width: "100%",
    height: 52,

    backgroundColor: "#121826",

    color: "#FFFFFF",
    fontSize: 16,

    borderRadius: 12,

    paddingHorizontal: 16,

    marginBottom: 18,
  },

  button: {
    width: "100%",
    height: 52,

    backgroundColor: "#5B4BFF",

    borderRadius: 12,

    justifyContent: "center",
    alignItems: "center",

    marginTop: 12,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

});