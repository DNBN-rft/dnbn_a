import { apiPostFormDataWithImage, apiPutFormDataWithImage } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  Linking,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./reviewreg.styles";

interface ReviewImageItem {
  uri: string;
  name: string;
  isNew: boolean;
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
  const [images, setImages] = useState<ReviewImageItem[]>([]);
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
        if (Array.isArray(parsed)) {
          setImages(
            parsed.map((img: any) => ({
              uri: img.fileUrl,
              name: img.originalName || `existing_${img.order ?? 0}.jpg`,
              isNew: false,
            }))
          );
        }
      } catch (error) {
        setImages([]);
      }
    }
  }, [requestCameraPermission]);

  // 사진 촬영
  const takePhoto = async () => {
    if (images.length >= 3) return;

    if (!cameraPermission?.granted) {
      const result = await requestCameraPermission();
      if (!result.granted) {
        Alert.alert(
          "카메라 권한 필요",
          "사진 촬영을 위해 카메라 접근 권한이 필요합니다.",
          [
            {
              text: "설정으로 이동",
              onPress: () => Linking.openSettings(),
            },
            { text: "취소", style: "cancel" },
          ],
        );
        return;
      }
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const ext = asset.mimeType?.split("/").pop()?.replace("jpeg", "jpg") || "jpg";
      const rawName = asset.fileName || asset.uri.split("/").pop() || "";
      const name = rawName.includes(".")
        ? rawName
        : `${rawName || `review_${Date.now()}`}.${ext}`;
      setImages((prev) => [...prev, { uri: asset.uri, name, isNew: true }].slice(0, 3));
    }
  };

  // 앨범에서 선택
  const pickImage = async () => {
    if (images.length >= 3) return;

    if (!mediaLibraryPermission?.granted) {
      const result = await requestMediaLibraryPermission();
      if (!result.granted) {
        Alert.alert(
          "카메라 권한 필요",
          "사진 촬영을 위해 카메라 접근 권한이 필요합니다.",
          [
            {
              text: "설정으로 이동",
              onPress: () => Linking.openSettings(),
            },
            { text: "취소", style: "cancel" },
          ],
        );
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 3 - images.length,
      quality: 1,
    });

    if (!result.canceled) {
      const newItems = result.assets.map((asset) => {
        const ext = asset.mimeType?.split("/").pop()?.replace("jpeg", "jpg") || "jpg";
        const rawName = asset.fileName || asset.uri.split("/").pop() || "";
        const name = rawName.includes(".")
          ? rawName
          : `${rawName || `review_${Date.now()}`}.${ext}`;
        return { uri: asset.uri, name, isNew: true };
      });
      setImages((prev) => [...prev, ...newItems].slice(0, 3));
    }
  };

  // 이미지 추가 옵션 선택
  const handleAddImage = () => {
    if (images.length >= 3) return;

    // 웹은 카메라 촬영 불가 - 앨범에서만 선택
    if (Platform.OS === "web") {
      void pickImage();
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

      // 이미지 추가 (기존 이미지 + 신규 이미지 모두 전송, 플랫폼별로 다르게 처리)
      // 백엔드는 기존 이미지를 전체 삭제 후 전달받은 이미지를 전체 저장하므로
      // 유지할 기존 이미지(isNew: false) + 새 이미지(isNew: true) 모두 전송
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const ext = img.name.split(".").pop()?.toLowerCase() || "jpg";
        const mimeType =
          ext === "png"
            ? "image/png"
            : ext === "gif"
              ? "image/gif"
              : ext === "webp"
                ? "image/webp"
                : "image/jpeg";

        if (Platform.OS === "web") {
          // 웹: Blob으로 변환하여 전송 (로컬 URI든 서버 URL이든 동일하게 처리)
          const response = await fetch(img.uri);
          const blob = await response.blob();
          const typedBlob = new Blob([blob], { type: mimeType });
          formData.append("reviewImgs", typedBlob as any, img.name);
        } else {
          // 네이티브: URI를 직접 FormData에 추가 (로컬 URI든 서버 URL이든 동일하게 처리)
          formData.append("reviewImgs", {
            uri: img.uri,
            type: mimeType,
            name: img.name,
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
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff" }} />
      )}

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -insets.bottom}
        enabled={true}
      >
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
            <Text style={styles.title}>
              {isEditMode ? "리뷰 수정" : "리뷰쓰기"}
            </Text>
          </View>
          <View style={styles.rightSection} />
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
                  사진 첨부 ({images.length}/3)
                </Text>

                <View style={styles.photoGridContainer}>
                  {/* 이미지 표시 (기존 + 새로운 이미지 통합) */}
                  {images.map((img, index) => (
                    <View key={`img-${index}`} style={styles.photoSlot}>
                      <View style={styles.photoWrapper}>
                        <Image
                          source={{ uri: img.uri }}
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
                    length: 3 - images.length,
                  }).map((_, index) => (
                    <View key={`empty-${index}`} style={styles.photoSlot}>
                      <Pressable
                        style={styles.photoUploadButton}
                        onPress={handleAddImage}
                        disabled={images.length >= 3}
                      >
                        <Ionicons
                          name="camera"
                          size={32}
                          color={images.length >= 3 ? "#ccc" : "#888"}
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
      </KeyboardAvoidingView>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </ScrollView>
  );
}
