import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./saleproductlist.styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SaleProductListScreen() {
    const insets = useSafeAreaInsets();

    const saleProducts = [
        { id: '1', uri: require('@/assets/images/image1.jpg'), productName: '신선한 사과', storeName: '과일가게', discount: 20, price: 8000, originalPrice: 10000 },
        { id: '2', uri: require('@/assets/images/image1.jpg'), productName: '딸기 1kg', storeName: '행복마트', discount: 15, price: 12000, originalPrice: 14000 },
        { id: '3', uri: require('@/assets/images/image1.jpg'), productName: '바나나', storeName: '프레시마켓', discount: 10, price: 5000, originalPrice: 6000 },
        { id: '4', uri: require('@/assets/images/image1.jpg'), productName: '오렌지', storeName: '과일가게', discount: 25, price: 6000, originalPrice: 8000 },
        { id: '5', uri: require('@/assets/images/image1.jpg'), productName: '포도', storeName: '행복마트', discount: 30, price: 15000, originalPrice: 20000 },
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
                    할인 상품
                </Text>
                <View style={styles.placeholder} />
            </View>

            <FlatList
                data={saleProducts}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                horizontal={false}
                numColumns={(1)}
                renderItem={({ item }) => (
                    <View>
                        <TouchableOpacity style={styles.productItemContainer} onPress={() => router.push("/(cust)/product-detail")}>
                            <Image resizeMode="contain" source={item.uri} style={styles.productImage} />
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{item.productName}</Text>
                                <Text style={styles.storeName}>{item.storeName}</Text>
                                <View style={styles.priceContainer}>
                                    <Text style={styles.originalPriceText}>{item.originalPrice.toLocaleString()}원</Text>
                                    <Text style={styles.discountText}>{item.discount}%</Text>
                                </View>
                                <Text style={styles.priceText}>{item.price.toLocaleString()}원</Text>
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