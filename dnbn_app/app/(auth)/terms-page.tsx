import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./terms-page.styles";

export default function TermsPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [allAgreed, setAllAgreed] = useState(false);
  const [ageAgreed, setAgeAgreed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);

  const handleAllAgree = () => {
    const newValue = !allAgreed;
    setAllAgreed(newValue);
    setAgeAgreed(newValue);
    setTermsAgreed(newValue);
    setPrivacyAgreed(newValue);
    setMarketingAgreed(newValue);
  };

  const handleIndividualAgree = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setter((prev) => {
      const newValue = !prev;
      // 개별 항목이 변경되면 전체 동의 상태도 체크
      setTimeout(() => {
        const allChecked =
          (setter === setAgeAgreed ? newValue : ageAgreed) &&
          (setter === setTermsAgreed ? newValue : termsAgreed) &&
          (setter === setPrivacyAgreed ? newValue : privacyAgreed) &&
          (setter === setMarketingAgreed ? newValue : marketingAgreed);
        setAllAgreed(allChecked);
      }, 0);
      return newValue;
    });
  };

  const canProceed = ageAgreed && termsAgreed && privacyAgreed;

  const handleStartButton = () => {
    // 필수 약관 검증
    if (!ageAgreed) {
      Alert.alert("알림", "만 14세 이상 동의는 필수입니다.");
      return;
    }
    if (!termsAgreed) {
      Alert.alert("알림", "서비스 이용약관 동의는 필수입니다.");
      return;
    }
    if (!privacyAgreed) {
      Alert.alert("알림", "개인정보 처리방침 동의는 필수입니다.");
      return;
    }

    // 마케팅 동의 상태를 query parameter로 전달하여 회원가입 페이지로 이동
    router.push({
      pathname: "/(auth)/signup",
      params: { marketingAgreed: marketingAgreed.toString() },
    });
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
      )}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>약관 동의</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            동네방네에 오신 것을 환영합니다
          </Text>
          <Text style={styles.descriptionText}>
            서비스 이용을 위해 약관에 동의해주세요
          </Text>
        </View>

        <View style={styles.termsSection}>
          <TouchableOpacity
            style={styles.allAgreeContainer}
            onPress={handleAllAgree}
            activeOpacity={0.7}
          >
            <View style={styles.allAgreeContent}>
              <View style={styles.allAgreeLeft}>
                <View
                  style={[styles.checkbox, allAgreed && styles.checkboxChecked]}
                >
                  {allAgreed && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>
                <Text style={styles.allAgreeText}>약관 전체 동의</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.termItemContainer}>
            <TouchableOpacity
              style={styles.termItemLeft}
              onPress={() => handleIndividualAgree(setAgeAgreed)}
              activeOpacity={0.7}
            >
              <View
                style={[styles.checkbox, ageAgreed && styles.checkboxChecked]}
              >
                {ageAgreed && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.termItemText}>만 14세 이상입니다</Text>
              <Text style={styles.requiredBadge}>(필수)</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.termItemContainer}>
            <TouchableOpacity
              style={styles.termItemLeft}
              onPress={() => handleIndividualAgree(setTermsAgreed)}
              activeOpacity={0.7}
            >
              <View
                style={[styles.checkbox, termsAgreed && styles.checkboxChecked]}
              >
                {termsAgreed && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.termItemText}>서비스 이용약관</Text>
              <Text style={styles.requiredBadge}>(필수)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.viewDetailButton}>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <View style={styles.termItemContainer}>
            <TouchableOpacity
              style={styles.termItemLeft}
              onPress={() => handleIndividualAgree(setPrivacyAgreed)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  privacyAgreed && styles.checkboxChecked,
                ]}
              >
                {privacyAgreed && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.termItemText}>개인정보 처리방침</Text>
              <Text style={styles.requiredBadge}>(필수)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.viewDetailButton}>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <View style={styles.termItemContainer}>
            <TouchableOpacity
              style={styles.termItemLeft}
              onPress={() => handleIndividualAgree(setMarketingAgreed)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  marketingAgreed && styles.checkboxChecked,
                ]}
              >
                {marketingAgreed && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.termItemText}>마케팅 정보 수신 동의</Text>
              <Text style={styles.optionalBadge}>(선택)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.viewDetailButton}>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.startButton,
            !canProceed && styles.startButtonDisabled,
          ]}
          onPress={handleStartButton}
          disabled={!canProceed}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.startButtonText,
              !canProceed && styles.startButtonTextDisabled,
            ]}
          >
            시작하기
          </Text>
        </TouchableOpacity>
      </View>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#FFFFFF" }} />
      )}
    </View>
  );
}
