
import { ScrollView, Pressable, Text, View, TouchableOpacity } from 'react-native';
import { styles } from './productdetail.styles';
import { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProductDetailScreen() {
    const [activeTab, setActiveTab] = useState<'productInfo' | 'review' | 'detailInfo'>('productInfo');
    const scrollViewRef = useRef<ScrollView>(null);
    const insets = useSafeAreaInsets();

    const scrollToTop = () => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    };

    return (
        <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
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
            <ScrollView ref={scrollViewRef} style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.productDetailImgContainer}>
                    <Text>상품 이미지</Text>
                </View>

                {/* 가게 정보 상단 */}
                <View style={styles.productDetailInfoTopContainer}>
                    <View style={styles.productDetailIconContainer}>
                        <Text>🏪</Text>
                    </View>

                    <View style={styles.productDetailAddressContainer}>
                        <View>
                            <Text style={styles.productDetailAddrDetailText}>우리동네빵집점</Text>
                            <View style={styles.productDetailMapContainer}>
                                <Text style={styles.productDetailNameText}>대전 서구 문주로 12</Text>
                                <Pressable>
                                    <Text style={styles.mapIconText}>🗺️</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>

                    <Pressable style={styles.productDetailShareContainer}>
                        <Text style={styles.iconText}>공유</Text>
                    </Pressable>

                    <Pressable style={styles.productDetailWishContainer}>
                        <Text style={styles.heartText}>❤️</Text>
                    </Pressable>

                    <Pressable style={styles.productDetailMoreContainer}>
                        <Text style={styles.moreText}>⋮</Text>
                    </Pressable>
                </View>

                {/* 상품 설명 */}
                <View style={styles.productDetailNmContainer}>
                    <Text style={styles.productNmText}>
                        [재구매1위] 세상에서 제일 맛있는 과일
                    </Text>
                    <Text style={styles.productPriceText}>
                        90,000원
                    </Text>
                    <View style={styles.productDetailPriceContainer}>
                        <Text style={styles.productSaleRateText}>
                            10%
                        </Text>
                        <Text style={styles.productSalePriceText}>
                            100,000원
                        </Text>
                        <Text style={styles.productLeftQuantityText}>
                            잔여수량(10개)
                        </Text>
                    </View>
                </View>

                {/* 별점 정보 */}
                <View style={styles.productDetailRateInfoContainer}>
                    <Text style={styles.rateText}>★★★★★ 5.0(10)</Text>
                </View>

                {/* 상품/리뷰 탭 */}
                <View style={styles.tabContainer}>
                    <Pressable
                        style={[styles.tabButton, activeTab === 'productInfo' && styles.tabButtonActive]}
                        onPress={() => setActiveTab('productInfo')}
                    >
                        <Text style={[styles.tabText, activeTab === 'productInfo' && styles.tabTextActive]}>상품(4)</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.tabButton, activeTab === 'review' && styles.tabButtonActive]}
                        onPress={() => setActiveTab('review')}
                    >
                        <Text style={[styles.tabText, activeTab === 'review' && styles.tabTextActive]}>리뷰(2)</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.tabButton, activeTab === 'detailInfo' && styles.tabButtonActive]}
                        onPress={() => setActiveTab('detailInfo')}
                    >
                        <Text style={[styles.tabText, activeTab === 'detailInfo' && styles.tabTextActive]}>상세정보</Text>
                    </Pressable>
                </View>

                {/* 상품 탭 콘텐츠 */}
                {activeTab === 'productInfo' && (
                    <View style={styles.productDetailProductContainer}>
                        <Text style={styles.productDetailProductInfoText}>상품 설명 및 정보가 여기에 표시됩니다.</Text>
                    </View>
                )}

                {/* 리뷰 탭 콘텐츠 */}
                {activeTab === 'review' && (
                    <View style={styles.productDetailReviewContainer}>
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

                {/* 상세정보 */}
                {activeTab === 'detailInfo' && (
                    <View style={styles.productDetailTabContainer}>
                        <Text style={styles.productDetailTabText}>
                            상품 고시정보
                            소비자상담 관련 전화번호: 어쩌구
                            유효기간: 어쩌구
                            공급자: 어쩌구
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* FloatingButton - 최상단 이동 */}
            <Pressable style={styles.scrollToTopButton} onPress={scrollToTop}>
                <Text style={styles.scrollToTopButtonText}>▲</Text>
            </Pressable>
        </View>
    );
}