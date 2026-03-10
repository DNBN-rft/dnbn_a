/**
 * 스토어 회원가입 Step 4: 파일 업로드 스타일
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
  section: {
    marginBottom: 32,
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
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  required: {
    color: "#FF6F2B",
  },
  helperText: {
    fontSize: 13,
    color: "#999",
    marginBottom: 16,
  },
  uploadButton: {
    height: 200,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  uploadButtonText: {
    fontSize: 15,
    color: "#999",
    marginTop: 8,
  },
  imagePreview: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 14,
  },
  docGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
  },
  docItem: {
    position: "relative",
    width: "48%",
    aspectRatio: 1,
  },
  docImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  removeDocButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  addDocButton: {
    height: 56,
    borderWidth: 1,
    borderColor: "#FF6F2B",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  addDocButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FF6F2B",
  },
  bottomButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  submitButton: {
    height: 56,
    backgroundColor: "#FF6F2B",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#fff",
  },
});
