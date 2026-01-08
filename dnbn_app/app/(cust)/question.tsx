import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from './question.styles'
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

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
                <View style={styles.questionItemContainer}>
                    <View style={styles.questionItemDetailContainer}>
                        <Text style={styles.questionItemTitleText}>문의사항 제목이 들어갑니다</Text>
                        <Text style={styles.questionItemDateText}>2024.06.01</Text>
                    </View>
                    <View style={styles.questionItemStatusContainer}>
                        <Text style={styles.questionItemStatusText}>답변대기</Text>
                    </View>

                </View>

                <View style={styles.questionItemContainer}>
                    <View style={styles.questionItemDetailContainer}>
                        <Text style={styles.questionItemTitleText}>문의사항 제목이 들어갑니다</Text>
                        <Text style={styles.questionItemDateText}>2024.06.01</Text>
                    </View>
                    <View style={styles.questionItemStatusContainer}>
                        <Text style={styles.questionItemStatusText}>답변대기</Text>
                    </View>

                </View>

                <View style={styles.questionItemContainer}>
                    <View style={styles.questionItemDetailContainer}>
                        <Text style={styles.questionItemTitleText}>문의사항 제목이 들어갑니다</Text>
                        <Text style={styles.questionItemDateText}>2024.06.01</Text>
                    </View>
                    <View style={styles.questionItemStatusContainer}>
                        <Text style={styles.questionItemStatusText}>답변완료</Text>
                    </View>

                </View>

                <View style={styles.questionItemContainer}>
                    <View style={styles.questionItemDetailContainer}>
                        <Text style={styles.questionItemTitleText}>문의사항 제목이 들어갑니다</Text>
                        <Text style={styles.questionItemDateText}>2024.06.01</Text>
                    </View>
                    <View style={styles.questionItemStatusContainer}>
                        <Text style={styles.questionItemStatusText}>답변완료</Text>
                    </View>

                </View>
            </View>
            {insets.bottom > 0 && (
                <View style={{ height: insets.bottom, backgroundColor: '#000' }} />
            )}
        </View>
    );
}