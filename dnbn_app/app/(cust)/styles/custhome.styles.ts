import { Dimensions, StyleSheet } from "react-native";

const screenWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  addr: {
    paddingVertical: 6,
    flexDirection: "row",
    gap: 30,
  },
  addrText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  headerButton: {
    padding: 6,
  },
  iconText: {
    fontSize: 20,
  },
  bannerContainer: {
    height: 200,
    marginBottom: 30,
  },
  bannerSlide: {
    width: screenWidth,
    height: 200,
    overflow: "hidden",
  },
  bannerImage: {
    width: screenWidth,
    height: 200,
  },
  contentSection: {
    marginBottom: 20,
  },
  productListWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  productList: {
    flex: 1,
  },
  sectionHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 10,
    alignItems: "center",
  },
  sectionMore: {
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  sectionMoreText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
  },
  productCard: {
    width: 150,
    marginHorizontal: 8,
  },
  productImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  productInfo: {
    paddingTop: 8,
    gap: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  storeName: {
    fontSize: 12,
    color: "#666",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  discount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ff4444",
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  contentProduct: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    marginBottom: 30,
  },
  moreButton: {
    width: 50,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
  },
});
