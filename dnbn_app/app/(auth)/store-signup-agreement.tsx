/**
 * 스토어 회원가입 Step 0: 약관 동의 화면
 *
 * 기능:
 * - 전체 약관 동의 체크박스
 * - 개별 약관 동의 (필수 3개 + 선택 1개)
 * - 약관 상세보기 (Modal/새 스크린)
 * - 필수 약관 동의 여부 검증
 */
import { useStoreSignup } from "@/contexts/StoreSignupContext";
import { validateAgreement } from "@/utils/storeSignupValidation";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./store-signup-agreement.styles";

export default function StoreSignupAgreementScreen() {
  const { formData, updateAgreement, setCurrentStep } = useStoreSignup();
  const { agreement } = formData;

  // 전체 약관 체크 여부 (marketing 포함)
  const allChecked =
    agreement.terms &&
    agreement.privacy &&
    agreement.seller &&
    agreement.marketing;

  /**
   * 전체 약관 동의 핸들러
   */
  const handleAllCheck = (isChecked: boolean) => {
    updateAgreement({
      terms: isChecked,
      privacy: isChecked,
      seller: isChecked,
      marketing: isChecked,
    });
  };

  /**
   * 개별 약관 동의 핸들러
   */
  const handleIndividualCheck =
    (field: keyof typeof agreement) => (isChecked: boolean) => {
      updateAgreement({
        [field]: isChecked,
      });
    };

  /**
   * 다음 단계로 이동
   */
  const handleNext = () => {
    const validation = validateAgreement(agreement);
    if (!validation.isValid) {
      Alert.alert("알림", validation.message);
      return;
    }
    setCurrentStep(1);
    router.push("/store-signup-member-info" as any);
  };

  /**
   * 약관 상세보기 (추후 구현)
   */
  const handleShowTerms = (type: string) => {
    // TODO: Modal 또는 새 스크린으로 약관 상세 내용 표시
    Alert.alert("약관 상세", `${type} 약관 내용을 표시합니다.`);
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
        <Text style={styles.headerTitle}>스토어 회원가입</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 상단 안내 */}
        <View style={styles.topContent}>
          <Text style={styles.topTitle}>동네방네 회원가입</Text>
          <Text style={styles.topText}>
            동네방네에서 제공하는 모든 서비스와 혜택을 누릴 수 있어요.
          </Text>
        </View>

        {/* 전체 동의 */}
        <View style={styles.allAgreeSection}>
          <Checkbox
            value={allChecked}
            onValueChange={handleAllCheck}
            color={allChecked ? "#FF6F2B" : undefined}
            style={styles.checkbox}
          />
          <Text style={styles.allAgreeText}>약관 전체 동의</Text>
        </View>

        {/* 개별 약관 */}
        <View style={styles.agreeListSection}>
          <Text style={styles.agreeListTitle}>
            서비스 이용을 위한 동의가 필요합니다.
          </Text>

          {/* 이용약관 */}
          <View style={[styles.agreeItem, styles.agreeItemFirst]}>
            <Checkbox
              value={agreement.terms}
              onValueChange={handleIndividualCheck("terms")}
              color={agreement.terms ? "#FF6F2B" : undefined}
              style={styles.checkbox}
            />
            <Text style={styles.agreeItemText}>
              <Text style={styles.required}>[필수]</Text> 이용약관 동의
            </Text>
            <Pressable
              style={styles.arrowButton}
              onPress={() => handleShowTerms("이용약관")}
            >
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </Pressable>
          </View>

          {/* 개인정보 수집이용 동의 */}
          <View style={styles.agreeItem}>
            <Checkbox
              value={agreement.privacy}
              onValueChange={handleIndividualCheck("privacy")}
              color={agreement.privacy ? "#FF6F2B" : undefined}
              style={styles.checkbox}
            />
            <Text style={styles.agreeItemText}>
              <Text style={styles.required}>[필수]</Text> 개인정보 수집이용 동의
            </Text>
            <Pressable
              style={styles.arrowButton}
              onPress={() => handleShowTerms("개인정보 수집이용")}
            >
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </Pressable>
          </View>

          {/* 판매회원 이용약관 */}
          <View style={styles.agreeItem}>
            <Checkbox
              value={agreement.seller}
              onValueChange={handleIndividualCheck("seller")}
              color={agreement.seller ? "#FF6F2B" : undefined}
              style={styles.checkbox}
            />
            <Text style={styles.agreeItemText}>
              <Text style={styles.required}>[필수]</Text> 판매회원 이용약관 동의
            </Text>
            <Pressable
              style={styles.arrowButton}
              onPress={() => handleShowTerms("판매회원 이용약관")}
            >
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </Pressable>
          </View>

          {/* 마케팅 정보 수신 동의 */}
          <View style={[styles.agreeItem, styles.agreeItemLast]}>
            <Checkbox
              value={agreement.marketing}
              onValueChange={handleIndividualCheck("marketing")}
              color={agreement.marketing ? "#FF6F2B" : undefined}
              style={styles.checkbox}
            />
            <Text style={styles.agreeItemText}>
              [선택] 마케팅 정보 및 알림 수신 동의
            </Text>
            <Pressable
              style={styles.arrowButton}
              onPress={() => handleShowTerms("마케팅 정보 수신")}
            >
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </Pressable>
          </View>
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
    </SafeAreaView>
  );
}
