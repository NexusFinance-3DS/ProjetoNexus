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

  header: {
    marginTop: 1,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  subTitle: {
    color: "#9AA4BF",
    fontSize: 16,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#1c1c1c",
    marginHorizontal: 18,
    marginBottom: 15,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#303030",
  },

  cardNova: {
    borderLeftWidth: 5,
    borderLeftColor: "#4b3df2",
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
    backgroundColor: "#4b3df2",
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