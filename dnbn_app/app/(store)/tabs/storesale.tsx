import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Modal, Platform, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "../styles/storesale.styles";

export default function StoreSale() {
  const insets = useSafeAreaInsets();
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const saleList = [
    { 
      id: "1", 
      uri: require("@/assets/images/image1.jpg"), 
      category: "카테고리 1", 
      productName: "상품 1", 
      status: "진행",
      originalPrice: 10000, 
      discountRate: 10,
      salePrice: 9000
    },
    { 
      id: "2", 
      uri: require("@/assets/images/image1.jpg"), 
      category: "카테고리 2", 
      productName: "상품 2", 
      status: "대기",
      originalPrice: 20000, 
      discountRate: 20,
      salePrice: 16000
    },
    { 
      id: "3", 
      uri: require("@/assets/images/image1.jpg"), 
      category: "카테고리 3", 
      productName: "상품 3", 
      status: "대기",
      originalPrice: 30000, 
      discountRate: 15,
      salePrice: 25500
    },
    { 
      id: "4", 
      uri: require("@/assets/images/image1.jpg"), 
      category: "카테고리 4", 
      productName: "상품 4", 
      status: "대기",
      originalPrice: 90000, 
      discountRate: 10,
      salePrice: 81000
    },
  ];

  const handleDelete = () => {
    // TODO: 실제 삭제 로직 구현
    console.log("삭제할 상품 ID:", selectedItemId);
    setDeleteModal(false);
    setSelectedItemId(null);
  };

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
          할인 관리
        </Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? insets.bottom + 60 : 0 }}
        data={saleList}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.saleProduct}>
            <View style={styles.productContainer}>
              <View style={styles.productImageContainer}>
                <Image
                  style={styles.productImage}
                  source={item.uri} />
              </View>
  
              <View style={styles.productInfoContainer}>
                <View>
                  <Text style={styles.categoryText}>{item.category}</Text>

                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.productNameText}
                  >{item.productName}</Text>
                </View>
                
                <View>
                  <Text style={styles.originalPriceText}>
                    {item.originalPrice.toLocaleString()}원
                  </Text>
                  <View style={styles.discountContainer}>
                    <Text style={styles.discountRateText}>
                      {item.discountRate}%
                    </Text>
                    <Text style={styles.salePriceText}>
                      {item.salePrice.toLocaleString()}원
                    </Text>
                  </View>
                  <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>
                      {item.status}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
  
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => {
                  setSelectedItemId(item.id);
                  setDeleteModal(true);
                }}
              >
                <Text style={styles.deleteButtonText}>삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal
        visible={deleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalTitle}>
              알림
            </Text>
            <Text style={styles.deleteModalMessage}>
              정말로 이 할인을 삭제하시겠습니까?
            </Text>
            
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={[styles.deleteModalButton, styles.confirmButton]}
                onPress={handleDelete}>
                <Text style={styles.confirmButtonText}>삭제</Text>
              </TouchableOpacity>
        
              <TouchableOpacity
                style={[styles.deleteModalButton, styles.cancelButton]}
                onPress={() => setDeleteModal(false)}>
                <Text style={styles.modalCancelButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
