import { apiPostFormDataWithImage } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./questionreg.styles";

type QuestionType = "QR" | "PAYMENT" | "REFUND" | "MOD_REQUEST" | "ETC";

export default function NoticeDetailScreen() {
  const insets = useSafeAreaInsets();
  const [questionTypeModalVisible, setQuestionTypeModalVisible] =
    useState(false);
  const [selectedQuestionType, setSelectedQuestionType] =
    useState<string>("문의유형 선택");
  const [selectedQuestionTypeValue, setSelectedQuestionTypeValue] =
    useState<QuestionType | null>(null);
  const [questionTitle, setQuestionTitle] = useState<string>("");
  const [questionContent, setQuestionContent] = useState<string>("");
  const [questionFiles, setQuestionFiles] = useState<string[]>([]);

  // 이미지 선택 함수
  const pickImage = async () => {
    // 이미 3개 선택된 경우
    if (questionFiles.length >= 3) {
      Alert.alert("알림", "최대 3개까지 첨부 가능합니다.");
      return;
    }

    // 권한 요청
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("알림", "갤러리 접근 권한이 필요합니다.");
      return;
    }

    // 이미지 선택
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setQuestionFiles([...questionFiles, result.assets[0].uri]);
    }
  };

  // 이미지 삭제 함수
  const removeImage = (index: number) => {
    setQuestionFiles(questionFiles.filter((_, i) => i !== index));
  };

  // 문의 등록 및 이미지 업로드 함수
  const submitQuestion = async () => {
    // 유효성 검사
    if (!selectedQuestionTypeValue) {
      Alert.alert("알림", "문의유형을 선택해주세요.");
      return;
    }
    if (!questionTitle.trim()) {
      Alert.alert("알림", "제목을 입력해주세요.");
      return;
    }
    if (!questionContent.trim()) {
      Alert.alert("알림", "내용을 입력해주세요.");
      return;
    }

    try {
      const formData = new FormData();

      // 문의 정보 추가
      formData.append("custCode", "CUST_001");
      formData.append("questionRequestType", selectedQuestionTypeValue);
      formData.append("questionTitle", questionTitle);
      formData.append("questionContent", questionContent);

      // 이미지 파일들 추가
      for (let i = 0; i < questionFiles.length; i++) {
        const imageUri = questionFiles[i];

        // 파일명 생성 (확장자 포함)
        let filename =
          imageUri.split("/").pop() || `question_${Date.now()}_${i}.jpg`;

        // 확장자 확인 및 MIME 타입 설정
        const fileExtension = filename.toLowerCase().split(".").pop();
        let mimeType = "image/jpeg";

        if (fileExtension === "png") {
          mimeType = "image/png";
        } else if (fileExtension === "jpg" || fileExtension === "jpeg") {
          mimeType = "image/jpeg";
        } else {
          // 확장자가 없거나 이상한 경우 기본값 설정
          filename = `question_${Date.now()}_${i}.jpg`;
          mimeType = "image/jpeg";
        }

        // 웹과 네이티브 환경에 따라 다르게 처리
        if (Platform.OS === "web") {
          // 웹: Blob으로 변환하여 전송
          const response = await fetch(imageUri);
          const blob = await response.blob();
          const typedBlob = new Blob([blob], { type: mimeType });
          formData.append("questionFiles", typedBlob as any, filename);
        } else {
          // 네이티브: URI를 직접 FormData에 추가
          formData.append("questionFiles", {
            uri: imageUri,
            type: mimeType,
            name: filename,
          } as any);
        }
      }

      const response = await apiPostFormDataWithImage(
        "/cust/question",
        formData,
      );

      if (response.ok) {
        // 웹 환경에서는 window.alert 사용
        if (Platform.OS === "web") {
          window.alert("문의가 성공적으로 등록되었습니다.");
          router.replace("/(cust)/question");
        } else {
          // 네이티브 환경에서는 Alert.alert 사용
          Alert.alert("성공", "문의가 성공적으로 등록되었습니다.", [
            {
              text: "확인",
              onPress: () => router.replace("/(cust)/question"),
            },
          ]);
        }
      } else {
        try {
          const error = await response.json();

          if (Platform.OS === "web") {
            window.alert(error.message || "문의 등록에 실패했습니다.");
          } else {
            Alert.alert("실패", error.message || "문의 등록에 실패했습니다.");
          }
        } catch (e) {
          if (Platform.OS === "web") {
            window.alert("문의 등록에 실패했습니다.");
          } else {
            Alert.alert("실패", "문의 등록에 실패했습니다.");
          }
        }
      }
    } catch (error) {
      if (Platform.OS === "web") {
        window.alert("문의 등록 중 오류가 발생했습니다.");
      } else {
        Alert.alert("실패", "문의 등록 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
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
          <Text style={styles.title}>문의하기</Text>
        </View>
        <View style={styles.rightSection} />
      </View>
      <ScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.questionItemContainer}>
          <Text style={styles.questionItemTitleText}>문의유형 *</Text>
          <Pressable
            style={styles.questionTypeSelector}
            onPress={() => setQuestionTypeModalVisible(true)}
          >
            <Text style={styles.questionTypeSelectorText}>
              {selectedQuestionType}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </Pressable>
        </View>

        <View style={styles.questionItemContainer}>
          <Text style={styles.questionItemTitleText}>제목 *</Text>
          <TextInput
            style={styles.questionTitleInput}
            placeholder="제목을 입력해주세요."
            onChangeText={setQuestionTitle}
            value={questionTitle}
          />
        </View>

        <View style={styles.questionItemContainer}>
          <Text style={styles.questionItemContentText}>내용 *</Text>
          <TextInput
            style={styles.questionContentInput}
            placeholder="내용을 입력해주세요."
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            onChangeText={setQuestionContent}
            value={questionContent}
          />
        </View>

        <View style={styles.questionItemContainer}>
          <Text style={styles.questionItemTitleText}>
            첨부파일 ({questionFiles.length}/3)
          </Text>
        </View>

        <View style={styles.questionImageContainer}>
          {[0, 1, 2].map((index) => (
            <View key={index} style={styles.photoSlot}>
              {questionFiles[index] ? (
                <View style={styles.photoWrapper}>
                  <Image
                    style={styles.questionImage}
                    source={{ uri: questionFiles[index] }}
                    resizeMode="cover"
                  />

                  <Pressable
                    style={styles.removePhotoButton}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#FF6B35" />
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  style={styles.photoUploadButton}
                  onPress={pickImage}
                  disabled={questionFiles.length >= 3}
                >
                  <Ionicons
                    name="camera"
                    size={32}
                    color={questionFiles.length >= 3 ? "#ccc" : "#888"}
                  />
                </Pressable>
              )}
            </View>
          ))}
        </View>

        <View style={styles.submitButtonContainer}>
          <Pressable style={styles.submitButton} onPress={submitQuestion}>
            <Text style={styles.submitButtonText}>문의하기</Text>
          </Pressable>
          <Pressable style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>취소하기</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        visible={questionTypeModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setQuestionTypeModalVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => setQuestionTypeModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>문의유형 선택</Text>
                <Pressable
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedQuestionType("QR 관련");
                    setSelectedQuestionTypeValue("QR");
                    setQuestionTypeModalVisible(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>QR 관련</Text>
                </Pressable>
                <Pressable
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedQuestionType("결제 관련");
                    setSelectedQuestionTypeValue("PAYMENT");
                    setQuestionTypeModalVisible(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>결제 관련</Text>
                </Pressable>
                <Pressable
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedQuestionType("환불/교환 관련");
                    setSelectedQuestionTypeValue("REFUND");
                    setQuestionTypeModalVisible(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>환불/교환 관련</Text>
                </Pressable>
                <Pressable
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedQuestionType("개인정보 수정 요청");
                    setSelectedQuestionTypeValue("MOD_REQUEST");
                    setQuestionTypeModalVisible(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>개인정보 수정 요청</Text>
                </Pressable>
                <Pressable
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedQuestionType("기타");
                    setSelectedQuestionTypeValue("ETC");
                    setQuestionTypeModalVisible(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>기타</Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
