import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./question.styles";

interface Question {
  id: string;
  title: string;
  date: string;
  status: "답변대기" | "답변완료";
}

const questionList: Question[] = [
  {
    id: "1",
    title: "배송 기간이 얼마나 걸리나요?",
    date: "2024.06.15 00:00",
    status: "답변완료",
  },
  {
    id: "2",
    title: "환불 정책은 어떻게 되나요?",
    date: "2024.06.14 00:00",
    status: "답변완료",
  },
  {
    id: "3",
    title: "상품 A의 재고가 있나요?",
    date: "2024.06.13 00:00",
    status: "답변대기",
  },
  {
    id: "4",
    title: "결제 방법은 어떤 것들이 가능한가요?",
    date: "2024.06.12 00:00",
    status: "답변완료",
  },
  {
    id: "5",
    title: "회원 가입 후 혜택이 무엇인가요?",
    date: "2024.06.11 00:00",
    status: "답변대기",
  },
];

export default function NoticeDetailScreen() {
  const insets = useSafeAreaInsets();

  // 답변대기를 위로, 답변완료를 아래로 정렬하고, 각 그룹 내에서 날짜 최신순으로 정렬
  const sortedQuestionList = [...questionList].sort((a, b) => {
    // 먼저 상태별로 정렬 (답변대기가 먼저)
    if (a.status !== b.status) {
      return a.status === "답변대기" ? -1 : 1;
    }
    // 같은 상태 내에서는 날짜 최신순 정렬
    return new Date(b.date).getTime() - new Date(a.date).getTime();
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
        <FlatList
          data={sortedQuestionList}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.questionItemContainer}
              activeOpacity={0.7}
            >
              <View style={styles.questionItemLeftSection}>
                <View style={[styles.questionIconContainer,
                  item.status === "답변대기" && styles.questionItemStatusPending
                ]}>
                  {item.status === "답변대기" ? (
                    <Ionicons name="chatbubble-ellipses-outline" size={24} color="#999999" />
                  ) : (
                    <Ionicons name="checkmark-circle-outline" size={24} color="#EF7810" />)}
                </View>
                
                <View style={styles.questionItemDetailContainer}>
                  <View style={styles.questionItemRightSection}>
                    <View
                      style={[
                        styles.questionItemStatusContainer,
                        item.status === "답변대기" && styles.questionItemStatusPending,
                      ]}
                    >
                      <Text
                        style={[
                          styles.questionItemStatusText,
                          item.status === "답변대기" && styles.questionItemStatusTextPending,
                        ]}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.questionItemTitleText} numberOfLines={2}>
                    {item.title}
                  </Text>
                  
                  <View style={styles.questionItemFooter}>
                    <Ionicons name="time-outline" size={14} color="#999" />
                    
                    <Text style={styles.questionItemDateText}>{item.date}</Text>
                  </View>
                </View>
                
                    <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
