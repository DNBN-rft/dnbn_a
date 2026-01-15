import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./orderdetail.styles";

export default function OrderDetailScreen() {
    const insets = useSafeAreaInsets();

    const purchaseDetailList = [
        {
            orderId: "1",
            orderDateTime: "2026.01.05 14:30",
            orderNumber: "20260105-0001",
            paymentMethod: "신용카드",
            paymentInfo: "신한카드 1234-****-****-5678 (일시불)",
            totalPrice: 23000,
            discountPrice: 1500,
            finalPrice: 21500,

            stores: [
                {
                    storeId: "store1",
                    name: "가게이름1",
                    items: [
                        {
                            id: "1-1",
                            productName: "맛있는 두쫀쿠",
                            quantity: 1,
                            unitPrice: 5500,
                            totalPrice: 5500,
                            options: "기본",
                            status: "사용완료",
                            usedAt: "2026.01.06 12:33",
                        },
                        {
                            id: "1-2",
                            productName: "맛있는 케이크",
                            quantity: 2,
                            unitPrice: 8000,
                            totalPrice: 16000,
                            options: "초코맛",
                            status: "미사용",
                            usedAt: "",
                        },
                    ],
                },
                {
                    storeId: "store2",
                    name: "가게이름2",
                    items: [
                        {
                            id: "1-3",
                            productName: "신선한 빵",
                            quantity: 3,
                            unitPrice: 3000,
                            totalPrice: 9000,
                            options: "기본",
                            status: "미사용",
                            usedAt: "",
                        },
                    ],
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

            <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                {purchaseDetailList.map((item) => (
                    <View key={item.orderId} style={styles.orderDetailContainer}>
                        {/* 결제 일시 및 주문번호 */}
                        <View style={styles.orderInfoContainer}>
                            <View style={styles.orderInfoLeft}>
                                <Text style={styles.orderDateText}>{item.orderDateTime} 결제</Text>
                                <Text style={styles.orderNumberText}>주문번호: {item.orderNumber}</Text>
                            </View>
                            <Pressable style={styles.receiptButton}>
                                <Text style={styles.receiptButtonText}>영수증</Text>
                            </Pressable>
                        </View>

                        {/* 주문 정보 타이틀 */}
                        <Text style={styles.mainTitle}>주문 정보</Text>

                        {/* 가게별 박스 */}
                        {item.stores.map((store) => (
                            <View key={store.storeId} style={styles.sectionBox}>
                                <Text style={styles.storeNameText}>{store.name}</Text>
                                <View style={styles.divider} />
                                
                                {store.items.map((product) => (
                                    <View key={product.id} style={styles.productSection}>
                                        <View style={styles.productStatusRow}>
                                            <Text style={styles.orderStatusText}>{product.status}</Text>
                                            <Text style={styles.timestampText}>
                                                {product.usedAt ? ` 사용일시: ${product.usedAt}` : ' 사용일시: 미사용'}
                                            </Text>
                                        </View>
                                        
                                        <View style={styles.productRow}>
                                            <View style={styles.productImageContainer}>
                                                <Image
                                                    source={require("@/assets/images/logo.png")}
                                                    style={styles.productImage}
                                                    resizeMode="contain"
                                                />
                                            </View>
                                            <View style={styles.productInfoContainer}>
                                                <Text style={styles.productNameText}>{product.productName}</Text>
                                                <Text style={styles.productQuantityText}>수량: {product.quantity}개</Text>
                                                <Text style={styles.productPriceText}>{product.totalPrice.toLocaleString()}원</Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ))}

                        {/* 결제 정보 타이틀 */}
                        <Text style={styles.mainTitle}>결제 정보</Text>

                        {/* 결제 정보 박스 */}
                        <View style={styles.sectionBox}>
                            <View style={styles.paymentSummary}>
                                <View style={styles.paymentRow}>
                                    <Text style={styles.paymentLabel}>주문금액</Text>
                                    <Text style={styles.paymentValue}>총 {item.totalPrice.toLocaleString()}원</Text>
                                </View>
                                <View style={styles.paymentRow}>
                                    <Text style={styles.paymentLabelSub}>상품금액</Text>
                                    <Text style={styles.paymentValueSub}>{item.totalPrice.toLocaleString()}원</Text>
                                </View>
                                <View style={styles.paymentRow}>
                                    <Text style={styles.paymentLabelSub}>할인금액</Text>
                                    <Text style={styles.discountValue}>-{item.discountPrice.toLocaleString()}원</Text>
                                </View>
                                
                                <View style={styles.divider} />
                                
                                <View style={styles.paymentRow}>
                                    <Text style={styles.paymentMethodLabel}>{item.paymentMethod}</Text>
                                    <Text style={styles.finalPriceText}>{item.finalPrice.toLocaleString()}원</Text>
                                </View>
                                <Text style={styles.paymentInfoText}>{item.paymentInfo}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
            {
                insets.bottom > 0 && (
                    <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
                )
            }
        </View >

    );
}