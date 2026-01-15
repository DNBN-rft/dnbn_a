import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './my-info.styles';

export default function MyInfoScreen() {
    const [gender, setGender] = useState('male');
    const [pwModalVisible, setPwModalVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
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
                <Text style={styles.title}>
                    내 정보
                </Text>
                <View style={styles.placeholder} />
            </View>


            <ScrollView>
                <View style={styles.myInfoContainer}>
                    {/* 아이디 */}
                    <View style={styles.myInfoItemContainer}>
                        <Text style={styles.myInfoItemText}>아이디</Text>
                        <View style={styles.myInfoInputContainer}>
                            <TextInput style={styles.myInfoTextInput} placeholder='abc123'></TextInput>
                            <Pressable style={styles.myInfoPwChangeButton} onPress={() => setPwModalVisible(true)}>
                                <Text style={styles.myInfoPwChangeButtonText}>비밀번호 변경</Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* 이름(닉네임) */}
                    <View style={styles.myInfoItemContainer}>
                        <Text style={styles.myInfoItemText}>이름 (닉네임)</Text>
                        <TextInput style={styles.myInfoTextInput} placeholder='홍길동'></TextInput>
                    </View>

                    {/* 휴대전화 */}
                    <View style={styles.myInfoItemContainer}>
                        <Text style={styles.myInfoItemText}>휴대전화</Text>
                        <View style={styles.myInfoInputContainer}>
                            <TextInput style={styles.myInfoTextInput} placeholder='휴대전화 번호 입력'></TextInput>
                            <Pressable style={styles.myInfoVerifyButton}>
                                <Text style={styles.myInfoVerifyButtonText}>본인 인증</Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* 성별 */}
                    <View style={styles.myInfoItemContainer}>
                        <Text style={styles.myInfoItemText}>성별</Text>
                        <View style={styles.myInfoRadioContainer}>
                            <Pressable style={styles.myInfoRadioButton} onPress={() => setGender('male')}>
                                <View style={[styles.myInfoRadioButtonCircle, gender === 'male' && styles.myInfoRadioButtonCircleActive]} />
                                <Text style={styles.myInfoRadioButtonText}>남성</Text>
                            </Pressable>
                            <Pressable style={styles.myInfoRadioButton} onPress={() => setGender('female')}>
                                <View style={[styles.myInfoRadioButtonCircle, gender === 'female' && styles.myInfoRadioButtonCircleActive]} />
                                <Text style={styles.myInfoRadioButtonText}>여성</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* 정보 수정하기 버튼 */}
            <Pressable style={styles.myInfoSaveButton}>
                <Text style={styles.myInfoSaveButtonText}>정보 수정하기</Text>
            </Pressable>

            {/* 비밀번호 변경 모달 */}
            <Modal
                visible={pwModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setPwModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>비밀번호 변경</Text>

                        <View style={styles.modalInputSection}>
                            <Text style={styles.modalText}>현재 비밀번호 *</Text>
                            <TextInput
                                style={styles.modalTextInput}
                                placeholder="현재 비밀번호 입력"
                                secureTextEntry
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                            />
                        </View>

                        <View style={styles.modalInputSection}>
                            <Text style={styles.modalText}>새 비밀번호 *</Text>
                            <TextInput
                                style={styles.modalTextInput}
                                placeholder="새 비밀번호 입력"
                                secureTextEntry
                                value={newPassword}
                                onChangeText={setNewPassword}
                            />
                            <Text style={styles.modalPasswordHint}>
                                영문 대소문자, 숫자, 특수문자 포함 8~20자 이내로 입력해주세요.
                            </Text>
                        </View>

                        <View style={styles.modalInputSection}>
                            <Text style={styles.modalText}>비밀번호 확인 *</Text>
                            <TextInput
                                style={styles.modalTextInput}
                                placeholder="비밀번호 확인"
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                        </View>

                        <View style={styles.modalButtonContainer}>
                            <Pressable
                                style={styles.modalConfirmButton}
                                onPress={() => {
                                    // 비밀번호 변경 로직
                                    setPwModalVisible(false);
                                    setCurrentPassword('');
                                    setNewPassword('');
                                    setConfirmPassword('');
                                }}
                            >
                                <Text style={styles.modalConfirmButtonText}>변경</Text>
                            </Pressable>
                            <Pressable
                                style={styles.modalCancelButton}
                                onPress={() => setPwModalVisible(false)}
                            >
                                <Text style={styles.modalCancelButtonText}>취소</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* 관심 카테고리 모달 */}
            <Modal
                visible={categoryModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setCategoryModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>관심 카테고리 선택</Text>
                        <Text style={styles.categoryText}>
                            소매/잡화
                        </Text>
                        {/* 카테고리 선택 UI 구현 */}
                        <Pressable
                            style={styles.modalConfirmButton}
                            onPress={() => setCategoryModalVisible(false)}
                        >
                            <Text style={styles.modalConfirmButtonText}>확인</Text>
                        </Pressable>
                    </View>
                </View >
            </Modal >
            {insets.bottom > 0 && (
                <View style={{ height: insets.bottom, backgroundColor: '#000' }} />
            )}
        </View >
    );
}