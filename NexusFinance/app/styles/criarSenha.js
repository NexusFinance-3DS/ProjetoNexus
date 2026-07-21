import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -200,
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
    marginBottom: 40,
  },

  label: {
    width: "100%",
    color: "#FFF",
    fontSize: 15,
    marginBottom: 8,
    marginTop: 10,
  },

  input: {
    width: "100%",
    height: 55,
    backgroundColor: "#1c1c1c",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },

  button: {
    width: "100%",
    height: 55,
    backgroundColor: "#6C3EF4",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
});

export default styles;