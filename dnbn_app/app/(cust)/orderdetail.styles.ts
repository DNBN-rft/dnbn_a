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
  contentContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  orderDetailContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  orderInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 16,
    marginBottom: 12,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
  },
  orderInfoLeft: {
    flex: 1,
  },
  orderDateText: {
    fontSize: 16,
    color: "#000",
    marginBottom: 6,
    fontWeight: "600",
  },
  orderNumberText: {
    fontSize: 14,
    color: "#999",
  },
  receiptButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  receiptButtonText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 16,
    marginBottom: 12,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
  },
  storeSection: {
    marginBottom: 16,
  },
  storeNameText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  storeDivider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 20,
  },
  productSection: {
    marginBottom: 16,
  },
  productStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  orderStatusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EF7810",
  },
  timestampText: {
    fontSize: 12,
    color: "#666",
  },
  productRow: {
    flexDirection: "row",
    gap: 12,
  },
  productImageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 6,
  },
  productInfoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  productNameText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    marginBottom: 4,
  },
  productQuantityText: {
    fontSize: 14,
    color: "#999",
    marginBottom: 4,
  },
  productPriceText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },
  paymentSummary: {},
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },
  paymentValue: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },
  paymentLabelSub: {
    fontSize: 15,
    color: "#666",
    paddingLeft: 12,
  },
  paymentValueSub: {
    fontSize: 15,
    color: "#666",
  },
  discountValue: {
    fontSize: 15,
    color: "#EF7810",
  },
  paymentMethodLabel: {
    fontSize: 15,
    color: "#000",
    fontWeight: "600",
  },
  finalPriceText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  paymentInfoText: {
    fontSize: 13,
    color: "#999",
    marginTop: 4,
  },
});
