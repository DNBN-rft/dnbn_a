import Ionicons from '@expo/vector-icons/build/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './cart.styles';

interface Product {
    id: string;
    name: string;
    salePrice: number;
    originalPrice: number;
    qty: number;
    stock: number;
    imageUrl?: string;
    selected: boolean;
}

interface CartStore {
    id: string;
    storeId: string;
    storeName: string;
    selected: boolean;
    products: Product[];
}

const initialCartItems: CartStore[] = [
    {
        id: '1',
        storeId: 'store1',
        storeName: '행복',
        selected: false,
        products: [
            { id: 'prod1', name: '쫀쿠 치즈맛', salePrice: 9000, originalPrice: 10000, qty: 2, stock: 10, selected: false },
            { id: 'prod2', name: '쫀쿠 초코맛', salePrice: 9000, originalPrice: 10000, qty: 1, stock: 5, selected: false },
        ],
    },
    {
        id: '2',
        storeId: 'store2',
        storeName: '즐거움',
        selected: false,
        products: [
            { id: 'prod3', name: '쫀쿠 딸기맛', salePrice: 9500, originalPrice: 11000, qty: 1, stock: 8, selected: false },
            { id: 'prod4', name: '쫀쿠 바나나맛', salePrice: 8500, originalPrice: 10000, qty: 3, stock: 15, selected: false },
        ],
    },
];

export default function CartScreen() {
    const [cartItems, setCartItems] = useState<CartStore[]>(initialCartItems);
    const [selectAll, setSelectAll] = useState(false);
    const insets = useSafeAreaInsets();

    // 포맷팅 함수
    const formatPrice = (price: number) => {
        return price.toLocaleString('ko-KR') + '원';
    };

    // 총 금액 계산 (선택된 상품만)
    const calculateStoreTotal = (products: Product[]) => {
        return products
            .filter(product => product.selected)
            .reduce((sum, product) => sum + (product.salePrice * product.qty), 0);
    };

    const calculateSelectedTotal = () => {
        let totalAmount = 0;
        let totalCount = 0;
        cartItems.forEach(store => {
            store.products.forEach(product => {
                if (product.selected) {
                    totalAmount += product.salePrice * product.qty;
                    totalCount += 1; // 선택한 상품의 개수 (수량이 아님)
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
                products: store.products.map((product) => ({
                    ...product,
                    selected: newSelectAllState,
                })),
            }))
        );
    };

    // 가맹점 선택/해제
    const handleStoreSelect = (storeId: string) => {
        setCartItems(prevItems => {
            const updatedItems = prevItems.map((store) => {
                if (store.id === storeId) {
                    const newSelected = !store.selected;
                    return {
                        ...store,
                        selected: newSelected,
                        products: store.products.map((product) => ({
                            ...product,
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
    const handleProductSelect = (storeId: string, productId: string) => {
        setCartItems(prevItems => {
            const updatedItems = prevItems.map((store) => {
                if (store.id === storeId) {
                    const updatedProducts = store.products.map((product) => {
                        if (product.id === productId) {
                            return { ...product, selected: !product.selected };
                        }
                        return product;
                    });
                    const allSelected = updatedProducts.every((p) => p.selected);
                    return {
                        ...store,
                        selected: allSelected,
                        products: updatedProducts,
                    };
                }
                return store;
            });
            updateSelectAllState(updatedItems);
            return updatedItems;
        });
    };

    // 수량 증가
    const handleIncreaseQty = (storeId: string, productId: string) => {
        setCartItems(prevItems =>
            prevItems.map((store) => {
                if (store.id === storeId) {
                    return {
                        ...store,
                        products: store.products.map((product) => {
                            if (product.id === productId && product.qty < product.stock) {
                                return { ...product, qty: product.qty + 1 };
                            }
                            return product;
                        }),
                    };
                }
                return store;
            })
        );
    };

    // 수량 감소
    const handleDecreaseQty = (storeId: string, productId: string) => {
        setCartItems(prevItems =>
            prevItems.map((store) => {
                if (store.id === storeId) {
                    return {
                        ...store,
                        products: store.products.map((product) => {
                            if (product.id === productId && product.qty > 1) {
                                return { ...product, qty: product.qty - 1 };
                            }
                            return product;
                        }),
                    };
                }
                return store;
            })
        );
    };

    // 상품 삭제
    const handleDeleteProduct = (storeId: string, productId: string) => {
        setCartItems(prevItems => {
            const updatedItems = prevItems.map((store) => {
                if (store.id === storeId) {
                    const updatedProducts = store.products.filter(product => product.id !== productId);
                    return {
                        ...store,
                        products: updatedProducts,
                    };
                }
                return store;
            }).filter(store => store.products.length > 0); // 상품이 없는 가맹점 제거
            updateSelectAllState(updatedItems);
            return updatedItems;
        });
    };

    // 선택 삭제
    const handleDeleteSelected = () => {
        setCartItems(prevItems =>
            prevItems.map((store) => ({
                ...store,
                products: store.products.filter(product => !product.selected),
            })).filter(store => store.products.length > 0)
        );
        setSelectAll(false);
    };

    // 전체 삭제
    const handleDeleteAll = () => {
        setCartItems([]);
        setSelectAll(false);
    };

    // 전체선택 상태 업데이트
    const updateSelectAllState = (items: CartStore[]) => {
        const allSelected = items.every(store =>
            store.products.every(product => product.selected)
        );
        setSelectAll(allSelected && items.length > 0 && items.some(store => store.products.length > 0));
    };

    const { totalAmount, totalCount } = calculateSelectedTotal();

    // 가맹점별 렌더링
    const renderStoreItem = ({ item: store }: { item: CartStore }) => (
        <View key={store.id} style={styles.cartItemContainer}>
            {/* 가맹점 헤더 */}
            <View style={styles.cartStoreInfoContainer}>
                <Pressable
                    style={styles.storeCheckboxArea}
                    onPress={() => handleStoreSelect(store.id)}
                >
                    <Ionicons 
                        name={store.selected ? "checkbox" : "square-outline"} 
                        size={20} 
                        color={store.selected ? '#EF7810' : '#666'} 
                    />
                    <Text style={styles.cartStoreNameText}>{store.storeName}</Text>
                </Pressable>
            </View>

            {/* 상품 목록 */}
            {store.products.map((product) => (
                <View key={product.id} style={styles.productItemWrapper}>
                    {/* 상품 정보 영역 */}
                    <View style={styles.productContentArea}>
                        {/* 체크박스 */}
                        <Pressable
                            style={styles.productCheckboxArea}
                            onPress={() => handleProductSelect(store.id, product.id)}
                        >
                            <Ionicons 
                                name={product.selected ? "checkbox" : "square-outline"} 
                                size={20} 
                                color={product.selected ? '#EF7810' : '#666'} 
                            />
                        </Pressable>

                        {/* 상품 이미지 */}
                        <View style={styles.cartItemImgContainer}>
                            {product.imageUrl ? (
                                <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
                            ) : (
                                <Ionicons name="image-outline" size={40} color="#ccc" />
                            )}
                        </View>

                        {/* 상품 정보 */}
                        <View style={styles.cartItemInfoContainer}>
                            <Text style={styles.cartItemNmText} numberOfLines={2}>{product.name}</Text>
                            <View style={styles.cartItemPriceContainer}>
                                <Text style={styles.cartItemSalePriceText}>{formatPrice(product.salePrice)}</Text>
                                <Text style={styles.cartItemOriginalPriceText}>{formatPrice(product.originalPrice)}</Text>
                            </View>
                            {/* 수량 조절 */}
                            <View style={styles.cartItemQtyContainer}>
                                <Pressable 
                                    style={[
                                        styles.cartItemQtyButton,
                                        product.qty <= 1 && styles.qtyButtonDisabled
                                    ]}
                                    onPress={() => handleDecreaseQty(store.id, product.id)}
                                    disabled={product.qty <= 1}
                                >
                                    <Ionicons name="remove" size={16} color={product.qty <= 1 ? "#ccc" : "#666"} />
                                </Pressable>
                                <Text style={styles.qtyText}>{product.qty}</Text>
                                <Pressable 
                                    style={[
                                        styles.cartItemQtyButton,
                                        product.qty >= product.stock && styles.qtyButtonDisabled
                                    ]}
                                    onPress={() => handleIncreaseQty(store.id, product.id)}
                                    disabled={product.qty >= product.stock}
                                >
                                    <Ionicons name="add" size={16} color={product.qty >= product.stock ? "#ccc" : "#666"} />
                                </Pressable>
                            </View>
                            <Text style={styles.stockText}>재고: {product.stock}개</Text>
                        </View>
                    </View>

                    {/* 삭제 버튼 */}
                    <Pressable
                        style={styles.cartItemDeleteButton}
                        onPress={() => handleDeleteProduct(store.id, product.id)}
                    >
                        <Ionicons name="close" size={24} color="#999" />
                    </Pressable>
                </View>
            ))}

            {/* 가맹점별 총액 */}
            <View style={styles.cartItemDetailTotalContainer}>
                <Text style={styles.cartItemTotalText}>총 금액</Text>
                <Text style={styles.cartItemTotalSalePriceText}>
                    {formatPrice(calculateStoreTotal(store.products))}
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
                    onPress={() => router.back()}
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
                <Pressable style={styles.cartTopDeleteButton} onPress={handleDeleteSelected}>
                    <Text style={styles.cartTopDeleteButtonText}>선택삭제</Text>
                </Pressable>
            </View>

            {/* 장바구니 목록 */}
            <FlatList
                data={cartItems}
                renderItem={renderStoreItem}
                keyExtractor={(item) => item.id}
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
                            onPress={() => {
                                // 주문 처리 로직
                                console.log('주문하기');
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
