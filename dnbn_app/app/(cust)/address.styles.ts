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
  locationSettingContainer: {
    flex: 1,
    backgroundColor: "white",
  },

  bottomButtonContainer: {
    flexDirection: "column",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  addButton: {
    backgroundColor: "#ffffff",
    height: 50,
    borderRadius: 8,
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#EF7810",
    borderWidth: 1,
  },
  addButtonDisabled: {
    backgroundColor: "#f5f5f5",
    borderColor: "#ddd",
    opacity: 0.6,
  },
  addButtonText: {
    color: "#EF7810",
    fontSize: 16,
    fontWeight: "600",
  },

  infoBox: {
    margin: 10,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  list: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    marginVertical: 1,
  },
  listItem: {
    flexDirection: "column",
    marginVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    boxShadow: "0 0 10px rgba(0,0,0,0.12)",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  listItemSelected: {
    borderColor: "#EF7810",
    borderWidth: 1,
  },
  contentContainer: {
    flex: 1,
    gap: 3,
  },

  titleContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemRecipientContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemTitleContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemDetailText: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },

  defaultAddressContainer: {
    width: 70,
    height: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#EF7810",
    borderRadius: 6,
  },
  defaultAddress: {
    color: "#EF7810",
    fontSize: 12,
    fontWeight: "bold",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 5,
  },
  editButton: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#999",
  },
  editButtonText: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  removeButton: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#999",
  },
  removeButtonText: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 40,
  },

  // 주소 검색 모달 스타일
  modalContent: {
    flex: 1,
    paddingTop: 0,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalCloseButton: {
    padding: 4,
  },
  modalEmptyView: {
    width: 28,
  },
  postcodeStyle: {
    flex: 1,
  },

  // 확인 모달 스타일
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmModalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  confirmModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  confirmModalMessage: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  confirmModalButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  confirmModalButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
  },
  confirmButton: {
    backgroundColor: "#EF7810",
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  submitButton: {
    borderWidth: 1,
    borderColor: "#EF7810",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    height: 50,
    justifyContent: "center",
  },
  submitButtonDisabled: {
    borderColor: "#ddd",
    opacity: 0.5,
  },
  submitButtonText: {
    color: "#EF7810",
    fontSize: 16,
    fontWeight: "bold",
  },
});
