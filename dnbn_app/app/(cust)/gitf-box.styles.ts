import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#fff',
    },
  backButton: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'flex-start',
  },
  title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      position: 'absolute',
      left: 0,
      right: 0,
      textAlign: 'center',
       pointerEvents: "none"
  },
  placeholder: {
      width: 40,
  },

  container: {
    flex: 1,
    backgroundColor: "white"
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
    alignItems: "center"
  },
  products: {
    flex: 1,
    marginBottom: 10,
  },
  productImage: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    borderRadius: 5,
    resizeMode: 'contain',
  },
  notUsedAndUsedText: {
    fontWeight: "bold"
  },
  date: {
    fontSize: 12,
    color: "#969696"
  },
})