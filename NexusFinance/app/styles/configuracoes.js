import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070D",
  },

  back: {
    marginTop: -20,
    marginLeft: 18,
    marginBottom: 10,
  },

  title: {
    color: "#FFF",
    fontSize: 34,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#141923",
    marginHorizontal: 18,
    marginBottom: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#232C40",
    paddingVertical: 5,
    overflow: "hidden",
  },

  cardTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 12,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 18,
  },

  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  itemText: {
    color: "#FFF",
    fontSize: 17,
    marginLeft: 15,
    fontWeight: "500",
  },

  divider: {
    height: 1,
    backgroundColor: "#232C40",
    marginLeft: 60,
  },

  pickerContainer: {
    backgroundColor: "#0E121A",
    marginHorizontal: 18,
    marginBottom: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#232C40",
    overflow: "hidden",
  },

  picker: {
    color: "#FFF",
    height: 55,
  },

  switchContainer: {
    transform: [{ scaleX: 1 }, { scaleY: 1 }],
  },

  button: {
    backgroundColor: "#5145FF",
    marginHorizontal: 20,
    marginTop: 20,
    height: 55,
    borderRadius: 15,
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

  version: {
    color: "#7B8193",
    textAlign: "center",
    fontSize: 13,
    marginTop: 15,
    marginBottom: 25,
  },
});

export default styles;