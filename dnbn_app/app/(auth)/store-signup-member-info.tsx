/**
 * 스토어 회원가입 Step 1: 회원 정보 입력 화면
 * 
 * 기능:
 * - 아이디 입력 및 중복 체크
 * - 비밀번호 입력 및 확인
 * - 이메일 입력
 * - 실시간 유효성 검사
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useStoreSignup } from '@/contexts/StoreSignupContext';
import { validateMemberInfo, getPasswordCheckMessage } from '@/utils/storeSignupValidation';
import { restrictLoginId, restrictPassword, restrictEmail } from '@/utils/storeInputRestrictions';
import { apiPost } from '@/utils/api';
import { styles } from './store-signup-member-info.styles';

export default function StoreSignupMemberInfoScreen() {
  const { formData, updateMemberInfo, setCurrentStep } = useStoreSignup();
  const { memberInfo } = formData;

  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [idCheckStatus, setIdCheckStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isCheckingId, setIsCheckingId] = useState(false);

  // 에러 메시지
  const [loginIdError, setLoginIdError] = useState('');
  const [emailError, setEmailError] = useState('');

  /**
   * 아이디 입력 핸들러
   */
  const handleLoginIdChange = (text: string) => {
    const restricted = restrictLoginId(text);
    updateMemberInfo({ loginId: restricted });
    setIdCheckStatus('idle');
    setLoginIdError('');
  };

  /**
   * 비밀번호 입력 핸들러
   */
  const handlePasswordChange = (text: string) => {
    const restricted = restrictPassword(text);
    updateMemberInfo({ password: restricted });
  };

  /**
   * 이메일 입력 핸들러
   */
  const handleEmailChange = (text: string) => {
    const restricted = restrictEmail(text);
    updateMemberInfo({ email: restricted });
    setEmailError('');
  };

  /**
   * 아이디 중복 체크
   */
  const handleCheckDuplicateId = async () => {
    if (!memberInfo.loginId || memberInfo.loginId.length < 6) {
      Alert.alert('알림', '아이디는 6자 이상 입력해주세요.');
      return;
    }

    setIsCheckingId(true);
    try {
      const response = await apiPost('/store/check-login-id', { loginId: memberInfo.loginId });
      const data = await response.json();

      if (response.ok && !data.exists) {
        setIdCheckStatus('success');
        setLoginIdError('');
        Alert.alert('성공', '사용 가능한 아이디입니다.');
      } else {
        setIdCheckStatus('error');
        setLoginIdError('이미 사용 중인 아이디입니다.');
        Alert.alert('알림', '이미 사용 중인 아이디입니다.');
      }
    } catch (error) {
      console.error('아이디 중복 체크 에러:', error);
      Alert.alert('오류', '아이디 중복 확인 중 오류가 발생했습니다.');
    } finally {
      setIsCheckingId(false);
    }
  };

  /**
   * 다음 단계로 이동
   */
  const handleNext = () => {
    const validation = validateMemberInfo(memberInfo, idCheckStatus, passwordConfirm);
    if (!validation.isValid) {
      Alert.alert('알림', validation.message);
      return;
    }
    setCurrentStep(2);
    router.push('/store-signup-biz-info' as any);
  };

  const passwordCheck = getPasswordCheckMessage(memberInfo.password || '');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>회원 정보</Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 아이디 */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>
              아이디 <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.inputFlex]}
                placeholder="아이디 입력 (6~15자)"
                placeholderTextColor="#ccc"
                value={memberInfo.loginId}
                onChangeText={handleLoginIdChange}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={[
                  styles.checkButton,
                  (isCheckingId || idCheckStatus === 'success') && styles.checkButtonDisabled,
                ]}
                onPress={handleCheckDuplicateId}
                disabled={isCheckingId || idCheckStatus === 'success'}
              >
                {isCheckingId ? (
                  <ActivityIndicator size="small" color="#FF6F2B" />
                ) : (
                  <Text style={styles.checkButtonText}>
                    {idCheckStatus === 'success' ? '확인완료' : '중복확인'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            {loginIdError ? (
              <Text style={styles.errorText}>{loginIdError}</Text>
            ) : (
              <Text style={styles.helperText}>6자 이상의 영문 또는 영문, 숫자 혼합</Text>
            )}
          </View>

          {/* 비밀번호 */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>
              비밀번호 <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="비밀번호 입력"
              placeholderTextColor="#ccc"
              value={memberInfo.password}
              onChangeText={handlePasswordChange}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            {passwordCheck.message ? (
              <Text
                style={[
                  styles.helperText,
                  passwordCheck.status === 'error' && styles.errorText,
                  passwordCheck.status === 'success' && styles.successText,
                ]}
              >
                {passwordCheck.message}
              </Text>
            ) : (
              <Text style={styles.helperText}>8~16자 영문, 숫자, 특수문자를 사용하세요</Text>
            )}
          </View>

          {/* 비밀번호 확인 */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>
              비밀번호 확인 <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="비밀번호 재입력"
              placeholderTextColor="#ccc"
              value={passwordConfirm}
              onChangeText={(text) => setPasswordConfirm(restrictPassword(text))}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            {passwordConfirm && memberInfo.password !== passwordConfirm && (
              <Text style={styles.errorText}>비밀번호가 일치하지 않습니다.</Text>
            )}
            {passwordConfirm && memberInfo.password === passwordConfirm && (
              <Text style={styles.successText}>비밀번호가 일치합니다.</Text>
            )}
          </View>

          {/* 이메일 */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>
              이메일 <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="example@domain.com"
              placeholderTextColor="#ccc"
              value={memberInfo.email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : (
              <Text style={styles.helperText}>예: user@example.com</Text>
            )}
          </View>
        </ScrollView>

        {/* 하단 버튼 */}
        <View style={styles.bottomButton}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>다음</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
