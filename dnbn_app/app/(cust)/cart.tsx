import Ionicons from '@expo/vector-icons/build/Ionicons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiGet, apiDelete, apiPut } from '@/utils/api';
import { styles } from './cart.styles';

interface CartItemImage {
    originalName: string;
    fileUrl: string;
    order: number;
}

interface CartItem {
    cartItemIdx: number;
    productNm: string;
    price: number;
    discountPrice: number;
    quantity: number;
    productAmount: number;
    itemImg: CartItemImage | null;
}

interface CartStore {
    storeNm: string;
    items: CartItem[];
    selected?: boolean;
}

export default function CartScreen() {
    const [cartItems, setCartItems] = useState<CartStore[]>([]);
    const [originalCartItems, setOriginalCartItems] = useState<CartStore[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const insets = useSafeAreaInsets();

    // 장바구니 데이터 조회
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                setLoading(true);
                // TODO: custCode를 실제 로그인 사용자 정보에서 가져오기
                const custCode = "CUST_001"; // 임시값
                
                const response = await apiGet(`/cust/cart?custCode=${custCode}`);
                
                if (response.ok) {
                    const data = await response.json();
                    // API 응답에 selected 속성 추가
                    const itemsWithSelected = data.map((store: CartStore) => ({
                        ...store,
                        selected: false,
                        items: store.items.map(item => ({
                            ...item,
                            selected: false,
                        })),
                    }));
                    setCartItems(itemsWithSelected);
                    setOriginalCartItems(JSON.parse(JSON.stringify(itemsWithSelected)));
                } else {
                    console.error("장바구니 조회 실패:", response.status);
                }
            } catch (error) {
                console.error("장바구니 조회 에러:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    // 변경된 항목만 수집
    const getChangedItems = () => {
        const changed: { cartItemIdx: number; quantity: number }[] = [];
        
        cartItems.forEach((store) => {
            store.items.forEach((item) => {
                const originalItem = originalCartItems
                    .find(s => s.storeNm === store.storeNm)
                    ?.items.find(i => i.cartItemIdx === item.cartItemIdx);
                
                if (originalItem && originalItem.quantity !== item.quantity) {
                    changed.push({
                        cartItemIdx: item.cartItemIdx,
                        quantity: item.quantity,
                    });
                }
            });
        });
        
        return changed;
    };

    // 수량 변경 저장
    const saveQuantityChanges = async () => {
        // originalCartItems가 설정되지 않았으면 저장하지 않음
        if (originalCartItems.length === 0) return true;
        
        const changedItems = getChangedItems();
        
        if (changedItems.length === 0) return true;
        
        try {
            const response = await apiPut(`/cust/cart`, changedItems);
            
            if (response.ok) {
                setOriginalCartItems(JSON.parse(JSON.stringify(cartItems)));
                return true;
            } else {
                console.error("수량 저장 실패:", response.status);
                return false;
            }
        } catch (error) {
            console.error("수량 저장 오류:", error);
            return false;
        }
    };

    // 포맷팅 함수
    const formatPrice = (price: number) => {
        return price.toLocaleString('ko-KR') + '원';
    };

    // 총 금액 계산 (선택된 상품만)
    const calculateStoreTotal = (items: CartItem[] | undefined) => {
        if (!items || !Array.isArray(items)) return 0;
        return items
            .filter(item => (item as any).selected)
            .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const calculateSelectedTotal = () => {
        let totalAmount = 0;
        let totalCount = 0;
        cartItems.forEach(store => {
            store.items.forEach(item => {
                if ((item as any).selected) {
                    totalAmount += item.price * item.quantity;
                    totalCount += 1;
                }
            });
        });
        return { totalAmount, totalCount };
    };

    // 전체 선택/해제
    const handleSelectAll = () => {
        const newSelectAllState = !selectAll;
        setSelectAll(newSelectAllState);
        setCartItems(
            cartItems.map((store) => ({
                ...store,
                selected: newSelectAllState,
                items: store.items.map((item) => ({
                    ...item,
                    selected: newSelectAllState,
                })),
            }))
        );
    };

    // 가맹점 선택/해제
    const handleStoreSelect = (storeNm: string) => {
        setCartItems(prevItems => {
            const updatedItems = prevItems.map((store) => {
                if (store.storeNm === storeNm) {
                    const newSelected = !store.selected;
                    return {
                        ...store,
                        selected: newSelected,
                        items: store.items.map((item) => ({
                            ...item,
                            selected: newSelected,
                        })),
                    };
                }
                return store;
            });
            updateSelectAllState(updatedItems);
            return updatedItems;
        });
    };

    // 상품 선택/해제
    const handleItemSelect = (storeNm: string, cartItemIdx: number) => {
        setCartItems(prevItems => {
            const updatedItems = prevItems.map((store) => {
                if (store.storeNm === storeNm) {
                    const updatedItems = store.items.map((item) => {
                        if (item.cartItemIdx === cartItemIdx) {
                            return { ...item, selected: !(item as any).selected };
                        }
                        return item;
                    });
                    const allSelected = updatedItems.every((i) => (i as any).selected);
                    return {
                        ...store,
                        selected: allSelected,
                        items: updatedItems,
                    };
                }
                return store;
            });
            updateSelectAllState(updatedItems);
            return updatedItems;
        });
    };

    // 수량 증가
    const handleIncreaseQty = (storeNm: string, cartItemIdx: number) => {
        setCartItems(prevItems =>
            prevItems.map((store) => {
                if (store.storeNm === storeNm) {
                    return {
                        ...store,
                        items: store.items.map((item) => {
                            if (item.cartItemIdx === cartItemIdx && item.quantity < item.productAmount) {
                                return { ...item, quantity: item.quantity + 1 };
                            }
                            return item;
                        }),
                    };
                }
                return store;
            })
        );
    };

    // 수량 감소
    const handleDecreaseQty = (storeNm: string, cartItemIdx: number) => {
        setCartItems(prevItems =>
            prevItems.map((store) => {
                if (store.storeNm === storeNm) {
                    return {
                        ...store,
                        items: store.items.map((item) => {
                            if (item.cartItemIdx === cartItemIdx && item.quantity > 1) {
                                return { ...item, quantity: item.quantity - 1 };
                            }
                            return item;
                        }),
                    };
                }
                return store;
            })
        );
    };

    // 상품 삭제
    const handleDeleteProduct = async (storeNm: string, cartItemIdx: number) => {
        try {
            setDeleting(true);
            const response = await apiDelete(`/cust/cart/${cartItemIdx}`);

            if (response.ok) {
                setCartItems(prevItems => {
                    const updatedItems = prevItems.map((store) => {
                        if (store.storeNm === storeNm) {
                            const updatedItems = store.items.filter(item => item.cartItemIdx !== cartItemIdx);
                            return {
                                ...store,
                                items: updatedItems,
                            };
                        }
                        return store;
                    }).filter(store => store.items && store.items.length > 0);
                    updateSelectAllState(updatedItems);
                    return updatedItems;
                });
                Alert.alert("성공", "상품이 삭제되었습니다.");
            } else {
                Alert.alert("오류", "상품 삭제에 실패했습니다.");
            }
        } catch (error) {
            console.error("상품 삭제 오류:", error);
            Alert.alert("오류", "상품 삭제 중 오류가 발생했습니다.");
        } finally {
            setDeleting(false);
        }
    };

    // 선택 삭제
    const handleDeleteSelected = async () => {
        try {
            // 선택된 cartItemIdx 수집
            const selectedIdxs: number[] = [];
            cartItems.forEach(store => {
                if (store.items && Array.isArray(store.items)) {
                    store.items.forEach(item => {
                        if ((item as any).selected) {
                            selectedIdxs.push(item.cartItemIdx);
                        }
                    });
                }
            });

            if (selectedIdxs.length === 0) {
                Alert.alert("알림", "선택된 상품이 없습니다.");
                return;
            }

            setDeleting(true);
            const response = await apiDelete(`/cust/cart`, {
                body: JSON.stringify({ cartItemIdxs: selectedIdxs }),
            });

            if (response.ok) {
                setCartItems(prevItems =>
                    prevItems.map((store) => ({
                        ...store,
                        items: (store.items || []).filter(item => !(item as any).selected),
                    })).filter(store => store.items && store.items.length > 0)
                );
                setSelectAll(false);
                Alert.alert("성공", "선택한 상품들이 삭제되었습니다.");
            } else {
                Alert.alert("오류", "상품 삭제에 실패했습니다.");
            }
        } catch (error) {
            console.error("선택 삭제 오류:", error);
            Alert.alert("오류", "상품 삭제 중 오류가 발생했습니다.");
        } finally {
            setDeleting(false);
        }
    };

    // 전체 삭제
    const handleDeleteAll = async () => {
        try {
            // 모든 cartItemIdx 수집
            const allIdxs: number[] = [];
            cartItems.forEach(store => {
                if (store.items && Array.isArray(store.items)) {
                    store.items.forEach(item => {
                        allIdxs.push(item.cartItemIdx);
                    });
                }
            });

            if (allIdxs.length === 0) {
                Alert.alert("알림", "삭제할 상품이 없습니다.");
                return;
            }

            Alert.alert(
                "확인",
                "모든 상품을 삭제하시겠습니까?",
                [
                    {
                        text: "취소",
                        onPress: () => {},
                        style: "cancel",
                    },
                    {
                        text: "삭제",
                        onPress: async () => {
                            try {
                                setDeleting(true);
                                const response = await apiDelete(`/cust/cart`, {
                                    body: JSON.stringify({ cartItemIdxs: allIdxs }),
                                });

                                if (response.ok) {
                                    setCartItems([]);
                                    setSelectAll(false);
                                    Alert.alert("성공", "모든 상품이 삭제되었습니다.");
                                } else {
                                    Alert.alert("오류", "상품 삭제에 실패했습니다.");
                                }
                            } catch (error) {
                                console.error("전체 삭제 오류:", error);
                                Alert.alert("오류", "상품 삭제 중 오류가 발생했습니다.");
                            } finally {
                                setDeleting(false);
                            }
                        },
                        style: "destructive",
                    },
                ]
            );
        } catch (error) {
            console.error("전체 삭제 오류:", error);
            Alert.alert("오류", "상품 삭제 중 오류가 발생했습니다.");
        }
    };

    // 전체선택 상태 업데이트
    const updateSelectAllState = (items: CartStore[]) => {
        const allSelected = items.every(store =>
            store.items.every(item => (item as any).selected)
        );
        setSelectAll(allSelected && items.length > 0 && items.some(store => store.items.length > 0));
    };

    const { totalAmount, totalCount } = calculateSelectedTotal();

    // 로딩 상태
    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#EF7810" />
                <Text style={{ marginTop: 10, color: '#999' }}>장바구니를 불러오는 중...</Text>
            </View>
        );
    }

    // 빈 장바구니
    if (cartItems.length === 0) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="cart-outline" size={48} color="#ddd" />
                <Text style={{ marginTop: 10, color: '#999', fontSize: 16 }}>장바구니가 비어있습니다.</Text>
            </View>
        );
    }

    // 가맹점별 렌더링
    const renderStoreItem = ({ item: store }: { item: CartStore }) => (
        <View key={store.storeNm} style={styles.cartItemContainer}>
            {/* 가맹점 헤더 */}
            <View style={styles.cartStoreInfoContainer}>
                <Pressable
                    style={styles.storeCheckboxArea}
                    onPress={() => handleStoreSelect(store.storeNm)}
                >
                    <Ionicons 
                        name={store.selected ? "checkbox" : "square-outline"} 
                        size={20} 
                        color={store.selected ? '#EF7810' : '#666'} 
                    />
                    <Text style={styles.cartStoreNameText}>{store.storeNm}</Text>
                </Pressable>
            </View>

            {/* 상품 목록 */}
            {store.items && Array.isArray(store.items) && store.items.map((item) => (
                <View key={item.cartItemIdx.toString()} style={styles.productItemWrapper}>
                    {/* 상품 정보 영역 */}
                    <View style={styles.productContentArea}>
                        {/* 체크박스 */}
                        <Pressable
                            style={styles.productCheckboxArea}
                            onPress={() => handleItemSelect(store.storeNm, item.cartItemIdx)}
                        >
                            <Ionicons 
                                name={(item as any).selected ? "checkbox" : "square-outline"} 
                                size={20} 
                                color={(item as any).selected ? '#EF7810' : '#666'} 
                            />
                        </Pressable>

                        {/* 상품 이미지 */}
                        <View style={styles.cartItemImgContainer}>
                            {item.itemImg?.fileUrl ? (
                                <Image source={{ uri: item.itemImg.fileUrl }} style={styles.productImage} />
                            ) : (
                                <Ionicons name="image-outline" size={40} color="#ccc" />
                            )}
                        </View>

                        {/* 상품 정보 */}
                        <View style={styles.cartItemInfoContainer}>
                            <Text style={styles.cartItemNmText} numberOfLines={2}>{item.productNm}</Text>
                            <View style={styles.cartItemPriceContainer}>
                                <Text style={styles.cartItemSalePriceText}>{formatPrice(item.price)}</Text>
                                <Text style={styles.cartItemOriginalPriceText}>{formatPrice(item.price + item.discountPrice)}</Text>
                            </View>
                            {/* 수량 조절 */}
                            <View style={styles.cartItemQtyContainer}>
                                <Pressable 
                                    style={[
                                        styles.cartItemQtyButton,
                                        item.quantity <= 1 && styles.qtyButtonDisabled
                                    ]}
                                    onPress={() => handleDecreaseQty(store.storeNm, item.cartItemIdx)}
                                    disabled={item.quantity <= 1}
                                >
                                    <Ionicons name="remove" size={16} color={item.quantity <= 1 ? "#ccc" : "#666"} />
                                </Pressable>
                                <Text style={styles.qtyText}>{item.quantity}</Text>
                                <Pressable 
                                    style={[
                                        styles.cartItemQtyButton,
                                        item.quantity >= item.productAmount && styles.qtyButtonDisabled
                                    ]}
                                    onPress={() => handleIncreaseQty(store.storeNm, item.cartItemIdx)}
                                    disabled={item.quantity >= item.productAmount}
                                >
                                    <Ionicons name="add" size={16} color={item.quantity >= item.productAmount ? "#ccc" : "#666"} />
                                </Pressable>
                            </View>
                            <Text style={styles.stockText}>재고: {item.productAmount}개</Text>
                        </View>
                    </View>

                    {/* 삭제 버튼 */}
                    <Pressable
                        style={[styles.cartItemDeleteButton, deleting && { opacity: 0.5 }]}
                        onPress={() => handleDeleteProduct(store.storeNm, item.cartItemIdx)}
                        disabled={deleting}
                    >
                        <Ionicons name="close" size={24} color="#999" />
                    </Pressable>
                </View>
            ))}

            {/* 가맹점별 총액 */}
            <View style={styles.cartItemDetailTotalContainer}>
                <Text style={styles.cartItemTotalText}>총 금액</Text>
                <Text style={styles.cartItemTotalSalePriceText}>
                    {formatPrice(calculateStoreTotal(store.items))}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {insets.top > 0 && (
                <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
            )}

            {/* 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={async () => {
                        await saveQuantityChanges();
                        router.back();
                    }}
                >
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>장바구니</Text>
                <View style={styles.placeholder} />
            </View>

            {/* 전체선택 / 삭제 버튼 영역 */}
            <View style={styles.cartTopContainer}>
                <Pressable style={styles.cartTopLeftSection} onPress={handleSelectAll}>
                    <Ionicons 
                        name={selectAll ? "checkbox" : "square-outline"} 
                        size={20} 
                        color={selectAll ? '#EF7810' : '#666'} 
                    />
                    <Text style={styles.cartTopSelectAllText}>전체선택</Text>
                </Pressable>
                <Pressable
                    style={[styles.cartTopDeleteButton, deleting && { opacity: 0.5 }]}
                    onPress={handleDeleteSelected}
                    disabled={deleting}
                >
                    <Text style={styles.cartTopDeleteButtonText}>선택삭제</Text>
                </Pressable>
            </View>

            {/* 장바구니 목록 */}
            <FlatList
                data={cartItems}
                renderItem={renderStoreItem}
                keyExtractor={(item) => item.storeNm}
                contentContainerStyle={styles.flatListContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="cart-outline" size={80} color="#ccc" />
                        <Text style={styles.emptyText}>장바구니가 비어있습니다</Text>
                    </View>
                }
            />

            {/* 결제 정보 */}
            {cartItems.length > 0 && (
                <>
                    <View style={styles.purchaseContainer}>
                        <View style={styles.purchaseSummaryRow}>
                            <Text style={styles.purchaseText}>선택상품</Text>
                            <Text style={styles.purchaseValue}>{totalCount}개</Text>
                        </View>
                        <View style={styles.purchaseSummaryRow}>
                            <Text style={styles.purchaseText}>총 결제금액</Text>
                            <Text style={styles.purchaseValueOriginal}>{formatPrice(totalAmount)}</Text>
                        </View>
                    </View>

                    <View style={styles.purchaseButtonWrapper}>
                        <Pressable 
                            style={[
                                styles.purchaseButtonContainer,
                                totalCount === 0 && styles.purchaseButtonDisabled
                            ]}
                            disabled={totalCount === 0}
                            onPress={async () => {
                                const success = await saveQuantityChanges();
                                if (success) {
                                    // 주문 처리 로직
                                    console.log('주문하기');
                                }
                            }}
                        >
                            <Text style={[
                                styles.purchaseButtonText,
                                totalCount === 0 && styles.purchaseButtonTextDisabled
                            ]}>
                                {totalCount > 0 ? `주문하기 (${totalCount}개)` : '상품을 선택해주세요'}
                            </Text>
                        </Pressable>
                    </View>
                </>
            )}

            {insets.bottom > 0 && (
                <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
            )}
        </View>
    );
}
