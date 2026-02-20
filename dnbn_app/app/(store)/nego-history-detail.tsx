import { apiGet } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./nego-history-detail.styles";

// API 응답 타입 정의
interface FileItem {
  originalName: string;
  fileUrl: string;
  order: number;
}

interface NegoLogFiles {
  files: FileItem[];
}

interface NegoLogDetailResponse {
  negoLogStatus: string;
  files: NegoLogFiles;
  categoryNm: string;
  productNm: string;
  productPrice: number;
  productAmount: number;
  detailDescription: string;
  startDateTime: string;
  endDateTime: string;
}

export default function NegoHistoryDetailPage() {
  const insets = useSafeAreaInsets();
  const { negoLogIdx } = useLocalSearchParams<{ negoLogIdx: string }>();

  const [negoHistoryDetail, setNegoHistoryDetail] =
    useState<NegoLogDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 날짜 포맷 변환 함수 (ISO -> YYYY.MM.DD HH:mm)
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  // 상태 텍스트 변환
  const getStatusText = (status: string) => {
    return status === "COMPLETED" ? "완료" : status;
  };

  // 이미지 배열 생성 (3개 미만일 때 logo.png로 채우기)
  const getImages = () => {
    const logoImage = require("@/assets/images/logo.png");
    const images = [];

    if (
      negoHistoryDetail?.files?.files &&
      negoHistoryDetail.files.files.length > 0
    ) {
      // API에서 받은 이미지 추가
      negoHistoryDetail.files.files.forEach((file) => {
        images.push({ uri: file.fileUrl });
      });
    }

    // 3개 미만이면 logo.png로 채우기
    while (images.length < 3) {
      images.push(logoImage);
    }

    return images;
  };

  // 네고 이력 상세 API 호출
  const fetchNegoLogDetail = async () => {
    if (!negoLogIdx) return;

    try {
      setLoading(true);
      const response = await apiGet(`/store/app/nego-log/detail/${negoLogIdx}`);

      if (response.ok) {
        const data: NegoLogDetailResponse = await response.json();
        setNegoHistoryDetail(data);
      } else {
        console.error("네고 이력 상세 조회 실패:", response.status);
      }
    } catch (error) {
      console.error("네고 이력 상세 API 호출 에러:", error);
    } finally {
      setLoading(false);
    }
  };

  // 초기 데이터 로드
  useFocusEffect(
    useCallback(() => {
      fetchNegoLogDetail();
    }, [negoLogIdx]),
  );

  // 이전 이미지
  const handlePrevImage = () => {
    const images = getImages();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // 다음 이미지
  const handleNextImage = () => {
    const images = getImages();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        {insets.top > 0 && (
          <View style={{ height: insets.top, backgroundColor: "#fff" }} />
        )}
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!negoHistoryDetail) {
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
          <Text style={styles.title}>네고 이력 상세</Text>
          <View style={styles.placeholder}></View>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>데이터를 불러올 수 없습니다.</Text>
        </View>
      </View>
    );
  }

  const images = getImages();

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

        <Text style={styles.title}>네고 이력 상세</Text>
        <View style={styles.placeholder}></View>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.productDetailContainer}>
          <View style={styles.contentRow}>
            <View style={styles.productImagesContainer}>
              <View style={styles.productMetaContainer}>
                <Text style={styles.productStatus}>
                  {getStatusText(negoHistoryDetail.negoLogStatus)}
                </Text>
              </View>

              <View style={styles.mainImageContainer}>
                <TouchableOpacity
                  style={styles.mainImageButton}
                  onPress={handlePrevImage}
                >
                  <Ionicons name="chevron-back" size={24} color="#666" />
                </TouchableOpacity>

                <Image
                  style={styles.productMainImage}
                  source={images[currentImageIndex]}
                  resizeMode="contain"
                />

                <TouchableOpacity
                  style={styles.mainImageButton}
                  onPress={handleNextImage}
                >
                  <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.productSubImages}>
                {images.map((image, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      style={[
                        styles.productSubImage,
                        currentImageIndex === index && {
                          borderWidth: 2,
                          borderColor: "#007AFF",
                        },
                      ]}
                      source={image}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.productInfoContainer}>
              <Text style={styles.categoryName}>
                {negoHistoryDetail.categoryNm}
              </Text>
              <Text style={styles.productName}>
                {negoHistoryDetail.productNm}
              </Text>
              <Text style={styles.productPrice}>
                ₩ {negoHistoryDetail.productPrice.toLocaleString()}
              </Text>
              <Text style={styles.productStock}>
                재고: {negoHistoryDetail.productAmount}개
              </Text>
              <Text style={styles.productDescription}>
                {negoHistoryDetail.detailDescription || "상세 설명이 없습니다."}
              </Text>
            </View>
          </View>

          <View style={styles.productStatusContainer}>
            <View style={styles.statusInfoRow}>
              <Text style={styles.statusInfoTitle}>네고 기간</Text>
              <Text style={styles.statusInfoContent}>
                {formatDateTime(negoHistoryDetail.startDateTime)} ~{" "}
                {formatDateTime(negoHistoryDetail.endDateTime)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
