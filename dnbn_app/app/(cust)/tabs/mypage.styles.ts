import { Dimensions, StyleSheet } from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const styles = StyleSheet.create({
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
    justifyContent: 'flex-start',
  },
  serviceContainer: {},
  developerContainer: {},
  logoutContainer: {},
  contentContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    margin: 10
  },
  contentText: {
    fontSize: 20,
  },
  dnbnInfoContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  textBlock: {
    marginBottom: 15,
  },
  regularText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginBottom: 3,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 5,
  },
  copyRight: {
    fontSize: 11,
    color: '#999',
    marginTop: 10,
  },
  line: {
    borderWidth: 1,
    borderColor: "#0000000e",
    marginTop: 50,
    marginBottom: 5
  }

})