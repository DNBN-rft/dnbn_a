import { apiGet } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./reportdetail.styles";

interface ReportReason {
  value: string;
  label: string;
}

interface ReportStatus {
  value: string;
  label: string;
}

interface ReportType {
  value: string;
  label: string;
}

interface FileItem {
  originalName: string;
  fileUrl: string;
  order: number;
}

interface FileMasterResponse {
  files: FileItem[];
}

interface ReportDetailData {
  reportReason: ReportReason;
  reportStatus: ReportStatus;
  reportType: ReportType;
  storeNm: string;
  reportRegDateTime: string;
  reportContent: string;
  images: FileMasterResponse;
  answerTitle?: string | null;
  answerContent?: string | null;
  answerDateTime?: string | null;
}

export default function ReportDetailScreen() {
  const insets = useSafeAreaInsets();
  const { reportIdx } = useLocalSearchParams();

  const [reportData, setReportData] = useState<ReportDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchReportDetail = async () => {
      if (!reportIdx) {
        setError("신고 번호가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await apiGet(`/cust/report/${reportIdx}`);

        if (!response.ok) {
          throw new Error("신고 상세 정보를 불러오는데 실패했습니다.");
        }

        const data = await response.json();
        setReportData(data);
      } catch (err) {
        console.error("신고 상세 불러오기 실패:", err);
        setError("신고 상세 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReportDetail();
  }, [reportIdx]);

  if (loading) {
    return (
      <View style={styles.container}>
        {insets.top > 0 && (
          <View style={{ height: insets.top, backgroundColor: "#fff" }} />
        )}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>신고상세</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B00" />
          <Text style={styles.loadingText}>신고 상세를 불러오는 중...</Text>
        </View>
      </View>
    );
  }

  if (error || !reportData) {
    return (
      <View style={styles.container}>
        {insets.top > 0 && (
          <View style={{ height: insets.top, backgroundColor: "#fff" }} />
        )}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>신고상세</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
          <Text style={styles.errorText}>
            {error || "데이터를 불러올 수 없습니다."}
          </Text>
        </View>
      </View>
    );
  }

  const report = {
    id: "1",
    type: reportData.reportType.label,
    title: reportData.reportReason.label,
    status: reportData.reportStatus.label,
    date: new Date(reportData.reportRegDateTime).toLocaleDateString(),
    storeName: reportData.storeNm,
    description: reportData.reportContent,
    answerTitle: reportData.answerTitle || "",
    answer: reportData.answerContent || "아직 답변이 없습니다.",
    answerDate: reportData.answerDateTime
      ? new Date(reportData.answerDateTime).toLocaleDateString()
      : "",
    images: reportData.images.files.map((file) => file.fileUrl) || [],
  };

  const handleImagePress = (index: number) => {
    setSelectedImageIndex(index);
    setImageViewerVisible(true);
  };

  const closeImageViewer = () => {
    setImageViewerVisible(false);
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff" }} />
      )}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>신고상세</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.contentWrapper}>
          {/* 신고 정보 카드 */}
          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <View
                style={[
                  styles.statusBadge,
                  report.status === "답변완료" && styles.statusBadgeCompleted,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    report.status === "답변완료" && styles.statusTextCompleted,
                  ]}
                >
                  {report.status}
                </Text>
              </View>
            </View>

            <View style={styles.reportInfoContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.reportInfoLabel}>신고유형</Text>
                <Text style={styles.reportInfoValue}>{report.type}</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoItem}>
                <Text style={styles.reportInfoLabel}>가맹점</Text>
                <Text style={styles.reportInfoValue}>{report.storeName}</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoItem}>
                <Text style={styles.reportInfoLabel}>신고일시</Text>
                <Text style={styles.reportInfoValue}>{report.date}</Text>
              </View>
            </View>
          </View>

          {/* 신고 내용 카드 */}
          <View style={styles.contentCard}>
            <Text style={styles.sectionTitle}>신고 내용</Text>
            <Text style={styles.descriptionText}>{report.description}</Text>

            {/* 첨부 이미지 */}
            {report.images.length > 0 && (
              <View style={styles.imageSection}>
                <Text style={styles.imageSectionTitle}>첨부 이미지</Text>
                <View style={styles.imageContainer}>
                  {report.images.map((imageUrl, index) => (
                    <Pressable
                      key={index}
                      style={styles.imageWrapper}
                      onPress={() => handleImagePress(index)}
                    >
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* 처리 답변 카드 */}
          {reportData.answerContent && (
            <View style={styles.answerCard}>
              <View style={styles.answerHeader}>
                <Text style={styles.sectionTitle}>처리 결과</Text>
                <Text style={styles.answerDate}>{report.answerDate}</Text>
              </View>
              {report.answerTitle && (
                <Text style={styles.answerTitle}>{report.answerTitle}</Text>
              )}
              <Text style={styles.answerText}>{report.answer}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={imageViewerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageViewer}
      >
        <View style={styles.imageViewerContainer}>
          <TouchableOpacity
            style={styles.imageViewerCloseButton}
            onPress={closeImageViewer}
          >
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>

          <FlatList
            data={report.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={selectedImageIndex}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x /
                  Dimensions.get("window").width,
              );
              setSelectedImageIndex(index);
            }}
            getItemLayout={(data, index) => ({
              length: Dimensions.get("window").width,
              offset: Dimensions.get("window").width * index,
              index,
            })}
            keyExtractor={(img, index) => `viewer-${index}`}
            renderItem={({ item: imageUrl }) => (
              <View style={styles.imageViewerSlide}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.imageViewerImage}
                  resizeMode="contain"
                />
              </View>
            )}
          />

          <View style={styles.imageViewerCounter}>
            <Text style={styles.imageViewerCounterText}>
              {selectedImageIndex + 1} / {report.images.length}
            </Text>
          </View>
        </View>
      </Modal>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
