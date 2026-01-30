import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiGet } from "../../utils/api";
import { styles } from "./question-answer.styles";

interface QuestionImage {
  originalName: string;
  fileUrl: string;
  order: number;
}

interface QuestionDetailResponse {
  questionTitle: string;
  questionRequestType: string;
  questionRegDateTime: string;
  questionContent: string;
  isAnswered: boolean;
  answerContent: string | null;
  answerRegNm: string | null;
  answerDateTime: string | null;
  questionModTime: string | null;
  answerModNm: string | null;
  answerModTime: string | null;
  imgs: {
    files: QuestionImage[];
  };
}

export default function QuestionAnswer() {
  const insets = useSafeAreaInsets();
  const { questionId } = useLocalSearchParams();
  const [questionData, setQuestionData] =
    useState<QuestionDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (questionId) {
      fetchQuestionDetail();
    }
  }, [questionId]);

  const fetchQuestionDetail = async () => {
    try {
      const response = await apiGet(`/cust/question/detail/${questionId}`);

      if (response.ok) {
        const data: QuestionDetailResponse = await response.json();
        setQuestionData(data);
      } else {
        console.error("문의 상세 조회 실패:", response.status);
      }
    } catch (error) {
      console.error("문의 상세 조회 에러:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateTimeString: string | null): string => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  if (loading || !questionData) {
    return (
      <View style={styles.container}>
        {insets.top > 0 && (
          <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
        )}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>문의상세</Text>
          <View style={styles.placeholder} />
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>로딩중...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
      )}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>문의상세</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 질문 섹션 */}
        <View style={styles.qaSection}>
          <View style={styles.qaHeader}>
            <View style={styles.qaIconContainer}>
              <Text style={styles.qaIconText}>Q</Text>
            </View>

            <View style={styles.qaHeaderInfo}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {questionData.isAnswered ? "답변완료" : "답변대기"}
                </Text>
              </View>
              
              <View>
                <TouchableOpacity>수정</TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.qaContent}>
            <Text style={styles.qaTitle}>
              {questionData.questionRequestType}
            </Text>

            <Text style={styles.qaText}>{questionData.questionContent}</Text>

            <Text style={styles.qaDate}>
              {formatDate(questionData.questionRegDateTime)}
            </Text>
          </View>

          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: "#E5E5E5",
              marginTop: 15,
            }}
          ></View>

          {questionData.imgs?.files && questionData.imgs.files.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.questionImageContainer}
            >
              {questionData.imgs.files
                .sort((a, b) => a.order - b.order)
                .map((img, index) => (
                  <Image
                    key={index}
                    source={{ uri: img.fileUrl }}
                    style={styles.questionImage}
                  />
                ))}
            </ScrollView>
          )}
        </View>

        {/* 답변 섹션 */}
        {questionData.isAnswered && questionData.answerContent && (
          <View style={styles.qaSection}>
            <View style={styles.qaHeader}>
              <View
                style={[styles.qaIconContainer, styles.answerIconContainer]}
              >
                <Text style={styles.qaIconText}>A</Text>
              </View>

              <View style={styles.qaHeaderInfo}>
                <Text style={styles.managerName}>
                  {questionData.answerRegNm || "담당자"}
                </Text>
              </View>
            </View>

            <View style={styles.qaContent}>
              <Text style={styles.qaText}>{questionData.answerContent}</Text>
              {questionData.answerDateTime && (
                <Text style={styles.qaDate}>
                  {formatDate(questionData.answerDateTime)}
                </Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#FFFFFF" }} />
      )}
    </View>
  );
}
