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
    fontSize: 20,
    marginTop: 20,
    marginBottom: -5,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  visaoRapidaContainer: {
    marginTop: 16,
    width: "100%",
  },
  card: {
    backgroundColor: "#1c1c1c",
    padding: 16,
    borderRadius: 30,
    marginRight: 9,
    width: 150,
    height: 130,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    marginBottom: -6,
  },
  cardValue: {
    marginTop: 8,
    fontSize: 23,
    fontWeight: "bold",
    color: "#fff",
  },

});
