import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    alignItems: "stretch",
    marginLeft: -10,
    marginRight: -10,
    paddingHorizontal: 10,
    paddingBottom: 80,
  },
  titulo:{
    color: "#fff",
    marginLeft:10,
    fontSize: 19,
    fontWeight: "600",
  },
  addValor:{
    flexDirection: "row",
    backgroundColor: "#1c1c1c",
    padding:10,
    margin: 20,
    borderRadius: 35,
    alignItems: "center"
  },

  InputValor:{
    color: "#55ff00",
    marginLeft: "15%",
    borderRadius: 20,
    width: "40%",
    backgroundColor: "#6a66667b"
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
})