/**
 * 스토어 회원가입 Step 3: 가게 정보 입력 화면
 *
 * 기능:
 * - 가게 이름, 전화번호 입력
 * - 주소 검색 (Daum Postcode API)
 * - 영업일 선택
 * - 영업시간 설정
 */
import TimePickerModal from "@/components/TimePickerModal";
import { useStoreSignup } from "@/contexts/StoreSignupContext";
import {
  formatPhone,
  restrictBusinessName,
  restrictPhone,
} from "@/utils/storeInputRestrictions";
import { validateStoreInfo } from "@/utils/storeSignupValidation";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DaumPostcode from "react-native-kakao-postcode";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./store-signup-store-info.styles";

const WEEK_DAYS = [
  { label: "월", value: "MON" },
  { label: "화", value: "TUE" },
  { label: "수", value: "WED" },
  { label: "목", value: "THU" },
  { label: "금", value: "FRI" },
  { label: "토", value: "SAT" },
  { label: "일", value: "SUN" },
];

export default function StoreSignupStoreInfoScreen() {
  const { formData, updateStoreInfo, setCurrentStep } = useStoreSignup();
  const { storeInfo } = formData;
  const insets = useSafeAreaInsets();

  const [showOpenTimePicker, setShowOpenTimePicker] = useState(false);
  const [showCloseTimePicker, setShowCloseTimePicker] = useState(false);
  const [activeTimePicker, setActiveTimePicker] = useState<
    "open" | "close" | null
  >(null);
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
  const openTimePicker = (type: "open" | "close") => {
    setActiveTimePicker(type);
    if (type === "open") {
      setShowOpenTimePicker(true);
    } else {
      setShowCloseTimePicker(true);
    }
  };

  /**
   * 시간 선택 확인
   */
  const handleTimeConfirm = (time: string) => {
    if (activeTimePicker === "open") {
      updateStoreInfo({ storeOpenTime: time });
      setShowOpenTimePicker(false);
    } else if (activeTimePicker === "close") {
      updateStoreInfo({ storeCloseTime: time });
      setShowCloseTimePicker(false);
    }
    setActiveTimePicker(null);
  };

  /**
   * 주소 검색 완료 핸들러
   */
  const handleAddressComplete = (data: any) => {
    const address = data.roadAddress || data.address;
    updateStoreInfo({
      storeZipCode: data.zonecode,
      storeAddr: address,
    });
    setShowPostcode(false);
  };

  /**
   * 주소 검색
   */
  const handleSearchAddress = () => {
    setShowPostcode(true);
  };

  /**
   * 주소 검색 에러 핸들러
   */
  const handlePostcodeError = (error: any) => {
    console.error("주소 검색 오류:", error);
    Alert.alert("오류", "주소 검색 중 오류가 발생했습니다.");
  };

  /**
   * 시간 선택 모달 닫기
   */
  const handleTimePickerClose = () => {
    setShowOpenTimePicker(false);
    setShowCloseTimePicker(false);
    setActiveTimePicker(null);
  };

  const handleStoreTelNoChange = (text: string) => {
    const digitsOnly = restrictPhone(text);
    updateStoreInfo({ storeTelNo: digitsOnly });
  };

  /**
   * 다음 단계로 이동
   */
  const handleNext = () => {
    const validation = validateStoreInfo(storeInfo);
    if (!validation.isValid) {
      Alert.alert("알림", validation.message);
      return;
    }
    setCurrentStep(3);
    router.push("/store-signup-biz-info" as any);
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff" }} />
      )}
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.centerSection}>
          <Text style={styles.title}>가게 정보</Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -insets.bottom}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 가게 이름 */}
          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>가게명</Text>
              <Text style={styles.required}> *</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="가맹점 이름을 입력해주세요"
              placeholderTextColor="#ccc"
              value={storeInfo.storeNm}
              onChangeText={(text) =>
                updateStoreInfo({ storeNm: restrictBusinessName(text) })
              }
            />
          </View>

          {/* 가게 전화번호 */}
          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>가게 연락처</Text>
              <Text style={styles.required}> *</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="가맹점 연락처를 입력해주세요"
              placeholderTextColor="#ccc"
              value={formatPhone(storeInfo.storeTelNo)}
              onChangeText={handleStoreTelNoChange}
              keyboardType="phone-pad"
              maxLength={13}
            />
          </View>

          {/* 주소 */}
          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>주소</Text>
              <Text style={styles.required}> *</Text>
            </View>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.inputFlex, styles.inputReadonly]}
                value={storeInfo.storeAddr}
                placeholder="주소를 검색해주세요"
                placeholderTextColor="#ccc"
                editable={false}
              />
              <TouchableOpacity
                style={styles.checkButton}
                onPress={handleSearchAddress}
              >
                <Text style={styles.checkButtonText}>주소검색</Text>
              </TouchableOpacity>
            </View>
            {storeInfo.storeAddr && (
              <>
                <TextInput
                  style={[styles.input, styles.inputReadonlySpaced]}
                  value={storeInfo.storeZipCode || ""}
                  editable={false}
                />
                <TextInput
                  style={[styles.input, styles.inputSpaced]}
                  placeholder="상세 주소를 입력해주세요"
                  placeholderTextColor="#ccc"
                  value={storeInfo.storeDetailAddr}
                  onChangeText={(text) =>
                    updateStoreInfo({ storeDetailAddr: text })
                  }
                />
              </>
            )}
          </View>

          {/* 영업일 */}
          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>영업일</Text>
              <Text style={styles.required}> *</Text>
            </View>
            <View style={styles.daySelector}>
              {WEEK_DAYS.map((day) => (
                <TouchableOpacity
                  key={day.value}
                  style={[
                    styles.dayButton,
                    storeInfo.storeOpenDate?.includes(day.value) &&
                      styles.dayButtonActive,
                  ]}
                  onPress={() => toggleOpenDate(day.value)}
                >
                  <Text
                    style={[
                      styles.dayButtonText,
                      storeInfo.storeOpenDate?.includes(day.value) &&
                        styles.dayButtonTextActive,
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
            <View style={styles.labelRow}>
              <Text style={styles.label}>영업 시작 시간</Text>
              <Text style={styles.required}> *</Text>
            </View>
            <TouchableOpacity
              style={styles.timeInput}
              onPress={() => openTimePicker("open")}
            >
              <Text
                style={
                  storeInfo.storeOpenTime
                    ? styles.timeText
                    : styles.timePlaceholder
                }
              >
                {storeInfo.storeOpenTime || "시간 선택"}
              </Text>
              <Ionicons name="time-outline" size={20} color="#999" />
            </TouchableOpacity>
          </View>

          {/* 영업 종료 시간 */}
          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>영업 종료 시간</Text>
              <Text style={styles.required}> *</Text>
            </View>
            <TouchableOpacity
              style={styles.timeInput}
              onPress={() => openTimePicker("close")}
            >
              <Text
                style={
                  storeInfo.storeCloseTime
                    ? styles.timeText
                    : styles.timePlaceholder
                }
              >
                {storeInfo.storeCloseTime || "시간 선택"}
              </Text>
              <Ionicons name="time-outline" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* 하단 버튼 */}
        <View style={styles.bottomButton}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>다음 2 / 4</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* 주소 검색 모달 */}
      <Modal
        visible={showPostcode}
        animationType="slide"
        onRequestClose={() => setShowPostcode(false)}
      >
        {insets.top > 0 && (
          <View style={{ height: insets.top, backgroundColor: "#fff" }} />
        )}
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowPostcode(false)}
            >
              <Ionicons name="close" size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>주소 검색</Text>
            <View style={styles.modalEmptyView} />
          </View>
          <DaumPostcode
            style={styles.postcodeStyle}
            onSelected={handleAddressComplete}
            onError={handlePostcodeError}
          />
        </View>
      </Modal>

      <TimePickerModal
        visible={showOpenTimePicker || showCloseTimePicker}
        type={activeTimePicker}
        currentTime={
          activeTimePicker === "open"
            ? storeInfo.storeOpenTime || "09:00"
            : storeInfo.storeCloseTime || "18:00"
        }
        businessOpenTime={storeInfo.storeOpenTime || "09:00"}
        onConfirm={handleTimeConfirm}
        onClose={handleTimePickerClose}
      />
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
