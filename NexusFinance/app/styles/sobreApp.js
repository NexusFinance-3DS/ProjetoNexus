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
    fontSize: 24,
    fontWeight: "bold",
  },

  mainCard: {
    backgroundColor: "#1c1c1c",
    marginHorizontal: 18,
    marginTop: 10,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#303030",
  },

  appName: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "600",
  },

  featuresCard: {
    backgroundColor: "#1c1c1c",
    marginHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#303030",
    padding: 16,
    marginBottom: 18,
  },

  featuresTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },

  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  featureTexts: {
    flex: 1,
  },

  featureTitle: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },

  featureText: {
    color: "#B8C0D4",
    fontSize: 13,
    marginTop: 4,
  },

  infoCard: {
    backgroundColor: "#1c1c1c",
    marginHorizontal: 18,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#303030",
  },

  infoTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },

  infoText: {
    color: "#B8C0D4",
    fontSize: 13,
  },

  link: {
    color: "#4B6DFF",
    marginTop: 8,
    fontWeight: "700",
  },

  contactCard: {
    backgroundColor: "#1c1c1c",
    marginHorizontal: 18,
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#303030",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  contactLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  contactText: {
    color: "#FFF",
    fontSize: 15,
    marginLeft: 10,
  },

  footer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },

  footerApp: {
    color: "#B8C0D4",
    fontSize: 14,
    marginBottom: 6,
  },

  footerCopy: {
    color: "#7B8193",
    fontSize: 12,
  },
});
