import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  closeButton: {
    padding: 5,
  },
  productInfoSection: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  productNameText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 8,
  },
  priceText: {
    fontSize: 14,
    color: "#EF7810",
    fontWeight: "600",
    marginBottom: 5,
  },
  stockText: {
    fontSize: 12,
    color: "#999",
  },
  quantitySection: {
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 10,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  quantityInput: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    paddingVertical: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 15,
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 10,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#EF7810",
  },
  addButton: {
    backgroundColor: "#EF7810",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
