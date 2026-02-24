import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  leftSection: {
    flex: 1,
    alignItems: "flex-start",
  },
  centerSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  rightSection: {
    flex: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    borderRadius: 10,
    margin: 20,
    width: "90%",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  giftImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginTop: 5,
  },
  storeName: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.5)",
    marginTop: 8,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 2,
  },
  qrImage: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginTop: 50,
  },

  explanationContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    borderRadius: 10,
    paddingVertical: 15,
    backgroundColor: "#fff",
    marginHorizontal: 20,
  },
  explanationTab: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  explanationTabText: {
    fontSize: 16,
    color: "#333",
  },
  explanationContent: {
    marginTop: 15,
  },
  explanationText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  explanationTextToggle: {
    flex: 1,
  },
  explanationToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 10,
  },
  giftDetailInfo: {
    marginTop: 30,
    paddingTop: 20,
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingBottom: 20,
    marginBottom: 30,
    marginHorizontal: 20,
  },
  giftDetailTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  giftDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  giftDetailLabel: {
    fontSize: 14,
    color: "#333",
  },
  giftDetailValue: {
    fontSize: 14,
    color: "#666",
  },
  useButton: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#EF7810",
    paddingVertical: 20,
    borderRadius: 5,
  },
  useButtonText: {
    color: "#EF7810",
    fontSize: 16,
  },
});
