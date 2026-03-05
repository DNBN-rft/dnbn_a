/**
 * 스토어 회원가입 Step 2: 사업자 정보 입력 화면
 * 
 * 기능:
 * - 대표자 정보 입력
 * - 사업자 등록번호 입력 및 중복 체크
 * - 개업일 선택
 * - 업종/업태 입력
 * - 정산 계좌 정보 입력
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
import DateTimePicker from '@react-native-community/datetimepicker';
import { useStoreSignup } from '@/contexts/StoreSignupContext';
import { validateBizInfo } from '@/utils/storeSignupValidation';
import {
  restrictName,
  restrictPhone,
  formatPhone,
  restrictBusinessName,
  restrictBusinessNumber,
  formatBusinessNumber,
  restrictBusinessType,
  restrictAccountNumber,
} from '@/utils/storeInputRestrictions';
import { apiPost } from '@/utils/api';
import { styles } from './store-signup-biz-info.styles';

export default function StoreSignupBizInfoScreen() {
  const { formData, updateBizInfo, setCurrentStep } = useStoreSignup();
  const { bizInfo } = formData;

  const [bizNoDuplicate, setBizNoDuplicate] = useState<boolean | null>(null);
  const [isCheckingBizNo, setIsCheckingBizNo] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  /**
   * 사업자번호 중복 체크
   */
  const handleCheckBizNo = async () => {
    if (!bizInfo.bizNo || bizInfo.bizNo.replace(/-/g, '').length !== 10) {
      Alert.alert('알림', '사업자번호 10자리를 입력해주세요.');
      return;
    }

    setIsCheckingBizNo(true);
    try {
      const response = await apiPost('/store/check-biz-no', { 
        bizNo: bizInfo.bizNo.replace(/-/g, '') 
      });
      const data = await response.json();

      if (response.ok && !data.exists) {
        setBizNoDuplicate(false);
        Alert.alert('성공', '사용 가능한 사업자번호입니다.');
      } else {
        setBizNoDuplicate(true);
        Alert.alert('알림', '이미 등록된 사업자번호입니다.');
      }
    } catch (error) {
      console.error('사업자번호 중복 체크 에러:', error);
      Alert.alert('오류', '사업자번호 확인 중 오류가 발생했습니다.');
    } finally {
      setIsCheckingBizNo(false);
    }
  };

  /**
   * 날짜 선택 핸들러
   */
  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
      const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
      updateBizInfo({ bizRegDate: formattedDate });
    }
  };

  /**
   * 다음 단계로 이동
   */
  const handleNext = () => {
    const validation = validateBizInfo(bizInfo, bizNoDuplicate);
    if (!validation.isValid) {
      Alert.alert('알림', validation.message);
      return;
    }
    setCurrentStep(3);
    router.push('/store-signup-store-info' as any);
  };

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
        <Text style={styles.headerTitle}>사업자 정보</Text>
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
          {/* 대표 이름 */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>
              대표 이름 <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="홍길동"
              placeholderTextColor="#ccc"
              value={bizInfo.ownerNm}
              onChangeText={(text) => updateBizInfo({ ownerNm: restrictName(text) })}
            />
          </View>

          {/* 대표 전화번호 */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>
              대표 전화번호 <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="010-1234-5678"
              placeholderTextColor="#ccc"
              value={formatPhone(bizInfo.ownerTelNo)}
              onChangeText={(text) => {
                const digitsOnly = restrictPhone(text);
                updateBizInfo({ ownerTelNo: digitsOnly });
              }}
              keyboardType="phone-pad"
              maxLength={13}
            />
          </View>

          {/* 사업명 */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>
              사업명 <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="동네방네 본점"
              placeholderTextColor="#ccc"
              value={bizInfo.bizNm}
              onChangeText={(text) => updateBizInfo({ bizNm: restrictBusinessName(text) })}
            />
          </View>

          {/* 사업자번호 */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>
              사업자번호 <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.inputFlex]}
                placeholder="123-45-67890"
                placeholderTextColor="#ccc"
                value={formatBusinessNumber(bizInfo.bizNo)}
                onChangeText={(text) => {
                  const digitsOnly = restrictBusinessNumber(text);
                  updateBizInfo({ bizNo: digitsOnly });
                  setBizNoDuplicate(null);
                }}
                keyboardType="number-pad"
                maxLength={12}
              />
              <TouchableOpacity
                style={[
                  styles.checkButton,
                  (isCheckingBizNo || bizNoDuplicate === false) && styles.checkButtonDisabled,
                ]}
                onPress={handleCheckBizNo}
                disabled={isCheckingBizNo || bizNoDuplicate === false}
              >
                {isCheckingBizNo ? (
                  <ActivityIndicator size="small" color="#FF6F2B" />
                ) : (
                  <Text style={styles.checkButtonText}>
                    {bizNoDuplicate === false ? '확인완료' : '중복확인'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* 개업일 */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>
              개업일 <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={bizInfo.bizRegDate ? styles.dateText : styles.datePlaceholder}>
                {bizInfo.bizRegDate || '날짜 선택'}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#999" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          {/* 업종/업태 */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>
              업종/업태 <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="예: 식품, 음료, 소매업"
              placeholderTextColor="#ccc"
              value={bizInfo.bizType}
              onChangeText={(text) => updateBizInfo({ bizType: restrictBusinessType(text) })}
            />
          </View>

          {/* 정산 계좌번호 */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>
              정산 계좌번호 <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="계좌번호 입력 (숫자만)"
              placeholderTextColor="#ccc"
              value={bizInfo.storeAccNo}
              onChangeText={(text) => updateBizInfo({ storeAccNo: restrictAccountNumber(text) })}
              keyboardType="number-pad"
              maxLength={15}
            />
            <Text style={styles.helperText}>정산금이 입금될 계좌번호입니다.</Text>
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
