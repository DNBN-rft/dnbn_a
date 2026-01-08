import { Text, View, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { styles } from './cart.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { router } from 'expo-router';

export default function CartScreen() {
  const [selectAll, setSelectAll] = useState(false);
  const insets = useSafeAreaInsets();

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
                <Text style={styles.title} pointerEvents="none">
                    장바구니
                </Text>
                <View style={styles.placeholder} />
            </View>

            {/* 상단 전체선택/삭제 */}
            <View style={styles.cartTopContainer}>
                <Pressable style={styles.cartTopLeftSection} onPress={() => setSelectAll(!selectAll)}>
                    <Ionicons name="square-outline" size={20} color={'#666'} />
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
                <View style={styles.cartItemContainer}>
                    <View style={styles.cartStoreInfoContainer}>
                        <Ionicons name="square-outline" size={20} color={'#666'} />
                        <Text style={styles.cartStoreNameText}>너무 졸리다</Text>
                    </View>
                    {/* 상품 1 */}
                    <View style={styles.cartItemDetailContainer}>
                        <Ionicons name="square-outline" size={20} color={'#666'} />
                        <View style={styles.cartItemImgContainer}>
                            <Text>상품이미지</Text>
                        </View>
                        <View style={styles.cartItemInfoContainer}>
                            <Text style={styles.cartItemNmText}>쫀쿠 치즈맛</Text>
                            <View style={styles.cartItemPriceContainer}>
                                <Text style={styles.cartItemSalePriceText}>9,000원</Text>
                                <Text style={styles.cartItemOriginalPriceText}>10,000원</Text>
                            </View>
                            <View style={styles.cartItemQtyContainer}>
                                <Pressable style={styles.cartItemQtyButton}>
                                    <Text style={styles.cartItemQtyText}>−</Text>
                                </Pressable>
                                <Text style={styles.cartItemQtyText}>2</Text>
                                <Pressable style={styles.cartItemQtyButton}>
                                    <Text style={styles.cartItemQtyText}>+</Text>
                                </Pressable>
                            </View>
                        </View>
                        <Pressable style={styles.cartItemDeleteButton}>
                            <Text style={styles.cartItemDeleteButtonText}>×</Text>
                        </Pressable>
                    </View>
                    <View style={styles.cartItemEachPriceContainer}>
                        <Text style={styles.cartItemEachText}>상품 가격</Text>
                        <Text style={styles.cartItemEachPriceText}>18,000원</Text>
                    </View>

                    {/* 상품 2 */}
                    <View style={styles.cartItemDetailContainer}>
                        <Ionicons name="square-outline" size={20} color={'#666'} />
                        <View style={styles.cartItemImgContainer}>
                            <Text>상품이미지</Text>
                        </View>
                        <View style={styles.cartItemInfoContainer}>
                            <Text style={styles.cartItemNmText}>쫀쿠 초코맛</Text>
                            <View style={styles.cartItemPriceContainer}>
                                <Text style={styles.cartItemSalePriceText}>9,000원</Text>
                                <Text style={styles.cartItemOriginalPriceText}>10,000원</Text>
                            </View>
                            <View style={styles.cartItemQtyContainer}>
                                <Pressable style={styles.cartItemQtyButton}>
                                    <Text style={styles.cartItemQtyText}>−</Text>
                                </Pressable>
                                <Text style={styles.cartItemQtyText}>1</Text>
                                <Pressable style={styles.cartItemQtyButton}>
                                    <Text style={styles.cartItemQtyText}>+</Text>
                                </Pressable>
                            </View>
                        </View>
                        <Pressable style={styles.cartItemDeleteButton}>
                            <Text style={styles.cartItemDeleteButtonText}>×</Text>
                        </Pressable>
                    </View>
                    <View style={styles.cartItemEachPriceContainer}>
                        <Text style={styles.cartItemEachText}>상품 가격</Text>
                        <Text style={styles.cartItemEachPriceText}>9,000원</Text>
                    </View>

                    <View style={styles.cartItemDetailTotalContainer}>
                        <Text style={styles.cartItemTotalText}>총 금액</Text>
                        <Text style={styles.cartItemTotalSalePriceText}>27,000원</Text>
                    </View>
                </View>

                <View style={styles.cartItemContainer}>
                    <View style={styles.cartStoreInfoContainer}>
                        <Ionicons name="square-outline" size={20} color={'#666'} />
                        <Text style={styles.cartStoreNameText}>너무 졸리다</Text>
                    </View>
                    {/* 상품 1 */}
                    <View style={styles.cartItemDetailContainer}>
                        <Ionicons name="square-outline" size={20} color={'#666'} />
                        <View style={styles.cartItemImgContainer}>
                            <Text>상품이미지</Text>
                        </View>
                        <View style={styles.cartItemInfoContainer}>
                            <Text style={styles.cartItemNmText}>쫀쿠 치즈맛</Text>
                            <View style={styles.cartItemPriceContainer}>
                                <Text style={styles.cartItemSalePriceText}>9,000원</Text>
                                <Text style={styles.cartItemOriginalPriceText}>10,000원</Text>
                            </View>
                            <View style={styles.cartItemQtyContainer}>
                                <Pressable style={styles.cartItemQtyButton}>
                                    <Text style={styles.cartItemQtyText}>−</Text>
                                </Pressable>
                                <Text style={styles.cartItemQtyText}>2</Text>
                                <Pressable style={styles.cartItemQtyButton}>
                                    <Text style={styles.cartItemQtyText}>+</Text>
                                </Pressable>
                            </View>
                        </View>
                        <Pressable style={styles.cartItemDeleteButton}>
                            <Text style={styles.cartItemDeleteButtonText}>×</Text>
                        </Pressable>
                    </View>
                    <View style={styles.cartItemEachPriceContainer}>
                        <Text style={styles.cartItemEachText}>상품 가격</Text>
                        <Text style={styles.cartItemEachPriceText}>18,000원</Text>
                    </View>

                    {/* 상품 2 */}
                    <View style={styles.cartItemDetailContainer}>
                        <Ionicons name="square-outline" size={20} color={'#666'} />
                        <View style={styles.cartItemImgContainer}>
                            <Text>상품이미지</Text>
                        </View>
                        <View style={styles.cartItemInfoContainer}>
                            <Text style={styles.cartItemNmText}>쫀쿠 초코맛</Text>
                            <View style={styles.cartItemPriceContainer}>
                                <Text style={styles.cartItemSalePriceText}>9,000원</Text>
                                <Text style={styles.cartItemOriginalPriceText}>10,000원</Text>
                            </View>
                            <View style={styles.cartItemQtyContainer}>
                                <Pressable style={styles.cartItemQtyButton}>
                                    <Text style={styles.cartItemQtyText}>−</Text>
                                </Pressable>
                                <Text style={styles.cartItemQtyText}>1</Text>
                                <Pressable style={styles.cartItemQtyButton}>
                                    <Text style={styles.cartItemQtyText}>+</Text>
                                </Pressable>
                            </View>
                        </View>
                        <Pressable style={styles.cartItemDeleteButton}>
                            <Text style={styles.cartItemDeleteButtonText}>×</Text>
                        </Pressable>
                    </View>
                    <View style={styles.cartItemEachPriceContainer}>
                        <Text style={styles.cartItemEachText}>상품 가격</Text>
                        <Text style={styles.cartItemEachPriceText}>9,000원</Text>
                    </View>

                    <View style={styles.cartItemDetailTotalContainer}>
                        <Text style={styles.cartItemTotalText}>총 금액</Text>
                        <Text style={styles.cartItemTotalSalePriceText}>27,000원</Text>
                    </View>
                </View>
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
