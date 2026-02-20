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
  productInfoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  productInfoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  productImagePlaceholderText: {
    color: "#999",
  },
  productDetails: {
    flex: 1,
    justifyContent: "center",
  },
  storeName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  productName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    lineHeight: 20,
  },
  reviewImagesSection: {
    paddingVertical: 16,
  },
  reviewImagesContentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  reviewImageItem: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 8,
  },
  ratingSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  contentSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  contentText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
    marginTop: 8,
  },
  actionButtonsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderColor: "rgb(239, 120, 16)",
    borderWidth: 1,
    borderRadius: 4,
    alignItems: "center",
  },
  editButtonText: {
    color: "rgb(239, 120, 16)",
    fontWeight: "600",
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 4,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  safeAreaBottom: {
    backgroundColor: "#000",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 24,
    width: "80%",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "rgb(239, 120, 16)",
    borderRadius: 4,
    alignItems: "center",
  },
  modalConfirmButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    alignItems: "center",
  },
  modalCancelButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  starIcon: {
    marginRight: 4,
  },
  insetTopView: {
    backgroundColor: "#fff",
  },
});
