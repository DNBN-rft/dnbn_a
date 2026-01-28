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
  categoryContainer: {
    flex: 1,
  },
  columnWrapper: {
    justifyContent: "flex-start",
    paddingHorizontal: 20,
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
  submitButtonText: {
    color: "#EF7810",
    fontSize: 16,
    fontWeight: "bold",
  },
});
