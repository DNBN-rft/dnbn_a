import { apiGet, apiPut } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./order-detail.styles";

interface StoreAppProductItem {
    orderDetailIdx: number;
    productNm: string;
    productAmount: number;
    productPrice: number;
    orderStatus: string;
    cancelDate: string | null;
    refundDate: string | null;
    qrUseDate: string | null;
    qrUsed: boolean;
    reason: string | null;
}

interface StoreAppOrderDetailResponse {
    custId: string;
    custNm: string;
    custTelNo: string;
    payCode: string;
    orderCode: string;
    totalPrice: number;
    payType: string;
    payDate: string;
    products: StoreAppProductItem[];
}

const PAY_TYPE_LABEL: Record<string, string> = {
    CARD: "카드",
    CASH: "현금",
    KAKAO_PAY: "카카오페이",
    NAVER_PAY: "네이버페이",
    TOSS: "토스",
};

const ORDER_STATUS_COLOR: Record<string, string> = {
    "사용 완료": "#22C55E",
    "결제 완료": "#22C55E",
    "취소": "#EF4444",
    "환불": "#F59E0B",
};

function formatDateTime(isoString: string | null): string {
    if (!isoString) return "-";
    const date = new Date(isoString);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${y}.${m}.${d} ${hh}:${mm}`;
}

export default function OrderDetailPage() {
    const insets = useSafeAreaInsets();
    const { orderCode } = useLocalSearchParams<{ orderCode: string }>();

    const [detail, setDetail] = useState<StoreAppOrderDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedIdxs, setSelectedIdxs] = useState<Set<number>>(new Set());
    const [submitting, setSubmitting] = useState(false);

    const toggleSelect = (idx: number) => {
        setSelectedIdxs((prev) => {
            const next = new Set(prev);
            next.has(idx) ? next.delete(idx) : next.add(idx);
            return next;
        });
    };

    const handleUse = async () => {
        if (selectedIdxs.size === 0) {
            Alert.alert("알림", "처리할 상품을 선택해주세요.");
            return;
        }
        Alert.alert("사용 처리", `선택한 ${selectedIdxs.size}개 상품을 사용 처리하겠습니까?`, [
            { text: "취소", style: "cancel" },
            {
                text: "확인",
                onPress: async () => {
                    try {
                        setSubmitting(true);
                        const response = await apiPut("/store/app/order/use", {
                            orderDetailIdxList: Array.from(selectedIdxs),
                        });
                        if (response.ok) {
                            Alert.alert("완료", "사용되었습니다.");
                            setSelectedIdxs(new Set());
                            fetchDetail();
                        } else {
                            Alert.alert("오류", "사용 실패했습니다.");
                        }
                    } catch (e) {
                        console.error("사용 처리 오류:", e);
                        Alert.alert("오류", "네트워크 오류가 발생했습니다.");
                    } finally {
                        setSubmitting(false);
                    }
                },
            },
        ]);
    };

    const handleCancel = async () => {
        if (selectedIdxs.size === 0) {
            Alert.alert("알림", "처리할 상품을 선택해주세요.");
            return;
        }
        Alert.alert("취소 처리", `선택한 ${selectedIdxs.size}개 상품을 취소 처리하겠습니까?`, [
            { text: "취소", style: "cancel" },
            {
                text: "확인",
                style: "destructive",
                onPress: async () => {
                    try {
                        setSubmitting(true);
                        const response = await apiPut("/store/app/order/cancel", {
                            orderDetailIdxList: Array.from(selectedIdxs),
                        });
                        if (response.ok) {
                            Alert.alert("완료", "취소되었습니다.");
                            setSelectedIdxs(new Set());
                            fetchDetail();
                        } else {
                            Alert.alert("오류", "취소 실패했습니다.");
                        }
                    } catch (e) {
                        console.error("취소 처리 오류:", e);
                        Alert.alert("오류", "네트워크 오류가 발생했습니다.");
                    } finally {
                        setSubmitting(false);
                    }
                },
            },
        ]);
    };

    const fetchDetail = useCallback(async () => {
        if (!orderCode) return;
        try {
            setLoading(true);
            const response = await apiGet(`/store/app/order/${orderCode}`);
            if (response.ok) {
                const data: StoreAppOrderDetailResponse = await response.json();
                setDetail(data);
            } else {
                console.error("주문 상세 조회 실패:", response.status);
            }
        } catch (e) {
            console.error("주문 상세 API 오류:", e);
        } finally {
            setLoading(false);
        }
    }, [orderCode]);

    useFocusEffect(
        useCallback(() => {
            fetchDetail();
        }, [fetchDetail])
    );

    const Header = () => (
        <View style={styles.header}>
            <View style={styles.leftSection}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
            </View>
            <View style={styles.centerSection}>
                <Text style={styles.title}>주문 상세</Text>
            </View>
            <View style={styles.rightSection} />
        </View>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                {insets.top > 0 && <View style={{ height: insets.top, backgroundColor: "#fff" }} />}
                <Header />
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#EF7810" />
                </View>
            </View>
        );
    }

    if (!detail) {
        return (
            <View style={styles.container}>
                {insets.top > 0 && <View style={{ height: insets.top, backgroundColor: "#fff" }} />}
                <Header />
                <View style={styles.centered}>
                    <Text style={styles.emptyText}>데이터를 불러올 수 없습니다.</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {insets.top > 0 && <View style={{ height: insets.top, backgroundColor: "#fff" }} />}
            <Header />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* 결제 정보 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>결제 정보</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>주문번호</Text>
                        <Text style={styles.value}>{detail.orderCode}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>결제코드</Text>
                        <Text style={styles.value}>{detail.payCode}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>결제수단</Text>
                        <Text style={styles.value}>
                            {PAY_TYPE_LABEL[detail.payType] ?? detail.payType}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>결제일시</Text>
                        <Text style={styles.value}>{formatDateTime(detail.payDate)}</Text>
                    </View>
                    <View style={[styles.row, styles.totalRow]}>
                        <Text style={styles.totalLabel}>총 결제금액</Text>
                        <Text style={styles.totalPrice}>{detail.totalPrice.toLocaleString()}원</Text>
                    </View>
                </View>

                {/* 구매자 정보 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>구매자 정보</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>아이디</Text>
                        <Text style={styles.value}>{detail.custId}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>이름</Text>
                        <Text style={styles.value}>{detail.custNm}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>연락처</Text>
                        <Text style={styles.value}>{detail.custTelNo}</Text>
                    </View>
                </View>

                {/* 상품 목록 */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>상품 목록</Text>
                        <Text style={styles.selectedCount}>
                            {selectedIdxs.size > 0 ? `${selectedIdxs.size}개 선택` : ""}
                        </Text>
                    </View>
                    {detail.products.map((product, index) => {
                        const statusColor =
                            ORDER_STATUS_COLOR[product.orderStatus] ?? "#6B7280";
                        const statusLabel =
                            product.orderStatus
                        const isSelected = selectedIdxs.has(product.orderDetailIdx);
                        const isSelectable =
                            product.orderStatus !== "취소" && product.orderStatus !== "환불";

                        return (
                            <TouchableOpacity
                                key={product.orderDetailIdx}
                                style={[
                                    styles.productCard,
                                    index < detail.products.length - 1 && styles.productCardBorder,
                                    isSelected && styles.productCardSelected,
                                ]}
                                onPress={() => isSelectable && toggleSelect(product.orderDetailIdx)}
                                activeOpacity={isSelectable ? 0.7 : 1}
                            >
                                <View style={styles.productHeader}>
                                    <View style={styles.checkboxRow}>
                                        {isSelectable && (
                                            <View
                                                style={[
                                                    styles.checkbox,
                                                    isSelected && styles.checkboxSelected,
                                                ]}
                                            >
                                                {isSelected && (
                                                    <Ionicons name="checkmark" size={14} color="#fff" />
                                                )}
                                            </View>
                                        )}
                                        <Text style={styles.productNm} numberOfLines={2}>
                                            {product.productNm}
                                        </Text>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: `${statusColor}18` }]}>
                                        <Text style={[styles.statusText, { color: statusColor }]}>
                                            {statusLabel}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.productRow}>
                                    <Text style={styles.productLabel}>수량</Text>
                                    <Text style={styles.productValue}>{product.productAmount}개</Text>
                                </View>
                                <View style={styles.productRow}>
                                    <Text style={styles.productLabel}>금액</Text>
                                    <Text style={styles.productPrice}>
                                        {product.productPrice.toLocaleString()}원
                                    </Text>
                                </View>
                                <View style={styles.productRow}>
                                    <Text style={styles.productLabel}>QR 사용</Text>
                                    <Text style={styles.productPrice}>
                                        {product.qrUseDate ? formatDateTime(product.qrUseDate) : "미사용"}
                                    </Text>
                                </View>

                                {product.cancelDate && (
                                    <View style={styles.productRow}>
                                        <Text style={styles.productLabel}>취소일시</Text>
                                        <Text style={styles.productValue}>
                                            {formatDateTime(product.cancelDate)}
                                        </Text>
                                    </View>
                                )}
                                {product.refundDate && (
                                    <View style={styles.productRow}>
                                        <Text style={styles.productLabel}>환불일시</Text>
                                        <Text style={styles.productValue}>
                                            {formatDateTime(product.refundDate)}
                                        </Text>
                                    </View>
                                )}
                                {product.reason && (
                                    <View style={styles.reasonContainer}>
                                        <Text style={styles.reasonLabel}>사유</Text>
                                        <Text style={styles.reasonText}>{product.reason}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            {/* 하단 버튼 */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.useButton, submitting && styles.buttonDisabled]}
                    onPress={handleUse}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.useButtonText}>사용</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton, submitting && styles.buttonDisabled]}
                    onPress={handleCancel}
                    disabled={submitting}
                >
                    <Text style={styles.cancelButtonText}>취소</Text>
                </TouchableOpacity>
            </View>
            {insets.bottom > 0 && (
                <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
            )}
        </View>
    );
}
