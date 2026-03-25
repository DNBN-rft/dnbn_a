import { apiGet, apiPostFormDataWithImage } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./ProductReportModal.styles";

interface ReportReason {
  label: string;
  value: string;
}

interface ProductReportModalProps {
  visible: boolean;
  onClose: () => void;
  productCode: string;
}

export default function ProductReportModal({
  visible,
  onClose,
  productCode,
}: ProductReportModalProps) {
  const [reportReasons, setReportReasons] = useState<ReportReason[]>([]);
  const [selectedReason, setSelectedReason] = useState("");
  const [reportContent, setReportContent] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchReportReasons();
    } else {
      // 닫힐 때 초기화
      setSelectedReason("");
      setReportContent("");
      setAttachments([]);
    }
  }, [visible]);

  const fetchReportReasons = async () => {
    try {
      const response = await apiGet(`/cust/report/types?type=PRODUCT`);
      if (response.ok) {
        const data = await response.json();
        setReportReasons(data.reportReasons || []);
      }
    } catch (error) {
      console.error("신고 사유 불러오기 실패:", error);
    }
  };

  const pickImage = async () => {
    if (attachments.length >= 3) {
      showAlert("알림", "최대 3개까지 첨부 가능합니다.");
      return;
    }

    const launchPicker = async (useCamera: boolean) => {
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "카메라 권한 필요",
            "사진 촬영을 위해 카메라 접근 권한이 필요합니다.",
            [
              { text: "취소", style: "cancel" },
              { text: "설정으로 이동", onPress: () => Linking.openSettings() },
            ],
          );
          return;
        }
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: "images",
          allowsEditing: true,
        });
        if (!result.canceled && result.assets[0]) {
          setAttachments((prev) => [...prev, result.assets[0].uri]);
        }
      } else {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: "images",
          allowsEditing: true,
        });
        if (!result.canceled && result.assets[0]) {
          setAttachments((prev) => [...prev, result.assets[0].uri]);
        }
      }
    };

    Alert.alert("사진 첨부", "사진을 선택해주세요.", [
      { text: "카메라", onPress: () => launchPicker(true) },
      { text: "갤러리", onPress: () => launchPicker(false) },
      { text: "취소", style: "cancel" },
    ]);
  };

  const showAlert = (title: string, message?: string) => {
    if (Platform.OS === "web") {
      window.alert(message ? `${title}\n${message}` : title);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleSubmit = async () => {
    if (!selectedReason) {
      showAlert("알림", "신고 사유를 선택해주세요.");
      return;
    }
    if (!reportContent.trim()) {
      showAlert("알림", "신고 내용을 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("reportType", "PRODUCT");
      formData.append("productCode", productCode);
      formData.append("reportReason", selectedReason);
      formData.append("reportContent", reportContent);

      for (let i = 0; i < attachments.length; i++) {
        const uri = attachments[i];
        if (Platform.OS === "web") {
          const imageResponse = await fetch(uri);
          const blob = await imageResponse.blob();
          formData.append("images", blob, `image_${i}.jpg`);
        } else {
          const fileName = uri.split("/").pop() || `image_${i}.jpg`;
          formData.append("images", {
            uri,
            name: fileName,
            type: "image/jpeg",
          } as any);
        }
      }

      const response = await apiPostFormDataWithImage(
        "/cust/report/product",
        formData,
      );

      if (response.ok) {
        showAlert("완료", "신고가 정상적으로 접수되었습니다.");
        onClose();
      } else {
        showAlert("오류", "신고 접수에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("신고 제출 실패:", error);
      showAlert("오류", "신고 접수 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const openReasonPicker = () => {
    if (reportReasons.length === 0) return;
    Alert.alert("신고 사유 선택", undefined, [
      ...reportReasons.map((r) => ({
        text: r.label,
        onPress: () => setSelectedReason(r.value),
      })),
      { text: "취소", style: "cancel" as const },
    ]);
  };

  const selectedReasonLabel =
    reportReasons.find((r) => r.value === selectedReason)?.label || "";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>상품 신고</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={22} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* 신고 사유 선택 */}
              <Text style={styles.label}>신고 사유</Text>
              <TouchableOpacity
                style={styles.selectBox}
                onPress={openReasonPicker}
              >
                <Text
                  style={[
                    styles.selectBoxText,
                    !selectedReason && styles.selectBoxPlaceholder,
                  ]}
                >
                  {selectedReasonLabel || "신고 사유를 선택하세요"}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#999" />
              </TouchableOpacity>

              {/* 신고 내용 */}
              <Text style={styles.label}>신고 내용</Text>
              <TextInput
                style={styles.textArea}
                placeholder="신고 내용을 입력해주세요"
                placeholderTextColor="#999"
                multiline
                value={reportContent}
                onChangeText={setReportContent}
              />

              {/* 이미지 첨부 */}
              <Text style={styles.label}>
                사진 첨부 ({attachments.length}/3)
              </Text>
              <View style={styles.imageRow}>
                {attachments.map((uri, index) => (
                  <View key={index} style={styles.imageBox}>
                    <Image source={{ uri }} style={styles.imageThumb} />
                    <TouchableOpacity
                      style={styles.removeIcon}
                      onPress={() =>
                        setAttachments((prev) =>
                          prev.filter((_, i) => i !== index),
                        )
                      }
                    >
                      <Ionicons name="close-circle" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
                {attachments.length < 3 && (
                  <TouchableOpacity
                    style={styles.addImageButton}
                    onPress={pickImage}
                  >
                    <Ionicons name="camera-outline" size={24} color="#aaa" />
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>신고하기</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
