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
import { useStoreSignup } from "@/contexts/StoreSignupContext";
import { apiGet, apiPost } from "@/utils/api";
import { formatDateToLocalString, formatWebDateInput } from "@/utils/dateUtil";
import {
  formatBusinessNumber,
  restrictAccountNumber,
  restrictBusinessName,
  restrictBusinessNumber,
  restrictBusinessType,
  restrictName,
} from "@/utils/storeInputRestrictions";
import {
  handleStorePhoneFirstChange,
  handleStorePhoneLastChange,
  handleStorePhoneMiddleChange,
} from "@/utils/storeSignupUtil";
import { validateBizInfo } from "@/utils/storeSignupValidation";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./store-signup-biz-info.styles";

interface Bank {
  bankIdx: number;
  bankNm: string;
}

export default function StoreSignupBizInfoScreen() {
  const insets = useSafeAreaInsets();
  const { formData, updateBizInfo, setCurrentStep } = useStoreSignup();
  const { bizInfo } = formData;

  const [bizNoDuplicate, setBizNoDuplicate] = useState<boolean | null>(null);
  const [isCheckingBizNo, setIsCheckingBizNo] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [banks, setBanks] = useState<Bank[]>([]);
  const [showBankPicker, setShowBankPicker] = useState(false);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;

  // 전화번호 입력 state 및 ref
  const [phoneFirst, setPhoneFirst] = useState(
    bizInfo.ownerTelNo.substring(0, 3) || "",
  );
  const [phoneMiddle, setPhoneMiddle] = useState(
    bizInfo.ownerTelNo.substring(3, 7) || "",
  );
  const [phoneLast, setPhoneLast] = useState(
    bizInfo.ownerTelNo.substring(7, 11) || "",
  );
  const phoneMiddleRef = useRef<TextInput>(null);
  const phoneLastRef = useRef<TextInput>(null);

  /**
   * DatePicker/BankPicker 애니메이션
   */
  useEffect(() => {
    if (showDatePicker || showBankPicker) {
      slideAnim.setValue(300);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 10,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDatePicker, showBankPicker]);

  /**
   * 은행 목록 조회
   */
  useEffect(() => {
    const fetchBanks = async () => {
      setIsLoadingBanks(true);
      try {
        const response = await apiGet("/bank");
        if (response.ok) {
          const data = await response.json();
          setBanks(data);
        } else {
          Alert.alert("오류", "은행 목록을 불러오는데 실패했습니다.");
        }
      } catch (error) {
        console.error("은행 목록 조회 에러:", error);
        Alert.alert("오류", "은행 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoadingBanks(false);
      }
    };

    fetchBanks();
  }, []);

  /**
   * 은행 선택 핸들러
   */
  const handleSelectBank = (bank: Bank) => {
    updateBizInfo({ bankId: bank.bankIdx.toString() });
    setShowBankPicker(false);
  };

  /**
   * 선택된 은행 이름 가져오기
   */
  const getSelectedBankName = () => {
    if (!bizInfo.bankId) return null;
    const bank = banks.find((b) => b.bankIdx.toString() === bizInfo.bankId);
    return bank?.bankNm || null;
  };

  /**
   * 사업자번호 중복 체크
   */
  const handleCheckBizNo = async () => {
    if (!bizInfo.bizNo || bizInfo.bizNo.replace(/-/g, "").length !== 10) {
      Alert.alert("알림", "사업자번호 10자리를 입력해주세요.");
      return;
    }

    setIsCheckingBizNo(true);
    try {
      const bizNoClean = bizInfo.bizNo.replace(/-/g, "");
      const response = await apiGet(`/store/check-bizNo/${bizNoClean}`);

      if (response.ok) {
        setBizNoDuplicate(false);
        Alert.alert("성공", "사용 가능한 사업자 번호입니다.");
      } else {
        setBizNoDuplicate(true);
        Alert.alert("알림", "이미 등록된 사업자 번호입니다.");
      }
    } catch (error) {
      console.error("사업자번호 중복 체크 에러:", error);
      Alert.alert("오류", "사업자번호 확인 중 오류가 발생했습니다.");
    } finally {
      setIsCheckingBizNo(false);
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (Platform.OS === "ios" && event.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }
    if (date) {
      setSelectedDate(date);
      updateBizInfo({ bizRegDate: formatDateToLocalString(date) });
    }
  };

  const handleWebDateChange = (text: string) => {
    const { formatted, parsedDate } = formatWebDateInput(text);
    updateBizInfo({ bizRegDate: formatted });
    if (parsedDate) {
      setSelectedDate(parsedDate);
    }
  };

  /**
   * 날짜 선택 모달 닫기
   */
  const closeDatePicker = () => {
    setShowDatePicker(false);
  };

  const handleBizNoChange = (text: string) => {
    const digitsOnly = restrictBusinessNumber(text);
    updateBizInfo({ bizNo: digitsOnly });
    setBizNoDuplicate(null);
  };

  /**
   * 다음 단계로 이동
   */
  const handleNext = async () => {
    const validation = validateBizInfo(bizInfo, bizNoDuplicate);
    if (!validation.isValid) {
      Alert.alert("알림", validation.message);
      return;
    }

    // 사업자 등록번호 유효성 검증
    setIsValidating(true);
    try {
      const bizNoClean = bizInfo.bizNo.replace(/-/g, "");
      const startDtClean = bizInfo.bizRegDate.replace(/-/g, "");

      const validationRequest = {
        businesses: [
          {
            b_no: bizNoClean,
            start_dt: startDtClean,
            p_nm: bizInfo.ownerNm,
          },
        ],
      };

      const response = await apiPost("/store/validate", validationRequest);

      if (!response.ok) {
        Alert.alert("사업자 정보 검증을 실패하였습니다.");
        return;
      }

      // 검증 성공 시 다음 단계로 이동
      setCurrentStep(4);
      router.push("/store-signup-file-upload" as any);
    } catch (error) {
      console.error("사업자 정보 검증 에러:", error);
      Alert.alert("오류", "사업자 정보 검증 중 오류가 발생했습니다.");
    } finally {
      setIsValidating(false);
    }
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
          <Text style={styles.title}>사업자 정보</Text>
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
          {/* 사업자명 */}
          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>사업자명</Text>
              <Text style={styles.required}> *</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="법인명 또는 개인 상호명"
              placeholderTextColor="#ccc"
              value={bizInfo.bizNm}
              onChangeText={(text) =>
                updateBizInfo({ bizNm: restrictBusinessName(text) })
              }
            />
          </View>

          {/* 업종/업태 */}
          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>업종/업태</Text>
              <Text style={styles.required}> *</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="식품, 음료, 소매업 등"
              placeholderTextColor="#ccc"
              value={bizInfo.bizType}
              onChangeText={(text) =>
                updateBizInfo({ bizType: restrictBusinessType(text) })
              }
            />
          </View>

          {/* 사업자번호 */}
          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>사업자번호</Text>
              <Text style={styles.required}> *</Text>
            </View>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.inputFlex]}
                placeholder="법인 또는 개인 사업자번호"
                placeholderTextColor="#ccc"
                value={formatBusinessNumber(bizInfo.bizNo)}
                onChangeText={handleBizNoChange}
                keyboardType="number-pad"
                maxLength={12}
              />
              <TouchableOpacity
                style={[
                  styles.checkButton,
                  (isCheckingBizNo || bizNoDuplicate === false) &&
                    styles.checkButtonDisabled,
                ]}
                onPress={handleCheckBizNo}
                disabled={isCheckingBizNo || bizNoDuplicate === false}
              >
                {isCheckingBizNo ? (
                  <ActivityIndicator size="small" color="#FF6F2B" />
                ) : (
                  <Text style={styles.checkButtonText}>
                    {bizNoDuplicate === false ? "확인완료" : "중복확인"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* 사업주 이름 */}
          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>사업주 이름</Text>
              <Text style={styles.required}> *</Text>
            </View>
            <TextInput
              style={styles.input}
              value={bizInfo.ownerNm}
              onChangeText={(text) =>
                updateBizInfo({ ownerNm: restrictName(text) })
              }
            />
          </View>

          {/* 대표 전화번호 */}
          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>대표 전화번호</Text>
              <Text style={styles.required}> *</Text>
            </View>
            <View style={styles.phoneInputRow}>
              <TextInput
                style={styles.phoneInput}
                placeholder="010"
                placeholderTextColor="#ccc"
                keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
                value={phoneFirst}
                onChangeText={(text) =>
                  handleStorePhoneFirstChange(
                    text,
                    phoneMiddle,
                    phoneLast,
                    setPhoneFirst,
                    phoneMiddleRef,
                    (combined) => updateBizInfo({ ownerTelNo: combined }),
                  )
                }
                maxLength={3}
              />
              <Text style={styles.phoneSeparator}>-</Text>
              <TextInput
                ref={phoneMiddleRef}
                style={styles.phoneInput}
                placeholder="1234"
                placeholderTextColor="#ccc"
                keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
                value={phoneMiddle}
                onChangeText={(text) =>
                  handleStorePhoneMiddleChange(
                    text,
                    phoneFirst,
                    phoneLast,
                    setPhoneMiddle,
                    phoneLastRef,
                    (combined) => updateBizInfo({ ownerTelNo: combined }),
                  )
                }
                maxLength={4}
              />
              <Text style={styles.phoneSeparator}>-</Text>
              <TextInput
                ref={phoneLastRef}
                style={styles.phoneInput}
                placeholder="5678"
                placeholderTextColor="#ccc"
                keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
                value={phoneLast}
                onChangeText={(text) =>
                  handleStorePhoneLastChange(
                    text,
                    phoneFirst,
                    phoneMiddle,
                    setPhoneLast,
                    (combined) => updateBizInfo({ ownerTelNo: combined }),
                  )
                }
                maxLength={4}
              />
            </View>
          </View>

          {/* 은행 선택 */}
          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>은행</Text>
              <Text style={styles.required}> *</Text>
            </View>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowBankPicker(true)}
              disabled={isLoadingBanks}
            >
              <Text
                style={
                  getSelectedBankName()
                    ? styles.dateText
                    : styles.datePlaceholder
                }
              >
                {isLoadingBanks
                  ? "은행 목록 로딩 중..."
                  : getSelectedBankName() || "은행 선택"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#999" />
            </TouchableOpacity>
          </View>

          {/* 정산 계좌번호 */}
          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>계좌번호</Text>
              <Text style={styles.required}> *</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="계좌번호 입력"
              placeholderTextColor="#ccc"
              value={bizInfo.storeAccNo}
              onChangeText={(text) =>
                updateBizInfo({ storeAccNo: restrictAccountNumber(text) })
              }
              keyboardType="number-pad"
              maxLength={15}
            />
            <Text style={styles.helperText}>
              정산금이 입금될 계좌번호입니다.
            </Text>
          </View>

          {/* 사업자 등록일 */}
          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>사업자 등록일</Text>
              <Text style={styles.required}> *</Text>
            </View>
            {Platform.OS === "web" ? (
              // 웹용 HTML input
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#ccc"
                value={bizInfo.bizRegDate}
                onChangeText={handleWebDateChange}
                maxLength={10}
              />
            ) : (
              // 앱용 DateTimePicker
              <>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text
                    style={
                      bizInfo.bizRegDate
                        ? styles.dateText
                        : styles.datePlaceholder
                    }
                  >
                    {bizInfo.bizRegDate || "날짜 선택"}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#999" />
                </TouchableOpacity>

                {/* iOS용 Modal + DateTimePicker */}
                {Platform.OS === "ios" && showDatePicker && (
                  <Modal
                    transparent={true}
                    animationType="fade"
                    visible={showDatePicker}
                    onRequestClose={closeDatePicker}
                  >
                    <TouchableOpacity
                      style={styles.modalOverlay}
                      activeOpacity={1}
                      onPress={closeDatePicker}
                    >
                      <TouchableOpacity activeOpacity={1}>
                        <Animated.View
                          style={[
                            styles.pickerSheet,
                            { transform: [{ translateY: slideAnim }] },
                          ]}
                        >
                          <View style={styles.pickerHeader}>
                            <TouchableOpacity onPress={closeDatePicker}>
                              <Text style={styles.pickerCancelText}>취소</Text>
                            </TouchableOpacity>
                            <Text style={styles.pickerTitleText}>
                              개업일 선택
                            </Text>
                            <TouchableOpacity onPress={closeDatePicker}>
                              <Text style={styles.pickerDoneText}>완료</Text>
                            </TouchableOpacity>
                          </View>
                          <View style={styles.pickerCenter}>
                            <DateTimePicker
                              value={selectedDate}
                              mode="date"
                              display="spinner"
                              onChange={handleDateChange}
                              maximumDate={new Date()}
                              textColor="#000"
                              locale="ko-KR"
                            />
                          </View>
                        </Animated.View>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </Modal>
                )}

                {/* Android용 DateTimePicker */}
                {Platform.OS === "android" && showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                  />
                )}
              </>
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
            <Text style={styles.nextButtonText}>다음 3 / 4</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* 은행 선택 모달 */}
      <Modal
        visible={showBankPicker}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowBankPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowBankPicker(false)}
        >
          <TouchableOpacity activeOpacity={1}>
            <Animated.View
              style={[
                styles.bankSheet,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <View style={styles.pickerHeader}>
                <Text style={styles.bankSheetTitle}>은행 선택</Text>
                <TouchableOpacity onPress={() => setShowBankPicker(false)}>
                  <Ionicons name="close" size={28} color="#000" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.bankList}>
                {banks.map((bank) => (
                  <TouchableOpacity
                    key={bank.bankIdx}
                    style={[
                      styles.bankItem,
                      bizInfo.bankId === bank.bankIdx.toString() &&
                        styles.bankItemSelected,
                    ]}
                    onPress={() => handleSelectBank(bank)}
                  >
                    <Text
                      style={[
                        styles.bankItemText,
                        bizInfo.bankId === bank.bankIdx.toString() &&
                          styles.bankItemTextSelected,
                      ]}
                    >
                      {bank.bankNm}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* 검증 로딩 오버레이 */}
      {isValidating && (
        <Modal transparent={true} animationType="fade" visible={isValidating}>
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#FF6F2B" />
          </View>
        </Modal>
      )}
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
