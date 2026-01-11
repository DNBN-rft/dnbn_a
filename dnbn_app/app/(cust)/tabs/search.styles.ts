import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
    justifyContent: "center",
    width: 300,
    borderBottomWidth: 1,
    opacity: 1,
    outlineWidth: 0,
    flex: 1,
  },
  searchButton: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 3,
    color: "black",
  },
  recentSearchContainer: {
    marginBottom: 10,
  },
  recentSearchKeywordText: {
    marginBottom: 10,
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
    marginBottom: 10,
  },
  products: {
    marginBottom: 10,
    flexDirection: "row",
  },
  productInfo: {
    marginLeft: 10,
  },
  productImage: {
    backgroundColor: "white",
    width: 90,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  priceInfo: {
    flexDirection: "row",
  },
  reviewInfo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  reviewStar: {
    width: 13,
    height: 13,
  },
});
