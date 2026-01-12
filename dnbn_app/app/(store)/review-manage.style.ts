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
    pointerEvents: "none"
  },
  placeholder: {
    width: 40,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  reviewContainer: {
    gap: 8,
    marginVertical: 10,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#fff",
  },
  reviewInfoContainer: {
    flexDirection: "row",
  },
  reviewImageContainer: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  reviewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  reviewDetails: {
    flex: 1,
    justifyContent: "center",
    gap: 10
  },
  categoryText: {
    fontSize: 12,
    color: "#999",
  },
  productNameText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  dateText: {
    fontSize: 12,
    color: "#999",
  },
  userNameText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  reviewContentText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  hideInfoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#FFE5E5",
    backgroundColor: "#FFF5F5",
    borderRadius: 4,
    paddingVertical: 8,
  },
  hideInfoText: {
    fontSize: 13,
    color: "#999",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    height: 36,
    gap: 8
  },
  answerButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ef7810",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  answerButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ef7810",
  },
  answeredButton: {
    backgroundColor: "#ef7810",
  },
  answeredButtonText: {
    color: "#fff",
  },
  hideButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  hideButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
  },
  hiddenButton: {
    backgroundColor: "#999",
  },
  hiddenButtonText: {
    color: "#fff",
  },
});