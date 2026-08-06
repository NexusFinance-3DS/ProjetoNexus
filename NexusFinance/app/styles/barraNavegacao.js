import { StyleSheet } from "react-native";

export default StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    width: "94%",
    maxWidth: 420,
    height: 76,
    borderWidth: 1,
    borderColor: "#201f2c",
    backgroundColor: "#0f0f13",
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 8,
    alignSelf: "center",
    zIndex: 10,
    elevation: 6,
  },

  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 58,
    paddingHorizontal: 4,
  },

  tabLabel: {
    fontSize: 10,
    color: "#ffffff",
    fontWeight: "500",
    marginTop: 3,
    textAlign: "center",
  },

  // Menu expandido e navegação
  menuExpandido: {
    position: "absolute",
    bottom: 65,
    width: "94%",
    height: "15%",
    maxWidth: 420,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#101015",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 9,
    borderWidth: 1,
    borderColor: "#201f2c",
    alignSelf: "center",
  },

  itemMenu: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 56,
    paddingVertical: 4,
  },
});
