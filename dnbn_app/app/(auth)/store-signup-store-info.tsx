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
import Postcode from "@actbase/react-daum-postcode";
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
import { SafeAreaView } from "react-native-safe-area-context";
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

  /**
   * 다음 단계로 이동
   */
  const handleNext = () => {
    const validation = validateStoreInfo(storeInfo);
    if (!validation.isValid) {
      Alert.alert("알림", validation.message);
      return;
    }
    setCurrentStep(4);
    router.push("/store-signup-file-upload" as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
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
        behavior={Platform.OS === "ios" ? "padding" : undefined}
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
              onChangeText={(text) =>
                updateStoreInfo({ storeNm: restrictBusinessName(text) })
              }
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
              <Text
                style={
                  storeInfo.storeAddr
                    ? styles.addressText
                    : styles.addressPlaceholder
                }
              >
                {storeInfo.storeAddr || "주소 검색"}
              </Text>
              <Ionicons name="search" size={20} color="#999" />
            </TouchableOpacity>
            {storeInfo.storeAddr && (
              <TextInput
                style={[styles.input, { marginTop: 8 }]}
                placeholder="상세 주소 입력"
                placeholderTextColor="#ccc"
                value={storeInfo.storeDetailAddr}
                onChangeText={(text) =>
                  updateStoreInfo({ storeDetailAddr: text })
                }
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
            <Text style={styles.label}>
              영업 시작 시간 <Text style={styles.required}>*</Text>
            </Text>
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
            <Text style={styles.label}>
              영업 종료 시간 <Text style={styles.required}>*</Text>
            </Text>
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
            <Text style={styles.nextButtonText}>다음</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* 주소 검색 모달 */}
      <Modal
        visible={showPostcode}
        animationType="slide"
        onRequestClose={() => setShowPostcode(false)}
      >
        <SafeAreaView
          style={{ flex: 1, backgroundColor: "#fff" }}
          edges={["top"]}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowPostcode(false)}
            >
              <Ionicons name="close" size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>주소 검색</Text>
            <View style={{ width: 28 }} />
          </View>
          <Postcode
            style={{ flex: 1 }}
            onSelected={handleAddressComplete}
            onError={handlePostcodeError}
          />
        </SafeAreaView>
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
    </SafeAreaView>
  );
}
