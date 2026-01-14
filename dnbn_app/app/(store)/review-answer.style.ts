import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // 컨테이너
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  
  // 헤더
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
    width: 44,
  },
  
  // 메인 컨테이너
  reviewAnswerContainer: {
    flex: 1,
    padding: 15,
    gap: 15,
  },
  
  // 리뷰 카드
  reviewContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    gap: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  reviewInfoContainer: {
    flexDirection: "row",
    gap: 12,
  },
  reviewDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  reviewImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f8f8f8",
  },
  reviewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  categoryText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  productNameText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
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
    color: "#555",
    marginBottom: 4,
  },
  reviewContentText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  
  // 리뷰 이미지 갤러리
  reviewImagesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    paddingTop: 12,
    paddingBottom: 5,
  },
  reviewImageItem: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
  },

  // 답변 영역
  answerContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  answerContentContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 15,
    minHeight: 150,
    backgroundColor: "#fafafa",
  },
  answerContentText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
  },
  answerContentInput: {
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
    minHeight: 120,
  },

  // 버튼 영역
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  registerButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "#ef7810",
    borderWidth: 1,
    borderRadius: 8,
    minWidth: 80,
    elevation: 3,
  },
  registerButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ef7810",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 8,
    minWidth: 80,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#666",
  },

});