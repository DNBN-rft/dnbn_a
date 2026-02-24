import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  reviewContainer: {
    gap: 8,
    marginVertical: 10,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#fff",
  },
  reviewInfoContainer: {
    flexDirection: "row",
  },
  reviewImageContainer: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  reviewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  reviewDetails: {
    flex: 1,
    justifyContent: "center",
    gap: 10,
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
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  dateText: {
    fontSize: 12,
    color: "#999",
  },
  userNameText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  reviewContentText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  hideInfosContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#FFE5E5",
    backgroundColor: "#FFF5F5",
    borderRadius: 4,
    paddingVertical: 8,
  },
  hideInfoHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  hideInfoIcon: {
    lineHeight: 24,
  },
  hideInfoText: {
    fontSize: 14,
    color: "#999",
  },
  hideClearInfoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#d1d1d1",
    backgroundColor: "#f1f1f1",
    borderRadius: 4,
    paddingVertical: 8,
  },
  hideClearInfoText: {
    fontSize: 14,
    color: "#999",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    height: 36,
    gap: 8,
  },
  answerButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ef7810",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  answerButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ef7810",
  },
  answeredButton: {
    backgroundColor: "#ef7810",
  },
  answeredButtonText: {
    color: "#fff",
  },
  hideButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  hideButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
  },
  hiddenButton: {
    backgroundColor: "#999",
  },
  hiddenButtonText: {
    color: "#fff",
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
