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
  infoContainer: {
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    borderRadius: 10,
    margin: 20,
    width: "90%",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  giftImageContainer: {
    width: 180,
    height: 180,
    position: "relative",
  },
  giftImage: {
    width: 180,
    height: 180,
    resizeMode: "contain",
  },
  statusOverlayBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bgUsed: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  bgCanceled: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  statusStamp: {
    position: "absolute",
    top: 20,
    right: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 3,
    borderRadius: 6,
    transform: [{ rotate: "15deg" }],
  },
  stampUsed: {
    borderColor: "#ffb366",
  },
  stampCanceled: {
    borderColor: "#ff8888",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
  },
  textUsed: {
    color: "#ffb366",
  },
  textCanceled: {
    color: "#ff8888",
  },
  storeName: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.5)",
    marginTop: 8,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 2,
  },
  qrImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginTop: 50,
  },

  explanationContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    borderRadius: 10,
    paddingVertical: 15,
    backgroundColor: "#fff",
    marginHorizontal: 20,
  },
  explanationTab: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  explanationTabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  explanationTabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#FF6B6B",
    marginBottom: -1,
  },
  explanationTabText: {
    fontSize: 16,
    color: "#999",
  },
  explanationTabTextActive: {
    color: "#333",
    fontWeight: "600",
  },
  explanationContent: {
    marginTop: 15,
  },
  explanationText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  explanationTextToggle: {
    flex: 1,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  detailLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  detailDropdownContent: {
    paddingHorizontal: 4,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailDropdownText: {
    fontSize: 13,
    color: "#555",
    lineHeight: 20,
  },
  giftDetailInfo: {
    marginTop: 30,
    paddingTop: 20,
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingBottom: 20,
    marginBottom: 30,
    marginHorizontal: 20,
  },
  giftDetailTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  giftDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  giftDetailLabel: {
    fontSize: 14,
    color: "#333",
  },
  giftDetailValue: {
    fontSize: 14,
    color: "#666",
  },
  useButton: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#EF7810",
    paddingVertical: 15,
    borderRadius: 5,
  },
  useButtonText: {
    color: "#EF7810",
    fontSize: 16,
  },
  centeredContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#FF6B6B",
    marginBottom: 20,
  },
  noImagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  deletedProductText: {
    fontSize: 16,
    color: "#999",
    fontWeight: "bold",
  },
  dotIndicatorRow: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
});
