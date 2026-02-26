import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ef7810",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  successText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 40,
  },
  homeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#ef7810",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  homeButtonText: {
    fontSize: 15,
    color: "#ef7810",
    marginLeft: 4,
  },
});
