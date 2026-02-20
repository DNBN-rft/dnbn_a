import { apiPost, apiPut } from "@/utils/api";
import Postcode from "@actbase/react-daum-postcode";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./address-select.styles";

export default function AddressSelectScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    locationIdx?: string;
    label?: string;
    address?: string;
    isSelected?: string;
  }>();

  const isEditMode = !!params.locationIdx;

  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addressLabel, setAddressLabel] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const [custCode, setCustCode] = useState("");
  const [isInitialSetup, setIsInitialSetup] = useState(false);

  useEffect(() => {
    const fetchCustCode = async () => {
      let code = "";
      if (Platform.OS === "web") {
        code = localStorage.getItem("custCode") || "";
      } else {
        code = (await SecureStore.getItemAsync("custCode")) || "";
      }
      setCustCode(code);
    };

    fetchCustCode();
  }, []);

  // 최초 설정인지 확인 및 알림
  useEffect(() => {
    const checkInitialSetup = async () => {
      if (!isEditMode) {
        let hasLocation = false;
        if (Platform.OS === "web") {
          hasLocation = localStorage.getItem("hasLocation") === "true";
        } else {
          const value = await SecureStore.getItemAsync("hasLocation");
          hasLocation = value === "true";
        }

        if (!hasLocation) {
          setIsInitialSetup(true);
          if (Platform.OS === "web") {
            window.alert("주소 정보가 없어요 기본 주소지를 설정해주세요");
          } else {
            Alert.alert(
              "알림",
              "주소 정보가 없어요 기본 주소지를 설정해주세요",
            );
          }
        }
      }
    };

    checkInitialSetup();
  }, [isEditMode]);

  // 하드웨어 뒤로가기 버튼 처리
  useEffect(() => {
    if (!isInitialSetup) return;

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleBack();
        return true; // 기본 동작 방지
      },
    );

    return () => backHandler.remove();
  }, [isInitialSetup]);

  // 수정 모드일 경우 기존 데이터로 초기화
  useEffect(() => {
    if (isEditMode) {
      setAddressLabel(params.label || "");
      setSelectedAddress(params.address || "");
      setIsSelected(params.isSelected === "true");
    }
  }, [isEditMode, params.label, params.address, params.isSelected]);

  // 주소 검색 모달 열기
  const handleOpenAddressSearch = useCallback(() => {
    setShowAddressSearch(true);
  }, []);

  // 주소 선택 처리
  const handleAddressSelect = useCallback((data: any) => {
    const address = data.roadAddress || data.address;
    setSelectedAddress(address);
    setShowAddressSearch(false);
  }, []);

  // 주소 저장 또는 수정
  const handleSaveAddress = useCallback(async () => {
    if (!selectedAddress) {
      if (Platform.OS === "web") {
        window.alert("주소를 검색해주세요.");
      } else {
        Alert.alert("알림", "주소를 검색해주세요.");
      }
      return;
    }
    if (!addressLabel.trim()) {
      if (Platform.OS === "web") {
        window.alert("주소 별칭을 입력해주세요.");
      } else {
        Alert.alert("알림", "주소 별칭을 입력해주세요.");
      }
      return;
    }

    try {
      const addressData = {
        custCode: custCode,
        label: addressLabel,
        address: selectedAddress,
        isSelected: isSelected,
        ...(isEditMode && { locationIdx: params.locationIdx }),
      };

      const endpoint = isEditMode ? `/cust/location/mod` : `/cust/location/set`;

      const response = isEditMode
        ? await apiPut(endpoint, addressData)
        : await apiPost(endpoint, addressData);

      if (response.ok) {
        const result = await response.json();
        if (result) {
          const successMessage = isEditMode
            ? "주소 수정이 완료되었습니다."
            : "주소 저장이 완료되었습니다.";

          // 로그인 후 첫 주소 등록인지 확인
          let hasActCategory = false;
          if (Platform.OS === "web") {
            hasActCategory = localStorage.getItem("hasActCategory") === "true";
          } else {
            const value = await SecureStore.getItemAsync("hasActCategory");
            hasActCategory = value === "true";
          }

          if (Platform.OS === "web") {
            window.alert(successMessage);
            // 카테고리가 설정되지 않았으면 카테고리 설정 페이지로
            if (!hasActCategory && !isEditMode) {
              router.replace("/(cust)/category");
            } else {
              router.replace("/(cust)/address");
            }
          } else {
            Alert.alert("성공", successMessage, [
              {
                text: "확인",
                onPress: () => {
                  // 카테고리가 설정되지 않았으면 카테고리 설정 페이지로
                  if (!hasActCategory && !isEditMode) {
                    router.replace("/(cust)/category");
                  } else {
                    router.replace("/(cust)/address");
                  }
                },
              },
            ]);
          }
        }
      } else {
        const errorData = await response.json();
        const errorMessage = isEditMode
          ? "주소 수정에 실패했습니다."
          : "주소 저장에 실패했습니다.";

        if (Platform.OS === "web") {
          window.alert(errorData.message || errorMessage);
        } else {
          Alert.alert("오류", errorData.message || errorMessage);
        }
      }
    } catch (error) {
      console.error("주소 저장 오류:", error);
      const errorMessage = isEditMode
        ? "주소 수정 중 오류가 발생했습니다."
        : "주소 저장 중 오류가 발생했습니다.";

      if (Platform.OS === "web") {
        window.alert(errorMessage);
      } else {
        Alert.alert("오류", errorMessage);
      }
    }
  }, [
    custCode,
    selectedAddress,
    addressLabel,
    isSelected,
    isEditMode,
    params.locationIdx,
  ]);

  const handleBack = useCallback(() => {
    if (isInitialSetup) {
      // 최초 설정 중일 때 경고
      if (Platform.OS === "web") {
        const confirmLogout = window.confirm(
          "기본 설정을 완료해야 서비스 이용이 가능합니다.\n\n로그아웃하시겠습니까?",
        );
        if (confirmLogout) {
          // 로그아웃 처리
          localStorage.removeItem("custCode");
          localStorage.removeItem("hasLocation");
          localStorage.removeItem("hasActCategory");
          router.replace("/(auth)/login");
        }
      } else {
        Alert.alert("알림", "기본 설정을 완료해야 서비스 이용이 가능합니다.", [
          {
            text: "계속",
            style: "cancel",
          },
          {
            text: "로그아웃",
            onPress: async () => {
              // 로그아웃 처리
              await SecureStore.deleteItemAsync("custCode");
              await SecureStore.deleteItemAsync("hasLocation");
              await SecureStore.deleteItemAsync("hasActCategory");
              router.replace("/(auth)/login");
            },
          },
        ]);
      }
    } else {
      router.back();
    }
  }, [isInitialSetup]);

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
      )}

      <View style={styles.header}>
        <View style={styles.leftSection}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.centerSection}>
          <Text style={styles.title}>
            {isEditMode ? "주소 수정" : "새 주소 추가"}
          </Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -insets.bottom}
      >
        <ScrollView style={styles.content}>
          {/* 주소 별칭 입력 */}
          <View style={styles.section}>
            <Text style={styles.label}>주소 별칭 *</Text>
            <TextInput
              style={styles.input}
              placeholder="예: 집, 회사, 학교"
              placeholderTextColor="#999"
              value={addressLabel}
              onChangeText={setAddressLabel}
            />
          </View>

          {/* 주소 검색 */}
          <View style={styles.section}>
            <Text style={styles.label}>주소 *</Text>
            <Pressable
              style={styles.addressInputContainer}
              onPress={handleOpenAddressSearch}
            >
              <Text
                style={[
                  styles.addressInputText,
                  !selectedAddress && styles.addressInputPlaceholder,
                ]}
              >
                {selectedAddress || "주소를 검색해주세요"}
              </Text>
              <Ionicons name="search" size={20} color="#666" />
            </Pressable>
          </View>

          {/* 기본 배송지 설정 */}
          <View style={styles.section}>
            <Pressable
              style={styles.checkboxContainer}
              onPress={() => setIsSelected(!isSelected)}
            >
              <Ionicons
                name={isSelected ? "checkbox" : "square-outline"}
                size={24}
                color={isSelected ? "#EF7810" : "#999"}
              />
              <Text style={styles.checkboxLabel}>기본 주소지로 설정</Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* 하단 버튼 */}
        <View style={styles.bottomButtonContainer}>
          {isInitialSetup && (
            <Text style={styles.infoText}>
              현재 주소가 기본 주소지로 설정됩니다
            </Text>
          )}
          <Pressable
            style={[
              styles.saveButton,
              (!selectedAddress || !addressLabel.trim()) &&
                styles.saveButtonDisabled,
            ]}
            onPress={handleSaveAddress}
            disabled={!selectedAddress || !addressLabel.trim()}
          >
            <Text style={styles.saveButtonText}>저장하기</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      {/* 주소 검색 모달 */}
      <Modal
        visible={showAddressSearch}
        animationType="slide"
        onRequestClose={() => setShowAddressSearch(false)}
      >
        {insets.top > 0 && (
          <View style={{ height: insets.top, backgroundColor: "#fff" }} />
        )}
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowAddressSearch(false)}
            >
              <Ionicons name="close" size={28} color="#000" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>주소 검색</Text>

            <View style={styles.modalEmptyView} />
          </View>

          <Postcode
            style={styles.postcodeStyle}
            onSelected={handleAddressSelect}
            onError={(error) => {
              Alert.alert("오류", "주소 검색 중 오류가 발생했습니다.");
            }}
          />
        </View>
      </Modal>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
