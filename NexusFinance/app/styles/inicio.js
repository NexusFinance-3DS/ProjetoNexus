import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  saldoContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#271ae1",
    height: 150,
    width: "100%",

    borderRadius: 8,
  },
  titleSaldo: {
    marginTop: 10,
    fontSize: 19,
    fontWeight: "600",
    color: "#fff",
  },
  valor: {
    marginTop: 16,
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  visaoRapidaContainer: {
    marginTop: 16,
    width: "100%",
  },
  card: {
    backgroundColor: "#271ae1",
    padding: 16,
    borderRadius: 8,
    marginRight: 16,
    width: 200,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },

});
