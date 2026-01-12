import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./productlist.styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProductListScreen() {
    const insets = useSafeAreaInsets();

    const productList = [
        { id: '1', uri: require('@/assets/images/qr.png'), productName: '신선한 사과', storeName: '과일가게', price: 8000, review: '⭐ 4.8(120)' },
        { id: '2', uri: require('@/assets/images/logo.png'), productName: '딸기 1kg', storeName: '행복마트', price: 12000, review: '⭐ 4.5(80)' },
        { id: '3', uri: require('@/assets/images/qr.png'), productName: '바나나', storeName: '프레시마켓', price: 5000, review: '⭐ 4.7(200)' },
        { id: '4', uri: require('@/assets/images/qr.png'), productName: '오렌지', storeName: '과일가게', price: 6000, review: '⭐ 4.6(150)' },
        { id: '5', uri: require('@/assets/images/qr.png'), productName: '포도', storeName: '행복마트', price: 15000, review: '⭐ 4.9(90)' },
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
                    일반 상품
                </Text>
                <View style={styles.placeholder} />
            </View>

            <FlatList
                data={productList}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                    <View style={styles.listItemWrapper}>
                        <TouchableOpacity style={styles.productItemContainer} onPress={() => router.push("/(cust)/productDetail")}>
                            <Image resizeMode="contain" source={item.uri} style={styles.productImage} />
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{item.productName}</Text>
                                <Text style={styles.storeName}>{item.storeName}</Text>
                                <View style={styles.priceContainer}>
                                    <Text style={styles.priceText}>{item.price.toLocaleString()}원</Text>
                                </View>
                                <Text style={styles.reviewText}>{item.review}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}>
            </FlatList>

            {insets.bottom > 0 && (
                <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
            )}
        </View>
    );
}