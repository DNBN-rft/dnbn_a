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
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
    alignItems: "center",
  },
  tabActive: {
    borderBottomColor: "rgb(239, 120, 16)",
  },
  tabLabel: {
    fontSize: 17,
    fontWeight: "500",
    color: "rgb(239, 120, 16)",
  },
  tabLabelActive: {
    color: "rgb(239, 120, 16)",
    fontWeight: "800",
  },
  content: {
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 40,
  },
  alarmList: {
    flex: 1,
  },
  alarmItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fafafa",
  },
  alarmItemUnread: {
    backgroundColor: "rgba(239, 120, 16, 0.07)",
  },
  alarmItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  alarmItemLeft: {
    flex: 1,
  },
  alarmTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgb(239, 120, 16)",
    marginBottom: 4,
  },
  alarmText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
    marginBottom: 6,
  },
  alarmTime: {
    fontSize: 12,
    color: "#999",
  },
  alarmUnreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF6B6B",
    marginLeft: 8,
    marginTop: 2,
  },
});
