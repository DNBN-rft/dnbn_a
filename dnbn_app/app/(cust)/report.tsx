import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./report.styles";

export default function ReportListScreen() {
    const insets = useSafeAreaInsets();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const reports = [
        // 신고 목록 데이터 예시
        { id: "1", type: "가맹점", title: "부적절한 내용 신고", status: "답변완료", date: "2024-06-10", answer: "신고하신 내용에 대해 검토 후 조치하였습니다." },
        { id: "2", type: "상품", title: "스팸 신고", status: "답변대기", date: "2024-06-12", answer: "" },
        { id: "3", type: "가맹점", title: "기타 신고", status: "답변대기", date: "2024-06-14", answer: "" },
    ];

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <View style={styles.container}>
            {insets.top > 0 && (
                <View style={{ height: insets.top, backgroundColor: "#fff" }} />
            )}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>
                    신고 목록
                </Text>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.reportContainer}>
                <FlatList
                    data={reports}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.cardContainer}
                            onPress={() => router.navigate(`/(cust)/reportDetail`)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.cardHeader}>
                                <View style={styles.typeTag}>
                                    <Text style={styles.typeText}>{item.type}</Text>
                                </View>
                                <View style={[
                                    styles.statusBadge,
                                    item.status === "답변완료" && styles.statusBadgeCompleted
                                ]}>
                                    <Text style={[
                                        styles.statusText,
                                        item.status === "답변완료" && styles.statusTextCompleted
                                    ]}>{item.status}</Text>
                                </View>
                            </View>
                            
                            <Text style={styles.reportTitle}>{item.title}</Text>
                            <Text style={styles.reportDate}>{item.date}</Text>
                            
                            {expandedId === item.id && (
                                <View style={styles.reportAnswerContainer}>
                                    <Text style={styles.reportAnswerLabel}>답변</Text>
                                    <Text style={styles.reportAnswer}>
                                        {item.answer || "아직 답변이 없습니다."}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    )}
                />
            </View>
            {insets.bottom > 0 && (
                <View style={{ height: insets.bottom, backgroundColor: '#000' }} />
            )}
        </View>

    );
}