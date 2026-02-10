import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import { apiGet, apiPutFormDataWithImage } from "@/utils/api";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from "react-native";
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
  bizRegDate: string;

  storeOpenDate: Array<string>;
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
        let name: string | null = null;
        let storedStoreCode: string | null = null;

        if (Platform.OS === "web") {
          name = localStorage.getItem("memberId");
          storedStoreCode = localStorage.getItem("storeCode");
        } else {
          name = await SecureStore.getItemAsync("memberId");
          storedStoreCode = await SecureStore.getItemAsync("storeCode");
        }

        if (name) {
          setMemberId(name);
        }

        if (storedStoreCode) {
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
  const [phoneNumber, setPhoneNumber] = useState(initialStoreInfo?.storeTelNo || "");
  const [address, setAddress] = useState(initialStoreInfo?.storeAddr || "");
  const [detailedAddress, setDetailedAddress] = useState(initialStoreInfo?.storeAddrDetail || "");
  const [bankName, setBankName] = useState(initialStoreInfo?.bankNm || "");
  const [bankIdx, setBankIdx] = useState<number | null>(initialStoreInfo?.bankIdx || null);
  const [accountNumber, setAccountNumber] = useState(initialStoreInfo?.storeAccNo || "");
  const [businessOpenTime, setBusinessOpenTime] = useState(
    initialStoreInfo?.storeOpenTime || "09:00"
  );
  const [businessCloseTime, setBusinessCloseTime] = useState(
    initialStoreInfo?.storeCloseTime || "21:00"
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
    "월": "MON",
    "화": "TUE",
    "수": "WED",
    "목": "THU",
    "금": "FRI",
    "토": "SAT",
    "일": "SUN",
  };
  
  // 초기 영업일 처리
  const getInitialBusinessDays = () => {
    if (initialStoreInfo?.storeOpenDate && initialStoreInfo.storeOpenDate.length > 0) {
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
  
  const [businessDays, setBusinessDays] = useState<string[]>(getInitialBusinessDays());
  const [mainImage, setMainImage] = useState<any>(initialStoreInfo?.mainImg || null);

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
          const bankList = Array.isArray(data) ? data : (data.data || []);
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

  // Time picker 모달 관련 state
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [activeTimePicker, setActiveTimePicker] = useState<"open" | "close" | null>(null);
  const [selectedHour, setSelectedHour] = useState("09");
  const [selectedMinute, setSelectedMinute] = useState("00");

  // 비밀번호 변경 모달
  const [passwordModalStep, setPasswordModalStep] = useState<
    "none" | "verify" | "change" | "result"
  >("none");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(true);

  // 읽기 전용 정보 (initialStoreInfo에서 가져옴)
  const accountHolder = initialStoreInfo?.ownerNm || "";
  const businessName = initialStoreInfo?.bizNm || "";
  const businessNumber = initialStoreInfo?.bizNo || "";
  const representativeName = initialStoreInfo?.ownerNm || "";
  const representativePhone = initialStoreInfo?.ownerTelNo || "";
  const businessType = initialStoreInfo?.storeType || "";
  const registrationDate = initialStoreInfo?.bizRegDate || "";

  const handleVerifyPassword = () => {
    // TODO: 실제 API로 현재 비밀번호 검증
    if (currentPassword === "") {
      alert("현재 비밀밀번호를 입력하세요.");
      return;
    }
    // 검증 성공 가정
    setPasswordModalStep("change");
  };

  const handleChangePassword = () => {
    if (newPassword === "" || confirmPassword === "") {
      alert("새 비밀번호를 입력하세요.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("새 비밀밀번호가 일치하지 않습니다.");
      return;
    }

    // TODO: 실제 API로 비밀번호 변경
    console.log("비밀번호 변경:", { currentPassword, newPassword });

    // 변경 성공 가정
    setPasswordChangeSuccess(true);
    setPasswordModalStep("result");
  };

  const closePasswordModal = () => {
    setPasswordModalStep("none");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordChangeSuccess(false);
  };

  const openTimePicker = (type: "open" | "close") => {
    const timeStr = type === "open" ? businessOpenTime : businessCloseTime;
    const [hour, minute] = timeStr.split(":");
    setSelectedHour(hour);
    setSelectedMinute(minute);
    setActiveTimePicker(type);
    setTimePickerVisible(true);
  };

  const closeTimePicker = () => {
    setTimePickerVisible(false);
    setActiveTimePicker(null);
  };

  const confirmTimePicker = () => {
    const timeStr = `${selectedHour}:${selectedMinute}`;
    if (activeTimePicker === "open") {
      setBusinessOpenTime(timeStr);
    } else if (activeTimePicker === "close") {
      // 마감시간이 오픈시간보다 늦은지 확인
      const [openHour, openMinute] = businessOpenTime.split(":").map(Number);
      const closeHourNum = parseInt(selectedHour);
      const closeMinuteNum = parseInt(selectedMinute);
      
      if (closeHourNum < openHour || (closeHourNum === openHour && closeMinuteNum < openMinute)) {
        Alert.alert("알림", "마감 시간은 오픈 시간 이후로 설정해주세요.");
        return;
      }
      setBusinessCloseTime(timeStr);
    }
    closeTimePicker();
  };

  const toggleBusinessDay = (day: string) => {
    setBusinessDays(
      businessDays.includes(day)
        ? businessDays.filter((d) => d !== day)
        : [...businessDays, day].sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b))
    );
  };

  const selectBank = (bankIdx: number, bankNm: string) => {
    setBankIdx(bankIdx);
    setBankName(bankNm);
    setBankPickerVisible(false);
  };

  const pickImage = async () => {
    try {
      // 카메라와 라이브러리 접근 권한 요청
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
    // 필수 값 검증
    if (!storeName.trim()) {
      Alert.alert("알림", "가맹점명을 입력해주세요.");
      return;
    }
    if (!bankIdx) {
      Alert.alert("알림", "은행을 선택해주세요.");
      return;
    }
    if (!accountNumber.trim()) {
      Alert.alert("알림", "계좌번호를 입력해주세요.");
      return;
    }
    if (businessDays.length === 0) {
      Alert.alert("알림", "영업일을 선택해주세요.");
      return;
    }

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
      formData.append("storeOpenTime", businessOpenTime);
      formData.append("storeCloseTime", businessCloseTime);
      
      // 영업일 배열 추가 - 같은 이름으로 여러 번 append
      const daysToSend = businessDays.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
      daysToSend.forEach((day) => {
        formData.append("storeOpenDate", day);
      });

      // 이미지가 새로 선택된 경우 추가
      if (mainImage && mainImage.fileUrl) {
        const filename = mainImage.fileUrl.split("/").pop() || "store-image.jpg";
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
        `/store/info-modify/${storeCode}`,
        formData
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
      }
    } catch (error) {
      console.error("수정 오류:", error);
      Alert.alert("오류", "수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={[styles.safeAreaTop, { height: insets.top }]} />
      )}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>가맹점 정보 수정</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-circle" size={22} color="#EF7810" />
            <Text style={styles.sectionTitle}>계정 정보</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>계정 아이디</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={memberId || ""}
              editable={false}
            />
            <Text style={styles.helpText}>아이디는 변경할 수 없습니다</Text>
          </View>

          <TouchableOpacity
            style={styles.passwordChangeButton}
            onPress={() => setPasswordModalStep("verify")}
          >
            <Ionicons name="lock-closed" size={18} color="#EF7810" />
            <Text style={styles.passwordChangeButtonText}>비밀번호 변경</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="storefront" size={22} color="#EF7810" />
            <Text style={styles.sectionTitle}>가맹점 정보</Text>
          </View>

          {mainImage && mainImage.fileUrl && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>가맹점 대표 이미지</Text>
              <TouchableOpacity
                onPress={pickImage}
                style={styles.imagePickerContainer}
              >
                <Image
                  source={{ uri: mainImage.fileUrl }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
                <View style={styles.imageCameraButton}>
                  <Ionicons name="camera" size={18} color="#fff" />
                </View>
              </TouchableOpacity>
              <Text style={styles.imageChangedText}>
                이미지를 탭하여 변경할 수 있습니다
              </Text>
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.label}>가맹점명</Text>
            <TextInput
              style={styles.input}
              placeholder="가맹점명을 입력하세요"
              value={storeName}
              onChangeText={setStoreName}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>전화번호</Text>
            <TextInput
              style={styles.input}
              placeholder="전화번호를 입력하세요"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>주소</Text>
            <TextInput
              style={styles.input}
              placeholder="주소를 입력하세요"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>상세 주소</Text>
            <TextInput
              style={styles.input}
              placeholder="상세 주소를 입력하세요"
              value={detailedAddress}
              onChangeText={setDetailedAddress}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="card" size={22} color="#EF7810" />
            <Text style={styles.sectionTitle}>계좌 정보</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>은행명</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setBankPickerVisible(true)}
            >
              <Text style={[bankName ? styles.selectableInput : styles.selectableInputPlaceholder]}>
                {bankName || "은행을 선택하세요"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>계좌번호</Text>
            <TextInput
              style={styles.input}
              placeholder="계좌번호를 입력하세요"
              value={accountNumber}
              onChangeText={setAccountNumber}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>예금주</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={accountHolder}
              editable={false}
            />
            <Text style={styles.helpText}>예금주는 변경할 수 없습니다</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={22} color="#999" />
            <Text style={[styles.sectionTitle, styles.disabledTitle]}>
              사업자 정보
            </Text>
          </View>
          <Text style={styles.sectionDescription}>
            사업자 정보는 변경할 수 없습니다
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>사업자명</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={businessName}
              editable={false}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>사업자등록번호</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={businessNumber}
              editable={false}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>대표자명</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={representativeName}
              editable={false}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>대표 연락처</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={representativePhone}
              editable={false}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>업태</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={businessType}
              editable={false}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>사업자 등록일</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={registrationDate}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={22} color="#EF7810" />
            <Text style={styles.sectionTitle}>운영 정보</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>오픈 시간</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => openTimePicker("open")}
            >
              <Text style={[businessOpenTime ? styles.selectableInput : styles.selectableInputPlaceholder]}>
                {businessOpenTime}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>마감 시간</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => openTimePicker("close")}
            >
              <Text style={[businessCloseTime ? styles.selectableInput : styles.selectableInputPlaceholder]}>
                {businessCloseTime}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>영업일</Text>
            <View style={styles.businessDayContainer}>
              {dayOrder.map((day) => (
                <TouchableOpacity
                  key={day}
                  onPress={() => toggleBusinessDay(day)}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 6,
                    borderWidth: 1.5,
                    borderColor: businessDays.includes(day) ? "#EF7810" : "#ddd",
                    backgroundColor: businessDays.includes(day) ? "#FFF0E0" : "#fff",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: businessDays.includes(day) ? "600" : "500",
                      color: businessDays.includes(day) ? "#EF7810" : "#666",
                    }}
                  >
                    {dayMapping[day]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
          <Text style={styles.submitButtonText}>수정 완료</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={passwordModalStep !== "none"}
        transparent={true}
        animationType="fade"
        onRequestClose={closePasswordModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {passwordModalStep === "verify" && (
              <>
                <View style={styles.modalHeader}>
                  <Ionicons name="lock-closed" size={28} color="#EF7810" />
                  <Text style={styles.modalTitle}>비밀번호 확인</Text>
                </View>

                <Text style={styles.modalDescription}>
                  비밀번호 변경을 위해 현재 비밀번호를 입력해주세요
                </Text>

                <View style={styles.modalInputGroup}>
                  <Text style={styles.modalLabel}>현재 비밀번호</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="현재 비밀번호를 입력하세요"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry
                    autoFocus
                  />
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalConfirmButton}
                    onPress={handleVerifyPassword}
                  >
                    <Text style={styles.modalConfirmButtonText}>확인</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={closePasswordModal}
                  >
                    <Text style={styles.modalCancelButtonText}>취소</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {passwordModalStep === "change" && (
              <>
                <View style={styles.modalHeader}>
                  <Ionicons name="key" size={28} color="#EF7810" />
                  <Text style={styles.modalTitle}>새 비밀번호 설정</Text>
                </View>

                <Text style={styles.modalDescription}>
                  새로운 비밀번호를 입력해주세요
                </Text>

                <View style={styles.modalInputGroup}>
                  <Text style={styles.modalLabel}>새 비밀번호</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="새 비밀번호를 입력하세요"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    autoFocus
                  />
                </View>

                <View style={styles.modalInputGroup}>
                  <Text style={styles.modalLabel}>새 비밀번호 확인</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="새 비밀번호를 다시 입력하세요"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalConfirmButton}
                    onPress={handleChangePassword}
                  >
                    <Text style={styles.modalConfirmButtonText}>변경</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={closePasswordModal}
                  >
                    <Text style={styles.modalCancelButtonText}>취소</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {passwordModalStep === "result" && (
              <>
                <View style={styles.modalHeader}>
                  <Ionicons
                    name={
                      passwordChangeSuccess
                        ? "checkmark-circle"
                        : "close-circle"
                    }
                    size={48}
                    color={passwordChangeSuccess ? "#ef7810" : "#ef4444"}
                  />
                </View>

                <Text style={styles.modalResultTitle}>
                  {passwordChangeSuccess
                    ? "비밀번호 변경 완료"
                    : "비밀번호 변경 실패"}
                </Text>

                <Text style={styles.modalDescription}>
                  {passwordChangeSuccess
                    ? "비밀번호가 성공적으로 변경되었습니다."
                    : "비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요."}
                </Text>

                <TouchableOpacity
                  style={styles.modalSingleButton}
                  onPress={closePasswordModal}
                >
                  <Text style={styles.modalSingleButtonText}>확인</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal
        visible={timePickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeTimePicker}
      >
        <View style={styles.timePickerModalOverlay}>
          <View style={styles.timePickerModalContent}>
            <View style={styles.timePickerModalHeader}>
              <Text style={styles.timePickerModalTitle}>
                {activeTimePicker === "open" ? "오픈 시간" : "마감 시간"}을 선택하세요
              </Text>
              <Text style={{ fontSize: 32, fontWeight: "bold", color: "#EF7810" }}>
                {selectedHour}:{selectedMinute}
              </Text>
            </View>

            <View style={styles.timePickerContainer}>
              {/* Hour Picker */}
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 10, color: "#666" }}>
                  시간
                </Text>
                <ScrollView
                  style={{ maxHeight: 200, borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 8 }}
                  scrollEventThrottle={16}
                >
                  {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")).map((hour) => {
                    const isDisabled = activeTimePicker === "close" && 
                      parseInt(hour) < parseInt(businessOpenTime.split(":")[0]);
                    return (
                      <TouchableOpacity
                        key={hour}
                        onPress={() => !isDisabled && setSelectedHour(hour)}
                        disabled={isDisabled}
                        style={{
                          paddingVertical: 12,
                          paddingHorizontal: 16,
                          backgroundColor: selectedHour === hour ? "#FFF0E0" : "#fff",
                          borderBottomWidth: 1,
                          borderBottomColor: "#f0f0f0",
                          opacity: isDisabled ? 0.5 : 1,
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            fontSize: 16,
                            fontWeight: selectedHour === hour ? "600" : "400",
                            color: selectedHour === hour ? "#EF7810" : isDisabled ? "#ccc" : "#000",
                          }}
                        >
                          {hour}:00
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Minute Picker */}
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 10, color: "#666" }}>
                  분
                </Text>
                <ScrollView
                  style={{ maxHeight: 200, borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 8 }}
                  scrollEventThrottle={16}
                >
                  {["00", "30"].map((minute) => {
                    const openHour = parseInt(businessOpenTime.split(":")[0]);
                    const openMinute = parseInt(businessOpenTime.split(":")[1]);
                    const isDisabled = activeTimePicker === "close" && 
                      parseInt(selectedHour) === openHour && 
                      parseInt(minute) < openMinute;
                    return (
                      <TouchableOpacity
                        key={minute}
                        onPress={() => !isDisabled && setSelectedMinute(minute)}
                        disabled={isDisabled}
                        style={{
                          paddingVertical: 12,
                          paddingHorizontal: 16,
                          backgroundColor: selectedMinute === minute ? "#FFF0E0" : "#fff",
                          borderBottomWidth: 1,
                          borderBottomColor: "#f0f0f0",
                          opacity: isDisabled ? 0.5 : 1,
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            fontSize: 16,
                            fontWeight: selectedMinute === minute ? "600" : "400",
                            color: selectedMinute === minute ? "#EF7810" : isDisabled ? "#ccc" : "#000",
                          }}
                        >
                          :{minute}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.timePickerButtonGroup}>
              <TouchableOpacity
                style={[styles.modalCancelButton, { flex: 1 }]}
                onPress={closeTimePicker}
              >
                <Text style={styles.modalCancelButtonText}>
                  취소
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSingleButton, { flex: 1 }]}
                onPress={confirmTimePicker}
              >
                <Text style={{ fontSize: 16, fontWeight: "600", color: "#fff" }}>
                  확인
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bank Picker Modal */}
      <Modal
        visible={bankPickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setBankPickerVisible(false)}
      >
        <View style={styles.bankPickerModalOverlay}>
          <View style={styles.bankPickerModalContent}>
            <View style={styles.bankPickerModalHeader}>
              <Text style={styles.bankPickerModalTitle}>은행 선택</Text>
            </View>

            <ScrollView style={{ paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
              {banksLoading ? (
                <View style={{ paddingVertical: 40, justifyContent: "center", alignItems: "center" }}>
                  <Text style={{ color: "#999" }}>은행 목록을 불러오는 중입니다...</Text>
                </View>
              ) : banks.length > 0 ? (
                banks.map((bank) => (
                  <TouchableOpacity
                    key={bank.bankIdx}
                    onPress={() => selectBank(bank.bankIdx, bank.bankNm)}
                    style={[
                      styles.bankPickerItem,
                      bankName === bank.bankNm ? styles.bankPickerItemActive : styles.bankPickerItemInactive,
                    ]}
                  >
                    <View style={styles.bankPickerItemRow}>
                      <Text
                        style={[
                          styles.bankPickerItemText,
                          bankName === bank.bankNm ? styles.bankPickerItemTextActive : styles.bankPickerItemTextInactive,
                        ]}
                      >
                        {bank.bankNm}
                      </Text>
                      {bankName === bank.bankNm && (
                        <Ionicons name="checkmark-circle" size={20} color="#EF7810" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={{ paddingVertical: 40, justifyContent: "center", alignItems: "center" }}>
                  <Text style={{ color: "#999" }}>사용 가능한 은행이 없습니다.</Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.bankPickerModalFooter}>
              <TouchableOpacity
                style={styles.bankPickerCloseButton}
                onPress={() => setBankPickerVisible(false)}
              >
                <Text style={styles.bankPickerCloseButtonText}>
                  닫기
                </Text>
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

