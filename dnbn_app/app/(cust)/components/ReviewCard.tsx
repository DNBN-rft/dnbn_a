import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../storeInfo.styles";
import type { Review } from "../types/storeInfo.types";

interface ReviewCardProps {
  item: Review;
}

export function ReviewCard({ item }: ReviewCardProps) {
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleProductPress = () => {
    router.push({
      pathname: "/(cust)/product-detail",
      params: { productCode: item.reviewProductCode },
    });
  };

  const handleImagePress = (index: number) => {
    setSelectedImageIndex(index);
    setImageViewerVisible(true);
  };

  const closeImageViewer = () => {
    setImageViewerVisible(false);
  };

  return (
    <View style={styles.reviewItemContainer}>
      <View style={styles.reviewHeaderRow}>
        <View style={styles.reviewUserRatingContainer}>
          <Text style={styles.reviewRegNmText}>{item.custNick}</Text>
          <View style={styles.reviewRatingBox}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.reviewRateText}>
              {item.reviewRate.toFixed(1)}
            </Text>
          </View>
        </View>
        <Text style={styles.reviewRegDateText}>
          {new Date(item.regDateTime).toLocaleDateString("ko-KR")}
        </Text>
      </View>

      <Pressable onPress={item.productNm ? handleProductPress : undefined}>
        <Text style={styles.reviewProductNmText}>
          {item.productNm || "존재하지 않는 상품입니다."}
        </Text>
      </Pressable>

      <View style={styles.reviewContentContainer}>
        <Text style={styles.reviewContentText}>{item.reviewContent}</Text>
      </View>

      {item.reviewImage?.files && item.reviewImage.files.length > 0 && (
        <View style={styles.reviewImgGallery}>
          {item.reviewImage.files.map((img, index) => (
            <Pressable key={index} onPress={() => handleImagePress(index)}>
              <Image
                source={{ uri: img.fileUrl }}
                style={styles.reviewImgThumbnail}
                resizeMode="cover"
              />
            </Pressable>
          ))}
        </View>
      )}

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
            data={item.reviewImage?.files || []}
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
            renderItem={({ item: img }) => (
              <View style={styles.imageViewerSlide}>
                <Image
                  source={{ uri: img.fileUrl }}
                  style={styles.imageViewerImage}
                  resizeMode="contain"
                />
              </View>
            )}
          />

          <View style={styles.imageViewerCounter}>
            <Text style={styles.imageViewerCounterText}>
              {selectedImageIndex + 1} / {item.reviewImage?.files.length || 0}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}
