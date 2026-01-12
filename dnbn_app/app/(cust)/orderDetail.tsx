import { Ionicons } from "@expo/vector-icons";
import { FlatList, Text, TouchableOpacity, View, Image, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./orderdetail.styles";
import { router } from "expo-router";

export default function orderDetailScreen() {
    const insets = useSafeAreaInsets();

    const purchaseDetailList = [
        {
            orderId: "1",
            orderDate: "2026.01.05",
            orderNumber: "20260105-0001",
            paymentMethod: "카카오페이",
            totalPrice: 21500,
            discountPrice: 1500,
            finalPrice: 20000,

            store: {
                name: "가게이름1",
                address: "서울특별시 마포구 합정동 123-4",
            },

            items: [
                {
                    id: "1-1",
                    productName: "맛있는 두쫀쿠",
                    quantity: 1,
                    unitPrice: 5500,
                    totalPrice: 5500,
                    options: "기본",
                    status: "사용완료",
                    usedAt: "2026-01-05 12:33",
                },
                {
                    id: "1-2",
                    productName: "맛있는 케이크",
                    quantity: 2,
                    unitPrice: 8000,
                    totalPrice: 16000,
                    options: "초코맛",
                    status: "미사용",

                },
            ],
        },
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
                    구매 상세
                </Text>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.contentContainer}>
                <FlatList
                    data={purchaseDetailList}
                    scrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.orderId}
                    renderItem={({ item }) => (
                        <View style={styles.orderDetailContainer}>
                            <View style={styles.orderInfoContainer}>
                                <Text style={styles.orderDateText}>{item.orderDate} 결제</Text>
                                <Text style={styles.orderNumberText}>(주문번호: {item.orderNumber})</Text>
                            </View>

                            <View style={styles.wrapper}>
                                <View style={styles.storeInfoContainer}>
                                    <Text style={styles.storeNameText}>{item.store.name}</Text>
                                    <Text style={styles.storeAddressText}>{item.store.address}</Text>
                                </View>

                                <View style={styles.itemsContainer}>
                                    {item.items.map((product: { id: string; productName: string; quantity: number; totalPrice: number; unitPrice: number; options: string; status: string; usedAt?: string }) => (
                                        <View key={product.id}>
                                            <Text style={styles.orderStatusText}>{product.status}</Text>
                                            {product.usedAt && <Text style={styles.timestampText}>사용일시: {product.usedAt}</Text>}

                                            <View style={styles.itemRow}>
                                                <View style={styles.productImageContainer}>
                                                    <Image
                                                        source={require("@/assets/images/logo.png")}
                                                        style={styles.productImageContainer}
                                                        resizeMode="contain"
                                                    />
                                                </View>
                                                <View style={styles.productInfoContainer}>
                                                    <View>
                                                        <Text style={styles.productNameText}>{product.productName}</Text>
                                                        <Text style={styles.productQuantityText}>수량: {product.quantity}개</Text>
                                                        <Text style={styles.productPriceText}>{product.totalPrice.toLocaleString()}원</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.priceSummaryContainer}>
                                <View style={styles.priceSummaryItemContainer}>
                                    <Text style={styles.totalPriceText}>총 상품금액: </Text>
                                    <Text style={styles.totalPriceText}>{item.totalPrice.toLocaleString()}원</Text>
                                </View>
                                <View style={styles.priceSummaryItemContainer}>
                                    <Text style={styles.discountPriceText}>할인금액: </Text>
                                    <Text style={styles.discountPriceText}>-{item.discountPrice.toLocaleString()}원</Text>
                                </View>
                                <View style={styles.priceSummaryItemContainer}>
                                    <Text style={styles.finalPriceText}>최종 결제금액:</Text>
                                    <Text style={styles.finalPriceText}>{item.finalPrice.toLocaleString()}원</Text>
                                </View>
                                <Text style={styles.paymentMethodText}>{item.paymentMethod}</Text>
                            </View>
                        </View>
                    )}>
                </FlatList>
            </View >
            {
                insets.bottom > 0 && (
                    <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
                )
            }
        </View >

    );
}