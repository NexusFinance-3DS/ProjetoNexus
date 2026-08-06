import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    alignItems: "stretch",
    marginLeft: -10,
    marginRight: -10,
    paddingHorizontal: 10,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 55,
    marginBottom: 20,
  },

  title: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#B8C0D4",
    fontSize: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    lineHeight: 22,
  },

  card: {
    backgroundColor: "#1c1c1c",
    marginHorizontal: 18,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#303030",
    paddingVertical: 12,
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

  itemMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 18,
  },

  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  itemText: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 15,
    flexShrink: 1,
  },

  divider: {
    height: 1,
    backgroundColor: "#3b3b3b",
    marginHorizontal: 18,
  },

  cardInfo: {
    backgroundColor: "#1c1c1c",
    marginHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#303030",
    padding: 18,
    marginBottom: 20,
  },

  cardInfoTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  cardInfoText: {
    color: "#B8C0D4",
    fontSize: 15,
    lineHeight: 22,
  },

  contactButton: {
    backgroundColor: "#635bff",
    marginHorizontal: 18,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  contactText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
