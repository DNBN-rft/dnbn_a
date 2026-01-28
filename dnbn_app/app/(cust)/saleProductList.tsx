import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, Image, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { styles } from "./saleproductlist.styles";
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

export default function SaleProductListScreen() {
    const insets = useSafeAreaInsets();
    const [sortBy, setSortBy] = useState<SortType>("distance");
    const [timeLeft, setTimeLeft] = useState<{ [key: string]: number }>({});

    const saleProducts = [
        { id: '1', uri: require('@/assets/images/bread.jpg'), productName: '붕어빵 슈크림', storeName: '최강잉어빵', discount: 20, price: 1000, originalPrice: 1200, distance: 0.5, rating: 4.5, reviewCount: 128, category: '신선식품', timeLimitSeconds: 86400 + 14 * 60 + 34 },
        { id: '2', uri: require('@/assets/images/chicken.jpg'), productName: '치킨', storeName: '처갓집', discount: 15, price: 12000, originalPrice: 14000, distance: 1.2, rating: 4.8, reviewCount: 256, category: '과일', timeLimitSeconds: 65 * 3600 },
        { id: '3', uri: require('@/assets/images/dak.jpg'), productName: '닭갈비', storeName: '춘천닭갈비', discount: 10, price: 5000, originalPrice: 6000, distance: 0.8, rating: 4.3, reviewCount: 89, category: '과일', timeLimitSeconds: 35 * 3600 },
        { id: '4', uri: require('@/assets/images/fish.jpg'), productName: '방어회', storeName: '우리수산', discount: 25, price: 6000, originalPrice: 8000, distance: 0.5, rating: 4.7, reviewCount: 142, category: '신선식품', timeLimitSeconds: 2 * 3600 },
        { id: '5', uri: require('@/assets/images/lobster.jpg'), productName: '랍스터', storeName: '랍스터최강', discount: 30, price: 15000, originalPrice: 20000, distance: 1.2, rating: 4.6, reviewCount: 203, category: '과일', timeLimitSeconds: 14 * 3600 },
    ];

    // 초기 timeLeft 설정 및 카운트다운
    useEffect(() => {
        // 초기값 설정
        const initialTimeLeft: { [key: string]: number } = {};
        saleProducts.forEach(product => {
            initialTimeLeft[product.id] = product.timeLimitSeconds;
        });
        setTimeLeft(initialTimeLeft);

        // 1초마다 업데이트
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                const updated: { [key: string]: number } = {};
                saleProducts.forEach(product => {
                    updated[product.id] = Math.max(0, (prev[product.id] || product.timeLimitSeconds) - 1);
                });
                return updated;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const getSortedProducts = () => {
        const sorted = [...saleProducts];
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
                    할인 상품
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
                        onPress={() => router.push("/(cust)/product-detail")}
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
                                {/* 할인 배지 */}
                                <View style={styles.discountBadge}>
                                    <Text style={styles.discountBadgeText}>{item.discount}%</Text>
                                </View>
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

                                {/* 원래가격 */}
                                <Text style={styles.originalPriceText}>
                                    {item.originalPrice.toLocaleString()}원
                                </Text>

                                {/* 할인율과 할인가 */}
                                <View style={styles.discountPriceRow}>
                                    <Text style={styles.discountText}>
                                        -{item.discount}%
                                    </Text>
                                    <Text style={styles.priceText}>
                                        {item.price.toLocaleString()}원
                                    </Text>
                                </View>

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