import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentWrapper: {
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  negoProduct: {
    marginVertical: 10,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#fff",
  },
  productContainer: {
    flexDirection: "row",
  },
  negoPriceText: {
    fontWeight: "bold"
  },
  productImageContainer: {
    width: 120,
    height: 120,
  },
  productImage: {
    width:"100%",
    height:"100%",
    resizeMode: "contain"
  },
  productInfoContainer: {
    flex: 1,
    justifyContent: "space-evenly",
    marginLeft: 10
  },
  priceContainer: {
    // flexDirection: "row"
  },
  registPriceText: {
    fontSize: 13,
    color: "#bdbdbd"
  },
  cancelButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    height: 30,
    marginVertical: 5,
    borderColor: "#ff9500",
  },
  cancelButtonText: {
    color: "#ff9500"
  }
});
