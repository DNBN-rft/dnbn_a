import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./question-answer.styles";

export default function QuestionAnswer() {
  const insets = useSafeAreaInsets();

  // 더미 데이터
  const questionData = {
    status: "답변 완료",
    title: "배송",
    question: "안녕하세요\n\n제가 30주문해서 배송 받고 사이즈 미스로 32사이즈로 교환 신청을 했는데 30사이즈가 회수가 잘 되었는지 32사이즈로 배송 중인지 공금합니다!",
    date: "2024-05-22",
    answer: {
      manager: "비슬로우 담당자",
      content: "네 고객님 ~!\n\n교환 상품 크일 출고 되실거예요.\n\n오후부터 송장 번호도 공유 드리게습니다\n\n감사합니다 :)"
    }
  };

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
                <Text style={styles.statusText}>{questionData.status}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.qaContent}>
            <Text style={styles.qaTitle}>{questionData.title}</Text>
            
            <Text style={styles.qaText}>{questionData.question}</Text>
            
            <Text style={styles.qaDate}>{questionData.date}</Text>
          </View>
        </View>

        {/* 답변 섹션 */}
        {questionData.answer && (
          <View style={styles.qaSection}>
            <View style={styles.qaHeader}>
              <View style={[styles.qaIconContainer, styles.answerIconContainer]}>
                <Text style={styles.qaIconText}>A</Text>
              </View>
              
              <View style={styles.qaHeaderInfo}>
                <Text style={styles.managerName}>{questionData.answer.manager}</Text>
              </View>
            </View>
            
            <View style={styles.qaContent}>
              <Text style={styles.qaText}>{questionData.answer.content}</Text>
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
