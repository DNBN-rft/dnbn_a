import { useStoreSignup } from "@/contexts/StoreSignupContext";
import { validateAgreement } from "@/utils/storeSignupValidation";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TermsModal from "../../components/modal/TermsModal";
import { styles } from "./store-terms-page.styles";

export default function StoreSignupAgreementScreen() {
  const insets = useSafeAreaInsets();
  const { formData, updateAgreement, setCurrentStep } = useStoreSignup();
  const { agreement } = formData;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTerms, setSelectedTerms] = useState<{
    title: string;
    htmlPath: string;
  } | null>(null);

  const allChecked =
    agreement.terms && agreement.privacy && agreement.marketing;

  const handleAllAgree = () => {
    const newValue = !allChecked;
    updateAgreement({
      terms: newValue,
      privacy: newValue,
      marketing: newValue,
    });
  };

  const handleIndividualAgree = (field: keyof typeof agreement) => {
    updateAgreement({
      [field]: !agreement[field],
    });
  };

  const handleNext = () => {
    const validation = validateAgreement(agreement);
    if (!validation.isValid) {
      Alert.alert("알림", validation.message);
      return;
    }
    setCurrentStep(1);
    router.push("/store-signup-member-info" as any);
  };

  const handleViewTerms = (title: string, htmlPath: string) => {
    setSelectedTerms({ title, htmlPath });
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTerms(null);
  };

  const canProceed = agreement.terms && agreement.privacy;

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff" }} />
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
          <Text style={styles.title}>약관 동의</Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>회원가입</Text>
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
                  style={[
                    styles.checkbox,
                    allChecked && styles.checkboxChecked,
                  ]}
                >
                  {allChecked && (
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
              onPress={() => handleIndividualAgree("terms")}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  agreement.terms && styles.checkboxChecked,
                ]}
              >
                {agreement.terms && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.termItemText}>서비스 이용약관</Text>
              <Text style={styles.requiredBadge}>(필수)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.viewDetailButton}
              onPress={() =>
                handleViewTerms(
                  "서비스 이용약관",
                  "동네방네_서비스_통합_정책_가이드라인_V1.html",
                )
              }
            >
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <View style={styles.termItemContainer}>
            <TouchableOpacity
              style={styles.termItemLeft}
              onPress={() => handleIndividualAgree("privacy")}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  agreement.privacy && styles.checkboxChecked,
                ]}
              >
                {agreement.privacy && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.termItemText}>개인정보 처리방침</Text>
              <Text style={styles.requiredBadge}>(필수)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.viewDetailButton}
              onPress={() =>
                handleViewTerms(
                  "개인정보 처리방침",
                  "동네방네_가맹점_개인정보_처리방침_V2.html",
                )
              }
            >
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <View style={styles.termItemContainer}>
            <TouchableOpacity
              style={styles.termItemLeft}
              onPress={() => handleIndividualAgree("marketing")}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  agreement.marketing && styles.checkboxChecked,
                ]}
              >
                {agreement.marketing && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.termItemText}>마케팅 정보 수신 동의</Text>
              <Text style={styles.optionalBadge}>(선택)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.viewDetailButton}
              onPress={() =>
                handleViewTerms(
                  "마케팅 정보 수신 동의",
                  "동네방네_마케팅_수신_동의_약관_V1.html",
                )
              }
            >
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
          onPress={handleNext}
          disabled={!canProceed}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.startButtonText,
              !canProceed && styles.startButtonTextDisabled,
            ]}
          >
            다음
          </Text>
        </TouchableOpacity>
      </View>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}

      {selectedTerms && (
        <TermsModal
          visible={modalVisible}
          onClose={handleCloseModal}
          title={selectedTerms.title}
          htmlPath={selectedTerms.htmlPath}
        />
      )}
    </View>
  );
}
