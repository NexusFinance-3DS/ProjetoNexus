import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070D",
  },

  header: {
    marginTop: 15,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: "#FFF",
    fontSize: 30,
    fontWeight: "bold",
  },

  subTitle: {
    color: "#9AA4BF",
    fontSize: 16,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#141923",
    marginHorizontal: 18,
    marginBottom: 15,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#232C40",
  },

  cardNova: {
    borderLeftWidth: 5,
    borderLeftColor: "#5145FF",
  },

  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  textContainer: {
    flex: 1,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardTitle: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
    flex: 1,
  },

  descricao: {
    color: "#B5BDD2",
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },

  hora: {
    color: "#7B8193",
    fontSize: 13,
    marginLeft: 10,
  },

  bolinha: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#5145FF",
    marginLeft: 10,
    alignSelf: "flex-start",
    marginTop: 8,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    marginTop: 80,
  },

  emptyTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
  },

  emptyText: {
    color: "#8C93A8",
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },
});

export default styles;