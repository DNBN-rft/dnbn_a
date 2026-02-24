import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiGet, apiPut } from "../../utils/api";
import { styles } from "./review-manage.style";

interface ReviewItem {
  reviewIdx: number;
  reviewContent: string;
  reviewRate: number;
  reviewRegDateTime: string;
  reviewAnswered: boolean;
  reviewAnswerContent: string | null;
  productNm: string;
  custNm: string;
  reviewImgs: any;
  isHidden: boolean;
  hiddenExpireAt: string | null;
}

type ModalState = "hide" | "hideClear" | "noOpen";

export default function ReviewManage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [hideModal, setHideModal] = useState<ModalState>("noOpen");
  const [hideText, setHideText] = useState<"숨김" | "숨김 해제" | "숨김 중">("숨김");
  const [hideButtonText, setHideButtonText] = useState<"숨김" | "숨김 해제" | "숨김 중">(
    "숨김",
  );
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReviewIdx, setSelectedReviewIdx] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchReviews();
    }, [])
  );

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await apiGet("/store/app/review");

      if (response.ok) {
        const data = await response.json();
        const reviewList = data.content || data;
        setReviews(Array.isArray(reviewList) ? reviewList : []);
      } else {
        console.error("리뷰 목록 조회 실패:", response.status);
      }
    } catch (error) {
      console.error("리뷰 조회 에러:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (status: ModalState) => {
    if (!selectedReviewIdx) return;

    try {
      if (status === "hide") {
        const response = await apiPut(`/store/app/review/hidden/${selectedReviewIdx}`);
        if (response.ok) {
          Alert.alert("성공", "리뷰가 숨김 처리되었습니다.");
          setSelectedReviewIdx(null);
          fetchReviews();
        } else {
          Alert.alert("실패", "리뷰 숨김 처리에 실패했습니다.");
        }
      } else if (status === "hideClear") {
        // 숨김 해제는 API 없음 (메시지만 표시)
        Alert.alert("안내", "자동으로 숨김이 해제됩니다.");
      }
    } catch (error) {
      console.error("처리 실패:", error);
      Alert.alert("오류", "처리 중 오류가 발생했습니다.");
    }
  };

  const formatDateTime = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const period = hours >= 12 ? "오후" : "오전";
    const displayHours = String(hours % 12 || 12).padStart(2, "0");

    return `${year}년 ${month}월 ${day}일 ${period} ${displayHours}시 ${minutes}분`;
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff" }} />
      )}

      <View style={styles.header}>
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.centerSection}>
          <Text style={styles.title}>리뷰 관리</Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.reviewIdx.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? insets.bottom + 60 : 0,
        }}
        ListEmptyComponent={
          loading ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 40 }}>
              <ActivityIndicator size="large" color="#EF7810" />
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 40 }}>
              <Text>리뷰가 없습니다.</Text>
            </View>
          )
        }
        renderItem={({ item }) => {
          // 리뷰 상태 분류
          const isCurrentlyHidden =
            item.isHidden && item.hiddenExpireAt !== null;
          const canBeHidden = !item.isHidden && item.hiddenExpireAt === null;
          const wasAlreadyHidden =
            !item.isHidden && item.hiddenExpireAt !== null;

          // 남은 시간 계산 (숨김 중인 리뷰만)
          const getTimeRemaining = () => {
            if (!item.hiddenExpireAt) return "";

            const now = new Date();
            const expireDate = new Date(item.hiddenExpireAt);

            if (isNaN(expireDate.getTime())) return "";

            const diffMs = expireDate.getTime() - now.getTime();

            if (diffMs <= 0) return "";

            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const diffHours = Math.floor(
              (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
            );
            const diffMinutes = Math.floor(
              (diffMs % (1000 * 60 * 60)) / (1000 * 60),
            );

            if (diffDays > 0) {
              return `${diffDays}일 ${diffHours}시간 뒤 숨김 해제`;
            } else if (diffHours > 0) {
              return `${diffHours}시간 ${diffMinutes}분 뒤 숨김 해제`;
            } else {
              return `${diffMinutes}분 뒤 숨김 해제`;
            }
          };

          return (
            <View style={styles.reviewContainer}>
              {/* 상단: 상품명, 별점, 날짜 */}
              <View style={styles.reviewHeaderSection}>
                <Text style={styles.userNameText}>
                  {item.custNm}
                </Text>
                <View style={styles.ratingDateContainer}>
                  <View style={styles.ratingContainer}>
                    {Array.from({ length: Math.floor(item.reviewRate) }).map(
                      (_, index) => (
                        <Ionicons
                          key={index}
                          name="star"
                          size={14}
                          color="#FFD700"
                        />
                      )
                    )}
                  </View>
                  <Text style={styles.dateText}>
                    {formatDateTime(item.reviewRegDateTime)}
                  </Text>
                </View>
              </View>

              {/* 리뷰 이미지들 - 가로 3개 배열 */}
              {item.reviewImgs?.files && item.reviewImgs.files.length > 0 && (
                <View style={styles.reviewImagesSection}>
                  {item.reviewImgs.files
                    .sort((a: any, b: any) => a.order - b.order)
                    .map((imageFile: any, index: number) => (
                      <Image
                        key={index}
                        source={{ uri: imageFile.fileUrl }}
                        style={styles.reviewImageItem}
                        priority="high"
                        cachePolicy="memory-disk"
                        contentFit="cover"
                        transition={200}
                        placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
                      />
                    ))}
                </View>
              )}

              {/* 리뷰 내용 */}
              <View style={styles.reviewContentSection}>
                <Text style={styles.reviewContentText}>
                  {item.reviewContent}
                </Text>
              </View>

              {/* 사장님 답변 */}
              {item.reviewAnswered && item.reviewAnswerContent && (
                <View style={styles.answerSection}>
                  <View style={styles.answerHeader}>
                    <Text style={styles.answerTitle}>사장님</Text>
                  </View>
                  <Text style={styles.answerContentText}>
                    {item.reviewAnswerContent}
                  </Text>
                </View>
              )}

              {/* 이미 숨김 처리했던 리뷰 안내 */}
              {wasAlreadyHidden && (
                <View style={styles.hideInfosContainer}>
                  <View style={styles.hideInfoHeader}>
                    <Ionicons
                      name="information-circle-outline"
                      size={14}
                      color="#999"
                    />
                    <Text style={styles.hideInfoText}>
                      이전에 숨김 요청했던 리뷰입니다.
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.hideInfoText}>
                      리뷰 숨김은 동일한 리뷰에 대해서 1회만 가능합니다.
                    </Text>
                  </View>
                </View>
              )}

              {/* 숨김 중인 리뷰 안내 */}
              {isCurrentlyHidden && (
                <View style={styles.hideClearInfoContainer}>
                  <Ionicons
                    name="information-circle-outline"
                    size={14}
                    color="#999"
                  />
                  <Text style={styles.hideClearInfoText}>
                    {getTimeRemaining()}
                  </Text>
                </View>
              )}

              {/* 액션 버튼 */}
              <View style={styles.actionButtonsContainer}>
                {/* 답변 버튼 */}
                <TouchableOpacity
                  style={[
                    styles.answerButtonContainer,
                    item.reviewAnswered && styles.answeredButton,
                  ]}
                  onPress={() => {
                    router.push({
                      pathname: "/(store)/review-answer",
                      params: { reviewIdx: item.reviewIdx },
                    });
                  }}
                >
                  <Text
                    style={[
                      styles.answerButtonText,
                      item.reviewAnswered && styles.answeredButtonText,
                    ]}
                  >
                    {item.reviewAnswered ? "상세" : "답변하기"}
                  </Text>
                </TouchableOpacity>

                {/* 숨김/숨김해제 버튼 (이미 숨김 처리했던 리뷰는 표시 안 함) */}
                {!wasAlreadyHidden && (
                  <TouchableOpacity
                    style={[
                      styles.hideButtonContainer,
                      isCurrentlyHidden && styles.hiddenButton,
                    ]}
                    onPress={() => {
                      setSelectedReviewIdx(item.reviewIdx);
                      const modalType = isCurrentlyHidden
                        ? "hideClear"
                        : "hide";
                      const text = isCurrentlyHidden ? "숨김 중" : "숨김";
                      setHideModal(modalType);
                      setHideText(text);
                      setHideButtonText(text);
                    }}
                  >
                    <Text
                      style={[
                        styles.hideButtonText,
                        isCurrentlyHidden && styles.hiddenButtonText,
                      ]}
                    >
                      {isCurrentlyHidden ? "숨김 중" : "숨김"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        }}
      />
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#fff" }} />
      )}

      {/* 숨김/숨김해제 확인 모달 */}
      <Modal
        visible={hideModal !== "noOpen"}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setHideModal("noOpen")}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalTitle}>알림</Text>

            <Text style={styles.deleteModalMessage}>
              {`정말로 이 리뷰를 ${hideText} 하시겠습니까?`}
            </Text>

            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={[styles.deleteModalButton, styles.confirmButton]}
                onPress={() => {
                  const currentModal = hideModal;
                  setHideModal("noOpen");
                  handleApprove(currentModal);
                }}
              >
                <Text style={styles.confirmButtonText}>{hideButtonText}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.deleteModalButton, styles.cancelButton]}
                onPress={() => setHideModal("noOpen")}
              >
                <Text style={styles.modalCancelButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
