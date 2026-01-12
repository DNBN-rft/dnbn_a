import { Text, View, TouchableOpacity, Image, FlatList } from "react-native";
import { styles } from "./wishlist.styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function WishlistScreen() {
    const insets = useSafeAreaInsets();

    const storeList = [
        { id: '1', uri: require('@/assets/images/logo.png'), storeName: '족발집', review: '⭐ 4.8(120)', category: '음식점', addr: '서울시 강남구 역삼동', totalProducts: 34 },
        { id: '2', uri: require('@/assets/images/logo.png'), storeName: '과일가게', review: '⭐ 4.5(80)', category: '과일', addr: '서울시 서초구 반포동', totalProducts: 12 },
        { id: '3', uri: require('@/assets/images/logo.png'), storeName: '행복마트', review: '⭐ 4.7(200)', category: '마트', addr: '서울시 송파구 잠실동', totalProducts: 56 },
        { id: '4', uri: require('@/assets/images/logo.png'), storeName: '프레시마켓', review: '⭐ 4.6(150)', category: '신선식품', addr: '서울시 강동구 천호동', totalProducts: 23 },
        { id: '5', uri: require('@/assets/images/logo.png'), storeName: 'A전자', review: '⭐ 4.9(90)', category: '가전제품', addr: '서울시 용산구 이태원동', totalProducts: 45 },
    ]
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
            <View>
                <FlatList
                    data={storeList}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    horizontal={false}
                    numColumns={(1)}
                    renderItem={({ item }) => (
                        <View>
                            <TouchableOpacity style={styles.storeItemContainer} onPress={() => router.push("/(cust)/storeInfo")}>
                                <Image resizeMode="contain" source={item.uri} style={styles.storeImage} />
                                <View style={styles.storeInfo}>
                                    <View style={styles.storeHeader}>
                                        <Text style={styles.storeName}>{item.storeName}</Text>
                                        <Text style={styles.categoryText}>{item.category}</Text>
                                    </View>
                                    <Text style={styles.addrText}>{item.addr}</Text>
                                    <Text style={styles.reviewText}>{item.review}</Text>
                                    <Text style={styles.totalProductsText}>등록 상품 {item.totalProducts}개</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}>
                </FlatList>
            </View>
        </View>
    );
}
