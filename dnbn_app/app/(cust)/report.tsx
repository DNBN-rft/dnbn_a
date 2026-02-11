import { apiGet, apiPostFormDataWithImage } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { ReportReasonModal } from "./components/ReportReasonModal";
import { styles } from "./report.styles";

export default function ReportPage() {
  const { storeCode, type } = useLocalSearchParams<{
    storeCode?: string;
    type?: string;
  }>();

  const [reportReason, setReportReason] = useState("");
  const [reportContent, setReportContent] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reportReasons, setReportReasons] = useState<
    { label: string; value: string }[]
  >([{ label: "신고 사유를 선택하세요", value: "" }]);
  const [loading, setLoading] = useState(true);

  // 신고 사유 목록 가져오기
  useEffect(() => {
    const fetchReportReasons = async () => {
      if (!type) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await apiGet(`/cust/report/types?type=${type}`);
        if (!response.ok) {
          throw new Error("신고 사유 목록 응답 오류");
        }

        const data = await response.json();
        setReportReasons([
          { label: "신고 사유를 선택하세요", value: "" },
          ...data.reportReasons,
        ]);
      } catch (error) {
        console.error("신고 사유 불러오기 실패:", error);
        showAlert("오류", "신고 사유 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReportReasons();
  }, [type]);

  const showAlert = (
    title: string,
    message?: string,
    buttons?: { text: string; onPress?: () => void; style?: string }[],
  ) => {
    if (Platform.OS === "web") {
      const confirmMessage = message ? `${title}\n\n${message}` : title;
      if (buttons && buttons.length > 1) {
        if (window.confirm(confirmMessage)) {
          const confirmButton = buttons.find((btn) => btn.style !== "cancel");
          confirmButton?.onPress?.();
        }
      } else {
        window.alert(confirmMessage);
        buttons?.[0]?.onPress?.();
      }
    } else {
      if (buttons && buttons.length > 0) {
        Alert.alert(title, message, buttons as any);
      } else {
        Alert.alert(title, message);
      }
    }
  };

  const pickImage = async () => {
    if (attachments.length >= 3) {
      showAlert("알림", "최대 3개까지 첨부 가능합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setAttachments([...attachments, result.assets[0].uri]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!reportReason) {
      showAlert("알림", "신고 사유를 선택해주세요.");
      return;
    }
    if (!reportContent.trim()) {
      showAlert("알림", "신고 내용을 입력해주세요.");
      return;
    }

    showAlert("신고하기", "해당 매장을 신고하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "신고",
        onPress: async () => {
          try {
            const formData = new FormData();
            formData.append("reportType", type || "");
            formData.append("storeCode", storeCode || "");
            formData.append("reportReason", reportReason);
            formData.append("reportContent", reportContent);

            // 첨부파일 추가
            for (let i = 0; i < attachments.length; i++) {
              const uri = attachments[i];
              if (Platform.OS === "web") {
                // 웹: fetch로 blob 가져오기
                const imageResponse = await fetch(uri);
                const blob = await imageResponse.blob();
                const fileName = `image_${i}.jpg`;
                formData.append("images", blob, fileName);
              } else {
                // 모바일: uri 직접 사용
                const fileName = uri.split("/").pop() || `image_${i}.jpg`;
                formData.append("images", {
                  uri,
                  name: fileName,
                  type: "image/jpeg",
                } as any);
              }
            }

            const response = await apiPostFormDataWithImage(
              `/cust/report/register`,
              formData,
            );

            if (!response.ok) {
              throw new Error("신고 접수에 실패했습니다.");
            }

            showAlert("완료", "신고가 정상적으로 접수되었습니다.", [
              {
                text: "확인",
                onPress: () =>
                  router.replace(`/(cust)/storeInfo?storeCode=${storeCode}`),
              },
            ]);
          } catch (error) {
            console.error("신고 제출 실패:", error);
            showAlert(
              "오류",
              "신고 접수 중 오류가 발생했습니다. 다시 시도해주세요.",
            );
          }
        },
      },
    ]);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <View style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <Text style={styles.title}>신고하기</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.selectionContainer}>
          <Text style={styles.label}>신고 사유</Text>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => setIsModalVisible(true)}
          >
            <Text
              style={[
                styles.selectBoxText,
                !reportReason && styles.selectBoxPlaceholder,
              ]}
            >
              {reportReason
                ? reportReasons.find((r) => r.value === reportReason)?.label
                : "신고 사유를 선택하세요"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <ReportReasonModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          reportReasons={reportReasons}
          selectedReason={reportReason}
          onSelectReason={setReportReason}
        />

        <View style={styles.contentContainer}>
          <Text style={styles.label}>신고 내용</Text>
          <TextInput
            style={styles.textInput}
            placeholder="신고 내용을 상세히 입력해주세요."
            placeholderTextColor="#999"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={reportContent}
            onChangeText={setReportContent}
          />
          <Text style={styles.charCount}>{reportContent.length} / 500</Text>
        </View>

        <View style={styles.attachmentContainer}>
          <Text style={styles.label}>첨부파일 (최대 3개)</Text>
          <View style={styles.attachmentList}>
            {attachments.map((uri, index) => (
              <View key={index} style={styles.attachmentItem}>
                <Image source={{ uri }} style={styles.attachmentImage} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeAttachment(index)}
                >
                  <Ionicons name="close-circle" size={24} color="#FF5252" />
                </TouchableOpacity>
              </View>
            ))}
            {attachments.length < 3 && (
              <TouchableOpacity style={styles.addButton} onPress={pickImage}>
                <Ionicons name="add" size={32} color="#999" />
                <Text style={styles.addButtonText}>사진 추가</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>신고</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
