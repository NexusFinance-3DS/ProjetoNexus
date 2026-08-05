import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070D",
  },

  back: {
    marginTop: 0,
    marginLeft: 18,
    marginBottom: 10,
  },

  title: {
    color: "#FFF",
    fontSize: 36,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginBottom: 20,
  },

  card: {
    marginTop: 10,
    backgroundColor: "#151922",
    marginHorizontal: 18,
    marginBottom: 20,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#2A3246",
  },

  cardTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  pickerContainer: {
    backgroundColor: "#0F131C",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2A3246",
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
    borderBottomColor: "#242B3B",
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
    backgroundColor: "#5145FF",
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 15,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default styles;