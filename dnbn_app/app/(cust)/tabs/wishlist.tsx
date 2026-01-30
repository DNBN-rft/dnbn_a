import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { styles } from "../styles/wishlist.styles";

export default function WishlistScreen() {
  const insets = useSafeAreaInsets();
  const [wishList, setWishList] = useState<{ [key: string]: boolean }>({
    '1': true, '2': true, '3': true, '4': true, '5': true
  });

    const storeList = [
        { id: '1', uri: require('@/assets/images/products_soyun/pig.png'), storeName: '족발집', rating: 4.8, reviewCount: 120, category: '음식점', businessType: '일반음식점', address: '서울시 강남구', totalProducts: 34 },
        { id: '2', uri: require('@/assets/images/products_soyun/fruit.png'), storeName: '과일가게', rating: 4.5, reviewCount: 80, category: '과일', businessType: '소매업', address: '서울시 서초구', totalProducts: 12 },
        { id: '3', uri: require('@/assets/images/products_soyun/mart.png'), storeName: '행복마트', rating: 4.7, reviewCount: 200, category: '마트', businessType: '대형마트', address: '서울시 송파구', totalProducts: 56 },
        { id: '4', uri: require('@/assets/images/products_soyun/freshmarket.png'), storeName: '프레시마켓', rating: 4.6, reviewCount: 150, category: '신선식품', businessType: '식품유통', address: '서울시 강동구', totalProducts: 23 },
        { id: '5', uri: require('@/assets/images/products_soyun/electronic.png'), storeName: 'A전자', rating: 4.9, reviewCount: 90, category: '가전제품', businessType: '전자제품 판매', address: '서울시 용산구', totalProducts: 45 },
    ]

    const toggleWish = (storeId: string) => {
        setWishList(prev => ({
            ...prev,
            [storeId]: !prev[storeId]
        }));
    }

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
                    관심 매장
                </Text>
                <View style={styles.placeholder} />
            </View>
            {/* 찜한 가맹점 총 개수 */}
            <View style={styles.countContainer}>
                <Text style={styles.countText}>총 {storeList.length}개의 가맹점</Text>
            </View>

            {/* 가맹점 리스트 */}
            <FlatList
                data={storeList}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <View style={styles.storeItemWrapper}>
                        <TouchableOpacity 
                            style={styles.storeItemContainer} 
                            onPress={() => router.push("/(cust)/storeInfo")}
                            activeOpacity={0.7}
                        >
                            {/* 가게 이미지 */}
                            <Image 
                                resizeMode="stretch" 
                                source={item.uri} 
                                style={styles.storeImage} 
                            />
                            
                            {/* 가게 정보 */}
                            <View style={styles.storeInfo}>
                                {/* 가게 이름 및 주소 */}
                                <View style={styles.nameAddressContainer}>
                                    <Text style={styles.storeName} numberOfLines={1}>
                                        {item.storeName}
                                    </Text>
                                    <Text style={styles.addressText} numberOfLines={1}>
                                        {item.address}
                                    </Text>
                                </View>
                                
                                {/* 업종/업태 */}
                                <Text style={styles.businessTypeText}>
                                    {item.category} / {item.businessType}
                                </Text>
                                
                                {/* 평균 별점 및 리뷰 수 */}
                                <View style={styles.ratingContainer}>
                                    <Ionicons name="star" size={16} color="#FFB800" />
                                    <Text style={styles.ratingText}>
                                        {item.rating.toFixed(1)}
                                    </Text>
                                    <Text style={styles.reviewCountText}>
                                        ({item.reviewCount})
                                    </Text>
                                </View>
                                
                                {/* 등록 상품 수 */}
                                <View style={styles.productCountContainer}>
                                    <Ionicons name="pricetag-outline" size={14} color="#666" />
                                    <Text style={styles.productCountText}>
                                        등록 상품 {item.totalProducts}개
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        {/* 찜 버튼 */}
                        <TouchableOpacity 
                            style={styles.wishButton}
                            onPress={() => toggleWish(item.id)}
                        >
                            <Ionicons 
                                name={wishList[item.id] ? "heart" : "heart-outline"} 
                                size={24} 
                                color={wishList[item.id] ? "#FF4458" : "#ccc"}
                            />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}
