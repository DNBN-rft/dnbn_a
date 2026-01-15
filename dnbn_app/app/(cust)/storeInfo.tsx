
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './storeInfo.styles';

export default function StoreInfo() {
  const [activeTab, setActiveTab] = useState<"product" | "review">("product");
  const insets = useSafeAreaInsets();

  const productList = [
    { id: '1', uri: require('@/assets/images/qr.png'), name: '맛있는 두쫀쿠', discount: 20, price: 70000, originalPrice: 87500, rating: '4.8(1,250)' },
    { id: '2', uri: require('@/assets/images/qr.png'), name: '맛있는 두쫀쿠', discount: 20, price: 70000, originalPrice: 87500, rating: '4.8(1,250)' },
    { id: '3', uri: require('@/assets/images/qr.png'), name: '맛있는 두쫀쿠', discount: 20, price: 70000, originalPrice: 87500, rating: '4.8(1,250)' },
    { id: '4', uri: require('@/assets/images/qr.png'), name: '맛있는 두쫀쿠', discount: 20, price: 70000, originalPrice: 87500, rating: '4.8(1,250)' },
  ];

  const reviewList = [
    { id: '1', name: '사용자 이름', date: '2026.01.05', rating: '5.0', content: '맛있는 빵이에요! 추천합니다.', images: [require('@/assets/images/qr.png'), require('@/assets/images/qr.png')] },
    { id: '2', name: '또다른 사용자', date: '2026.01.04', rating: '4.5', content: '가격도 저렴하고 맛있습니다!', images: [require('@/assets/images/qr.png')] },
  ];

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
          가맹점이름들어가기
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}>
        {/* 가게 이미지 */}
        <View style={styles.storeImgContainer}>
          <Text>가게 이미지</Text>
        </View>

        {/* 기능 버튼들 */}
        <View style={styles.actionButtonsRow}>
          <Pressable style={styles.actionButton}>
            <Ionicons name="share-social-outline" size={24} color="#666" />
            <Text style={styles.actionButtonText}>공유</Text>
          </Pressable>

          <Pressable style={styles.actionButton}>
            <Ionicons name="heart-outline" size={24} color="#EF7810" />
            <Text style={styles.actionButtonText}>찜</Text>
          </Pressable>

          <Pressable style={styles.actionButton}>
            <Ionicons name="call-outline" size={24} color="#666" />
            <Text style={styles.actionButtonText}>전화</Text>
          </Pressable>
          
          <Pressable style={styles.actionButton}>
            <Ionicons name="flag-outline" size={24} color="#666" />
            <Text style={styles.actionButtonText}>신고</Text>
          </Pressable>
        </View>

        {/* 가게 정보 영역 */}
        <View style={styles.storeInfoContainer}>
          {/* 가맹점 이름과 별점 */}
          <View style={styles.storeNameRatingRow}>
            <Text style={styles.storeNameText}>우리동네빵집점</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.storeRatingText}>3.8(10)</Text>
            </View>
          </View>

          {/* 가게 설명 */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>
              대전관광은 맛있는 빵집~ 우리동네빵집은 정품입니다 도네빵집! 맛있는 도우!
            </Text>
          </View>

          {/* 가게 주소 */}
          <Pressable style={styles.addressRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.addressText}>대전 서구 문주로 12</Text>
            <Ionicons name="chevron-forward" size={16} color="#999" />
          </Pressable>
        </View>

        {/* 상품/리뷰 탭 */}
        <View style={styles.tabContainer}>
          <Pressable
            style={[
              styles.tabButton,
              activeTab === "product" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("product")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "product" && styles.tabTextActive,
              ]}
            >
              상품(4)
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.tabButton,
              activeTab === "review" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("review")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "review" && styles.tabTextActive,
              ]}
            >
              리뷰(2)
            </Text>
          </Pressable>
        </View>

        {/* 상품 탭 콘텐츠 */}
        {activeTab === "product" && (
          <View style={styles.storeProductContainer}>
            <View style={styles.productGridContainer}>
              {productList.map((item) => (
                <Pressable 
                  key={item.id}
                  style={styles.storeProductItemContainer}
                  onPress={() => router.push('/(cust)/productDetail')}
                >
                  <Image resizeMode='contain' source={item.uri} style={styles.storeProductImgContainer} />
                  <Text style={styles.storeProductNmText}>{item.name}</Text>
                  <Text style={styles.originalPriceText}>{item.originalPrice.toLocaleString()}원</Text>
                  <Text style={styles.priceText}>{item.price.toLocaleString()}원</Text>
                  <Text style={styles.productRatingText}><Ionicons name="star" size={13} color="#FFD700" /> {item.rating}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}


        {/* 리뷰 탭 콘텐츠 */}
        {activeTab === "review" && (
          <View style={styles.storeReviewContainer}>
            {reviewList.map((item) => (
              <View key={item.id} style={styles.reviewItemContainer}>
                <View style={styles.reviewHeaderRow}>
                  <View style={styles.reviewUserRatingContainer}>
                    <Text style={styles.reviewRegNmText}>{item.name}</Text>
                    <View style={styles.reviewRatingBox}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <Text style={styles.reviewRateText}>{item.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.reviewRegDateText}>{item.date}</Text>
                </View>
                
                <View style={styles.reviewContentContainer}>
                  <Text style={styles.reviewContentText}>
                    {item.content}
                  </Text>
                </View>

                {item.images && item.images.length > 0 && (
                  <View style={styles.reviewImgGallery}>
                    {item.images.map((img, index) => (
                      <Image key={index} source={img} style={styles.reviewImgThumbnail} resizeMode="cover" />
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
