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
  scrollContainer: {
    flex: 1,
  },
  productDetailContainer: {
    padding: 20,
  },

  productMetaContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 12,
    marginLeft: 48,
    marginRight: 48,
  },
  productStatus: {
    fontSize: 14,
    fontWeight: "600",
    color: "#22c55e",
  },
  registrationDate: {
    fontSize: 13,
    color: "#666",
  },

  contentRow: {
    flexDirection: "column",
    gap: 16,
    marginBottom: 16,
  },

  productImagesContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    backgroundColor: "#f0f0f0",
  },
  productSubImages: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  productSubImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  subImageButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
  },

  productInfoContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  categoryName: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  priceContainer: {
    gap: 4,
  },
  originalPriceText: {
    fontSize: 14,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  negoPriceText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#EF7810",
  },
  requestorInfoContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  requestorText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  requestorPhoneText: {
    fontSize: 13,
    color: "#6B7280",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  statusApprove: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10B981",
  },
  statusReject: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EF4444",
  },
  statusCancel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  productPrice: {
    fontSize: 24,
    fontWeight: "700",
    color: "#e63946",
    marginBottom: 12,
  },
  productStock: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  productDescription: {
    fontSize: 14,
    color: "#444",
    lineHeight: 22,
  },

  productStatusContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  statusInfoTitle: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  statusInfoContent: {
    fontSize: 14,
    color: "#1a1a1a",
    fontWeight: "600",
  },
});
