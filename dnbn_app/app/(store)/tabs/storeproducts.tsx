import Ionicons from "@expo/vector-icons/build/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./storeproducts.styles";

export default function StoreProducts() {
  const insets = useSafeAreaInsets();
  const [detailModal, setDetailModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedProductCode, setSelectedProductCode] = useState<string | null>(null);

  const products = [
    { id: "1", uri: require("@/assets/images/image1.jpg"), name: "상품 1", price: 10000, categoryName: "카테고리 1"},
    { id: "2", uri: require("@/assets/images/image1.jpg"), name: "상품 2", price: 20000, categoryName: "카테고리 2"},
    { id: "3", uri: require("@/assets/images/image1.jpg"), name: "상품 3", price: 30000, categoryName: "카테고리 3"},
  ];

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#ffffff" }} />
      )}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title} pointerEvents="none">
          상품 관리
        </Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: products }) => (
          <View style={styles.content}>
            <TouchableOpacity style={styles.productTouchable}>
              <View style={styles.productContainer}>
                <View style={styles.productImageContainer}>
                  <Image source={products.uri} style={styles.productImage} resizeMode="cover"/>
                </View>
                <View style={styles.productInfoContainer}>
                  <Text style={styles.categoryName}>{products.categoryName}</Text>
                  <Text style={styles.productName}>{products.name}</Text>
                  <Text style={styles.price}>
                    {products.price.toLocaleString()}원
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.productButtonContainer}>
              <TouchableOpacity style={styles.saleButton}>
                <Text style={styles.saleButtonText}>할인 등록</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.negoButton}>
                <Text style={styles.negoButtonText}>네고 등록</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.moreButton}
              onPress={() => {
                // products.id에서 products.productCode로 변경 필요함
                setSelectedProductCode(products.id);
                setDetailModal(true);
              }}>
                <Text><Ionicons name="ellipsis-horizontal" size={20} color="#666" /></Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      ></FlatList>

      <TouchableOpacity
        onPress={() => router.navigate("/(store)/addproduct")}
      >
        <View style={styles.addProductButton}>
          <Ionicons name="add" size={24} color="#ef7810" />
        </View>
      </TouchableOpacity>

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
                  params: { productCode: selectedProductCode}
                });
              }}
            >
              <Ionicons name="information-circle-outline" size={20} color="#333" />
              <Text style={styles.modalButtonText}>상세정보</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setDetailModal(false);
                // 수정 페이지로 이동 (상품 ID 전달)
                router.push({
                  pathname: "/(store)/editproduct",
                  params: { productCode: selectedProductCode, mode: 'edit' }
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
              <Text style={[styles.modalButtonText, { color: '#ff3b30' }]}>삭제</Text>
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
              정말로 이 상품을 삭제하시겠습니까?{"\n"}삭제된 상품은 복구할 수 없습니다.
            </Text>
            
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={[styles.deleteModalButton, styles.confirmButton]}
                onPress={() => {
                  // 여기서 실제 삭제 로직 구현
                  setDeleteModal(false);
                  setSelectedProductCode(null);
                  // TODO: 실제 삭제 API 호출
                }}>
                <Text style={styles.confirmButtonText}>삭제</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.deleteModalButton, styles.cancelButton]}
                onPress={() => setDeleteModal(false)}>
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
