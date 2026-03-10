import { apiGet } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./order-manage.styles";

interface OrderListItem {
    productsNm: string;
    buyer: string;
    price: number;
    payType: string;
    paymentDateTime: string;
    orderCode: string;
}

interface OrderListResponse {
    content: OrderListItem[];
    last: boolean;
    totalElements: number;
    totalPages: number;
}

function formatDateTime(isoString: string): string {
    const date = new Date(isoString);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${y}.${m}.${d} ${hh}:${mm}`;
}

export default function OrderManage() {
    const insets = useSafeAreaInsets();
    const flatListRef = useRef<FlatList>(null);

    const [orderList, setOrderList] = useState<OrderListItem[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrders = useCallback(async (pageNum: number, isRefresh = false) => {
        if (!isRefresh && (loadingMore || (!hasMore && pageNum > 0))) return;

        if (pageNum === 0) {
            isRefresh ? setRefreshing(true) : setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const response = await apiGet(`/store/app/order?page=${pageNum}&size=10`);
            if (response.ok) {
                const data: OrderListResponse = await response.json();
                if (pageNum === 0) {
                    setOrderList(data.content);
                } else {
                    setOrderList((prev) => [...prev, ...data.content]);
                }
                setHasMore(!data.last);
                setPage(pageNum);
            }
        } catch (e) {
            console.error("주문 목록 조회 오류:", e);
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setRefreshing(false);
        }
    }, [loadingMore, hasMore]);

    useFocusEffect(
        useCallback(() => {
            setPage(0);
            setHasMore(true);
            fetchOrders(0, true);
        }, [])
    );

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            fetchOrders(page + 1);
        }
    };

    const handleRefresh = () => {
        setPage(0);
        setHasMore(true);
        fetchOrders(0, true);
    };

    const renderItem = ({ item }: { item: OrderListItem }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() =>
                router.push({
                    pathname: "/(store)/order-detail",
                    params: { orderCode: item.orderCode },
                })
            }
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.productsNm} numberOfLines={1}>
                    {item.productsNm}
                </Text>
                <View style={styles.payTypeBadge}>
                    <Text style={styles.payTypeText}>
                        {item.payType}
                    </Text>
                </View>
            </View>

            <View style={styles.cardRow}>
                <Text style={styles.label}>구매자</Text>
                <Text style={styles.value}>{item.buyer}</Text>
            </View>
            <View style={styles.cardRow}>
                <Text style={styles.label}>결제금액</Text>
                <Text style={styles.priceText}>{item.price.toLocaleString()}원</Text>
            </View>
            <View style={styles.cardRow}>
                <Text style={styles.label}>결제일시</Text>
                <Text style={styles.value}>{formatDateTime(item.paymentDateTime)}</Text>
            </View>

            <View style={styles.cardFooter}>
                <Text style={styles.orderCode}>주문번호: {item.orderCode}</Text>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {insets.top > 0 && (
                <View style={{ height: insets.top, backgroundColor: "#fff" }} />
            )}

            <View style={styles.header}>
                <View style={styles.leftSection}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="chevron-back" size={24} color="#000" />
                    </TouchableOpacity>
                </View>
                <View style={styles.centerSection}>
                    <Text style={styles.title}>주문 관리</Text>
                </View>
                <View style={styles.rightSection} />
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#EF7810" />
                </View>
            ) : orderList.length === 0 ? (
                <View style={styles.centered}>
                    <Text style={styles.emptyText}>주문 내역이 없습니다.</Text>
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={orderList}
                    keyExtractor={(item) => item.orderCode}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    ListFooterComponent={
                        loadingMore ? (
                            <ActivityIndicator
                                size="small"
                                color="#EF7810"
                                style={{ marginVertical: 16 }}
                            />
                        ) : null
                    }
                />
            )}

            {insets.bottom > 0 && (
                <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
            )}
        </View>
    );
}