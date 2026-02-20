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
  // 탭 스타일
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: 50,
  },
  tabButton: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tabButtonActive: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: "#ef7810",
  },
  tabButtonText: {
    color: "#9CA3AF",
    fontSize: 15,
  },
  tabButtonTextActive: {
    color: "#1F2937",
    fontSize: 15,
    fontWeight: "600",
  },

  // 상품 탭 스타일 (storesale 참고)
  productCard: {
    backgroundColor: "#fff",
    marginTop: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
    overflow: "hidden",
  },
  productContainer: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 16,
    alignItems: "center",
  },
  productImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  productInfoContainer: {
    flex: 1,
    justifyContent: "space-between",
    gap: 8,
  },
  categoryText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  productNameText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    lineHeight: 20,
  },
  priceText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#EF7810",
    marginTop: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  statusComplete: {
    color: "#10B981",
    backgroundColor: "#D1FAE5",
  },
  statusDelete: {
    color: "#EF4444",
    backgroundColor: "#FEE2E2",
  },
  buttonContainer: {
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  detailButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ef7810",
    borderRadius: 8,
    paddingVertical: 10,
  },
  detailButtonText: {
    fontWeight: "600",
    color: "#ef7810",
    fontSize: 14,
  },

  // 요청 탭 스타일 (storenego 참고)
  requestCard: {
    backgroundColor: "#fff",
    marginTop: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
    overflow: "hidden",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  requestHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  processDateText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  requestContainer: {
    flexDirection: "row",
    gap: 16,
  },
  requestImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  requestImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  requestInfoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  priceContainer: {
    gap: 4,
  },
  originalPriceText: {
    fontSize: 13,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  negoPriceText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#EF7810",
  },
  requestorContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  requestorText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  requestorPhoneText: {
    fontSize: 12,
    color: "#6B7280",
  },
  requestResultText: {
    fontSize: 12,
    fontWeight: "600",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  requestResultApprove: {
    color: "#10B981",
    backgroundColor: "#D1FAE5",
  },
  requestResultReject: {
    color: "#EF4444",
    backgroundColor: "#FEE2E2",
  },
  requestResultCancel: {
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
  },
  requestButtonContainer: {
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
    paddingTop: 12,
    marginTop: 12,
  },
  requestDetailButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ef7810",
    borderRadius: 8,
    paddingVertical: 10,
  },
  requestDetailButtonText: {
    fontWeight: "600",
    color: "#ef7810",
    fontSize: 14,
  },
});
