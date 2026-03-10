/**
 * 스토어 회원가입 Step 2: 사업자 정보 입력 스타일
 */
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 24,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  required: {
    color: "#FF6F2B",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#333",
    backgroundColor: "#fff",
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
  },
  inputFlex: {
    flex: 1,
  },
  phoneInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  phoneInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#333",
    backgroundColor: "#fff",
    textAlign: "center",
  },
  phoneSeparator: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
  },
  checkButton: {
    paddingHorizontal: 16,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF6F2B",
    borderRadius: 8,
    backgroundColor: "#fff",
    minWidth: 90,
  },
  checkButtonDisabled: {
    borderColor: "#ccc",
    backgroundColor: "#f5f5f5",
  },
  checkButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF6F2B",
  },
  dateInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  dateText: {
    fontSize: 15,
    color: "#333",
  },
  datePlaceholder: {
    fontSize: 15,
    color: "#ccc",
  },
  helperText: {
    fontSize: 13,
    color: "#999",
    marginTop: 6,
  },
  bottomButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  nextButton: {
    height: 56,
    backgroundColor: "#FF6F2B",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#fff",
  },
});
