import { apiGet, apiPutFormDataWithImage } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
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

interface ImageFile {
  uri: string;
  name: string;
  isNew?: boolean;
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
  const [images, setImages] = useState<ImageFile[]>([]);

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

        // 이미지가 있으면 ImageFile 배열로 설정
        if (data.imgs?.files && data.imgs.files.length > 0) {
          const imageList = data.imgs.files
            .sort((a, b) => a.order - b.order)
            .map((img) => ({
              uri: img.fileUrl,
              name: img.originalName,
              isNew: false,
            }));
          setImages(imageList);
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
  const pickImage = () => {
    if (images.length >= 3) {
      Alert.alert("알림", "이미지는 최대 3개까지만 등록할 수 있습니다");
      return;
    }

    const addFromAsset = (asset: ImagePicker.ImagePickerAsset) => {
      const extFromMime = asset.mimeType
        ? asset.mimeType.split("/").pop()?.replace("jpeg", "jpg") || "jpg"
        : "jpg";
      const rawName = asset.fileName || asset.uri.split("/").pop() || "";
      const hasExt = rawName.includes(".");
      const name = hasExt ? rawName : `${rawName || `image_${Date.now()}`}.${extFromMime}`;
      setImages([...images, { uri: asset.uri, name, isNew: true }]);
    };

    Alert.alert("이미지 추가", "어떤 방법으로 추가할까요?", [
      {
        text: "카메라로 촬영",
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") {
            Alert.alert("카메라 권한 필요", "카메라로 촬영하려면 기기 설정에서 카메라 접근 권한을 허용해주세요.", [
              { text: "설정으로 이동", onPress: () => Linking.openSettings() },
              { text: "취소", style: "cancel" },
            ]);
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
          if (!result.canceled) addFromAsset(result.assets[0]);
        },
      },
      {
        text: "갤러리에서 선택",
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
          if (!result.canceled) addFromAsset(result.assets[0]);
        },
      },
      { text: "취소", style: "cancel" },
    ]);
  };

  // 이미지 삭제 함수
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
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

      // 백엔드는 기존 이미지를 전체 삭제 후 전달받은 이미지를 전체 저장하므로
      // 유지할 기존 이미지(isNew: false) + 새 이미지(isNew: true) 모두 전송
      for (const img of images) {
        const ext = img.name.split(".").pop()?.toLowerCase() || "jpg";
        const mimeType =
          ext === "png"
            ? "image/png"
            : ext === "gif"
              ? "image/gif"
              : ext === "webp"
                ? "image/webp"
                : "image/jpeg";

        formData.append("questionFiles", {
          uri: img.uri,
          name: img.name,
          type: mimeType,
        } as any);
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
        </View>
        <View style={styles.rightSection} />

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
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.centerSection}>
          <Text style={styles.title}>문의 수정</Text>
        </View>
        <View style={styles.rightSection} />
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
            첨부파일 ({images.length}/3)
          </Text>
          <View style={styles.imageManagementBox}>
            <View style={styles.imageGrid}>
              {images.map((img, index) => (
                <View key={index} style={styles.imagePreview}>
                  <Image
                    source={{ uri: img.uri }}
                    style={styles.previewImage}
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                style={[
                  styles.addImageButton,
                  images.length >= 3 && styles.disabledButton,
                ]}
                onPress={pickImage}
                disabled={submitting || images.length >= 3}
              >
                <Ionicons
                  name="add"
                  size={32}
                  color={images.length >= 3 ? "#ccc" : "#999"}
                />
                <Text
                  style={[
                    styles.addImageText,
                    images.length >= 3 && styles.disabledText,
                  ]}
                >
                  {images.length >= 3 ? "완료" : "추가"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
            <TouchableWithoutFeedback onPress={() => { }}>
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
