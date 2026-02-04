import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiGet } from "@/utils/api";
import { styles } from "./detailproduct.styles";

interface ProductDetailResponse {
  productNm: string;
  productCode: string;
  categoryNm: string;
  productPrice: number;
  productAmount: number;
  productState: string;
  isSale: boolean;
  isNego: boolean;
  isStock: boolean;
  isAdult: boolean;
  productDetailDescription: string;
  regNm: string;
  regDateTime: string;
  modNm: string;
  modDateTime: string;
  imgs: {
    files: Array<{ fileUrl: string; originalName: string; order: number }>;
  };
}

export default function DetailProductPage() {
  const insets = useSafeAreaInsets();
  const { productCode } = useLocalSearchParams<{ productCode: string }>();
  const [product, setProduct] = useState<ProductDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 상품 상세 조회 함수
  const loadProductDetail = useCallback(async () => {
    if (!productCode) {
      Alert.alert("알림", "상품 정보를 찾을 수 없습니다");
      router.back();
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiGet(`/store/product/detail/${productCode}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
        setCurrentImageIndex(0);
      } else {
        console.error("상품 상세 조회 실패:", response.status);
        Alert.alert("알림", "상품 정보를 불러올 수 없습니다");
      }
    } catch (error) {
      console.error("상품 상세 조회 오류:", error);
      Alert.alert("오류", "상품 정보 조회 중 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  }, [productCode]);

  // 초기 로드
  useEffect(() => {
    loadProductDetail();
  }, [productCode, loadProductDetail]);

  // 화면 포커스 시 새로고침
  useFocusEffect(
    useCallback(() => {
      loadProductDetail();
    }, [loadProductDetail])
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={{ flex: 1, textAlign: "center", marginTop: 20 }}>로딩 중...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={{ flex: 1, textAlign: "center", marginTop: 20 }}>상품 정보를 찾을 수 없습니다</Text>
      </View>
    );
  }

  const images = product.imgs?.files || [];
  const currentImage = images[currentImageIndex];

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

        <Text style={styles.title}>상품 상세</Text>
        <View style={styles.placeholder}></View>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.productDetailContainer}>
          <View style={styles.contentRow}>
            <View style={styles.productImagesContainer}>
              <View style={styles.productMetaContainer}>
                <Text style={styles.productStatus}>{product.productState}</Text>
                <Text style={styles.registrationDate}>
                  등록일: {new Date(product.regDateTime).toLocaleDateString('ko-KR')}
                </Text>
              </View>
              
              <View style={styles.mainImageContainer}>
                <TouchableOpacity
                  style={styles.mainImageButton}
                  onPress={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                  disabled={currentImageIndex === 0}
                >
                  <Ionicons name="chevron-back" size={24} color={currentImageIndex === 0 ? "#ccc" : "#666"} />
                </TouchableOpacity>
                
                <Image 
                  style={styles.productMainImage}
                  source={{ uri: currentImage?.fileUrl || 'https://via.placeholder.com/300' }}
                />
                
                <TouchableOpacity
                  style={styles.mainImageButton}
                  onPress={() => setCurrentImageIndex(Math.min(images.length - 1, currentImageIndex + 1))}
                  disabled={currentImageIndex === images.length - 1}
                >
                  <Ionicons name="chevron-forward" size={24} color={currentImageIndex === images.length - 1 ? "#ccc" : "#666"} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.productSubImages}>
                {images.map((img, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setCurrentImageIndex(index)}
                    style={{ opacity: currentImageIndex === index ? 1 : 0.5 }}
                  >
                    <Image 
                      style={styles.productSubImage}
                      source={{ uri: img.fileUrl }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.productInfoContainer}>
              <Text style={styles.categoryName}>{product.categoryNm}</Text>
              <Text style={styles.productName}>{product.productNm}</Text>
              <Text style={styles.productPrice}>₩ {product.productPrice.toLocaleString()}</Text>
              <Text style={styles.productStock}>재고: {product.productAmount}개</Text>
              <Text style={styles.productDescription}>
                {product.productDetailDescription}
              </Text>
            </View>
          </View>

          <View style={styles.productStatusContainer}>
            <View style={styles.statusInfoRow}>
              <Text style={styles.statusInfoTitle}>할인 여부</Text>
              <Text style={styles.statusInfoContent}>{product.isSale ? '할인 중' : '할인 없음'}</Text>
            </View>

            <View style={styles.statusInfoRow}>
              <Text style={styles.statusInfoTitle}>네고 여부</Text>
              <Text style={styles.statusInfoContent}>{product.isNego ? '네고 중' : '네고 없음'}</Text>
            </View>

            <View style={styles.statusInfoRow}>
              <Text style={styles.statusInfoTitle}>상품 구분</Text>
              <Text style={styles.statusInfoContent}>{product.isAdult ? '성인' : '일반'}</Text>
            </View>

            <View style={styles.statusInfoRow}>
              <Text style={styles.statusInfoTitle}>상품 타입</Text>
              <Text style={styles.statusInfoContent}>{product.isStock ? '재고 있음' : '서비스'}</Text>
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
