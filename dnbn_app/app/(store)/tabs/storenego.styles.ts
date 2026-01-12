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
    borderBottomColor: "#E0E0E0",
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
    color: "#999",
    fontSize: 15,
  },
  tabButtonTextActive: {
    color: "#000",
    fontSize: 15,
    fontWeight: "600",
  },
  negoProduct: {
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
    width:"100%",
    height:"100%",
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
  registPriceText: {
    fontSize: 12,
    color: "#bdbdbd"
  },
  negoRequestProduct: {
    marginVertical: 10,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#fff",
  },
  negoRequestProductContainer: {
    flexDirection: "row",
  },
  negoRequestProductImageContainer: {
    width: 120,
    height: 120,
  },
  negoRequestProductImage: {
    width:"100%",
    height:"100%",
    resizeMode: "contain"
  },
  negoRequestproductInfoContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 8,
    marginLeft: 10
  },
  negoStatusAndPriceContainer: {
    gap: 5,
  },
  negoStatusText: {
    fontSize: 12,
    color: "#666",
  },
  negoPriceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  requestor: {
    flexDirection: "row",
    gap: 10,
  },
  cancelButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    height: 30,
    marginVertical: 5,
    borderColor: "#ef7810",
  },
  cancelButtonText: {
    fontWeight: "bold",
    color: "#ef7810"
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  requestButtonContainer: {
    flexDirection: "row",
    flex: 1,
  },
  approveButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    height: 30,
    marginVertical: 5,
    marginRight: 4,
    borderColor: "#ef7810",
  },
  approveButtonText: {
    fontWeight: "bold",
    color: "#ef7810"
  },
  rejectButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    height: 30,
    marginVertical: 5,
    marginLeft: 4,
    borderColor: "#ef7810",
  },
  rejectButtonText: {
    fontWeight: "bold",
    color: "#ef7810"
  },
  moreButton: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    paddingHorizontal: 4,
    height: 30,
    borderRadius: 6,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },



  
  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    minWidth: 160,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
  },
  modalButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
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
