import { apiGet } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./discountdetail.styles";

interface FileItem {
  originalName: string;
  fileUrl: string;
  order: number;
}

interface FileMasterResponse {
  files: FileItem[];
}

interface SaleHistoryDetail {
  saleLogIdx: number;
  productCode: string;
  productNm: string;
  originalPrice: number;
  saleType: string;
  saleValue: number;
  discountedPrice: number;
  startDateTime: string;
  endDateTime: string;
  saleLogStatus: string;
  productDescription?: string;
  files?: FileMasterResponse;
  categoryNm?: string;
  stock?: number;
}

export default function DiscountDetailPage() {
  const insets = useSafeAreaInsets();
  const { saleLogIdx } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [discountData, setDiscountData] = useState<SaleHistoryDetail | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadDiscountDetail = async () => {
      if (!saleLogIdx) {
        Alert.alert("오류", "할인 정보를 찾을 수 없습니다.");
        router.back();
        return;
      }

      try {
        setLoading(true);
        const response = await apiGet(`/store/app/sale-history/detail/${saleLogIdx}`);
        
        if (response.ok) {
          const data = await response.json();
console.log("할인 상세 API 응답:", data);

          setDiscountData(data);
        } else {
          Alert.alert("오류", "할인 상세 정보를 불러오는데 실패했습니다.");
          router.back();
        }
      } catch (error) {
        console.error("할인 상세 조회 실패:", error);
        Alert.alert("오류", "할인 상세 정보를 불러오는데 실패했습니다.");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    loadDiscountDetail();
  }, [saleLogIdx]);

  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\. /g, '.').replace(/\.$/, '');
  };

  const formatDate = (dateTime: string) => {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\. /g, '.').replace(/\.$/, '');
  };

  const getStatusText = (status: string) => {
    // API가 이미 한글로 반환하므로 그대로 사용
    return status;
  };

  const handlePreviousImage = () => {
    const images = discountData?.files?.files || [];
    if (images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    const images = discountData?.files?.files || [];
    if (images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === images.length - 1 ? 0 : prev + 1
      );
    }
  };

  if (loading || !discountData) {
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
          <Text style={styles.title}>할인 상세</Text>
          <View style={styles.placeholder}></View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#EF7810" />
        </View>
      </View>
    );
  }

  const displayImages = discountData.files?.files?.map(file => file.fileUrl) || ['https://via.placeholder.com/300'];
  const finalPrice = discountData.originalPrice - discountData.discountedPrice;
  const discountRate = discountData.saleType === '할인률' 
    ? discountData.saleValue 
    : Math.round((discountData.discountedPrice / discountData.originalPrice) * 100);

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

        <Text style={styles.title}>할인 상세</Text>
        <View style={styles.placeholder}></View>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.productDetailContainer}>
          <View style={styles.contentRow}>
            <View style={styles.productImagesContainer}>
              <View style={styles.productMetaContainer}>
                <Text style={[
                  styles.productStatus,
                  discountData.saleLogStatus === '할인 완료' ? styles.statusComplete : styles.statusCanceled
                ]}>
                  {getStatusText(discountData.saleLogStatus)}
                </Text>
                <Text style={styles.registrationDate}>
                  등록일: {formatDate(discountData.startDateTime)}
                </Text>
              </View>
              
              <View style={styles.mainImageContainer}>
                <TouchableOpacity
                  style={styles.mainImageButton}
                  onPress={handlePreviousImage}
                >
                  <Ionicons name="chevron-back" size={24} color="#666" />
                </TouchableOpacity>
                
                <Image 
                  style={styles.productMainImage}
                  source={{ uri: displayImages[currentImageIndex] }}
                />
                
                <TouchableOpacity
                  style={styles.mainImageButton}
                  onPress={handleNextImage}
                >
                  <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              {displayImages.length > 1 && (
                <View style={styles.productSubImages}>
                  {displayImages.map((uri, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setCurrentImageIndex(index)}
                    >
                      <Image 
                        style={[
                          styles.productSubImage,
                          currentImageIndex === index && { borderColor: '#EF7810', borderWidth: 2 }
                        ]}
                        source={{ uri }}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.productInfoContainer}>
              <Text style={styles.categoryName}>{discountData.categoryNm || '카테고리 없음'}</Text>
              <Text style={styles.productName}>{discountData.productNm}</Text>
              
              <View style={styles.priceInfoContainer}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>원가:</Text>
                  <Text style={styles.originalPrice}>
                    ₩ {discountData.originalPrice.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>할인:</Text>
                  <Text style={styles.discountRate}>
                    {discountRate}%
                  </Text>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>할인 금액:</Text>
                  <Text style={styles.discountAmount}>
                    -₩ {discountData.discountedPrice.toLocaleString()}
                  </Text>
                </View>

                <View style={[styles.priceRow, styles.finalPriceRow]}>
                  <Text style={styles.finalPriceLabel}>최종 금액:</Text>
                  <Text style={styles.finalPrice}>
                    ₩ {finalPrice.toLocaleString()}
                  </Text>
                </View>
              </View>

              {discountData.stock !== undefined && (
                <Text style={styles.productStock}>재고: {discountData.stock}개</Text>
              )}
              {discountData.productDescription && (
                <Text style={styles.productDescription}>
                  {discountData.productDescription}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.productStatusContainer}>
            <View style={styles.statusInfoRow}>
              <Text style={styles.statusInfoTitle}>할인 기간</Text>
              <Text style={styles.statusInfoContent}>
                {formatDateTime(discountData.startDateTime)} ~ {formatDateTime(discountData.endDateTime)}
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
