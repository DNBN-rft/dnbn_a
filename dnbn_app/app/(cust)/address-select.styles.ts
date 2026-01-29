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
    pointerEvents: "none",
  },
  placeholder: {
    width: 40,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  section: {
    marginTop: 24,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 15,
    fontSize: 15,
    color: "#333",
  },

  addressInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 15,
  },

  addressInputText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },

  addressInputPlaceholder: {
    color: "#999",
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  checkboxLabel: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },

  bottomButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  saveButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#EF7810",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  saveButtonDisabled: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: "#EF7810",
    fontSize: 16,
    fontWeight: "bold",
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
});
