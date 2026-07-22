import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: "#000",
  alignItems: "stretch",
  marginLeft: -10,
  marginRight: -10,
  paddingHorizontal: 10,
  paddingTop: 10,
  paddingBottom: 80,
},

  saldoContainer: {
    marginTop: 16,
    marginLeft: 10,
    marginRight: 10,
    padding: 12,
    backgroundColor: "#271ae1",
    height: 150,
    width: "95%",
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
    width: "110%",
  },

  title: {
    fontSize: 20,
    marginTop: 16,
    marginLeft: 20,
    marginBottom: 5,
    fontWeight: "600",
    color: "#fff",
  },
  visaoRapidaContainer: {
    marginTop: 16,
    width: "95%",
    marginLeft: 10,
    marginRight: 10,
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
  metasContainer: {
    marginTop: 16,
  },
  metaCard: {
    backgroundColor: "#1c1c1c",
    padding: 16,
    marginLeft: 10,
    marginRight: 10,
    width: "86%",
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  metaTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  metaValue: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#fff",
  },

});
