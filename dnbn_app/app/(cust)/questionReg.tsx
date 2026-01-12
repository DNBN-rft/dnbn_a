import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from './questionreg.styles'
import { Modal, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

export default function NoticeDetailScreen() {
    const insets = useSafeAreaInsets();
    const [questionTypeModalVisible, setQuestionTypeModalVisible] = useState(false);

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
                    문의하기
                </Text>
                <View style={styles.placeholder} />
            </View>
            <View style={styles.questionItemContainer}>
                <Text style={styles.questionItemTitleText}>문의유형 *</Text>
                <Pressable style={styles.questionTypeSelector} onPress={() => setQuestionTypeModalVisible(true)}>
                    <Text style={styles.questionTypeSelectorText}>문의유형 선택</Text>
                    <Ionicons name="chevron-down" size={20} color="#666" />
                </Pressable>
            </View>

            <View style={styles.questionItemContainer}>
                <Text style={styles.questionItemTitleText}>제목 *</Text>
                <TextInput style={styles.questionTitleInput} placeholder="제목을 입력해주세요." />
            </View>

            <View style={styles.questionItemContainer}>
                <Text style={styles.questionItemContentText}>내용 *</Text>
                <TextInput style={styles.questionContentInput} placeholder="내용을 입력해주세요." />
            </View>

            <View style={styles.questionItemContainer}>
                <Text style={styles.questionItemTitleText}>첨부파일</Text>
                <Pressable style={styles.fileUploadButton}>
                    <Text style={styles.fileUploadButtonText}>파일 선택</Text>
                </Pressable>
            </View>

            <View style={styles.submitButtonContainer}>
                <Pressable style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>문의하기</Text>
                </Pressable>
                <Pressable style={styles.cancelButton}
                    onPress={() => router.back()}>
                    <Text style={styles.cancelButtonText}>취소하기</Text>
                </Pressable>
            </View>
            <Modal
                visible={questionTypeModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setQuestionTypeModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>문의유형 선택</Text>
                        <Pressable
                            style={styles.modalOption}
                            onPress={() => {
                                // 문의유형 선택 로직 추가
                                setQuestionTypeModalVisible(false);
                            }}
                        >
                            <Text style={styles.modalOptionText}>배송문의</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            {insets.bottom > 0 && (
                <View style={{ height: insets.bottom, backgroundColor: '#000' }} />
            )}
        </View>
    );
}