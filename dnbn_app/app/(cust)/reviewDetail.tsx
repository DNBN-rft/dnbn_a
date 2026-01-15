import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./reviewdetail.styles";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ReviewDetail {
    id: string;
    uri: string;
    productName: string;
    rating: number;
    comment: string;
    images: any[];
}

export default function ReviewDetailScreen() {
    const insets = useSafeAreaInsets();

    const review: ReviewDetail[] = [
        {
            id: "1",
            uri: "@/assets/images/logo.png",
            productName: "상품이름asdasdasdasdasdasdasdasdasdasA",
            rating: 5,
            comment: "정말 맛있었어요! 강추합니다. 백암에서 제일로 맛있는 무언가",
            images: [
                require('@/assets/images/icon.png'),
                require('@/assets/images/icon.png'),
                require('@/assets/images/icon.png')
            ]
        }
    ];
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
                <Text style={styles.title}>
                    리뷰 상세
                </Text>
                <View style={styles.placeholder} />
            </View>

            <View style={{ flex: 1 }}>
                <View style={styles.productInfoContainer}>
                    <TouchableOpacity onPress={() => router.push("/(cust)/product-detail")}>
                        <Image source={require('@/assets/images/qr.png')} style={styles.productImage} resizeMode="contain" />
                    </TouchableOpacity>
                    <View style={styles.productTextContainer}>
                        <Text style={styles.productName} numberOfLines={1}>{review[0].productName}</Text>
                        <Text style={styles.storeName}>과일가게</Text>
                    </View>
                </View>

                <View style={styles.reviewInfoContainer}>
                    <View style={styles.regContainer}>
                        <Text style={styles.regNm}>사람이름</Text>
                        <Text style={styles.regDate}>2024-06-15</Text>
                    </View>
                    <Text style={styles.ratingText}>{"⭐".repeat(review[0].rating)}</Text>

                    <View style={styles.imageContainer}>
                        {review[0].images.map((image, index) => (
                            <View key={index} style={styles.imageWrapper}>
                                <Image
                                    source={image}
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                            </View>
                        ))}
                    </View>
                    <Text style={styles.reviewContent}>
                        {review[0].comment}
                    </Text>
                </View>
            </View>
            {insets.bottom > 0 && (
                <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
            )}
        </View>

    );
}