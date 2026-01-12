import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from './question.styles'
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface Question {
    id: string;
    title: string;
    date: string;
    status: "답변대기" | "답변완료";
}

const questionList: Question[] = [
    { id: "1", title: "배송 기간이 얼마나 걸리나요?", date: "2024.06.15", status: "답변완료" },
    { id: "2", title: "환불 정책은 어떻게 되나요?", date: "2024.06.14", status: "답변완료" },
    { id: "3", title: "상품 A의 재고가 있나요?", date: "2024.06.13", status: "답변대기" },
    { id: "4", title: "결제 방법은 어떤 것들이 가능한가요?", date: "2024.06.12", status: "답변완료" },
    { id: "5", title: "회원 가입 후 혜택이 무엇인가요?", date: "2024.06.11", status: "답변대기" },
];

export default function NoticeDetailScreen() {
    const insets = useSafeAreaInsets();

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
                <Text style={styles.title} pointerEvents="none">
                    문의사항
                </Text>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.questionListContainer}>
                <FlatList
                    data={questionList}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.questionItemContainer}>
                            <View style={styles.questionItemDetailContainer}>
                                <Text style={styles.questionItemTitleText}>{item.title}</Text>
                                <Text style={styles.questionItemDateText}>{item.date}</Text>
                            </View>
                            <View style={styles.questionItemStatusContainer}>
                                <Text style={[
                                    styles.questionItemStatusText,
                                    item.status === "답변완료" && { color: "#EF7810" }
                                ]}>
                                    {item.status}
                                </Text>
                            </View>
                        </View>
                    )}
                    scrollEnabled={false}
                />
            </View>
            {insets.bottom > 0 && (
                <View style={{ height: insets.bottom, backgroundColor: '#000' }} />
            )}
        </View>
    );
}