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

  card: {
    marginTop: 20,
    backgroundColor: "#1c1c1c",
    marginHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#303030",
    padding: 18,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  profileCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: "#5145FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    backgroundColor: "#0E1119",
  },

  profileInfo: {
    flex: 1,
  },

  profileName: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },

  profileEmail: {
    color: "#A5A5A5",
    fontSize: 14,
    marginTop: 4,
  },

  profileSubtitle: {
    color: "#B8C0D4",
    fontSize: 14,
    lineHeight: 20,
  },

  cardTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 18,
  },

  input: {
    width: "100%",
    height: 55,
    backgroundColor: "#111010",
    color: "#FFF",
    fontSize: 16,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#3c3c3c",
  },

  itemButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#111010",
    borderRadius: 14,
  },

  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  itemText: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 14,
  },

  saveButton: {
    backgroundColor: "#635bff",
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 18,
    marginTop: 10,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  saveButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default styles;
