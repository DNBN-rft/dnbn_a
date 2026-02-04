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
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
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
  scrollContent: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  // 구매자 정보
  buyerInfoCard: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    width: 80,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    textAlign: "right",
  },
  // 상품 정보
  productCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  storeName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EF7810",
    marginBottom: 12,
  },
  productInfoRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
    marginRight: 12,
  },
  productTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  quantity: {
    fontSize: 12,
    color: "#999",
  },
  priceRow: {
    alignItems: "flex-end",
  },
  unitPrice: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  // 총 주문금액
  totalCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF8F0",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#FFE5CC",
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#EF7810",
  },
  // 결제 수단
  paymentOptionsContainer: {
    gap: 12,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  radioButton: {
    marginRight: 12,
  },
  radioButtonOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#EF7810",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#EF7810",
  },
  paymentOptionText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  selectedPaymentContainer: {
    gap: 12,
  },
  selectedPaymentHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFF8F0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EF7810",
  },
  selectedPaymentText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    fontWeight: "600",
    marginLeft: 12,
  },
  changeButtonContainer: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FAFAFA",
    alignItems: "center",
  },
  changeButtonText: {
    fontSize: 14,
    color: "#EF7810",
    fontWeight: "600",
  },
  paymentMethodScroll: {
    marginTop: 8,
  },
  paymentMethodCard: {
    width: 140,
    height: 100,
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  paymentMethodText: {
    fontSize: 13,
    color: "#666",
  },
  // 추천 상품
  recommendedProductsScroll: {
    marginTop: 12,
  },
  recommendedProductCard: {
    width: 120,
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 12,
    marginRight: 12,
  },
  recommendedProductImage: {
    width: 96,
    height: 96,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
    marginBottom: 8,
  },
  recommendedProductName: {
    fontSize: 13,
    color: "#333",
    marginBottom: 4,
    height: 34,
  },
  recommendedProductPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EF7810",
  },
  // 개인정보 제공 동의
  privacyConsentCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  privacyConsentText: {
    fontSize: 13,
    color: "#333",
    lineHeight: 20,
  },
  privacyConsentLink: {
    fontSize: 13,
    fontWeight: "600",
  },
  privacyConsentDetail: {
    fontSize: 13,
    color: "#666",
    textDecorationLine: "underline",
  },
  // 하단 결제 버튼 (스크롤 내)
  purchaseButtonContainer: {
    padding: 20,
    backgroundColor: "#fff",
    marginTop: 12,
  },
  agreementText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 12,
    textAlign: "center",
  },
  purchaseButton: {
    backgroundColor: "#EF7810",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  // 플로팅 버튼
  floatingButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  floatingAgreementText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 12,
    textAlign: "center",
  },
  floatingButton: {
    backgroundColor: "#EF7810",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  floatingButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
