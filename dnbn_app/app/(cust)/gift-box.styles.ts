import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
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

  container: {
    flex: 1,
    backgroundColor: "white",
  },
  giftBoxContainer: {
    flex: 1,
  },
  notUsedAndUsedTab: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: 50,
  },
  activeTab: {
    justifyContent: "center",
    alignItems: "center",
    width: 195,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "orange",
  },
  inActiveTab: {
    justifyContent: "center",
    alignItems: "center",
    width: 195,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },
  tabText: {
    color: "black",
  },
  giftContainer: {
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    flex: 1,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 30,
  },
  countText: {
    justifyContent: "center",
    alignItems: "center",
  },
  products: {
    width: '45%',
    marginBottom: 10,
  },
  productImageContainer: {
    height: 160,
    marginBottom: 3,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  productImage: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  statusOverlayBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bgUsed: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  bgCanceled: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  statusStamp: {
    position: 'absolute',
    top: 20,
    right: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 3,
    borderRadius: 6,
    transform: [{ rotate: '15deg' }],
  },
  stampUsed: {
    borderColor: '#ffb366',
  },
  stampCanceled: {
    borderColor: '#ff8888',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
  textUsed: {
    color: '#ffb366',
  },
  textCanceled: {
    color: '#ff8888',
  },
  productInfoContainer: {
    gap: 2,
  },
  storeNameText: {
    fontSize: 12,
    color: "#FF9D5C",
  },
  productNameText: {
    fontSize: 15,
    color: "#000",
  },
  fromText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "600",
  },
  datetimeText: {
    fontSize: 12,
    color: "#999",
  },
  notUsedAndUsedText: {
    fontWeight: "bold",
  },
  date: {
    fontSize: 12,
    color: "#969696",
  },
});
