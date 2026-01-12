import Ionicons from '@expo/vector-icons/build/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './cart.styles';

const initialCartItems = [
    {
        id: '1',
        storeId: 'store1',
        storeName: '행복',
        selected: false,
        products: [
            { id: 'prod1', name: '쫀쿠 치즈맛', salePrice: '9,000원', originalPrice: '10,000원', qty: 2, selected: false },
            { id: 'prod2', name: '쫀쿠 초코맛', salePrice: '9,000원', originalPrice: '10,000원', qty: 1, selected: false },
        ],
        totalPrice: '27,000원',
    },
    {
        id: '2',
        storeId: 'store1',
        storeName: '행복',
        selected: false,
        products: [
            { id: 'prod3', name: '쫀쿠 치즈맛', salePrice: '9,000원', originalPrice: '10,000원', qty: 2, selected: false },
            { id: 'prod4', name: '쫀쿠 초코맛', salePrice: '9,000원', originalPrice: '10,000원', qty: 1, selected: false },
        ],
        totalPrice: '27,000원',
    },
];

export default function CartScreen() {
    const [cartItems, setCartItems] = useState(initialCartItems);
    const [selectAll, setSelectAll] = useState(false);
    const insets = useSafeAreaInsets();

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

    const handleStoreSelect = (storeId: string) => {
        setCartItems(
            cartItems.map((store) => {
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
            })
        );
    };

    const handleProductSelect = (storeId: string, productId: string) => {
        setCartItems(
            cartItems.map((store) => {
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
            })
        );
    };

    return (
        <View style={styles.container}>
            {insets.top > 0 && (
                <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
            )}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>
                    장바구니
                </Text>
                <View style={styles.placeholder} />
            </View>

            {/* 상단 전체선택/삭제 */}
            <View style={styles.cartTopContainer}>
                <Pressable style={styles.cartTopLeftSection} onPress={handleSelectAll}>
                    <Ionicons name={selectAll ? "checkbox" : "square-outline"} size={20} color={selectAll ? '#EF7810' : '#666'} />
                    <Text style={styles.cartTopSelectAllText}>전체선택</Text>
                </Pressable>
                <View style={styles.cartTopDeleteContainer}>
                    <Pressable style={styles.cartTopDeleteButton}>
                        <Text style={styles.cartTopDeleteButtonText}>전체삭제</Text>
                    </Pressable>
                    <Text style={styles.cartTopDivider}>|</Text>
                    <Pressable style={styles.cartTopDeleteButton}>
                        <Text style={styles.cartTopDeleteButtonText}>선택삭제</Text>
                    </Pressable>
                </View>
            </View>

            <ScrollView>
                {cartItems.map((store) => (
                    <View key={store.id} style={styles.cartItemContainer}>
                        <Pressable
                            style={styles.cartStoreInfoContainer}
                            onPress={() => handleStoreSelect(store.id)}
                        >
                            <Ionicons name={store.selected ? "checkbox" : "square-outline"} size={20} color={store.selected ? '#EF7810' : '#666'} />
                            <Text style={styles.cartStoreNameText}>{store.storeName}</Text>
                        </Pressable>
                        {store.products.map((product) => (
                            <View key={product.id}>
                                <Pressable
                                    style={styles.cartItemDetailContainer}
                                    onPress={() => handleProductSelect(store.id, product.id)}
                                >
                                    <Ionicons name={product.selected ? "checkbox" : "square-outline"} size={20} color={product.selected ? '#EF7810' : '#666'} />
                                    <View style={styles.cartItemImgContainer}>
                                        <Text>상품이미지</Text>
                                    </View>
                                    <View style={styles.cartItemInfoContainer}>
                                        <Text style={styles.cartItemNmText}>{product.name}</Text>
                                        <View style={styles.cartItemPriceContainer}>
                                            <Text style={styles.cartItemSalePriceText}>{product.salePrice}</Text>
                                            <Text style={styles.cartItemOriginalPriceText}>{product.originalPrice}</Text>
                                        </View>
                                        <View style={styles.cartItemQtyContainer}>
                                            <Pressable style={styles.cartItemQtyButton}>
                                                <Text style={styles.cartItemQtyText}>−</Text>
                                            </Pressable>
                                            <Text style={styles.cartItemQtyText}>{product.qty}</Text>
                                            <Pressable style={styles.cartItemQtyButton}>
                                                <Text style={styles.cartItemQtyText}>+</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </Pressable>
                                <Pressable
                                    style={styles.cartItemDeleteButton}
                                    onPress={() => handleProductSelect(store.id, product.id)}
                                >
                                    <Text style={styles.cartItemDeleteButtonText}>×</Text>
                                </Pressable>
                            </View>
                        ))}
                        <View style={styles.cartItemDetailTotalContainer}>
                            <Text style={styles.cartItemTotalText}>총 금액</Text>
                            <Text style={styles.cartItemTotalSalePriceText}>{store.totalPrice}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* 결제 정보 */}
            <View style={styles.purchaseContainer}>
                <View style={styles.purchaseSummaryRow}>
                    <Text style={styles.purchaseText}>선택상품</Text>
                    <Text style={styles.purchaseValue}>쫀쿠 치즈맛 외 1건</Text>
                </View>
                <View style={styles.purchaseSummaryRow}>
                    <Text style={styles.purchaseText}>총 결제금액</Text>
                    <Text style={styles.purchaseValueOriginal}>27,000원</Text>
                </View>


            </View>

      <Pressable style={styles.purchaseButtonContainer}>
        <Text style={styles.purchaseButtonText}>주문하기</Text>
      </Pressable>

            {insets.bottom > 0 && (
                <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
            )}
        </View>
    );
}
