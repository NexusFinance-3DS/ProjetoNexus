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
    backgroundColor: "#1c1c1c",
    marginHorizontal: 18,
    marginTop: 18,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#222",
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
    backgroundColor: "#383838",
  },

});

export default styles;