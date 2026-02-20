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
  searchView: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    paddingBottom: 20,
  },
  searchBarContainer: {
    flexDirection: "row",
    marginBottom: 25,
    height: 40,
  },
  searchBar: {
    fontSize: 16,
    color: "#000",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
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
    marginBottom: 20,
  },
  recentSearchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  recentSearchKeywordText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteAllText: {
    fontSize: 14,
    color: "#666",
  },
  recentKeywordText: {
    fontSize: 16,
  },
  recentSearchKeyword: {
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: "rgba(239, 120, 16, 0.15)",
    margin: 5,
    padding: 5,
  },
  deleteButton: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  categorySection: {
    marginBottom: 25,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e8e8e8",
  },
  categoryContainer: {
    paddingVertical: 10,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 20,
  },
  categoryImageBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  categoryImage: {
    width: 70,
    height: 70,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },

  productSection: {
    marginBottom: 25,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e8e8e8",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  galleryContainer: {
    paddingVertical: 10,
  },
  galleryItem: {
    width: 170,
    marginRight: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },
  galleryImage: {
    width: 170,
    height: 170,
    backgroundColor: "#f5f5f5",
  },
  galleryInfo: {
    padding: 10,
  },
  storeName: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  productName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  discountPrice: {
    fontSize: 14,
    color: "#EF7810",
    fontWeight: "bold",
    opacity: 0.5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#EF7810",
  },
  moreButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 8,
    marginRight: 15,
    boxShadow: "0 0 4px rgba(0,0,0,0.2)",
  },
  emptyProductContainer: {
    height: 210,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    marginTop: 12,
  },
});
