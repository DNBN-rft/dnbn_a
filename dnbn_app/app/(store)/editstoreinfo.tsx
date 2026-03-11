import AccountInfoSection from "@/components/store/AccountInfoSection";
import BankInfoSection from "@/components/store/BankInfoSection";
import BankPickerModal from "@/components/store/BankPickerModal";
import BusinessInfoSection from "@/components/store/BusinessInfoSection";
import OperatingInfoSection from "@/components/store/OperatingInfoSection";
import PasswordChangeModal from "@/components/store/PasswordChangeModal";
import StoreInfoSection from "@/components/store/StoreInfoSection";
import TimePickerModal from "@/components/store/TimePickerModal";
import { apiGet, apiPost, apiPutFormDataWithImage } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  Alert,
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
import { styles } from "./editstoreinfo.styles";

interface StoreInfo {
  approvalStatus: string;
  storeNm: string;
  storeTelNo: string;
  storeAddr: string;
  storeAddrDetail: string;
  storeReport: number;
  storeCode?: string;

  bankIdx: number;
  bankNm: string;
  storeAccNo: string;
  ownerNm: string;

  bizNm: string;
  storeType: string;
  bizNo: string;
  ownerTelNo: string;
  bizRegDateTime: string;

  storeOpenDate: string[];
  storeOpenTime: string;
  storeCloseTime: string;

  planNm: string;
  membershipStartDate: string;
  nextBillingDate: string;
  planPrice: number;
  isRenew: boolean;
  membershipInfos: MembershipInfo[];
  mainImg: mainImg;
}

interface MembershipInfo {
  membershipStartDate: string;
  membershipEndDate: string;
  PlanNm: string;
  PlanPrice: number;
  PaymentDateTime: string;
  PlanType: string;
}

interface mainImg {
  fileUrl: string;
  originalName: string;
  order: number;
}

export default function EditStoreInfoPage() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [memberId, setMemberId] = useState<string | null>(null);
  const [storeCode, setStoreCode] = useState<string | null>(null);

  useEffect(() => {
    const loadStoreInfo = async () => {
      try {
        if (Platform.OS === "web") {
          setMemberId(localStorage.getItem("memberId"));
          setStoreCode(localStorage.getItem("storeCode"));
          return;
        }

        let name = await SecureStore.getItemAsync("memberId");
        let storedStoreCode = await SecureStore.getItemAsync("storeCode");

        if (name && storedStoreCode) {
          setMemberId(name);
          setStoreCode(storedStoreCode);
        }
      } catch (error) {
        console.error("스토어 정보 로드 실패:", error);
      }
    };

    loadStoreInfo();
  }, []);

  // params에서 storeInfo 파싱
  const initialStoreInfo: StoreInfo | null = params.storeInfo
    ? JSON.parse(params.storeInfo as string)
    : null;

  // 수정 가능한 정보
  const [storeName, setStoreName] = useState(initialStoreInfo?.storeNm || "");
  const [phoneNumber, setPhoneNumber] = useState(
    initialStoreInfo?.storeTelNo || "",
  );
  const [address, setAddress] = useState(initialStoreInfo?.storeAddr || "");
  const [detailedAddress, setDetailedAddress] = useState(
    initialStoreInfo?.storeAddrDetail || "",
  );
  const [bankName, setBankName] = useState(initialStoreInfo?.bankNm || "");
  const [bankIdx, setBankIdx] = useState<number | null>(
    initialStoreInfo?.bankIdx || null,
  );
  const [accountNumber, setAccountNumber] = useState(
    initialStoreInfo?.storeAccNo || "",
  );

  // 입력 에러 상태
  const [errors, setErrors] = useState<{
    storeName?: string;
    phoneNumber?: string;
    address?: string;
    accountNumber?: string;
    representativePhone?: string;
  }>({});

  // 전화번호 자동 하이픈 포맷
  const formatPhoneNumber = (digits: string): string => {
    if (digits.startsWith("02")) {
      // 02-xxx-xxxx (최대 9자리)
      if (digits.length <= 2) return digits;
      if (digits.length <= 5) return `02-${digits.slice(2)}`;
      return `02-${digits.slice(2, 5)}-${digits.slice(5, 9)}`;
    } else {
      // xxx-xxx-xxxx (10자리) 또는 xxx-xxxx-xxxx (11자리)
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
      if (digits.length <= 10)
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
    }
  };

  // 핸들러: 가맹점명 (한글, 영문, 숫자, 공백만 허용)
  const handleStoreNameChange = (value: string) => {
    const filtered = value.replace(/[^가-힣a-zA-Z0-9 ]/g, "");
    setStoreName(filtered);
    if (filtered.trim()) {
      setErrors((prev) => ({ ...prev, storeName: undefined }));
    }
  };

  // 핸들러: 전화번호 (자동 하이픈 + 02는 최대 9자리, 그 외 최대 11자리)
  const handlePhoneChange = (value: string) => {
    const raw = value.replace(/[^0-9]/g, "");
    const maxLen = raw.startsWith("02") ? 9 : 11;
    const digits = raw.slice(0, maxLen);
    const formatted = formatPhoneNumber(digits);
    setPhoneNumber(formatted);
    if (digits.length >= 9) {
      setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
    }
  };

  // 핸들러: 계좌번호 (숫자만, 최대 15자리)
  const handleAccountNumberChange = (value: string) => {
    const digits = value.replace(/[^0-9]/g, "").slice(0, 15);
    setAccountNumber(digits);
    if (digits.trim()) {
      setErrors((prev) => ({ ...prev, accountNumber: undefined }));
    }
  };
  const [businessOpenTime, setBusinessOpenTime] = useState(
    initialStoreInfo?.storeOpenTime || "09:00",
  );
  const [businessCloseTime, setBusinessCloseTime] = useState(
    initialStoreInfo?.storeCloseTime || "21:00",
  );

  // 요일 매핑
  const dayOrder = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const dayMapping: { [key: string]: string } = {
    MON: "월",
    TUE: "화",
    WED: "수",
    THU: "목",
    FRI: "금",
    SAT: "토",
    SUN: "일",
  };
  const koreanToDayCode: { [key: string]: string } = {
    월: "MON",
    화: "TUE",
    수: "WED",
    목: "THU",
    금: "FRI",
    토: "SAT",
    일: "SUN",
  };

  // 초기 영업일 처리
  const getInitialBusinessDays = () => {
    if (
      initialStoreInfo?.storeOpenDate &&
      initialStoreInfo.storeOpenDate.length > 0
    ) {
      // storeOpenDate가 한글(월,화,수) 형식인 경우 영문 코드로 변환
      const convertedDays = initialStoreInfo.storeOpenDate
        .map((day: string) => {
          // 한글로 되어 있으면 변환, 이미 영문이면 그대로
          return koreanToDayCode[day] || day;
        })
        .filter((day: string) => dayOrder.includes(day)); // 유효한 값만 필터링

      return convertedDays.length > 0 ? convertedDays : dayOrder;
    }
    return dayOrder; // 기본값: 모든 요일
  };

  const [businessDays, setBusinessDays] = useState<string[]>(
    getInitialBusinessDays(),
  );
  const [mainImage, setMainImage] = useState<any>(
    initialStoreInfo?.mainImg || null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 은행 목록 및 선택 modal 관련 state
  const [banks, setBanks] = useState<{ bankIdx: number; bankNm: string }[]>([]);
  const [bankPickerVisible, setBankPickerVisible] = useState(false);
  const [banksLoading, setBanksLoading] = useState(true);

  // 컴포넌트 마운트 시 은행 목록 로드
  useEffect(() => {
    const loadBanks = async () => {
      try {
        const response = await apiGet("/bank");
        if (response.ok) {
          const data = await response.json();
          // data.data 또는 data가 배열인지 확인
          const bankList = Array.isArray(data) ? data : data.data || [];
          setBanks(bankList);
        }
      } catch (error) {
        console.error("은행 목록 로드 실패:", error);
      } finally {
        setBanksLoading(false);
      }
    };
    loadBanks();
  }, []);

  // 회원탈퇴 모달 state
  const [withdrawPasswordModalVisible, setWithdrawPasswordModalVisible] =
    useState(false);
  const [withdrawPassword, setWithdrawPassword] = useState("");

  // 모달 관련 state
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [activeTimePicker, setActiveTimePicker] = useState<
    "open" | "close" | null
  >(null);

  // 읽기 전용 정보 (initialStoreInfo에서 가져옴)
  const accountHolder = initialStoreInfo?.ownerNm || "";
  const businessName = initialStoreInfo?.bizNm || "";
  const businessNumber = initialStoreInfo?.bizNo || "";
  const representativeName = initialStoreInfo?.ownerNm || "";
  const [representativePhone, setRepresentativePhone] = useState(
    initialStoreInfo?.ownerTelNo || "",
  );
  const businessType = initialStoreInfo?.storeType || "";
  const registrationDate = initialStoreInfo?.bizRegDateTime || "";

  const handleRepresentativePhoneChange = (value: string) => {
    const raw = value.replace(/[^0-9]/g, "");
    const maxLen = raw.startsWith("02") ? 9 : 11;
    const digits = raw.slice(0, maxLen);
    const formatted = formatPhoneNumber(digits);
    setRepresentativePhone(formatted);
    if (digits.length >= 9) {
      setErrors((prev) => ({ ...prev, representativePhone: undefined }));
    }
  };

  const handleWithdrawClick = () => {
    setWithdrawPasswordModalVisible(true);
  };

  const handleWithdrawPasswordSubmit = async () => {
    if (!withdrawPassword) {
      if (Platform.OS === "web") {
        alert("비밀번호를 입력해주세요.");
      } else {
        Alert.alert("입력 오류", "비밀번호를 입력해주세요.");
      }
      return;
    }

    try {
      const response = await apiPost("/store/app/password", {
        password: withdrawPassword,
      });

      if (response.ok) {
        setWithdrawPasswordModalVisible(false);
        setWithdrawPassword("");
        router.push("/(store)/Withdraw");
      } else {
        if (Platform.OS === "web") {
          alert("비밀번호가 일치하지 않습니다.");
        } else {
          Alert.alert("오류", "비밀번호가 일치하지 않습니다.");
        }
      }
    } catch (error) {
      console.error("비밀번호 확인 에러:", error);
      if (Platform.OS === "web") {
        alert("비밀번호 확인 중 오류가 발생했습니다.");
      } else {
        Alert.alert("오류", "비밀번호 확인 중 오류가 발생했습니다.");
      }
    }
  };

  const openTimePicker = (type: "open" | "close") => {
    setActiveTimePicker(type);
    setTimePickerVisible(true);
  };

  const handleAddressSelect = (data: any) => {
    const selected = data.roadAddress || data.address;
    setAddress(selected);
    setShowAddressSearch(false);
  };

  const handleTimeConfirm = (time: string) => {
    if (activeTimePicker === "open") {
      setBusinessOpenTime(time);
    } else if (activeTimePicker === "close") {
      setBusinessCloseTime(time);
    }
    setTimePickerVisible(false);
    setActiveTimePicker(null);
  };

  const toggleBusinessDay = (day: string) => {
    setBusinessDays(
      businessDays.includes(day)
        ? businessDays.filter((d) => d !== day)
        : [...businessDays, day].sort(
            (a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b),
          ),
    );
  };

  const pickImage = async () => {
    try {
      // 카메라와 라이브러리 접근 권한 요청
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("알림", "사진 라이브러리 접근 권한이 필요합니다.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        // mainImage를 새 이미지로 업데이트
        setMainImage({
          fileUrl: selectedAsset.uri,
          originalName: selectedAsset.fileName || "image",
          order: 0,
        });
      }
    } catch (error) {
      console.error("이미지 선택 오류:", error);
      Alert.alert("오류", "이미지를 선택하는 중 오류가 발생했습니다.");
    }
  };

  const handleUpdate = async () => {
    // validation
    const newErrors: typeof errors = {};

    if (!storeName.trim()) {
      newErrors.storeName = "가맹점명을 입력해주세요.";
    } else if (!/^[가-힣a-zA-Z0-9 ]+$/.test(storeName.trim())) {
      newErrors.storeName = "한글, 영문, 숫자, 공백만 입력 가능합니다.";
    }

    const phoneDigits = phoneNumber.replace(/[^0-9]/g, "");
    if (!phoneDigits) {
      newErrors.phoneNumber = "전화번호를 입력해주세요.";
    } else if (phoneDigits.startsWith("02") ? phoneDigits.length !== 9 : phoneDigits.length < 10 || phoneDigits.length > 11) {
      newErrors.phoneNumber = "유효한 전화번호를 입력해주세요.";
    }

    if (!address.trim()) {
      newErrors.address = "주소를 검색해주세요.";
    }

    if (!accountNumber.trim()) {
      newErrors.accountNumber = "계좌번호를 입력해주세요.";
    } else if (!/^[0-9]+$/.test(accountNumber)) {
      newErrors.accountNumber = "계좌번호는 숫자만 입력 가능합니다.";
    }

    const repPhoneDigits = representativePhone.replace(/[^0-9]/g, "");
    if (!repPhoneDigits) {
      newErrors.representativePhone = "대표 연락처를 입력해주세요.";
    } else if (repPhoneDigits.startsWith("02") ? repPhoneDigits.length !== 9 : repPhoneDigits.length < 10 || repPhoneDigits.length > 11) {
      newErrors.representativePhone = "유효한 연락처를 입력해주세요.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!bankIdx) {
      Alert.alert("알림", "은행을 선택해주세요.");
      return;
    }
    if (businessDays.length === 0) {
      Alert.alert("알림", "영업일을 선택해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      // FormData 생성
      const formData = new FormData();
      formData.append("storeNm", storeName);
      formData.append("storeTelNo", phoneNumber);
      formData.append("storeAddr", address);
      formData.append("storeAddrDetail", detailedAddress);
      formData.append("bankIdx", String(bankIdx));
      formData.append("storeAccNo", accountNumber);
      formData.append("ownerNm", initialStoreInfo?.ownerNm || "");
      formData.append("ownerTelNo", representativePhone);
      formData.append("storeOpenTime", businessOpenTime);
      formData.append("storeCloseTime", businessCloseTime);

      // 영업일 배열 추가 - 같은 이름으로 여러 번 append
      const daysToSend = businessDays.sort(
        (a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b),
      );
      daysToSend.forEach((day) => {
        formData.append("storeOpenDate", day);
      });

      // 이미지가 새로 선택된 경우(로컬 URI)에만 추가
      // 기존 서버 URL(http/https)은 MultipartFile로 전송 불가 → 제외
      if (
        mainImage &&
        mainImage.fileUrl &&
        !mainImage.fileUrl.startsWith("http")
      ) {
        const filename =
          mainImage.fileUrl.split("/").pop() || "store-image.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("mainImg", {
          uri: mainImage.fileUrl,
          type: type,
          name: filename,
        } as any);
      }

      // API 호출
      const response = await apiPutFormDataWithImage(
        `/store/app/info-modify/${storeCode}`,
        formData,
      );

      if (response.ok) {
        Alert.alert("성공", "가맹점 정보가 수정되었습니다.", [
          {
            text: "확인",
            onPress: () => {
              // storeinfo 페이지를 replace로 이동하여 강제 새로고침
              router.replace("/(store)/storeinfo");
            },
          },
        ]);
      } else {
        const error = await response.text();
        Alert.alert("오류", error || "수정 중 오류가 발생했습니다.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("수정 오류:", error);
      Alert.alert("오류", "수정 중 오류가 발생했습니다.");
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={[styles.safeAreaTop, { height: insets.top }]} />
      )}

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
          <Text style={styles.title}>정보 수정</Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <AccountInfoSection
          memberId={memberId}
          onPasswordChange={() => setPasswordModalVisible(true)}
        />

        <StoreInfoSection
          mainImage={mainImage}
          storeName={storeName}
          phoneNumber={phoneNumber}
          address={address}
          detailedAddress={detailedAddress}
          onStoreNameChange={handleStoreNameChange}
          onPhoneNumberChange={handlePhoneChange}
          onAddressChange={setAddress}
          onDetailedAddressChange={setDetailedAddress}
          onImagePick={pickImage}
          onAddressSearch={() => {
            setShowAddressSearch(true);
            setErrors((prev) => ({ ...prev, address: undefined }));
          }}
          errors={errors}
        />

        <BankInfoSection
          bankName={bankName}
          accountNumber={accountNumber}
          accountHolder={accountHolder}
          onBankSelect={() => setBankPickerVisible(true)}
          onAccountNumberChange={handleAccountNumberChange}
          accountNumberError={errors.accountNumber}
        />

        <BusinessInfoSection
          businessName={businessName}
          businessNumber={businessNumber}
          representativeName={representativeName}
          representativePhone={representativePhone}
          onRepresentativePhoneChange={handleRepresentativePhoneChange}
          representativePhoneError={errors.representativePhone}
          businessType={businessType}
          bizRegDateTime={registrationDate}
        />

        <OperatingInfoSection
          businessOpenTime={businessOpenTime}
          businessCloseTime={businessCloseTime}
          businessDays={businessDays}
          dayOrder={dayOrder}
          dayMapping={dayMapping}
          onOpenTimePick={() => openTimePicker("open")}
          onCloseTimePick={() => openTimePicker("close")}
          onToggleBusinessDay={toggleBusinessDay}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && { opacity: 0.5 }]}
            onPress={handleUpdate}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "처리 중..." : "수정 완료"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButtonSecondary}
            onPress={() => router.back()}
            disabled={isSubmitting}
          >
            <Text style={styles.backButtonSecondaryText}>이전</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.withdrawButton}
          onPress={handleWithdrawClick}
        >
          <Text style={styles.withdrawButtonText}>회원탈퇴</Text>
        </TouchableOpacity>
      </ScrollView>

      <PasswordChangeModal
        visible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
      />

      <TimePickerModal
        visible={timePickerVisible}
        type={activeTimePicker}
        currentTime={
          activeTimePicker === "open" ? businessOpenTime : businessCloseTime
        }
        businessOpenTime={businessOpenTime}
        onConfirm={handleTimeConfirm}
        onClose={() => setTimePickerVisible(false)}
      />

      <BankPickerModal
        visible={bankPickerVisible}
        banks={banks}
        selectedBankName={bankName}
        loading={banksLoading}
        onSelect={(bankIdx, bankNm) => {
          setBankIdx(bankIdx);
          setBankName(bankNm);
          setBankPickerVisible(false);
        }}
        onClose={() => setBankPickerVisible(false)}
      />

      {/* 다음 우편번호 검색 모달 */}
      <Modal
        visible={showAddressSearch}
        animationType="slide"
        onRequestClose={() => setShowAddressSearch(false)}
      >
        {insets.top > 0 && (
          <View style={{ height: insets.top, backgroundColor: "#fff" }} />
        )}
        <View style={styles.postcodeModalContent}>
          <View style={styles.postcodeModalHeader}>
            <TouchableOpacity
              style={styles.postcodeModalCloseButton}
              onPress={() => setShowAddressSearch(false)}
            >
              <Ionicons name="close" size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.postcodeModalTitle}>주소 검색</Text>
            <View style={styles.postcodeModalEmptyView} />
          </View>
          <DaumPostcode
            style={styles.postcodeStyle}
            onSelected={handleAddressSelect}
            onError={() =>
              Alert.alert("오류", "주소 검색 중 오류가 발생했습니다.")
            }
          />
        </View>
        {insets.bottom > 0 && (
          <View style={{ height: insets.bottom, backgroundColor: "#fff" }} />
        )}
      </Modal>

      {/* 회원탈퇴 비밀번호 확인 모달 */}
      <Modal
        visible={withdrawPasswordModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setWithdrawPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.withdrawPasswordModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>비밀번호 확인</Text>
            </View>

            <View style={styles.withdrawModalContent}>
              <Text style={styles.withdrawModalDescription}>
                회원 탈퇴를 위해 비밀번호를 입력해주세요.
              </Text>
              <TextInput
                style={styles.withdrawPasswordInput}
                placeholder="비밀번호"
                placeholderTextColor="#ccc"
                value={withdrawPassword}
                onChangeText={setWithdrawPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.withdrawModalButtonContainer}>
              <TouchableOpacity
                style={styles.withdrawModalSubmitButton}
                onPress={handleWithdrawPasswordSubmit}
              >
                <Text style={styles.withdrawModalSubmitButtonText}>확인</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.withdrawModalCancelButton}
                onPress={() => {
                  setWithdrawPasswordModalVisible(false);
                  setWithdrawPassword("");
                }}
              >
                <Text style={styles.withdrawModalCancelButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {insets.bottom > 0 && (
        <View style={[styles.safeAreaBottom, { height: insets.bottom }]} />
      )}
    </View>
  );
}
