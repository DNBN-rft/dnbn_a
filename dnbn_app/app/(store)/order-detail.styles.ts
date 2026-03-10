import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
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
  rightSection: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#9CA3AF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  // 섹션
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 10,
  },
  selectedCount: {
    fontSize: 13,
    fontWeight: "600",
    color: "#EF7810",
  },
  // 행
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    width: 72,
    fontSize: 13,
    color: "#6B7280",
  },
  value: {
    flex: 1,
    fontSize: 13,
    color: "#374151",
  },
  // 총 결제금액 행
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    marginBottom: 0,
  },
  totalLabel: {
    width: 72,
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
  },
  totalPrice: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#EF7810",
  },
  // 상품 카드
  productCard: {
    paddingVertical: 12,
  },
  productCardBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    marginBottom: 4,
  },
  productCardSelected: {
    backgroundColor: "#FFF7F0",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginHorizontal: -8,
  },
  productHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 8,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  checkboxSelected: {
    backgroundColor: "#EF7810",
    borderColor: "#EF7810",
  },
  checkboxDisabled: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  productNm: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  productLabel: {
    width: 72,
    fontSize: 13,
    color: "#6B7280",
  },
  productValue: {
    flex: 1,
    fontSize: 13,
    color: "#374151",
  },
  productPrice: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
  },
  // 사유
  reasonContainer: {
    marginTop: 6,
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    padding: 10,
    flexDirection: "row",
    gap: 6,
  },
  reasonLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#EF4444",
    minWidth: 24,
  },
  reasonText: {
    flex: 1,
    fontSize: 12,
    color: "#7F1D1D",
    lineHeight: 18,
  },
  // 하단 버튼 바
  bottomBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    marginBottom: 10,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  useButton: {
    backgroundColor: "#EF7810",
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#EF4444",
  },
  useButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#EF4444",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
