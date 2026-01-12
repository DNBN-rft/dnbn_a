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
  },
  placeholder: {
    width: 40,
  },
  saleProduct: {
    marginVertical: 10,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#fff",
  },
  productContainer: {
    flexDirection: "row",
  },
  productImageContainer: {
    width: 120,
    height: 120,
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  productInfoContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 8,
    marginLeft: 10
  },
  categoryText: {
    fontSize: 12,
    color: "#999",
  },
  productNameText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  originalPriceText: {
    fontSize: 12,
    color: "#bdbdbd",
    textDecorationLine: "line-through",
  },
  discountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  discountRateText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ef7810",
  },
  salePriceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  statusContainer: {
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    color: "#666",
  },
  buttonContainer: {
    marginTop: 8,
  },
  deleteButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#999",
    backgroundColor: "#fff",
    paddingVertical: 10,
  },
  deleteButtonText: {
    fontWeight: "bold",
    color: "#999"
  },

  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteModalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    maxWidth: 340,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  deleteModalMessage: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 24,
  },
  deleteModalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  deleteModalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F5F5F5",
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  confirmButton: {
    backgroundColor: "#FF3B30",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
