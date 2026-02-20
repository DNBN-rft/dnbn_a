import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  welcomeSection: {
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 16,
    color: "#1A1A1A",
    fontWeight: "600",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  termsSection: {
    flex: 1,
    marginBottom: 20,
  },
  allAgreeContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  allAgreeContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  allAgreeLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#D1D1D6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: "#EF7810",
    borderColor: "#EF7810",
  },
  allAgreeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  termItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  termItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  termItemText: {
    fontSize: 15,
    color: "#1A1A1A",
    marginRight: 4,
  },
  requiredBadge: {
    color: "#EF7810",
    fontSize: 15,
    fontWeight: "600",
  },
  optionalBadge: {
    color: "#8E8E93",
    fontSize: 13,
  },
  viewDetailButton: {
    padding: 4,
  },
  buttonContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  startButton: {
    width: "100%",
    height: 54,
    backgroundColor: "#EF7810",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#EF7810",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonDisabled: {
    backgroundColor: "#D1D1D6",
    shadowOpacity: 0,
    elevation: 0,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  startButtonTextDisabled: {
    color: "#8E8E93",
  },
});
