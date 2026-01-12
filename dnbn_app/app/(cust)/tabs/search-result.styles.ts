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
    pointerEvents: "none",
  },
  placeholder: {
    width: 40,
  },
  searchResultView: {
    flex: 1,
    backgroundColor: "white",
  },
  productResultContainer: {
    flex: 1,
  },
  productAndStoreTab: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: 50,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#EF7810',
  },
  tabText: {
    fontSize: 20,
    color: '#999',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#EF7810',
    fontWeight: '600',
  },
  filter: {
    fontSize: 16,
    color: '#999',
  },
  searchResult: {
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    flex: 1,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  resultCountHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  products: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    marginVertical: 8,
    borderRadius: 8,
    overflow: "hidden",
    borderBottomWidth: 1,
    paddingBottom: 16,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  productInfo: {
    marginLeft: 12,
    flex: 1,
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  productImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    marginRight: 10,
  },
  priceInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  discountRateText: {
    fontSize: 18,
    color: "#EF7810",
    fontWeight: "bold",
    marginLeft: 10,
  },
  originalPriceText: {
    fontSize: 18,
    color: "#999",
    textDecorationLine: "line-through",
  },
  priceText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 18,
    color: "#666",
    marginTop: 4,
    marginBottom: 8,
  },
  averageRate: {
    fontSize: 18,
    color: "#333",
  },
  reviewCount: {
    fontSize: 18,
    color: "#666",
    marginLeft: 4,
  },
  reviewInfo: {
    flexDirection: "row",
  },
  stores: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    marginVertical: 8,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    borderBottomWidth: 1,
    paddingBottom: 16,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  storeInfo: {
    marginLeft: 10,
    flex: 1,
  },
  storeImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    marginRight: 10,

  },
  category: {
    marginLeft: 8,
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  storeNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  }
});
