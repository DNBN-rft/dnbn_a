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
  // 정렬 옵션
  sortContainer: {
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomColor: "#f0f0f0",
    borderBottomWidth: 1,
  },
  sortContentContainer: {
    paddingHorizontal: 12,
    alignItems: "center",
  },
  sortButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  sortButtonActive: {
    backgroundColor: "rgb(239, 120, 16)",
    borderColor: "rgb(239, 120, 16)",
  },
  sortButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  sortButtonTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  // 상품 아이템
  productItemContainer: {
    flexDirection: "column",
    backgroundColor: "#fff",
    marginVertical: 5,
    marginHorizontal: 12,
    borderRadius: 10,
    overflow: "hidden",
  },
  productItemExpired: {
    opacity: 0.6,
    backgroundColor: "#f5f5f5",
  },

  productContentRow: {
    flexDirection: "row",
    paddingRight: 12,
    paddingLeft: 12,
    paddingVertical: 12,
    borderColor: "#ccc",
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  productImageWrapper: {
    position: "relative",
    width: 180,
    height: 170,
  },
  productImage: {
    borderRadius: 8,
    width: "100%",
    height: "100%",
  },
  productImageExpired: {
    opacity: 0.5,
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgb(239, 120, 16)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 10,
  },
  discountBadgeExpired: {
    backgroundColor: "#999",
  },
  discountBadgeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  timeLimitBanner: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
    borderColor: "rgb(239, 120, 16)",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  timeLimitBannerExpired: {
    backgroundColor: "#f5f5f5",
    borderColor: "#999",
  },
  timeLimitBannerText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "rgb(239, 120, 16)",
  },
  timeLimitBannerTextExpired: {
    color: "#999",
  },
  productInfo: {
    marginLeft: 12,
    flex: 1,
    paddingVertical: 8,
    paddingRight: 8,
    justifyContent: "flex-start",
  },
  storeName: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
    flex: 1,
    marginBottom: 4,
  },
  storeNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  productNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 40,
  },
  distanceText: {
    fontSize: 13,
    color: "#999",
  },
  originalPriceText: {
    fontSize: 13,
    color: "#bbb",
    textDecorationLine: "line-through",
    marginBottom: 4,
  },
  discountPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginBottom: 6,
  },
  discountText: {
    fontSize: 14,
    color: "rgb(239, 120, 16)",
    fontWeight: "bold",
  },
  priceText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
  reviewSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    marginLeft: 2,
  },
  reviewCountText: {
    fontSize: 14,
    color: "#999",
    marginLeft: 1,
  },
  // 로딩 상태
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  // 빈 상태
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#999",
  },
});
