import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  leftSection: {
    flex: 1,
    alignItems: "flex-start",
  },
  centerSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  rightSection: {
    flex: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  // 찜한 가맹점 개수 표시 영역
  countContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  countText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  // 리스트 컨테이너
  listContainer: {
    paddingVertical: 8,
  },
  // 가맹점 아이템 컨테이너
  storeItemContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    position: "relative", // 하트 버튼 절대 위치 지정을 위해
  },
  // 가게 컨텐츠 영역 (클릭 가능)
  storeContentContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 12,
  },
  // 가게 이미지
  storeImage: {
    width: 110,
    height: 110,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  // 가게 정보 영역
  storeInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  // 가게 이름과 주소 컨테이너
  nameAddressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },
  // 가게 이름
  storeName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    flexShrink: 0,
  },
  // 주소
  addressText: {
    fontSize: 12,
    color: "#999",
    flex: 1,
  },
  // 업종/업태
  businessTypeText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 18,
  },
  // 별점 컨테이너
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginLeft: 4,
  },
  reviewCountText: {
    fontSize: 13,
    color: "#888",
    marginLeft: 2,
  },
  // 상품 개수 컨테이너
  productCountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  productCountText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 4,
  },
  // 하트 버튼 (찜 토글)
  heartButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    boxShadow: "0 0 5px rgba(0,0,0,0.2)",
    zIndex: 10,
  },
  // 중앙 컨테이너 (로딩, 에러, 빈 리스트)
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: "#999",
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#FF6B6B",
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  // 이미지 플레이스홀더
  placeholderImage: {
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
});
