import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./withdraw.styles";

const WITHDRAW_REASONS = [
    { id: '1', label: '서비스 만족도 낮음' },
    { id: '2', label: '이용할 이유가 없음' },
    { id: '3', label: '더 나은 서비스 찾음' },
    { id: '4', label: '개인정보 보안 우려' },
    { id: '5', label: '기타' },
];

export default function WithdrawScreen() {
    const insets = useSafeAreaInsets();
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [reasonDetail, setReasonDetail] = useState('');

    const handleSubmitReason = () => {
        if (!selectedReason) {
            Alert.alert('필수 입력', '탈퇴 이유를 선택해주세요.');
            return;
        }
        if (selectedReason === '5' && !reasonDetail.trim()) {
            Alert.alert('필수 입력', '상세 이유를 입력해주세요.');
            return;
        }

        // 최종 확인 Alert
        Alert.alert(
            '회원 탈퇴',
            '정말 탈퇴하시겠어요?\n탈퇴 후 계정은 복구할 수 없습니다.',
            [
                {
                    text: '취소',
                    onPress: () => { },
                    style: 'cancel',
                },
                {
                    text: '탈퇴',
                    onPress: () => {
                        // TODO: API를 통해 탈퇴 처리
                        const reason = WITHDRAW_REASONS.find(r => r.id === selectedReason)?.label;
                        console.log('탈퇴 처리:', {
                            reason,
                            reasonDetail: selectedReason === '5' ? reasonDetail : '',
                        });

                        Alert.alert('안내', '탈퇴가 완료되었습니다.', [
                            {
                                text: '확인',
                                onPress: () => router.replace('/(auth)/login'),
                            },
                        ]);
                    },
                    style: 'destructive',
                },
            ]
        );
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
                    회원 탈퇴
                </Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* 탈퇴 이유 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>탈퇴 이유</Text>
                    <Text style={styles.description}>
                        서비스를 이용하지 않는 이유가 무엇인가요? 더 나은 서비스를 제공하기 위해 의견을 듣고 싶습니다.
                    </Text>
                    <View style={styles.reasonContainer}>
                        {WITHDRAW_REASONS.map((reason) => (
                            <TouchableOpacity
                                key={reason.id}
                                style={styles.reasonOption}
                                onPress={() => setSelectedReason(reason.id)}
                            >
                                <View style={[
                                    styles.radioButton,
                                    selectedReason === reason.id && styles.radioButtonSelected
                                ]}>
                                    {selectedReason === reason.id && (
                                        <View style={styles.radioButtonInner} />
                                    )}
                                </View>
                                <Text style={[
                                    styles.reasonLabel,
                                    selectedReason === reason.id && styles.reasonLabelSelected
                                ]}>
                                    {reason.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* 기타 선택시 상세 이유 입력 */}
                    {selectedReason === '5' && (
                        <View style={styles.detailSection}>
                            <Text style={styles.detailLabel}>상세 이유</Text>
                            <TextInput
                                style={styles.detailInput}
                                placeholder="탈퇴 이유를 입력해주세요"
                                placeholderTextColor="#ccc"
                                value={reasonDetail}
                                onChangeText={setReasonDetail}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>
                    )}
                </View>

                {/* 주의사항 */}
                <View style={styles.warningSection}>
                    <Text style={styles.warningTitle}>⚠️ 주의사항</Text>
                    <Text style={styles.warningText}>• 탈퇴 후 계정은 복구할 수 없습니다.</Text>
                    <Text style={styles.warningText}>• 보유하신 포인트는 소멸됩니다.</Text>
                    <Text style={styles.warningText}>• 개인정보는 관련 법령에 따라 일정기간 보관 후 삭제됩니다.</Text>
                </View>
            </ScrollView>

            {/* 하단 버튼 */}
            <View style={styles.bottomButtonContainer}>
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmitReason}
                >
                    <Text style={styles.submitButtonText}>제출</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.cancelButtonText}>취소</Text>
                </TouchableOpacity>
            </View>

            {insets.bottom > 0 && (
                <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
            )}
        </View>

    );
}