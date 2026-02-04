import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
  },
  headerContainer: {
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
  welcome: {
    color: "#FF6F2B",
    marginBottom: 5,
    fontSize: 18,
    fontWeight: "bold",
  },
  practiceView: {
    flex: 1,
    backgroundColor: "white",
  },
  viewMargin: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    marginVertical: 1,
  },
  inputContainer: {
    marginHorizontal: 10,
  },
  inputComponent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  inputStyle: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 15,
    color: "#919191ff",
    backgroundColor: "#fff",
  },
  inputTitle: {
    fontSize: 15,
    color: "#EF7810",
    marginBottom: 8,
  },
  pressableStyle: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#EF7810",
    backgroundColor: "#fff",
    borderRadius: 6,
  },
  pressableTextStyle: {
    fontSize: 15,
    color: "#EF7810",
  },
  descriptionStyle: {
    fontSize: 13,
    color: "#999",
    marginTop: 6,
  },
  registButton: {
    height: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#FF6F2B",
  },
  registButtonText: {
    fontSize: 20,
    color: "#FF6F2B",
  },
  safeAreaTop: {
    backgroundColor: "#FFFFFF",
  },
  safeAreaBottom: {
    backgroundColor: "#000",
  },
  emailDomainDisabled: {
    backgroundColor: "#f0f0f0",
  },
  pickerContainer: {
    marginTop: 8,
    ...Platform.select({
      ios: {
        height: 200,
      },
      android: {
        height: 55,
      },
    }),
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: 6,
    backgroundColor: "#fff",
    justifyContent: "center",
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: "100%",
  },
  pickerItem: {
    fontSize: 16,
    height: 216,
    color: "#333",
  },
  pickerButton: {
    marginTop: 8,
    height: 50,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: 6,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  pickerButtonText: {
    fontSize: 15,
    color: "#919191ff",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "transparent",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  modalDoneButton: {
    fontSize: 16,
    color: "#EF7810",
    fontWeight: "600",
  },
  iosModalPicker: {
    width: "100%",
    height: 216,
    backgroundColor: "#fff",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
