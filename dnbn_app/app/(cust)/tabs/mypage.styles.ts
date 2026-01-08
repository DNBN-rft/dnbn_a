import { Dimensions, StyleSheet } from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: "#ffffffff",
  },
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
  },
  placeholder: {
      width: 40,
  },
  storeButton: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  storeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF9500",
  },
  mypageViewContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  mypageView: {
    flex: 1,
  },
  dnbnInfoContainer: {
    marginTop: 40,
    paddingTop: 24,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  textBlock: {
    marginBottom: 16,
  },
  regularText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
    marginBottom: 4,
  },
  labelText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  copyRight: {
    fontSize: 11,
    color: "#999",
    marginTop: 12,
  },
  contentView: {
    paddingHorizontal: 20,
    paddingTop: 8,
    minHeight: SCREEN_HEIGHT - 120,
  },
  section: {
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
});
