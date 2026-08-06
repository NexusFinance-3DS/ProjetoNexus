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

  card: {
    marginTop: 10,
    backgroundColor: "#151922",
    marginHorizontal: 18,
    marginBottom: 5,
    marginTop: 20,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#303030",
  },

  cardTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  pickerContainer: {
    backgroundColor: "#1c1c1c",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#303030",
    overflow: "hidden",
  },

  picker: {
    color: "#FFF",
    height: 55,
  },

  itemResumo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#303030",
  },

  textos: {
    marginLeft: 15,
    flex: 1,
  },

  label: {
    color: "#B8C0D4",
    fontSize: 15,
    marginBottom: 3,
  },

  valor: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },

  button: {
     backgroundColor: "#635bff",
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 18,
    marginTop: 10,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default styles;