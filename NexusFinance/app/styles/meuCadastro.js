import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070D",
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
    backgroundColor: "#11151D",
    marginHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#242B3D",
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
    backgroundColor: "#0E121A",
    color: "#FFF",
    fontSize: 16,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#242B3D",
  },

  itemButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#0B0F16",
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
    backgroundColor: "#5145FF",
    marginHorizontal: 18,
    marginTop: 10,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  saveButtonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
  },
});

export default styles;
