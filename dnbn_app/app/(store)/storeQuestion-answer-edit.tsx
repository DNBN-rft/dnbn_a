import { apiGet, apiPutFormDataWithImage } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./storeQuestion-answer-edit.styles";

interface QuestionImage {
  originalName: string;
  fileUrl: string;
  order: number;
}

interface QuestionDetailResponse {
  questionTitle: string;
  questionRequestType: string;
  questionRegDateTime: string;
  questionContent: string;
  isAnswered: boolean;
  answerContent: string | null;
  answerRegNm: string | null;
  answerDateTime: string | null;
  questionModTime: string | null;
  answerModNm: string | null;
  answerModTime: string | null;
  imgs: {
    files: QuestionImage[];
  };
}

// 백엔드 응답은 한글 label, 요청은 enum 코드 필요
const questionTypeMap: { [key: string]: string } = {
  "QR 관련": "QR",
  "결제 관련": "PAYMENT",
  "환불/교환 관련": "REFUND",
  "개인정보 수정 요청": "MOD_REQUEST",
  기타: "ETC",
};

export default function StoreQuestionAnswerEdit() {
  const insets = useSafeAreaInsets();
  const { questionId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [questionTypeModalVisible, setQuestionTypeModalVisible] =
    useState(false);
  const [selectedQuestionType, setSelectedQuestionType] =
    useState<string>("문의유형 선택");
  const [questionTitle, setQuestionTitle] = useState<string>("");
  const [questionContent, setQuestionContent] = useState<string>("");
  const [questionFiles, setQuestionFiles] = useState<string[]>([]);

  useEffect(() => {
    if (questionId) {
      fetchQuestionDetail();
    }
  }, [questionId]);

  const fetchQuestionDetail = async () => {
    try {
      const response = await apiGet(`/store/app/question/${questionId}`);

      if (response.ok) {
        const data: QuestionDetailResponse = await response.json();

        console.log(
          "백엔드에서 받은 questionRequestType:",
          data.questionRequestType,
        );

        // 백엔드에서 한글 label로 오므로 그대로 사용
        setSelectedQuestionType(data.questionRequestType);
        setQuestionTitle(data.questionTitle);
        setQuestionContent(data.questionContent);

        // 이미지가 있으면 URL 배열로 설정
        if (data.imgs?.files && data.imgs.files.length > 0) {
          const imageUrls = data.imgs.files
            .sort((a, b) => a.order - b.order)
            .map((img) => img.fileUrl);
          setQuestionFiles(imageUrls);
        }
      } else {
        console.error("문의 상세 조회 실패:", response.status);
        Alert.alert("오류", "문의 정보를 불러오는데 실패했습니다.");
        router.back();
      }
    } catch (error) {
      console.error("문의 상세 조회 에러:", error);
      Alert.alert("오류", "문의 정보를 불러오는데 실패했습니다.");
      router.back();
    } finally {
      setLoading(false);
    }
  };

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

  // 문의 수정 및 이미지 업로드 함수
  const submitQuestion = async () => {
    // 유효성 검사
    if (selectedQuestionType === "문의유형 선택") {
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

    setSubmitting(true);
    try {
      const formData = new FormData();

      // 문의 정보 추가
      // 백엔드 deserialize를 위해 enum 코드 전송
      const enumCode = questionTypeMap[selectedQuestionType];
      formData.append("questionRequestType", enumCode);
      formData.append("questionTitle", questionTitle);
      formData.append("questionContent", questionContent);

      // 이미지 파일들 추가 (모든 이미지 전송)
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
          // 웹: Blob으로 변환하여 전송 (URL이든 로컬이든 동일)
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

      const response = await apiPutFormDataWithImage(
        `/store/app/question/${questionId}`,
        formData,
      );

      if (response.ok) {
        // 웹 환경에서는 window.alert 사용
        if (Platform.OS === "web") {
          window.alert("문의가 성공적으로 수정되었습니다.");
          router.back();
        } else {
          // 네이티브 환경에서는 Alert.alert 사용
          Alert.alert("성공", "문의가 성공적으로 수정되었습니다.", [
            {
              text: "확인",
              onPress: () => router.back(),
            },
          ]);
        }
      } else {
        try {
          const error = await response.json();

          if (Platform.OS === "web") {
            window.alert(error.message || "문의 수정에 실패했습니다.");
          } else {
            Alert.alert("실패", error.message || "문의 수정에 실패했습니다.");
          }
        } catch (e) {
          if (Platform.OS === "web") {
            window.alert("문의 수정에 실패했습니다.");
          } else {
            Alert.alert("실패", "문의 수정에 실패했습니다.");
          }
        }
      }
    } catch (error) {
      if (Platform.OS === "web") {
        window.alert("문의 수정 중 오류가 발생했습니다.");
      } else {
        Alert.alert("실패", "문의 수정 중 오류가 발생했습니다.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        {insets.top > 0 && (
          <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
        )}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>문의 수정</Text>
          <View style={styles.placeholder} />
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>로딩중...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
      )}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>문의 수정</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: Platform.OS === "ios" ? insets.bottom + 60 : 0,
        }}
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
                    priority="high"
                    cachePolicy="memory-disk"
                    contentFit="cover"
                    transition={200}
                    placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
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
          <Pressable
            style={[
              styles.submitButton,
              submitting && { opacity: 0.6 },
            ]}
            onPress={submitQuestion}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#EF7810" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>수정하기</Text>
            )}
          </Pressable>
          <Pressable
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={submitting}
          >
            <Text style={styles.cancelButtonText}>취소</Text>
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
                    setQuestionTypeModalVisible(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>QR 관련</Text>
                </Pressable>
                <Pressable
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedQuestionType("결제 관련");
                    setQuestionTypeModalVisible(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>결제 관련</Text>
                </Pressable>
                <Pressable
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedQuestionType("환불/교환 관련");
                    setQuestionTypeModalVisible(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>환불/교환 관련</Text>
                </Pressable>
                <Pressable
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedQuestionType("개인정보 수정 요청");
                    setQuestionTypeModalVisible(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>개인정보 수정 요청</Text>
                </Pressable>
                <Pressable
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedQuestionType("기타");
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
