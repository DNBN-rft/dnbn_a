import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
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
    color: "#1F2937",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    pointerEvents: "none",
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  productDetailContainer: {
    padding: 20,
    gap: 20,
  },
  contentRow: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    gap: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  productImagesContainer: {
    gap: 12,
  },
  productMetaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginLeft: 48,
    marginRight: 48,
  },
  productStatus: {
    fontSize: 13,
    fontWeight: "600",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusComplete: {
    backgroundColor: "#D1FAE5",
    color: "#059669",
  },
  statusCanceled: {
    backgroundColor: "#FEE2E2",
    color: "#DC2626",
  },
  registrationDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  mainImageContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  mainImageButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
  },
  productMainImage: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  productSubImages: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  productSubImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  productInfoContainer: {
    gap: 12,
  },
  categoryName: {
    fontSize: 12,
    color: "#6B7280",
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  priceInfoContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  originalPrice: {
    fontSize: 14,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  discountRate: {
    fontSize: 15,
    color: "#EF7810",
    fontWeight: "700",
  },
  discountAmount: {
    fontSize: 15,
    color: "#EF4444",
    fontWeight: "700",
  },
  finalPriceRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  finalPriceLabel: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
  },
  finalPrice: {
    fontSize: 18,
    color: "#EF7810",
    fontWeight: "bold",
  },
  productStock: {
    fontSize: 14,
    color: "#6B7280",
  },
  productDescription: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  productStatusContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusInfoRow: {
    gap: 8,
  },
  statusInfoTitle: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
  },
  statusInfoContent: {
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "500",
  },
});
