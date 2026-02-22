import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  questionListContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questionItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 8,
    boxShadow: "0 0 4px rgba(0,0,0,0.1)",
  },
  questionItemLeftSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  questionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF5ED",
    justifyContent: "center",
    alignItems: "center",
  },
  questionItemDetailContainer: {
    flex: 1,
    gap: 6,
  },
  questionItemTitleText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333333",
    lineHeight: 22,
  },
  questionItemFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  questionItemDateText: {
    fontSize: 13,
    color: "#999999",
  },
  questionItemRightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  questionItemStatusContainer: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#FFF5ED",
  },
  questionItemStatusPending: {
    backgroundColor: "#F5F5F5",
  },
  questionItemStatusText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#EF7810",
  },
  questionItemStatusTextPending: {
    color: "#999999",
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
  registerButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    paddingBottom: Platform.OS === "ios" ? 72 : 12,
  },
  flatListContentContainer: {
    paddingBottom: Platform.OS === "ios" ? 60 : 0,
  },
  registerButton: {
    backgroundColor: "#EF7810",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
