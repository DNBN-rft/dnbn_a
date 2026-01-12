import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./reviewreg.styles";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";

export default function ReviewRegScreen() {
    const insets = useSafeAreaInsets();
    const [rating, setRating] = useState(0);
    const [images, setImages] = useState<string[]>([]);
    const [permission, requestPermission] = ImagePicker.useCameraPermissions();

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
                <Text style={styles.title}>리뷰쓰기</Text>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.productContainer}>
                <Image
                    source={require("@/assets/images/qr.png")}
                    style={styles.productImage}
                    resizeMode="contain"
                />
                <View style={styles.productTextContainer}>
                    <Text style={styles.productName} numberOfLines={1}>
                        상품이름asdasdasdasdasdasdasdasdasdasA
                    </Text>
                    <Text style={styles.storeName}>과일가게</Text>
                </View>
            </View>

            <View style={styles.reviewContainer}>
                <Text style={styles.titleText}>상품은 어떠셨나요?</Text>

                <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map(star => (
                        <Pressable
                            key={star}
                            onPress={() => setRating(star)}
                            style={styles.starButton}
                        >
                            <Ionicons
                                name={rating >= star ? "star" : "star-outline"}
                                size={32}
                                color="#EF7810"
                            />
                        </Pressable>
                    ))}
                </View>

                <Text style={styles.reviewLabel}>리뷰 작성</Text>
                <TextInput
                    style={styles.textInputPlaceholder}
                    placeholder="리뷰를 작성해주세요."
                    multiline
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
                    style={styles.submitButton}
                    onPress={() => {
                        // 리뷰 제출 로직
                    }}
                >
                    <Text style={styles.submitButtonText}>리뷰 제출</Text>
                </TouchableOpacity>
            </View>

            {insets.bottom > 0 && (
                <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
            )}
        </View>
    );
}
