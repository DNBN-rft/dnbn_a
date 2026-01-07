import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  searchResultView: {
    flex: 1,
    backgroundColor: "white",
  },
  productResultContainer: {
    flex: 1,
  },
  productAndStoreTab: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: 50
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

  searchResult: {
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    flex: 1
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },
  products: {
    marginBottom: 10,
    flexDirection: "row",
  },
  productInfo: {
    marginLeft: 10,
  },
  productImage: {
    backgroundColor: "white",
    width: 90,
    height: 70,
    justifyContent:"center",
    alignItems: "center",
    borderRadius: 5,
    },
  priceInfo: {
    flexDirection: "row"
  },
  reviewInfo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  reviewStar: {
    width: 13,
    height: 13,
  },
  stores: {
    marginBottom: 10,
    flexDirection: "row",
  },
  storeInfo: {
    marginLeft: 10,
  },
  storeImage: {
    backgroundColor: "white",
    width: 90,
    height: 70,
    justifyContent:"center",
    alignItems: "center",
    borderRadius: 5,
  },
})
