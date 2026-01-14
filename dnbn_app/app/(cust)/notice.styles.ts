import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
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
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    pointerEvents: "none",
  },
  placeholder: {
    width: 40,
  },
  noticeListContainer: {
    padding: 16,
  },
  noticeItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginVertical: 6,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  noticeItemDetailContainer: {
    flex: 1,
    marginRight: 12,
  },
  noticeItemTitleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 6,
    lineHeight: 22,
  },
  noticeItemDateText: {
    fontSize: 13,
    color: "#8E8E93",
    fontWeight: "400",
  },
  chevronIcon: {
    opacity: 1,
  },
  pinnedNoticeContainer: {
    backgroundColor: "#FFF9F0",
  },
  pinnedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EF7810",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  pinnedBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 3,
  },
  pinnedIcon: {
    marginRight: 2,
  },
});
