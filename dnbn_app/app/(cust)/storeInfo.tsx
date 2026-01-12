
import { ScrollView, Pressable, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import { styles } from './storeInfo.styles';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
    { id: '1', name: '사용자 이름', date: '2026.01.05', rating: '★★★★★ 5점', content: '맛있는 빵이에요! 추천합니다.' },
    { id: '2', name: '또다른 사용자', date: '2026.01.04', rating: '★★★★☆ 4점', content: '가격도 저렴하고 맛있습니다!' },
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
            <Ionicons name="heart-outline" size={20} color="red" />
          </Pressable>

          <Pressable style={styles.storeMoreContainer}>
            <Ionicons name="ellipsis-vertical" size={20} color="#000" />
          </Pressable>
        </View>

        {/* 가게 설명 */}
        <View style={styles.storeInfoDetailContainer}>
          <Text style={styles.descriptionText}>
            대전관광은 맛있는 빵집~ 우리동네빵집은 정품입니다 도네빵집! 맛있는
            도우!
          </Text>
        </View>

        {/* 별점 정보 */}
        <View style={styles.storeRateInfoContainer}>
          <Text style={styles.rateText}>
            <Ionicons name="star" size={16} color="#FFD700" /> 3.8(10)</Text>
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
            <FlatList
              data={productList}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              renderItem={({ item }) => (
                <View style={styles.storeProductItemContainer}>
                  <Image resizeMode='contain' source={item.uri} style={styles.storeProductImgContainer} />
                  <Text style={styles.storeProductNmText}>{item.name}</Text>
                  <View style={styles.storeProductPriceContainer}>
                    <Text style={styles.originalPriceText}>{item.originalPrice.toLocaleString()}원</Text>

                    <Text style={styles.salePercentText}>{item.discount}%</Text>
                  </View>
                  <Text style={styles.priceText}>{item.price.toLocaleString()}원</Text>

                  <Text style={styles.ratingText}>★ {item.rating}</Text>
                </View>
              )}
            />
          </View>
        )}


        {/* 리뷰 탭 콘텐츠 */}
        {activeTab === "review" && (
          <View style={styles.storeReviewContainer}>
            <FlatList
              data={reviewList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.reviewItemContainer}>
                  <View style={styles.reviewRefInfoContainer}>
                    <Text style={styles.reviewRegNmText}>{item.name}</Text>
                    <Text style={styles.reviewRegDateText}>{item.date}</Text>
                  </View>
                  <Text style={styles.reviewRateText}>{item.rating}</Text>
                  <View style={styles.reviewImgContainer}>
                    <Text>리뷰 이미지</Text>
                  </View>
                  <Text style={styles.reviewContentText}>
                    {item.content}
                  </Text>
                </View>
              )}
            />
          </View>
        )}
      </ScrollView>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
