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
  categoryContainer: {
    flex: 1,
  },
  controlButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  controlButtonText: {
    fontSize: 14,
    color: "#aaa",
  },
  separator: {
    fontSize: 14,
    color: "#ddd",
  },
  listWrapper: {
    flex: 1,
    alignItems: "center",
  },
  columnWrapper: {
    justifyContent: "flex-start",
  },
  categoryItem: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryItemSelected: {
    borderColor: "#EF7810",
    backgroundColor: "#FFEEDD",
  },
  categoryImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  categoryText: {
    width: 70,
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  categoryTextSelected: {
    color: "#EF7810",
  },
  submitButton: {
    borderWidth: 1,
    borderColor: "#EF7810",
    backgroundColor: "#fff",
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonDisabled: {
    borderColor: "#ddd",
    backgroundColor: "#f5f5f5",
  },
  submitButtonText: {
    color: "#EF7810",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButtonTextDisabled: {
    color: "#999",
  },
  warningContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  warningText: {
    fontSize: 16,
    color: "#ff3b30",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
    marginBottom: 24,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#EF7810",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  refreshButtonText: {
    color: "#EF7810",
    fontSize: 16,
    fontWeight: "600",
  },
});
