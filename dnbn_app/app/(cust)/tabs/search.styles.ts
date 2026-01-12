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
  searchView: {
    flex: 1,
    backgroundColor: "white",
  },
  searchContainer: {
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    flex: 1,
  },
  searchBarContainer: {
    flexDirection: "row",
    marginBottom: 10,
    height: 40,
  },
  searchBar: {
    fontSize: 16,
    color: '#999',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: 300,
    borderBottomWidth: 1,
    opacity: 1,
    outlineWidth: 0,
    flex: 1,
  },
  searchButton: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#EF7810",
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    fontSize: 18,
    paddingHorizontal: 25,
    color: "#EF7810",
  },
  recentSearchContainer: {
    marginBottom: 10,
  },
  recentSearchKeywordText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  recentKeywordText: {
    fontSize: 16,
  },
  recentSearchKeyword: {
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: "#F2F2F2",
    margin: 5,
    padding: 5,
  },
  deleteButton: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  recommendProductContainer: {
    flex: 1,
  },
  recommendProductText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  products: {
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
  },
  priceInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
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
    fontSize: 16,
    color: "#666",
    marginTop: 4,
    marginBottom: 8,
  },
  averageRate: {
    fontSize: 16,
    color: "#333",
  },
  reviewCount: {
    fontSize: 16,
    color: "#666",
    marginLeft: 4,
  },
  reviewInfo: {
    flexDirection: "row",
  },
  reviewStar: {
    width: 13,
    height: 13,
  },
});
