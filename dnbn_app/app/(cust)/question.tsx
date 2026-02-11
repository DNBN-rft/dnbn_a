import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiGet } from "../../utils/api";
import { styles } from "./question.styles";

interface Question {
  id: string;
  title: string;
  date: string;
  dateRaw: string; // 정렬용 원본 ISO 날짜
  status: "답변대기" | "답변완료";
}

interface QuestionResponse {
  questionId: number;
  questionTitle: string;
  questionRegDateTime: string;
  isAnswered: boolean;
}

export default function NoticeDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [questionList, setQuestionList] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await apiGet(`/cust/question`);

      if (response.ok) {
        const data: QuestionResponse[] = await response.json();

        // 백엔드 데이터를 UI 형식으로 변환
        const formattedQuestions: Question[] = data.map((item) => ({
          id: item.questionId.toString(),
          title: item.questionTitle,
          date: formatDate(item.questionRegDateTime),
          dateRaw: item.questionRegDateTime, // 원본 ISO 날짜 저장
          status: item.isAnswered ? "답변완료" : "답변대기",
        }));

        setQuestionList(formattedQuestions);
      } else {
        console.error("문의사항 조회 실패:", response.status);
        setError(true);
      }
    } catch (error) {
      console.error("문의사항 조회 에러:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  // 날짜 최신순으로 정렬 (가장 최신이 위로)
  const sortedQuestionList = [...questionList].sort((a, b) => {
    return new Date(b.dateRaw).getTime() - new Date(a.dateRaw).getTime();
  });

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
        <Text style={styles.title}>문의사항</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.questionListContainer}>
        {loading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>로딩 중...</Text>
          </View>
        ) : error ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="alert-circle-outline" size={60} color="#999" />
            <Text style={styles.emptyText}>서버 오류가 발생했습니다</Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={fetchQuestions}
            >
              <Ionicons name="refresh" size={20} color="#EF7810" />
              <Text style={styles.refreshButtonText}>다시 시도</Text>
            </TouchableOpacity>
          </View>
        ) : sortedQuestionList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={60}
              color="#999"
            />
            <Text style={styles.emptyText}>문의내역이 존재하지 않습니다</Text>
          </View>
        ) : (
          <FlatList
            data={sortedQuestionList}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.questionItemContainer}
                activeOpacity={0.7}
                onPress={() =>
                  router.navigate({
                    pathname: "/(cust)/question-answer",
                    params: { questionId: item.id },
                  })
                }
              >
                <View style={styles.questionItemLeftSection}>
                  <View
                    style={[
                      styles.questionIconContainer,
                      item.status === "답변대기" &&
                        styles.questionItemStatusPending,
                    ]}
                  >
                    {item.status === "답변대기" ? (
                      <Ionicons
                        name="chatbubble-ellipses-outline"
                        size={24}
                        color="#999999"
                      />
                    ) : (
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={24}
                        color="#EF7810"
                      />
                    )}
                  </View>

                  <View style={styles.questionItemDetailContainer}>
                    <View style={styles.questionItemRightSection}>
                      <View
                        style={[
                          styles.questionItemStatusContainer,
                          item.status === "답변대기" &&
                            styles.questionItemStatusPending,
                        ]}
                      >
                        <Text
                          style={[
                            styles.questionItemStatusText,
                            item.status === "답변대기" &&
                              styles.questionItemStatusTextPending,
                          ]}
                        >
                          {item.status}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={styles.questionItemTitleText}
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>

                    <View style={styles.questionItemFooter}>
                      <Ionicons name="time-outline" size={14} color="#999" />

                      <Text style={styles.questionItemDateText}>
                        {item.date}
                      </Text>
                    </View>
                  </View>

                  <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
