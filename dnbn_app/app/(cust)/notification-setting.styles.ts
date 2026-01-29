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
    pointerEvents: "none",
  },
  placeholder: {
    width: 40,
  },


  line: {
    borderWidth: 1,
    borderColor: "#0000000e",
  },


  container: {
    flex: 1,
    backgroundColor: "white",
  },
  notificationContainer: {
    flex: 1,
    margin: 20,
  },
  notificationContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#efefefff",
    paddingTop: 12,
    paddingBottom: 12
  },





  // 토글 스타일

  toggle: {
    width: 50,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#d1d1d1',
    justifyContent: 'center',
    padding: 2,
  },
  toggleOn: {
    backgroundColor: '#FF6F2B',
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ffffff',
  },
  submitButton: {
    borderWidth: 1,
    borderColor: '#EF7810',
    backgroundColor: '#fff',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#EF7810',
    fontSize: 16,
    fontWeight: 'bold',
  },
})