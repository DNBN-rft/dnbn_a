/**
 * 스토어 회원가입 Step 3: 가게 정보 입력 화면
 * 
 * 기능:
 * - 가게 이름, 전화번호 입력
 * - 주소 검색 (Daum Postcode API)
 * - 영업일 선택
 * - 영업시간 설정
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useStoreSignup } from '@/contexts/StoreSignupContext';
import { validateStoreInfo } from '@/utils/storeSignupValidation';
import { restrictBusinessName, restrictPhone, formatPhone } from '@/utils/storeInputRestrictions';
import DaumPostcode from '@/components/daum-postcode';
import { styles } from './store-signup-store-info.styles';

const WEEK_DAYS = [
  { label: '월', value: 'MON' },
  { label: '화', value: 'TUE' },
  { label: '수', value: 'WED' },
  { label: '목', value: 'THU' },
  { label: '금', value: 'FRI' },
  { label: '토', value: 'SAT' },
  { label: '일', value: 'SUN' },
];

export default function StoreSignupStoreInfoScreen() {
  const { formData, updateStoreInfo, setCurrentStep } = useStoreSignup();
  const { storeInfo } = formData;

  const [showOpenTimePicker, setShowOpenTimePicker] = useState(false);
  const [showCloseTimePicker, setShowCloseTimePicker] = useState(false);
  const [tempOpenTime, setTempOpenTime] = useState(new Date());
  const [tempCloseTime, setTempCloseTime] = useState(new Date());
  const [showPostcode, setShowPostcode] = useState(false);

  /**
   * 영업일 토글
   */
  const toggleOpenDate = (day: string) => {
    const currentDays = storeInfo.storeOpenDate || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];
    updateStoreInfo({ storeOpenDate: newDays });
  };

  /**
   * 영업 시작 시간 설정
   */
  const handleOpenTimeChange = (event: any, date?: Date) => {
    setShowOpenTimePicker(Platform.OS === 'ios');
    if (date) {
      setTempOpenTime(date);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      updateStoreInfo({ storeOpenTime: `${hours}:${minutes}` });
    }
  };

  /**
   * 영업 종료 시간 설정
   */
  const handleCloseTimeChange = (event: any, date?: Date) => {
    setShowCloseTimePicker(Platform.OS === 'ios');
    if (date) {
      setTempCloseTime(date);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      updateStoreInfo({ storeCloseTime: `${hours}:${minutes}` });
    }
  };

  /**
   * 주소 검색 완료 핸들러
   */
  const handleAddressComplete = (data: {
    zonecode: string;
    address: string;
    addressType: string;
    buildingName?: string;
  }) => {
    updateStoreInfo({
      storeZipCode: data.zonecode,
      storeAddr: data.address,
    });
  };

  /**
   * 주소 검색 (Phase 4에서 구현 예정)
   */
  const handleSearchAddress = () => {
    setShowPostcode(true);
  };

  /**
   * 다음 단계로 이동
   */
  const handleNext = () => {
    const validation = validateStoreInfo(storeInfo);
    if (!validation.isValid) {
      Alert.alert('알림', validation.message);
      return;
    }
    setCurrentStep(4);
    router.push('/store-signup-file-upload' as any);
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
        <Text style={styles.headerTitle}>가게 정보</Text>
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
          {/* 가게 이름 */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>
              가게 이름 <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="동네방네 본점"
              placeholderTextColor="#ccc"
              value={storeInfo.storeNm}
              onChangeText={(text) => updateStoreInfo({ storeNm: restrictBusinessName(text) })}
            />
          </View>

          {/* 가게 전화번호 */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>
              가게 전화번호 <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="02-1234-5678"
              placeholderTextColor="#ccc"
              value={formatPhone(storeInfo.storeTelNo)}
              onChangeText={(text) => {
                const digitsOnly = restrictPhone(text);
                updateStoreInfo({ storeTelNo: digitsOnly });
              }}
              keyboardType="phone-pad"
              maxLength={13}
            />
          </View>

          {/* 주소 */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>
              주소 <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.addressButton}
              onPress={handleSearchAddress}
            >
              <Text style={storeInfo.storeAddr ? styles.addressText : styles.addressPlaceholder}>
                {storeInfo.storeAddr || '주소 검색'}
              </Text>
              <Ionicons name="search" size={20} color="#999" />
            </TouchableOpacity>
            {storeInfo.storeAddr && (
              <TextInput
                style={[styles.input, { marginTop: 8 }]}
                placeholder="상세 주소 입력"
                placeholderTextColor="#ccc"
                value={storeInfo.storeDetailAddr}
                onChangeText={(text) => updateStoreInfo({ storeDetailAddr: text })}
              />
            )}
          </View>

          {/* 영업일 */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>
              영업일 <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.daySelector}>
              {WEEK_DAYS.map((day) => (
                <TouchableOpacity
                  key={day.value}
                  style={[
                    styles.dayButton,
                    storeInfo.storeOpenDate?.includes(day.value) && styles.dayButtonActive,
                  ]}
                  onPress={() => toggleOpenDate(day.value)}
                >
                  <Text
                    style={[
                      styles.dayButtonText,
                      storeInfo.storeOpenDate?.includes(day.value) && styles.dayButtonTextActive,
                    ]}
                  >
                    {day.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 영업 시작 시간 */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>
              영업 시작 시간 <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.timeInput}
              onPress={() => setShowOpenTimePicker(true)}
            >
              <Text style={storeInfo.storeOpenTime ? styles.timeText : styles.timePlaceholder}>
                {storeInfo.storeOpenTime || '시간 선택'}
              </Text>
              <Ionicons name="time-outline" size={20} color="#999" />
            </TouchableOpacity>
            {showOpenTimePicker && (
              <DateTimePicker
                value={tempOpenTime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleOpenTimeChange}
              />
            )}
          </View>

          {/* 영업 종료 시간 */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>
              영업 종료 시간 <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.timeInput}
              onPress={() => setShowCloseTimePicker(true)}
            >
              <Text style={storeInfo.storeCloseTime ? styles.timeText : styles.timePlaceholder}>
                {storeInfo.storeCloseTime || '시간 선택'}
              </Text>
              <Ionicons name="time-outline" size={20} color="#999" />
            </TouchableOpacity>
            {showCloseTimePicker && (
              <DateTimePicker
                value={tempCloseTime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleCloseTimeChange}
              />
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

      {/* Daum Postcode Modal */}
      <DaumPostcode
        visible={showPostcode}
        onClose={() => setShowPostcode(false)}
        onComplete={handleAddressComplete}
      />
    </SafeAreaView>
  );
}
