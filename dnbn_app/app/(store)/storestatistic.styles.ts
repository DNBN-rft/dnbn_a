import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
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
    color: "#1F2937",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    pointerEvents: "none",
  },
  placeholder: {
    width: 40,
  },
  sectionContainer: {
    flex: 1,
    padding: 16,
  },

  // 기간 선택 필터
  periodFilter: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  periodButtonActive: {
    backgroundColor: "#EF7810",
    borderColor: "#EF7810",
  },
  periodButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  periodButtonTextActive: {
    color: "#fff",
  },

  // 요약 통계
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  topSectionBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  topSectionLabel: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 8,
    fontWeight: "500",
  },
  topSectionPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  changeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#22C55E",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },

  graphSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  graphContainer: {
    alignItems: "center",
    paddingTop: 10,
  },

  rankingSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rankingList: {
    width: "100%",
  },
  rankingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  rankingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  trophyBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  rankingInfo: {
    flex: 1,
  },
  rankingProductName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  rankingProductAmount: {
    fontSize: 12,
    color: "#94A3B8",
  },
  rankingProductTotal: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#EF7810",
  },
  rankingDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },

  // 카테고리 섹션
  categorySection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryList: {
    width: "100%",
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    flex: 1,
  },
  categoryRight: {
    alignItems: "flex-end",
  },
  categoryPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 2,
  },
  categoryPercent: {
    fontSize: 12,
    color: "#94A3B8",
  },
  categoryDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },
});
