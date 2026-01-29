import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View, ScrollView, FlatList, Modal } from "react-native";
import { styles } from "./reviewdetail.styles";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useState } from "react";

interface ReviewImageFile {
  fileUrl: string;
  order?: number;
}

interface ReviewImages {
  files: ReviewImageFile[];
}

export default function ReviewDetailScreen() {
  const insets = useSafeAreaInsets();
  const {
    reviewIdx,
    productImage,
    storeNm,
    productName,
    reviewRate,
    reviewContent,
    reviewImages,
  } = useLocalSearchParams();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  let images: ReviewImages = { files: [] };
  try {
    if (reviewImages && typeof reviewImages === 'string') {
      images = JSON.parse(reviewImages) as ReviewImages;
    }
  } catch (error) {
    console.error('Failed to parse reviewImages:', error);
    images = { files: [] };
  }

  const renderStarRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= parseInt(reviewRate as string) ? "star" : "star-outline"}
          size={20}
          color="#FFD700"
          style={styles.starIcon}
        />
      );
    }
    return stars;
  };

  const handleDeletePress = () => {
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    // TODO: 실제 삭제 로직 구현
    console.log('리뷰 삭제:', reviewIdx);
    setDeleteModalVisible(false);
    router.back();
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
  };
  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={[{ height: insets.top }, styles.insetTopView]} />
      )}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>
          리뷰 상세
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 상품 정보 영역 */}
        <View style={styles.productInfoContainer}>
          <View style={styles.productInfoRow}>
            {productImage ? (
              <Image
                source={{ uri: productImage as string }}
                style={styles.productImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.productImagePlaceholder}>
                <Text style={styles.productImagePlaceholderText}>이미지</Text>
              </View>
            )}
            <View style={styles.productDetails}>
              <Text style={styles.storeName} numberOfLines={1}>
                {storeNm}
              </Text>
              <Text style={styles.productName} numberOfLines={2}>
                {productName}
              </Text>
            </View>
          </View>
        </View>

        {/* 리뷰 이미지 영역 */}
        {images.files && images.files.length > 0 && (
          <View style={styles.reviewImagesSection}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={images.files}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.reviewImagesContentContainer}
              scrollEnabled={images.files.length > 1}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item.fileUrl }}
                  style={styles.reviewImageItem}
                  resizeMode="cover"
                />
              )}
            />
          </View>
        )}

        {/* 별점 영역 */}
        <View style={styles.ratingSection}>
          <View style={styles.ratingContainer}>
            {renderStarRating(parseInt(reviewRate as string))}
            <Text style={styles.ratingText}>{reviewRate}점</Text>
          </View>
        </View>

        {/* 리뷰 내용 영역 */}
        <View style={styles.contentSection}>
          <Text style={styles.contentText}>{reviewContent}</Text>
        </View>

        {/* 수정/삭제 버튼 */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push("/(cust)/reviewReg")}
          >
            <Text style={styles.editButtonText}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeletePress}
          >
            <Text style={styles.deleteButtonText}>삭제</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {insets.bottom > 0 && (
        <View style={[{ height: insets.bottom }, styles.safeAreaBottom]} />
      )}

      {/* 삭제 확인 모달 */}
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>리뷰 삭제</Text>
            <Text style={styles.modalMessage}>정말로 삭제하시겠습니까?</Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleConfirmDelete}
              >
                <Text style={styles.modalConfirmButtonText}>확인</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={handleCancelDelete}
              >
                <Text style={styles.modalCancelButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}