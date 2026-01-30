import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, Image, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { styles } from "./negolist.styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";

type SortType = "distance" | "price" | "rating" | "new";

const formatDistance = (distanceKm: number): string => {
    if (distanceKm >= 1) {
        return `${distanceKm.toFixed(1)}km`;
    }
    return `${Math.round(distanceKm * 1000)}m`;
};

const formatCountdown = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export default function NegoListScreen() {
    const insets = useSafeAreaInsets();
    const [sortBy, setSortBy] = useState<SortType>("distance");
    const [timeLeft, setTimeLeft] = useState<{ [key: string]: number }>({});

    const negoProducts = [
        { id: '1', uri: require('@/assets/images/products_soyun/lunch.jpg'), productName: '점심식사', storeName: '쿠우쿠우', price: 8000, originalPrice: 10000, distance: 0.5, rating: 4.5, reviewCount: 45, timeLimitSeconds: 12 * 3600 },
        { id: '2', uri: require('@/assets/images/products_soyun/pizza.jpg'), productName: '고구마피자', storeName: '피자리아', price: 12000, originalPrice: 15000, distance: 1.2, rating: 4.7, reviewCount: 82, timeLimitSeconds: 8 * 3600 },
        { id: '3', uri: require('@/assets/images/products_soyun/dak.jpg'), productName: '닭갈비', storeName: '춘천닭갈비가게', price: 5000, originalPrice: 6500, distance: 0.8, rating: 4.3, reviewCount: 30, timeLimitSeconds: 24 * 3600 },
        { id: '4', uri: require('@/assets/images/products_soyun/fish.jpg'), productName: '맛있는 방어회', storeName: '바다수산', price: 6000, originalPrice: 7500, distance: 0.5, rating: 4.6, reviewCount: 56, timeLimitSeconds: 6 * 3600 },
        { id: '5', uri: require('@/assets/images/products_soyun/lobster.jpg'), productName: '랍스터 조개', storeName: 'LOBSTER KING', price: 15000, originalPrice: 18000, distance: 1.2, rating: 4.8, reviewCount: 120, timeLimitSeconds: 18 * 3600 },
    ]

    // 초기 timeLeft 설정 및 카운트다운
    useEffect(() => {
        // 초기값 설정
        const initialTimeLeft: { [key: string]: number } = {};
        negoProducts.forEach(product => {
            initialTimeLeft[product.id] = product.timeLimitSeconds;
        });
        setTimeLeft(initialTimeLeft);

        // 1초마다 업데이트
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                const updated: { [key: string]: number } = {};
                negoProducts.forEach(product => {
                    updated[product.id] = Math.max(0, (prev[product.id] || product.timeLimitSeconds) - 1);
                });
                return updated;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const getSortedProducts = () => {
        const sorted = [...negoProducts];
        switch (sortBy) {
            case "distance":
                return sorted.sort((a, b) => a.distance - b.distance);
            case "price":
                return sorted.sort((a, b) => a.price - b.price);
            case "rating":
                return sorted.sort((a, b) => b.rating - a.rating);
            case "new":
                return sorted.reverse();
            default:
                return sorted;
        }
    };

    const sortOptions: { id: SortType; label: string }[] = [
        { id: "distance", label: "거리순" },
        { id: "price", label: "가격순" },
        { id: "rating", label: "평점순" },
        { id: "new", label: "신규순" },
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
                    네고 상품
                </Text>
                <View style={styles.placeholder} />
            </View>

            {/* 정렬 옵션 */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.sortContainer}
                contentContainerStyle={styles.sortContentContainer}
            >
                {sortOptions.map((option) => (
                    <TouchableOpacity
                        key={option.id}
                        style={[
                            styles.sortButton,
                            sortBy === option.id && styles.sortButtonActive,
                        ]}
                        onPress={() => setSortBy(option.id)}
                    >
                        <Text
                            style={[
                                styles.sortButtonText,
                                sortBy === option.id && styles.sortButtonTextActive,
                            ]}
                        >
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <FlatList
                data={getSortedProducts()}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingVertical: 8 }}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.productItemContainer} 
                        onPress={() => router.push("/(cust)/nego-product-detail")}
                        activeOpacity={0.7}
                    >
                        {/* 시간 제한 배너 */}
                        {item.timeLimitSeconds && timeLeft[item.id] !== undefined && timeLeft[item.id] > 0 && (
                            <View style={styles.timeLimitBanner}>
                                <Ionicons name="time" size={16} color="rgb(239, 120, 16)" />
                                <Text style={styles.timeLimitBannerText}>남은 시간: {formatCountdown(timeLeft[item.id])}</Text>
                            </View>
                        )}

                        {/* 이미지와 정보 */}
                        <View style={styles.productContentRow}>
                            {/* 이미지 */}
                            <View style={styles.productImageWrapper}>
                                <Image 
                                    resizeMode="stretch" 
                                    source={item.uri} 
                                    style={styles.productImage} 
                                />
                            </View>

                            {/* 정보 */}
                            <View style={styles.productInfo}>
                                {/* 가게이름과 거리 (Touchable) */}
                                <View style={styles.storeNameRow}>
                                    <Text style={styles.storeName}>{item.storeName}</Text>
                                    <Text style={styles.distanceText}>{formatDistance(item.distance)}</Text>
                                </View>

                                {/* 상품명 */}
                                <Text style={styles.productName}>{item.productName}</Text>

                                {/* 가격 정보 */}
                                <Text style={styles.originalPriceText}>
                                    {item.originalPrice.toLocaleString()}원
                                </Text>

                                {/* 리뷰 평점 */}
                                <View style={styles.reviewSection}>
                                    <Ionicons name="star" size={14} color="#FFB800" />
                                    <Text style={styles.ratingText}>{item.rating}</Text>
                                    <Text style={styles.reviewCountText}>({item.reviewCount})</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}>
            </FlatList>

            {insets.bottom > 0 && (
                <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
            )}
        </View>
    );
}