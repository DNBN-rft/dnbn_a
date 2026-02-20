import DiscountRegistrationModal from "@/components/modal/DiscountRegistrationModal";
import NegoRegistrationModal from "@/components/modal/NegoRegistrationModal";
import { apiDelete, apiGet, apiPost } from "@/utils/api";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "../styles/storeproducts.styles";

interface ProductItem {
  productCode: string;
  productNm: string;
  categoryNm: string;
  productPrice: number;
  productAmount: number;
  productState: string;
  isSale: boolean;
  isNego: boolean;
  isStock: boolean;
  productRegDateTime: string;
  images: {
    files: File[];
  };
}

interface File {
  originalName: string;
  fileUrl: string;
  order: number;
}

export default function StoreProducts() {
  const insets = useSafeAreaInsets();
  const [detailModal, setDetailModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedProductCode, setSelectedProductCode] = useState<string | null>(
    null,
  );
  const [saleModal, setSaleModal] = useState(false);
  const [negoModal, setNegoModal] = useState(false);

  // API 연동용 state
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // 성공 메시지 표시 (웹/앱 분기 처리)
  const showSuccessMessage = (message: string) => {
    if (Platform.OS === "web") {
      alert(message);
    } else {
      Alert.alert("알림", message);
    }
  };

  // 에러 메시지 표시 (웹/앱 분기 처리)
  const showErrorMessage = (message: string) => {
    if (Platform.OS === "web") {
      alert(message);
    } else {
      Alert.alert("오류", message);
    }
  };

  // 로컬 시간을 그대로 ISO 형식 문자열로 변환 (타임존 변환 없이)
  const formatLocalDateTime = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  // 상품 목록 조회 함수
  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiGet(
        `/store/product?page=${currentPage}&size=10`,
      );
      if (response.ok) {
        const data = await response.json();
        // Page 응답 처리
        const productList = data.content || [];
        setProducts(productList);
      } else {
        console.error("상품 목록 로드 실패:", response.status);
      }
    } catch (error) {
      console.error("상품 목록 로드 오류:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  // 페이지 변경 시 상품 조회
  useEffect(() => {
    loadProducts();
  }, [currentPage, loadProducts]);

  // 상품 삭제 함수
  const deleteProduct = async (productCode: string) => {
    try {
      const response = await apiDelete(`/store/app/regular/${productCode}`);
      if (response.ok) {
        await loadProducts();
        return true;
      } else {
        console.error("상품 삭제 실패:", response.status);
        return false;
      }
    } catch (error) {
      console.error("상품 삭제 오류:", error);
      return false;
    }
  };

  // 할인 등록 함수
  const registerDiscount = async (
    productCode: string,
    data: {
      discountType: "rate" | "price";
      discountValue: string;
      startDate: Date;
    },
  ) => {
    try {
      const product = products.find((p) => p.productCode === productCode);
      if (!product) {
        console.error("상품을 찾을 수 없습니다.");
        return false;
      }

      const originalPrice = product.productPrice;
      const saleValue = parseFloat(data.discountValue);

      // 할인된 가격 계산
      const discountedPrice =
        data.discountType === "rate"
          ? Math.round(originalPrice - (originalPrice * saleValue) / 100)
          : originalPrice - saleValue;

      const startDateTime = formatLocalDateTime(data.startDate);

      const requestData = {
        discountedPrice,
        originalPrice,
        saleType: data.discountType === "rate" ? "할인률" : "할인가",
        saleValue,
        startDateTime,
      };

      const response = await apiPost(
        `/store/app/sale/${productCode}`,
        requestData,
      );

      if (response.ok) {
        // 등록 성공 후 목록 새로고침
        await loadProducts();
        return true;
      } else {
        console.error("할인 등록 실패:", response.status);
        return false;
      }
    } catch (error) {
      console.error("할인 등록 오류:", error);
      return false;
    }
  };

  // 네고 등록 함수
  const registerNego = async (
    productCode: string,
    data: { startDate: Date },
  ) => {
    try {
      const startDateTime = formatLocalDateTime(data.startDate);

      const requestData = {
        startDateTime,
      };

      const response = await apiPost(
        `/store/app/nego/${productCode}`,
        requestData,
      );

      if (response.ok) {
        // 등록 성공 후 목록 새로고침
        await loadProducts();
        return true;
      } else {
        console.error("네고 등록 실패:", response.status);
        return false;
      }
    } catch (error) {
      console.error("네고 등록 오류:", error);
      return false;
    }
  };

  // 화면 포커스 시 새로고침
  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [loadProducts]),
  );

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
          <Text style={styles.title}>상품 관리</Text>
        </View>
        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.navigate("/(store)/addproduct")}
          >
            <Ionicons name="add" size={28} color="#EF7810" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.productCode}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? insets.bottom + 60 : 0,
          paddingHorizontal: 16,
          paddingTop: 8,
        }}
        renderItem={({ item: product }) => (
          <View style={styles.content}>
            <View style={styles.productContainer}>
              <View style={styles.productImageContainer}>
                <Image
                  source={
                    product.images?.files?.[0]?.fileUrl
                      ? { uri: product.images.files[0].fileUrl }
                      : { uri: "https://via.placeholder.com/150" }
                  }
                  style={styles.productImage}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.productInfoContainer}>
                <View style={styles.categoryTag}>
                  <Text style={styles.categoryName}>{product.categoryNm}</Text>
                </View>
                <Text style={styles.productName} numberOfLines={2}>
                  {product.productNm}
                </Text>
                <Text style={styles.price}>
                  {product.productPrice.toLocaleString()}원
                </Text>
              </View>
            </View>
            <View style={styles.productButtonContainer}>
              <TouchableOpacity
                style={styles.saleButton}
                onPress={() => {
                  setSelectedProductCode(product.productCode);
                  setSaleModal(true);
                }}
              >
                <Ionicons name="pricetag-outline" size={16} color="#EF7810" />
                <Text style={styles.saleButtonText}>할인 등록</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.negoButton}
                onPress={() => {
                  setSelectedProductCode(product.productCode);
                  setNegoModal(true);
                }}
              >
                <Ionicons name="chatbubble-outline" size={16} color="#4B5563" />
                <Text style={styles.negoButtonText}>네고 등록</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.moreButton}
                onPress={() => {
                  setSelectedProductCode(product.productCode);
                  setDetailModal(true);
                }}
              >
                <Ionicons
                  name="ellipsis-horizontal"
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal
        visible={detailModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDetailModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDetailModal(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setDetailModal(false);
                router.push({
                  pathname: "/(store)/detailproduct",
                  params: { productCode: selectedProductCode },
                });
              }}
            >
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#333"
              />
              <Text style={styles.modalButtonText}>상세정보</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setDetailModal(false);
                // 수정 페이지로 이동 (상품 ID 전달)
                router.push({
                  pathname: "/(store)/editproduct",
                  params: { productCode: selectedProductCode, mode: "edit" },
                });
              }}
            >
              <Ionicons name="create-outline" size={20} color="#333" />
              <Text style={styles.modalButtonText}>수정</Text>
            </TouchableOpacity>

            <View style={styles.modalDivider} />

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setDetailModal(false);
                setDeleteModal(true);
              }}
            >
              <Ionicons name="trash-outline" size={20} color="#ff3b30" />
              <Text style={[styles.modalButtonText, { color: "#ff3b30" }]}>
                삭제
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={deleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalTitle}>상품 삭제</Text>
            <Text style={styles.deleteModalMessage}>
              정말로 이 상품을 삭제하시겠습니까?{"\n"}삭제된 상품은 복구할 수
              없습니다.
            </Text>

            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={[styles.deleteModalButton, styles.confirmButton]}
                onPress={async () => {
                  if (selectedProductCode) {
                    const success = await deleteProduct(selectedProductCode);
                    if (success) {
                      setDeleteModal(false);
                      setSelectedProductCode(null);
                      showSuccessMessage("삭제가 완료되었습니다.");
                    } else {
                      // 에러 메시지 표시
                      showErrorMessage("상품 삭제에 실패했습니다.");
                    }
                  }
                }}
              >
                <Text style={styles.confirmButtonText}>삭제</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.deleteModalButton, styles.cancelButton]}
                onPress={() => setDeleteModal(false)}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <DiscountRegistrationModal
        visible={saleModal}
        onClose={() => setSaleModal(false)}
        onConfirm={async (data) => {
          if (selectedProductCode) {
            const success = await registerDiscount(selectedProductCode, data);
            if (success) {
              setSaleModal(false);
              setSelectedProductCode(null);
              showSuccessMessage("등록이 완료되었습니다.");
            } else {
              showErrorMessage("할인 등록에 실패했습니다.");
            }
          }
        }}
        productPrice={
          selectedProductCode
            ? products.find((p) => p.productCode === selectedProductCode)
                ?.productPrice
            : undefined
        }
      />

      <NegoRegistrationModal
        visible={negoModal}
        onClose={() => setNegoModal(false)}
        onConfirm={async (data) => {
          if (selectedProductCode) {
            const success = await registerNego(selectedProductCode, data);
            if (success) {
              setNegoModal(false);
              setSelectedProductCode(null);
              showSuccessMessage("등록이 완료되었습니다.");
            } else {
              showErrorMessage("네고 등록에 실패했습니다.");
            }
          }
        }}
      />
    </View>
  );
}
