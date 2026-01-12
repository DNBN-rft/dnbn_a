import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./negolist.styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NegoListScreen() {
    const insets = useSafeAreaInsets();

    const negoProducts = [
        { id: '1', uri: require('@/assets/images/logo.png'), productName: '신선한 사과', storeName: '과일가게', price: 8000 },
        { id: '2', uri: require('@/assets/images/logo.png'), productName: '딸기 1kg', storeName: '행복마트', price: 12000 },
        { id: '3', uri: require('@/assets/images/logo.png'), productName: '바나나', storeName: '프레시마켓', price: 5000 },
        { id: '4', uri: require('@/assets/images/logo.png'), productName: '오렌지', storeName: '과일가게', price: 6000 },
        { id: '5', uri: require('@/assets/images/logo.png'), productName: '포도', storeName: '행복마트', price: 15000 },
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
                    네고 상품
                </Text>
                <View style={styles.placeholder} />
            </View>

            <FlatList
                data={negoProducts}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                horizontal={false}
                numColumns={(1)}
                renderItem={({ item }) => (
                    <View>
                        <TouchableOpacity style={styles.productItemContainer} onPress={() => router.push("/(cust)/productDetail")}>
                            <Image resizeMode="contain"
                                source={item.uri} style={styles.productImage} />
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{item.productName}</Text>
                                <Text style={styles.storeName}>{item.storeName}</Text>
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