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
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
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
  scrollContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  qaSection: {
    marginHorizontal: 20,
    marginVertical: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  qaHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  qaIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EF7810",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  answerIconContainer: {
    backgroundColor: "#EF7810",
  },
  qaIconText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  qaHeaderInfo: {
    flex: 1,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: "#FFF5ED",
  },
  statusBadgePending: {
    backgroundColor: "#F5F5F5",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#EF7810",
  },
  statusTextPending: {
    color: "#999999",
  },
  managerName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
  },
  qaContent: {
    paddingLeft: 42,
  },
  qaTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  qaText: {
    fontSize: 14,
    color: "#333333",
    lineHeight: 22,
    marginBottom: 8,
  },
  qaDate: {
    fontSize: 13,
    color: "#999999",
  },
});

