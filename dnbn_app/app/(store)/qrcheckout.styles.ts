import { Dimensions, StyleSheet } from "react-native";

const SCAN_AREA_SIZE = Dimensions.get("window").width * 0.65;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    paddingVertical: 4,
    paddingRight: 16,
  },
  backButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  cameraContainer: {
    flex: 1,
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "column",
  },
  overlayTop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  overlayMiddle: {
    flexDirection: "row",
    height: SCAN_AREA_SIZE,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  scanArea: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    backgroundColor: "transparent",
  },
  corner: {
    position: "absolute",
    width: 24,
    height: 24,
    borderColor: "#EF7810",
    borderWidth: 3,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    paddingTop: 28,
  },
  guideText: {
    color: "#FFF",
    fontSize: 14,
    textAlign: "center",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 20,
  },
  messageText: {
    color: "#FFF",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: "#EF7810",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
  },
  // ---- 모달 ----
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
    position: "relative",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
  },
  modalCloseButton: {
    padding: 4,
    position: "absolute",
    right: 20,
  },
  modalCloseText: {
    fontSize: 20,
    color: "#666",
  },
  selectAllRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
    backgroundColor: "#FAFAFA",
  },
  selectAllText: {
    fontSize: 14,
    color: "#444",
    marginLeft: 12,
    fontWeight: "600",
  },
  productList: {
    paddingVertical: 8,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    gap: 12,
  },
  productImageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
    flexShrink: 0,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E8E8E8",
  },
  usageBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderBottomRightRadius: 6,
  },
  usageBadgeNew: {
    backgroundColor: "#EF7810",
  },
  usageBadgeUsed: {
    backgroundColor: "#999",
  },
  usageBadgeText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#CCC",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  checkboxChecked: {
    borderColor: "#EF7810",
    backgroundColor: "#EF7810",
  },
  checkmark: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 16,
  },
  productInfo: {
    flex: 1,
  },
  categoryNm: {
    fontSize: 11,
    color: "#EF7810",
    fontWeight: "600",
    marginBottom: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    lineHeight: 20,
    marginBottom: 4,
  },
  productDetail: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
    backgroundColor: "#FFF",
  },
  footerButtonRow: {
    flexDirection: "row",
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#CCC",
    backgroundColor: "#FFF",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#EF7810",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: "#CCC",
  },
  confirmButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
