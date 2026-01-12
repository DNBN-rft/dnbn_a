import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#F5F5F5",
  },
  modalOptionSelected: {
    backgroundColor: "#E8E8E8",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#333",
  },
  modalOptionTextSelected: {
    fontWeight: "600",
  },
});
