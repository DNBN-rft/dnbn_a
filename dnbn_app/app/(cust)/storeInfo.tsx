
import { ScrollView, Pressable, Text, View, TouchableOpacity } from 'react-native';
import { styles } from './storeInfo.styles';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function StoreInfo() {
    const [activeTab, setActiveTab] = useState<'product' | 'review'>('product');
    const insets = useSafeAreaInsets();

    return (
        <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title} pointerEvents="none">
                    내 위치 설정
                </Text>
                <View style={styles.placeholder} />
            </View>
            {/* 가게 이미지 */}
            <View style={styles.storeImgContainer}>
                <Text>가게 이미지</Text>
            </View>

            {/* 가게 정보 상단 */}
            <View style={styles.storeInfoTopContainer}>
                <View style={styles.storeIconContainer}>
                    <Text>🏪</Text>
                </View>

                <View style={styles.storeAddressContainer}>
                    <View>
                        <Text style={styles.storeNameText}>대전 서구 문주로 12</Text>
                        <View style={styles.storeMapContainer}>
                            <Text style={styles.storeAddrDetailText}>우리동네빵집점</Text>
                            <Pressable>
                                <Text style={styles.mapIconText}>🗺️</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

                <Pressable style={styles.storeShareContainer}>
                    <Text style={styles.iconText}>공유</Text>
                </Pressable>

                <Pressable style={styles.storeWishContainer}>
                    <Text style={styles.heartText}>❤️</Text>
                </Pressable>

                <Pressable style={styles.storeMoreContainer}>
                    <Text style={styles.moreText}>⋮</Text>
                </Pressable>
            </View>

            {/* 가게 설명 */}
            <View style={styles.storeInfoDetailContainer}>
                <Text style={styles.descriptionText}>
                    대전관광은 맛있는 빵집~ 우리동네빵집은 정품입니다 도네빵집! 맛있는 도우!
                </Text>
            </View>

            {/* 별점 정보 */}
            <View style={styles.storeRateInfoContainer}>
                <Text style={styles.rateText}>★ 3.8(10)</Text>
            </View>

            {/* 상품/리뷰 탭 */}
            <View style={styles.tabContainer}>
                <Pressable
                    style={[styles.tabButton, activeTab === 'product' && styles.tabButtonActive]}
                    onPress={() => setActiveTab('product')}
                >
                    <Text style={[styles.tabText, activeTab === 'product' && styles.tabTextActive]}>상품(4)</Text>
                </Pressable>
                <Pressable
                    style={[styles.tabButton, activeTab === 'review' && styles.tabButtonActive]}
                    onPress={() => setActiveTab('review')}
                >
                    <Text style={[styles.tabText, activeTab === 'review' && styles.tabTextActive]}>리뷰(2)</Text>
                </Pressable>
            </View>

            {/* 상품 탭 콘텐츠 */}
            {activeTab === 'product' && (
                <View style={styles.storeProductContainer}>
                    <View style={styles.productGridContainer}>
                        {/* 상품 1 */}
                        <View style={styles.storeProductItemContainer}>
                            <View style={styles.storeProductImgContainer}>
                                <Text>상품이미지</Text>
                            </View>
                            <Text style={styles.storeProductNmContainer}>
                                맛있는 두쫀쿠
                            </Text>
                            <View style={styles.storeProductPriceContainer}>
                                <Text style={styles.salePercentText}>20%</Text>
                                <Text style={styles.priceText}>70,000원</Text>
                            </View>
                            <Text style={styles.ratingText}>★ 4.8(1,250)</Text>
                        </View>

                        {/* 상품 2 */}
                        <View style={styles.storeProductItemContainer}>
                            <View style={styles.storeProductImgContainer}>
                                <Text>상품이미지</Text>
                            </View>
                            <Text style={styles.storeProductNmContainer}>
                                맛있는 두쫀쿠
                            </Text>
                            <View style={styles.storeProductPriceContainer}>
                                <Text style={styles.salePercentText}>20%</Text>
                                <Text style={styles.priceText}>70,000원</Text>
                            </View>
                            <Text style={styles.ratingText}>★ 4.8(1,250)</Text>
                        </View>

                        {/* 상품 3 */}
                        <View style={styles.storeProductItemContainer}>
                            <View style={styles.storeProductImgContainer}>
                                <Text>상품이미지</Text>
                            </View>
                            <Text style={styles.storeProductNmContainer}>
                                맛있는 두쫀쿠
                            </Text>
                            <View style={styles.storeProductPriceContainer}>
                                <Text style={styles.salePercentText}>20%</Text>
                                <Text style={styles.priceText}>70,000원</Text>
                            </View>
                            <Text style={styles.ratingText}>★ 4.8(1,250)</Text>
                        </View>

                        {/* 상품 4 */}
                        <View style={styles.storeProductItemContainer}>
                            <View style={styles.storeProductImgContainer}>
                                <Text>상품이미지</Text>
                            </View>
                            <Text style={styles.storeProductNmContainer}>
                                맛있는 두쫀쿠
                            </Text>
                            <View style={styles.storeProductPriceContainer}>
                                <Text style={styles.salePercentText}>20%</Text>
                                <Text style={styles.priceText}>70,000원</Text>
                            </View>
                            <Text style={styles.ratingText}>★ 4.8(1,250)</Text>
                        </View>
                    </View>
                </View>
            )}

            {/* 리뷰 탭 콘텐츠 */}
            {activeTab === 'review' && (
                <View style={styles.storeReviewContainer}>
                    {/* 리뷰 아이템 1 */}
                    <View style={styles.reviewItemContainer}>
                        <View style={styles.reviewRefInfoContainer}>
                            <Text style={styles.reviewRegNmContainer}>사용자 이름</Text>
                            <Text style={styles.reviewRegDateContainer}>2026.01.05</Text>
                        </View>
                        <Text style={styles.reviewRateContainer}>★★★★★ 5점</Text>
                        <View style={styles.reviewImgContainer}>
                            <Text>리뷰 이미지</Text>
                        </View>
                        <Text style={styles.reviewContentContainer}>
                            맛있는 빵이에요! 추천합니다.
                        </Text>
                    </View>

                    {/* 리뷰 아이템 2 */}
                    <View style={styles.reviewItemContainer}>
                        <View style={styles.reviewRefInfoContainer}>
                            <Text style={styles.reviewRegNmContainer}>또다른 사용자</Text>
                            <Text style={styles.reviewRegDateContainer}>2026.01.04</Text>
                        </View>
                        <Text style={styles.reviewRateContainer}>★★★★☆ 4점</Text>
                        <View style={styles.reviewImgContainer}>
                            <Text>리뷰 이미지</Text>
                        </View>
                        <Text style={styles.reviewContentContainer}>
                            가격도 저렴하고 맛있습니다!
                        </Text>
                    </View>
                </View>
            )}
        </ScrollView>
    );
}