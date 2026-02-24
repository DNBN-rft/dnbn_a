import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiGet, apiPost, apiPut, apiDelete } from "../../utils/api";
import { styles } from "./review-answer.style";

interface ReviewDetailData {
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

export default function ReviewAnswer() {
  const router = useRouter();
  const { reviewIdx } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [reviewData, setReviewData] = useState<ReviewDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isRegist, setIsRegist] = useState(false);
  const [answerText, setAnswerText] = useState("");

  useFocusEffect(
    useCallback(() => {
      if (reviewIdx) {
        fetchReviewDetail();
      }
    }, [reviewIdx])
  );

  const fetchReviewDetail = async () => {
    try {
      setLoading(true);
      const response = await apiGet(`/store/app/review/${reviewIdx}`);

      if (response.ok) {
        const review = await response.json();
        setReviewData(review);
        setIsRegist(review.reviewAnswered && review.reviewAnswerContent !== null);
        setAnswerText(review.reviewAnswerContent || "");
      } else {
        Alert.alert("오류", "리뷰 정보를 불러오는데 실패했습니다.");
        router.back();
      }
    } catch (error) {
      console.error("리뷰 조회 에러:", error);
      Alert.alert("오류", "리뷰 정보를 불러오는데 실패했습니다.");
      router.back();
    } finally {
      setLoading(false);
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

    return `${year}년${month}월${day}일 ${period} ${displayHours}시 ${minutes}분`;
  };

  const handleRegisterAnswer = async () => {
    if (!reviewData || !reviewIdx) {
      Alert.alert("오류", "리뷰 정보가 없습니다.");
      return;
    }

    if (answerText.trim() === "") {
      Alert.alert("알림", "답변 내용을 입력해주세요.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await apiPost(`/store/app/review/${reviewIdx}`, {
        answerContent: answerText,
        reviewAnswered: true,
      });

      if (response.ok) {
        const message = await response.text();
        Alert.alert("성공", message);
        setIsRegist(true);
      } else {
        Alert.alert("실패", "답변 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("답변 등록 실패:", error);
      Alert.alert("오류", "답변 등록 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAnswer = async () => {
    if (!reviewIdx) return;

    Alert.alert("확인", "답변을 삭제하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            setSubmitting(true);
            const response = await apiDelete(`/store/app/review/${reviewIdx}`);

            if (response.ok) {
              Alert.alert("성공", "답변이 삭제되었습니다.", [
                {
                  text: "확인",
                  onPress: () => router.back(),
                },
              ]);
            } else {
              Alert.alert("실패", "답변 삭제에 실패했습니다.");
            }
          } catch (error) {
            console.error("답변 삭제 실패:", error);
            Alert.alert("오류", "답변 삭제 중 오류가 발생했습니다.");
          } finally {
            setSubmitting(false);
          }
        },
      },
    ]);
  };

  if (loading || !reviewData) {
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
            <Text style={styles.title}>리뷰 답변</Text>
          </View>
          <View style={styles.rightSection} />
        </View>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#EF7810" />
        </View>
      </View>
    );
  }

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
          <Text style={styles.title}>리뷰 답변</Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            paddingBottom: Platform.OS === "ios" ? insets.bottom + 60 : 0,
          }}
        >
          <View style={styles.reviewAnswerContainer}>
            <View style={styles.reviewContainer}>
              {/* 상단: 상품명, 별점, 날짜 */}
              <View style={styles.reviewHeaderSection}>
                <Text style={styles.userNameText}>
                  {reviewData.custNm}
                </Text>
                <View style={styles.ratingDateContainer}>
                  <View style={styles.ratingContainer}>
                    {Array.from({ length: Math.floor(reviewData.reviewRate) }).map(
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
                    {formatDateTime(reviewData.reviewRegDateTime)}
                  </Text>
                </View>
              </View>

              {/* 리뷰 이미지들 */}
              <View style={styles.reviewImagesContainer}>
                {reviewData.reviewImgs?.files &&
                  reviewData.reviewImgs.files.map(
                    (imageFile: any, index: number) => (
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
                    )
                  )}
              </View>

              {/* 리뷰 내용 */}
              <View style={styles.reviewContentSection}>
                <Text style={styles.reviewContentText}>
                  {reviewData.reviewContent}
                </Text>
              </View>

              {/* 이전에 숨김 요청했다는 메시지 */}
              {reviewData.hiddenExpireAt && (
                <View
                  style={{
                    backgroundColor: "#FFF5ED",
                    borderLeftWidth: 4,
                    borderLeftColor: "#EF7810",
                    padding: 12,
                    marginBottom: 16,
                    borderRadius: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#EF7810",
                      fontWeight: "600",
                    }}
                  >
                    이 리뷰는 이전에 숨김 요청되었습니다.
                  </Text>
                </View>
              )}
            </View>

            {/* 답변 입력 영역 */}
            <View style={styles.answerContainer}>
              <View style={styles.answerContentContainer}>
                {isRegist ? (
                  // 등록된 답변 표시
                  <Text style={styles.answerContentText}>{answerText}</Text>
                ) : (
                  // 답변 작성 입력
                  <TextInput
                    style={styles.answerContentInput}
                    placeholder="답변을 작성해주세요"
                    placeholderTextColor={"#777"}
                    multiline
                    textAlignVertical="top"
                    value={answerText}
                    onChangeText={setAnswerText}
                  />
                )}
              </View>

              <View style={styles.buttonsContainer}>
                {isRegist ? (
                  // 수정 & 삭제 버튼 (등록된 상태)
                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                      style={styles.registerButton}
                      onPress={() => setIsRegist(false)}
                    >
                      <Text style={styles.registerButtonText}>수정</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={handleDeleteAnswer}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <ActivityIndicator color="#999" />
                      ) : (
                        <Text style={styles.buttonText}>삭제</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ) : (
                  // 등록 버튼만 (등록 전 상태)
                  <TouchableOpacity
                    style={[styles.registerButton, submitting && { opacity: 0.6 }]}
                    onPress={handleRegisterAnswer}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.registerButtonText}>등록</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
