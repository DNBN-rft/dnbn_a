import { apiDelete, apiGet } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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
import { styles } from "../styles/storesale.styles";

interface ImageFile {
  originalName: string;
  fileUrl: string;
  order: number;
}

interface ProductImages {
  files: ImageFile[];
}

interface SaleItem {
  saleIdx: number;
  images: ProductImages;
  productCode: string;
  productNm: string;
  saleType: string;
  saleValue: number;
  originalPrice: number;
  discountedPrice: number;
  saleStatus: string;
  startDateTime: string;
  endDateTime: string;
}

interface SaleListResponse {
  content: SaleItem[];
  pageable: any;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export default function StoreSale() {
  const insets = useSafeAreaInsets();
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedSaleIdx, setSelectedSaleIdx] = useState<number | null>(null);
  const [saleList, setSaleList] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSaleList = async () => {
    setLoading(true);
    try {
      const response = await apiGet("/store/app/sale");

      if (response.ok) {
        const data: SaleListResponse = await response.json();
        setSaleList(data.content);
      } else {
        const errorData = await response.json().catch(() => ({}));
        Alert.alert(
          "오류",
          errorData.message || "할인 목록을 불러오는데 실패했습니다.",
        );
      }
    } catch (error) {
      console.error("할인 목록 불러오기 오류:", error);
      Alert.alert("오류", "네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaleList();
  }, []);

  const handleDelete = async () => {
    if (!selectedSaleIdx) return;

    try {
      const response = await apiDelete(`/store/app/sale/${selectedSaleIdx}`);

      if (response.ok) {
        Alert.alert("성공", "할인이 삭제되었습니다.");
        fetchSaleList(); // 목록 새로고침
      } else {
        const errorData = await response.json().catch(() => ({}));
        Alert.alert("오류", errorData.message || "삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("삭제 오류:", error);
      Alert.alert("오류", "네트워크 오류가 발생했습니다.");
    } finally {
      setDeleteModal(false);
      setSelectedSaleIdx(null);
    }
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#ffffff" }} />
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
          <Text style={styles.title}>할인 관리</Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      {loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>로딩 중...</Text>
        </View>
      ) : saleList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="pricetag-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>등록된 할인 상품이 없습니다</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{
            paddingBottom: Platform.OS === "ios" ? insets.bottom + 60 : 0,
          }}
          data={saleList}
          keyExtractor={(item) => item.saleIdx.toString()}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchSaleList}
          renderItem={({ item }) => (
            <View style={styles.saleProduct}>
              <View style={styles.productContainer}>
                <View style={styles.productImageContainer}>
                  <Image
                    style={styles.productImage}
                    source={{ uri: item.images.files[0]?.fileUrl }}
                  />
                </View>

                <View style={styles.productInfoContainer}>
                  <View>
                    <Text style={styles.categoryText}>{item.saleStatus}</Text>

                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.productNameText}
                    >
                      {item.productNm}
                    </Text>
                  </View>

                  <View>
                    <Text style={styles.originalPriceText}>
                      {item.originalPrice.toLocaleString()}원
                    </Text>
                    <View style={styles.discountContainer}>
                      <Text style={styles.discountRateText}>
                        {item.saleValue}
                        {item.saleType === "할인률" ? "%" : "원"}
                      </Text>
                      <Text style={styles.salePriceText}>
                        {item.discountedPrice.toLocaleString()}원
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => {
                    setSelectedSaleIdx(item.saleIdx);
                    setDeleteModal(true);
                  }}
                >
                  <Text style={styles.deleteButtonText}>할인 취소</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <Modal
        visible={deleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalTitle}>알림</Text>
            <Text style={styles.deleteModalMessage}>
              정말로 이 할인을 취소하시겠습니까?
            </Text>

            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={[styles.deleteModalButton, styles.confirmButton]}
                onPress={handleDelete}
              >
                <Text style={styles.confirmButtonText}>네</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.deleteModalButton, styles.cancelButton]}
                onPress={() => setDeleteModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>아니오</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
