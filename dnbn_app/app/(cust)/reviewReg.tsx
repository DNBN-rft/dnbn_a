import { apiPostFormDataWithImage, apiPutFormDataWithImage } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./reviewreg.styles";

interface ReviewImageFile {
  fileUrl: string;
  order?: number;
  originalName?: string;
}

export default function ReviewRegScreen() {
  const insets = useSafeAreaInsets();
  const {
    reviewIdx,
    orderDetailIdx,
    storeNm,
    productName,
    productImage,
    reviewRate: initialRate,
    reviewContent: initialContent,
    reviewImages: initialReviewImages,
  } = useLocalSearchParams();

  const isEditMode = !!reviewIdx;

  const [rating, setRating] = useState(
    isEditMode ? parseInt(initialRate as string) || 0 : 0,
  );
  const [reviewText, setReviewText] = useState(
    isEditMode ? (initialContent as string) || "" : "",
  );
  const [images, setImages] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<ReviewImageFile[]>([]);
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    ImagePicker.useMediaLibraryPermissions();
  const [cameraPermission, requestCameraPermission] =
    ImagePicker.useCameraPermissions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 두 권한 모두 요청
    requestMediaLibraryPermission();
    requestCameraPermission();

    // 수정 모드일 때 기존 이미지 파싱
    if (isEditMode && initialReviewImages) {
      try {
        const parsed = JSON.parse(initialReviewImages as string);
        setExistingImages(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        setExistingImages([]);
      }
    }
  }, [requestCameraPermission]);

  // 사진 촬영
  const takePhoto = async () => {
    const totalImages = existingImages.length + images.length;
    if (totalImages >= 3) return;

    if (!cameraPermission?.granted) {
      const result = await requestCameraPermission();
      if (!result.granted) {
        Alert.alert("알림", "카메라 접근 권한이 필요합니다.");
        return;
      }
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      setImages((prev) =>
        [...prev, result.assets[0].uri].slice(0, 3 - existingImages.length),
      );
    }
  };

  // 앨범에서 선택
  const pickImage = async () => {
    const totalImages = existingImages.length + images.length;
    if (totalImages >= 3) return;

    if (!mediaLibraryPermission?.granted) {
      const result = await requestMediaLibraryPermission();
      if (!result.granted) {
        Alert.alert("알림", "사진 라이브러리 접근 권한이 필요합니다.");
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 3 - totalImages,
      quality: 1,
    });

    if (!result.canceled) {
      const newUris = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...newUris].slice(0, 3 - totalImages));
    }
  };

  // 이미지 추가 옵션 선택
  const handleAddImage = () => {
    const totalImages = existingImages.length + images.length;
    if (totalImages >= 3) return;

    // 웹은 카메라 촬영 불가 - 앨범에서만 선택
    if (Platform.OS === "web") {
      pickImage();
      return;
    }

    // iOS, 안드로이드: 사진 촬영 또는 앨범 선택
    Alert.alert(
      "사진 추가",
      "사진을 추가할 방법을 선택하세요",
      [
        {
          text: "사진 촬영",
          onPress: takePhoto,
        },
        {
          text: "앨범에서 선택",
          onPress: pickImage,
        },
        {
          text: "취소",
          style: "cancel",
        },
      ],
      { cancelable: true },
    );
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmitReview = async () => {
    if (!rating || !reviewText.trim()) {
      if (Platform.OS === "web") {
        window.alert("별점과 리뷰 내용을 모두 입력해주세요.");
      } else {
        Alert.alert("알림", "별점과 리뷰 내용을 모두 입력해주세요.");
      }
      return;
    }

    if (!isEditMode && !orderDetailIdx) {
      if (Platform.OS === "web") {
        window.alert("주문 정보를 찾을 수 없습니다.");
      } else {
        Alert.alert("알림", "주문 정보를 찾을 수 없습니다.");
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const custCode = "CUST_001";

      // FormData 생성
      const formData = new FormData();

      if (!isEditMode) {
        // 새로 작성 모드
        formData.append("orderDetailIdx", orderDetailIdx as string);
        formData.append("reviewRate", String(rating));
        formData.append("reviewContent", reviewText);
      } else {
        // 수정 모드 - 백엔드 필드명에 맞게 (content, rating)
        formData.append("content", reviewText);
        formData.append("rating", String(rating));
      }

      // 이미지 추가 (플랫폼별로 다르게 처리)
      for (let i = 0; i < images.length; i++) {
        const imageUri = images[i];

        if (Platform.OS === "web") {
          // 웹: Blob으로 변환하여 전송
          const response = await fetch(imageUri);
          const blob = await response.blob();
          const typedBlob = new Blob([blob], { type: "image/jpeg" });
          formData.append("reviewImgs", typedBlob as any, `review_${i}.jpg`);
        } else {
          // 네이티브: URI를 직접 FormData에 추가
          formData.append("reviewImgs", {
            uri: imageUri,
            type: "image/jpeg",
            name: `review_${i}.jpg`,
          } as any);
        }
      }

      // API 호출
      const endpoint = isEditMode
        ? `/cust/review/${reviewIdx}?`
        : `/cust/review`;

      const response = isEditMode
        ? await apiPutFormDataWithImage(endpoint, formData)
        : await apiPostFormDataWithImage(endpoint, formData);

      if (response.ok) {
        const message = isEditMode
          ? "리뷰가 수정되었습니다."
          : "리뷰가 등록되었습니다.";

        if (Platform.OS === "web") {
          window.alert(message);
          router.replace("/(cust)/review");
        } else {
          Alert.alert(message, "", [
            {
              text: "확인",
              onPress: () => router.replace("/(cust)/review"),
            },
          ]);
        }
      } else {
        const message = isEditMode
          ? "리뷰 수정에 실패했습니다. 잠시 후 다시 시도해주세요."
          : "이미 리뷰 작성이 완료된 상품입니다.";

        if (Platform.OS === "web") {
          window.alert(message);
        } else {
          Alert.alert(message);
        }
      }
    } catch (error) {
      console.error("Review submission error:", error);
      if (Platform.OS === "web") {
        window.alert(
          "리뷰 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
        );
      } else {
        Alert.alert(
          "리뷰 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      enabled={true}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
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
          <Text style={styles.title}>
            {isEditMode ? "리뷰 수정" : "리뷰쓰기"}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.productContainer}>
          {productImage ? (
            <Image
              source={{ uri: productImage as string }}
              style={styles.productImage}
              resizeMode="contain"
            />
          ) : (
            <View
              style={[
                styles.productImage,
                {
                  backgroundColor: "#f0f0f0",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Text style={{ color: "#999" }}>이미지</Text>
            </View>
          )}
          <View style={styles.productInfoBox}>
            <Text style={styles.storeNameSmall}>{storeNm || "상점명"}</Text>
            <Text style={styles.productNameBold} numberOfLines={1}>
              {productName || "상품이름"}
            </Text>
          </View>
        </View>

        <View style={styles.reviewContainer}>
          {/* 별점이 없을 때만 표시 */}
          {rating === 0 && (
            <Text style={styles.questionText}>상품은 어떠셨나요?</Text>
          )}
          {/* 별점 영역 */}
          <View
            style={[
              styles.ratingContainer,
              rating > 0 && styles.ratingContainerSmall,
            ]}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable
                key={star}
                onPress={() => setRating(star)}
                style={styles.starButton}
              >
                <Ionicons
                  name={rating >= star ? "star" : "star-outline"}
                  size={rating > 0 ? 24 : 40}
                  color="#FFD700"
                />
              </Pressable>
            ))}
          </View>

          {/* 별점을 등록했을 때만 표시 */}
          {rating > 0 && (
            <>
              <Text style={styles.reviewLabel}>리뷰 작성</Text>
              <TextInput
                style={styles.textInputPlaceholder}
                placeholder="리뷰를 작성해주세요."
                multiline
                value={reviewText}
                onChangeText={setReviewText}
              />

              <View style={styles.photoContainer}>
                <Text style={styles.photoLabel}>
                  사진 첨부 ({existingImages.length + images.length}/3)
                </Text>

                <View style={styles.photoGridContainer}>
                  {/* 기존 이미지 표시 */}
                  {existingImages.map((image, index) => (
                    <View key={`existing-${index}`} style={styles.photoSlot}>
                      <View style={styles.photoWrapper}>
                        <Image
                          source={{ uri: image.fileUrl }}
                          style={styles.photoImage}
                          resizeMode="contain"
                        />
                        <Pressable
                          style={styles.removePhotoButton}
                          onPress={() => removeExistingImage(index)}
                        >
                          <Ionicons
                            name="close-circle"
                            size={24}
                            color="#FF6B35"
                          />
                        </Pressable>
                      </View>
                    </View>
                  ))}

                  {/* 새로운 이미지 표시 */}
                  {images.map((imageUri, index) => (
                    <View key={`new-${index}`} style={styles.photoSlot}>
                      <View style={styles.photoWrapper}>
                        <Image
                          source={{ uri: imageUri }}
                          style={styles.photoImage}
                          resizeMode="contain"
                        />
                        <Pressable
                          style={styles.removePhotoButton}
                          onPress={() => removeImage(index)}
                        >
                          <Ionicons
                            name="close-circle"
                            size={24}
                            color="#FF6B35"
                          />
                        </Pressable>
                      </View>
                    </View>
                  ))}

                  {/* 빈 슬롯 (최대 3개까지) */}
                  {Array.from({
                    length: 3 - existingImages.length - images.length,
                  }).map((_, index) => (
                    <View key={`empty-${index}`} style={styles.photoSlot}>
                      <Pressable
                        style={styles.photoUploadButton}
                        onPress={handleAddImage}
                        disabled={existingImages.length + images.length >= 3}
                      >
                        <Ionicons
                          name="camera"
                          size={32}
                          color={
                            existingImages.length + images.length >= 3
                              ? "#ccc"
                              : "#888"
                          }
                        />
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (reviewText.trim().length === 0 || isSubmitting) &&
                    styles.submitButtonDisabled,
                ]}
                onPress={handleSubmitReview}
                disabled={reviewText.trim().length === 0 || isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text
                    style={[
                      styles.submitButtonText,
                      (reviewText.trim().length === 0 || isSubmitting) &&
                        styles.submitButtonTextDisabled,
                    ]}
                  >
                    {isEditMode ? "리뷰 수정" : "리뷰 등록"}
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </KeyboardAvoidingView>
  );
}
