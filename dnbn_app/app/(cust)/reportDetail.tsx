import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./reportdetail.styles";

export default function ReportDetailScreen() {
    const insets = useSafeAreaInsets();

    const report = {
        id: "1",
        type: "가맹점",
        title: "부적절한 내용 신고",
        status: "답변완료",
        date: "2024-06-10",
        description: "해당 가맹점의 상품 설명이 부정확하고 고객을 기만하는 내용이 포함되어 있습니다.",
        answer: "신고하신 내용에 대해 검토 후 해당 가맹점에 조치를 취했습니다. 감사합니다.",
        images: [
            require('@/assets/images/icon.png'),
            require('@/assets/images/icon.png'),
            require('@/assets/images/icon.png')
        ]
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
                <Text style={styles.title}>신고상세</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                <View style={styles.contentWrapper}>
                    {/* 신고 정보 카드 */}
                    <View style={styles.infoCard}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.reportTitle}>{report.title}</Text>
                            <View style={[
                                styles.statusBadge,
                                report.status === "답변완료" && styles.statusBadgeCompleted
                            ]}>
                                <Text style={[
                                    styles.statusText,
                                    report.status === "답변완료" && styles.statusTextCompleted
                                ]}>
                                    {report.status}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.reportInfoContainer}>
                            <View style={styles.infoItem}>
                                <Text style={styles.reportInfoLabel}>신고유형</Text>
                                <Text style={styles.reportInfoValue}>{report.type}</Text>
                            </View>
                            <View style={styles.infoDivider} />
                            <View style={styles.infoItem}>
                                <Text style={styles.reportInfoLabel}>신고일시</Text>
                                <Text style={styles.reportInfoValue}>{report.date}</Text>
                            </View>
                        </View>
                    </View>

                    {/* 신고 내용 카드 */}
                    <View style={styles.contentCard}>
                        <Text style={styles.sectionTitle}>신고 내용</Text>
                        <Text style={styles.descriptionText}>{report.description}</Text>

                        {/* 첨부 이미지 */}
                        {report.images.length > 0 && (
                            <View style={styles.imageSection}>
                                <Text style={styles.imageSectionTitle}>첨부 이미지</Text>
                                <View style={styles.imageContainer}>
                                    {report.images.map((image, index) => (
                                        <View key={index} style={styles.imageWrapper}>
                                            <Image
                                                source={image}
                                                style={styles.image}
                                                resizeMode="cover"
                                            />
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>

                    {/* 처리 답변 카드 */}
                    <View style={styles.answerCard}>
                        <View style={styles.answerHeader}>
                            <Text style={styles.sectionTitle}>처리 결과</Text>
                            <Text style={styles.answerDate}>{report.date}</Text>
                        </View>
                        <Text style={styles.answerText}>{report.answer}</Text>
                    </View>
                </View>
            </ScrollView>

            {insets.bottom > 0 && (
                <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
            )}
        </View>
    );
}