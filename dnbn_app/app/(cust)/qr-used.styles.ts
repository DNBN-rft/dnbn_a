import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
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
    qrContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    qrImage: {
        width: 300,
        height: 300,
        resizeMode: "contain",
    },
    qrText: {
        fontSize: 20,
        fontWeight: "bold",
    }
});
