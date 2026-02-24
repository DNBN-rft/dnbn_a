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
  reportContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  cardContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: "0 0px 4px rgba(0, 0, 0, 0.3)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  typeTag: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#999",
  },
  statusBadgePending: {
    backgroundColor: "#F5F5F5",
    borderColor: "#BDBDBD",
  },
  statusBadgeCompleted: {
    backgroundColor: "#FFF5ED",
    borderColor: "#FF6B00",
  },
  statusBadgeRejected: {
    backgroundColor: "#FFEBEE",
    borderColor: "#E53935",
  },
  statusText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },
  statusTextPending: {
    color: "#757575",
  },
  statusTextCompleted: {
    color: "#FF6B00",
  },
  statusTextRejected: {
    color: "#E53935",
  },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  idxText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },
  reportTitle: {
    fontSize: 16,
    color: "#222",
    fontWeight: "600",
    marginBottom: 8,
    lineHeight: 22,
  },
  reportDate: {
    fontSize: 13,
    color: "#999",
  },
  reportAnswerContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  reportAnswerLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#EF7810",
    marginBottom: 8,
  },
  answerTitle: {
    fontSize: 15,
    color: "#222",
    fontWeight: "600",
    marginBottom: 6,
    lineHeight: 20,
  },
  reportAnswer: {
    fontSize: 14,
    color: "#555",
    lineHeight: 21,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#999",
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
