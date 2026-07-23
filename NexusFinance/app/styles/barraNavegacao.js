import { StyleSheet } from "react-native";

export default StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    width: "105%",
    height: 70,
    borderWidth: 1,
    borderColor: "#201f2c",
    backgroundColor: "#0f0f13",
    borderRadius: 18,
    marginBottom: 12,
    paddingHorizontal: 6,
    alignItems: "center",
    position: 'absolute',
    bottom: -10,
  },

  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    minHeight: 58,
  },

  tabLabel: {
    fontSize: 11,
    color: "#ffffff",
    fontWeight: "500",
    marginTop: 4,
  },
  // Menu expandido e navegação
  menuExpandido: {
    position: "absolute",
    bottom: 70,
    left: 10,
    right: 10,
    height: 80,
    backgroundColor: "#17171c",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    
  },
  itemMenu: {
    alignItems: "center",
  },
});
