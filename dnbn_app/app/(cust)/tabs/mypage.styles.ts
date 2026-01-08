import { Dimensions, StyleSheet } from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: "#ffffffff",
  },
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
  },
  placeholder: {
    width: 40,
  },
  mypageViewContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  mypageView: {
    marginTop: 20,
    marginBottom: 20,
  },
  infoContainer: {},
  menuContainer: {
    minHeight: SCREEN_HEIGHT - 200,
    justifyContent: "flex-start",
  },
  serviceContainer: {},
  developerContainer: {},
  logoutContainer: {},
  contentContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    margin: 10,
  },
  contentText: {
    fontSize: 20,
  },
  dnbnInfoContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  textBlock: {
    marginBottom: 15,
  },
  regularText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
    marginBottom: 3,
  },
  labelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 12,
    marginBottom: 5,
  },
  copyRight: {
    fontSize: 11,
    color: "#999",
    marginTop: 10,
  },
  line: {
    borderWidth: 1,
    borderColor: "#0000000e",
    marginTop: 50,
    marginBottom: 5,
  },
});
