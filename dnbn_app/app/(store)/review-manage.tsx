import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./review-manage.style";

type ModalState = "hide" | "hideClear" | "noOpen";

export default function ReviewManage() {
  const insets = useSafeAreaInsets();
  const [hideModal, setHideModal] = useState<ModalState>("noOpen");
  const [hideText, setHideText] = useState<"숨김" | "숨김 해제">("숨김");
  const [hideButtonText, setHideButtonText] = useState<"숨김" | "숨김 해제">(
    "숨김",
  );

  const handleApprove = (status: ModalState) => {
    if (status === "hide") {
      // TODO: 숨김 처리 API 호출
    } else if (status === "hideClear") {
      // TODO: 숨김 해제 API 호출
    }
  };

  const reviewList = [
    {
      id: "1",
      productImage: require("@/assets/images/image1.jpg"),
      category: "음료",
      productName: "아메리카노",
      rating: 5,
      date: "2026.01.10",
      reviewContent:
        "정말 맛있어요! 커피 향이 진하고 깔끔합니다. 매장 분위기도 좋고 다음에 또 방문하고 싶어요.",
      userName: "김진용",
      hiddenExpireAt: "2026-01-10",
      isHidden: false,
      hasAnswer: false,
    },
    {
      id: "2",
      productImage: require("@/assets/images/image1.jpg"),
      category: "디저트",
      productName: "초콜릿 케이크",
      rating: 4,
      date: "2026.01.09",
      reviewContent:
        "달콤하고 부드러운 케이크였습니다. 다만 가격이 조금 비싼 것 같아요.",
      userName: "박소윤",
      hiddenExpireAt: "2026-01-12",
      isHidden: false,
      hasAnswer: true,
    },
    {
      id: "3",
      productImage: require("@/assets/images/image1.jpg"),
      category: "음료",
      productName: "카페라떼",
      rating: 3.5,
      date: "2026.01.08",
      reviewContent: "보통이었어요. 특별히 나쁘지도 좋지도 않았습니다.",
      userName: "전형운",
      hiddenExpireAt: "2026-01-20",
      isHidden: true,
      hasAnswer: false,
    },
    {
      id: "4",
      productImage: require("@/assets/images/image1.jpg"),
      category: "베이커리",
      productName: "크루아상",
      rating: 5.0,
      date: "2026.01.07",
      reviewContent:
        "겉은 바삭하고 속은 촉촉한 완벽한 크루아상입니다. 아침 식사로 최고예요!",
      userName: "이민준",
      hiddenExpireAt: null,
      isHidden: false,
      hasAnswer: false,
    },
  ];

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
        data={reviewList}
        keyExtractor={(item) => item.id}
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

            if (diffMs <= 0) return "임시데이터";

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
              <View style={styles.reviewInfoContainer}>
                <View style={styles.reviewImageContainer}>
                  <Image
                    source={item.productImage}
                    style={styles.reviewImage}
                  />
                </View>

                <View style={styles.reviewDetails}>
                  <View>
                    <Text style={styles.categoryText}>{item.category}</Text>
                    <Text style={styles.productNameText}>
                      {item.productName}
                    </Text>
                  </View>

                  <View>
                    <View style={styles.reviewHeader}>
                      <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                      </View>
                      <Text style={styles.dateText}>{item.date}</Text>
                    </View>

                    <View>
                      <Text style={styles.userNameText}>{item.userName}</Text>
                      <Text
                        style={styles.reviewContentText}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {item.reviewContent}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

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
                    item.hasAnswer && styles.answeredButton,
                  ]}
                  onPress={() => {
                    router.navigate("/(store)/review-answer");
                  }}
                >
                  <Text
                    style={[
                      styles.answerButtonText,
                      item.hasAnswer && styles.answeredButtonText,
                    ]}
                  >
                    {item.hasAnswer ? "답변 완료" : "답변하기"}
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
                      const modalType = isCurrentlyHidden
                        ? "hideClear"
                        : "hide";
                      const text = isCurrentlyHidden ? "숨김 해제" : "숨김";
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
                      {isCurrentlyHidden ? "숨김 해제" : "숨김"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        }}
      />
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
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
