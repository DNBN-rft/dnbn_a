import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./questionreg.styles";

export default function NoticeDetailScreen() {
  const insets = useSafeAreaInsets();
  const [questionTypeModalVisible, setQuestionTypeModalVisible] =
    useState(false);
  const [selectedQuestionType, setSelectedQuestionType] =
    useState<string>("문의유형 선택");
  const [questionTitle, setQuestionTitle] = useState<string>("");
  const [questionContent, setQuestionContent] = useState<string>("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // 이미지 선택 함수
  const pickImage = async () => {
    // 이미 3개 선택된 경우
    if (selectedImages.length >= 3) {
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImages([...selectedImages, result.assets[0].uri]);
    }
  };

  // 이미지 삭제 함수
  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

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
        <Text style={styles.title}>문의하기</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={{ flex: 1 }}>
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
            첨부파일 ({selectedImages.length}/3)
          </Text>
        </View>

        <View style={styles.questionImageContainer}>
          {[0, 1, 2].map((index) => (
            <View key={index} style={styles.photoSlot}>
              {selectedImages[index] ? (
                <View style={styles.photoWrapper}>
                  <Image
                    style={styles.questionImage}
                    source={{ uri: selectedImages[index] }}
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
                  disabled={selectedImages.length >= 3}
                >
                  <Ionicons
                    name="camera"
                    size={32}
                    color={selectedImages.length >= 3 ? "#ccc" : "#888"}
                  />
                </Pressable>
              )}
            </View>
          ))}
        </View>

        <View style={styles.submitButtonContainer}>
          <Pressable
            style={styles.submitButton}
            onPress={() => {
              alert(
                `${selectedQuestionType} 문의가 접수되었습니다. ${questionTitle} ${questionContent} ${selectedImages.length}개의 이미지 첨부됨`,
              );
              router.navigate("/(cust)/question");
            }}
          >
            <Text style={styles.submitButtonText}>문의하기</Text>
          </Pressable>
          <Pressable style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>취소하기</Text>
          </Pressable>
        </View>
      </View>

      <Modal
        visible={questionTypeModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setQuestionTypeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>문의유형 선택</Text>
            <Pressable
              style={styles.modalOption}
              onPress={() => {
                setSelectedQuestionType("배송문의");
                setQuestionTypeModalVisible(false);
              }}
            >
              <Text style={styles.modalOptionText}>배송문의</Text>
            </Pressable>
            <Pressable
              style={styles.modalOption}
              onPress={() => {
                setSelectedQuestionType("나문의");
                setQuestionTypeModalVisible(false);
              }}
            >
              <Text style={styles.modalOptionText}>나문의</Text>
            </Pressable>
            <Pressable
              style={styles.modalOption}
              onPress={() => {
                setSelectedQuestionType("진용문의");
                setQuestionTypeModalVisible(false);
              }}
            >
              <Text style={styles.modalOptionText}>진용문의</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
