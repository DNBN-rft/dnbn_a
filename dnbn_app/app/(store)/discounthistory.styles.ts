import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
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
  discountProduct: {
    backgroundColor: "#fff",
    marginTop: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  productContainer: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 16,
    alignItems: "flex-start",
  },
  productImageContainer: {
    width: 120,
    height: 120,
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
    gap: 8,
  },
  categoryText: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 4,
  },
  productNameText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  priceContainer: {
    gap: 6,
  },
  originalPriceText: {
    fontSize: 13,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  discountAndFinalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  discountRateText: {
    fontSize: 14,
    color: "#EF7810",
    fontWeight: "700",
  },
  divider: {
    fontSize: 14,
    color: "#D1D5DB",
    fontWeight: "300",
  },
  finalPriceText: {
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "700",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  statusComplete: {
    backgroundColor: "#D1FAE5",
    color: "#059669",
  },
  statusCanceled: {
    backgroundColor: "#FEE2E2",
    color: "#DC2626",
  },
  detailButtonContainer: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  detailButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EF7810",
  },
  detailButtonText: {
    color: "#EF7810",
    fontSize: 14,
    fontWeight: "600",
  },
});
