import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert, KeyboardAvoidingView, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./reviewreg.styles";
import { apiPostFormData } from "@/utils/api";

export default function ReviewRegScreen() {
    const insets = useSafeAreaInsets();
    const { orderDetailIdx, storeNm, productName, productImage } = useLocalSearchParams();
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [permission, requestPermission] = ImagePicker.useCameraPermissions();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        requestPermission();
    }, [requestPermission]);

    const pickImage = async () => {
        if (images.length >= 3) return;

        if (!permission?.granted) {
            const result = await requestPermission();
            if (!result.granted) return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 3,
            quality: 1,
        });

        if (!result.canceled) {
            const newUris = result.assets.map(asset => asset.uri);

            setImages(prev =>
                [...prev, ...newUris].slice(0, 3)
            );
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmitReview = async () => {
        if (!orderDetailIdx || !rating || !reviewText.trim()) {
            Alert.alert("오류", "모든 필수 항목을 입력해주세요.");
            return;
        }

        setIsSubmitting(true);
        try {
            const custCode = "CUST001";

            // FormData 생성
            const formData = new FormData();
            formData.append('orderDetailIdx', orderDetailIdx as string);
            formData.append('reviewRate', String(rating));
            formData.append('reviewContent', reviewText);

            // 이미지 추가 (Blob으로 변환)
            for (let i = 0; i < images.length; i++) {
                const imageUri = images[i];
                const response = await fetch(imageUri);
                const blob = await response.blob();
                formData.append('reviewImgs', blob as any, `review_${i}.jpg`);
            }

            // API 호출
            const response = await apiPostFormData(
                `/cust/review?custCode=${custCode}`,
                formData
            );

            if (response.ok) {
                Alert.alert("성공", "리뷰가 등록되었습니다.", [
                    {
                        text: "확인",
                        onPress: () => router.replace("/(cust)/review"),
                    }
                ]);
            } else {
                const errorText = await response.text();
                Alert.alert("오류", errorText || "리뷰 등록에 실패했습니다.");
            }
        } catch (error) {
            console.error("Review submission error:", error);
            Alert.alert("오류", "리뷰 등록 중 오류가 발생했습니다.");
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
                    <Text style={styles.title}>리뷰쓰기</Text>
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
                    <View style={[styles.productImage, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={{ color: '#999' }}>이미지</Text>
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
                <View style={[
                    styles.ratingContainer,
                    rating > 0 && styles.ratingContainerSmall
                ]}>
                    {[1, 2, 3, 4, 5].map(star => (
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
                                {[0, 1, 2].map(index => (
                                    <View key={index} style={styles.photoSlot}>
                                        {images[index] ? (
                                            <View style={styles.photoWrapper}>
                                                <Image
                                                    source={{ uri: images[index] }}
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
                                        ) : (
                                            <Pressable
                                                style={styles.photoUploadButton}
                                                onPress={pickImage}
                                                disabled={images.length >= 3}
                                            >
                                                <Ionicons
                                                    name="camera"
                                                    size={32}
                                                    color={images.length >= 3 ? "#ccc" : "#888"}
                                                />
                                            </Pressable>
                                        )}
                                    </View>
                                ))}
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                (reviewText.trim().length === 0 || isSubmitting) && styles.submitButtonDisabled
                            ]}
                            onPress={handleSubmitReview}
                            disabled={reviewText.trim().length === 0 || isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={[
                                    styles.submitButtonText,
                                    (reviewText.trim().length === 0 || isSubmitting) && styles.submitButtonTextDisabled
                                ]}>리뷰 등록</Text>
                            )}
                        </TouchableOpacity>
                    </>
                )}
            </View>
            </ScrollView>

            {insets.bottom > 0 && (
                <View style={{ height: insets.bottom, backgroundColor: "#fff" }} />
            )}
        </KeyboardAvoidingView>
    );
}
