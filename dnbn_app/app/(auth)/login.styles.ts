import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
    resizeMode: "contain",
  },
  typeSelector: {
    flexDirection: "row",
    marginBottom: 30,
    gap: 10,
  },
  typeButton: {
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  typeButtonActive: {
    backgroundColor: "#EF7810",
    borderColor: "#EF7810",
  },
  typeButtonText: {
    fontSize: 16,
    color: "#666",
  },
  typeButtonTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  inputContainer: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  loginButton: {
    width: "100%",
    maxWidth: 400,
    height: 50,
    backgroundColor: "#EF7810",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    gap: 10,
  },
  linkText: {
    fontSize: 14,
    color: "#666",
  },
  separator: {
    width: 1,
    height: 12,
    backgroundColor: "#ddd",
  },
  snsContainer: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 20,
  },
  snsTitle: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "500",
  },
  snsButton: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  kakaoButton: {
    backgroundColor: "#FEE500",
  },
  naverButton: {
    backgroundColor: "#03C75A",
  },
  kakaoButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },
  naverButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});