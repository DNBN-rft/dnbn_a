/**
 * 스토어 회원가입 Step 4: 파일 업로드 및 최종 제출
 *
 * 기능:
 * - 가게 대표 이미지 업로드 (1장)
 * - 사업자등록증 업로드 (여러 장)
 * - expo-image-picker 사용
 * - 전체 데이터 검증
 * - API 제출
 */
import { useStoreSignup } from "@/contexts/StoreSignupContext";
import { apiPostFormDataWithImage } from "@/utils/api";
import { buildStoreSignupFormData } from "@/utils/storeSignupFormBuilder";
import { validateFileInfo } from "@/utils/storeSignupValidation";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./store-signup-file-upload.styles";

export default function StoreSignupFileUploadScreen() {
  const insets = useSafeAreaInsets();
  const { formData, updateFileUpload, resetFormData } = useStoreSignup();
  const { fileUpload, memberInfo, bizInfo, storeInfo } = formData;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  /**
   * 이미지 권한 요청
   */
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("권한 필요", "갤러리 접근 권한이 필요합니다.");
      return false;
    }
    return true;
  };

  /**
   * 가게 대표 이미지 선택
   */
  const handlePickStoreImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      updateFileUpload({
        storeImage: {
          uri: asset.uri,
          type: "image/jpeg",
          name: `store_${Date.now()}.jpg`,
        },
      });
    }
  };

  /**
   * 사업자등록증 이미지 추가
   */
  const handlePickBusinessDoc = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    if (fileUpload.businessDocs.length >= 3) {
      Alert.alert("알림", "첨부파일은 최대 3개까지 등록 가능합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const newDoc = {
        uri: asset.uri,
        type: "image/jpeg",
        name: `biz_doc_${Date.now()}.jpg`,
      };
      updateFileUpload({
        businessDocs: [...fileUpload.businessDocs, newDoc],
      });
    }
  };

  /**
   * 사업자등록증 이미지 삭제
   */
  const handleRemoveBusinessDoc = (index: number) => {
    const newDocs = fileUpload.businessDocs.filter((_, i) => i !== index);
    updateFileUpload({ businessDocs: newDocs });
  };

  /**
   * 최종 제출
   */
  const handleSubmit = async () => {
    // 전체 데이터 검증
    const allData = {
      ...memberInfo,
      ...bizInfo,
      ...storeInfo,
    };

    const validation = validateFileInfo(
      allData,
      fileUpload.storeImage,
      fileUpload.businessDocs,
    );

    if (!validation.isValid) {
      Alert.alert("알림", validation.message);
      return;
    }

    Alert.alert(
      "회원가입 제출",
      "입력하신 정보로 회원가입을 진행하시겠습니까?",
      [
        { text: "확인", onPress: submitSignup },
        { text: "취소", style: "cancel" },
      ],
    );
  };

  /**
   * 회원가입 API 제출
   */
  const submitSignup = async () => {
    setIsSubmitting(true);

    try {
      const formData = buildStoreSignupFormData(
        memberInfo,
        bizInfo,
        storeInfo,
        fileUpload,
      );

      const response = await apiPostFormDataWithImage(
        "/store/register",
        formData,
      );

      if (response.ok) {
        setIsSubmitted(true);
        Alert.alert(
          "성공",
          "회원가입이 완료되었으며, 승인 후 로그인할 수 있습니다.",
          [
            {
              text: "확인",
              onPress: () => {
                resetFormData();
                router.replace("/(auth)/login?tab=store" as any);
              },
            },
          ],
        );
      } else {
        const errorData = await response.json();
        Alert.alert("실패", errorData.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원가입 에러:", error);
      Alert.alert("오류", "회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
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
          <Text style={styles.title}>파일 업로드</Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 가게 대표 이미지 */}
        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>가게 대표 이미지</Text>
            <Text style={styles.required}> *</Text>
          </View>
          <Text style={styles.helperText}>
            가게 대표 이미지를 올려주세요. (jpg, png / 파일당 10MB 이하)
          </Text>

          {fileUpload.storeImage ? (
            <View style={styles.imagePreview}>
              <Image
                source={{ uri: fileUpload.storeImage.uri }}
                style={styles.previewImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => updateFileUpload({ storeImage: null })}
              >
                <Ionicons name="close-circle" size={28} color="#ff3b30" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handlePickStoreImage}
            >
              <Ionicons name="camera-outline" size={32} color="#999" />
              <Text style={styles.uploadButtonText}>이미지 선택</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 사업자등록증 */}
        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>사업자등록증, 영업신고증, 통장사본</Text>
            <Text style={styles.required}> *</Text>
          </View>
          <Text style={styles.helperText}>
            사업자 증명, 영업신고증, 통장사본을 올려주세요. (jpg, png / 파일당
            10MB 이하)
          </Text>

          {fileUpload.businessDocs.length > 0 && (
            <View style={styles.docGrid}>
              {fileUpload.businessDocs.map((doc, index) => (
                <View key={index} style={styles.docItem}>
                  <Image
                    source={{ uri: doc.uri }}
                    style={styles.docImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={styles.removeDocButton}
                    onPress={() => handleRemoveBusinessDoc(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#ff3b30" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {fileUpload.businessDocs.length < 3 && (
            <TouchableOpacity
              style={styles.addDocButton}
              onPress={handlePickBusinessDoc}
            >
              <Ionicons name="add-circle-outline" size={24} color="#FF6F2B" />
              <Text style={styles.addDocButtonText}>
                파일찾기 ({fileUpload.businessDocs.length}/3)
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomButton}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (isSubmitting || isSubmitted) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting || isSubmitted}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>회원가입</Text>
          )}
        </TouchableOpacity>
      </View>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
