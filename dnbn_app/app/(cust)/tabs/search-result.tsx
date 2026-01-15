import Ionicons from '@expo/vector-icons/build/Ionicons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './search-result.styles';

export default function SearchView() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"product" | "store">("product");

  const products = [
    {
      id: "1",
      uri: require("@/assets/images/logo.png"),
      name: "상품1",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명1",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "2",
      uri: require("@/assets/images/logo.png"),
      name: "상품2",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명2",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "3",
      uri: require("@/assets/images/logo.png"),
      name: "상품3",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명3",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "4",
      uri: require("@/assets/images/logo.png"),
      name: "상품1",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명1",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "5",
      uri: require("@/assets/images/logo.png"),
      name: "상품2",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명2",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "6",
      uri: require("@/assets/images/logo.png"),
      name: "상품3",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명3",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "7",
      uri: require("@/assets/images/logo.png"),
      name: "상품1",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명1",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "8",
      uri: require("@/assets/images/logo.png"),
      name: "상품2",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명2",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "9",
      uri: require("@/assets/images/logo.png"),
      name: "상품3",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명3",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "10",
      uri: require("@/assets/images/logo.png"),
      name: "상품1",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명1",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "11",
      uri: require("@/assets/images/logo.png"),
      name: "상품2",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명2",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "12",
      uri: require("@/assets/images/logo.png"),
      name: "상품3",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명3",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "13",
      uri: require("@/assets/images/logo.png"),
      name: "상품1",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명1",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "14",
      uri: require("@/assets/images/logo.png"),
      name: "상품2",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명2",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "15",
      uri: require("@/assets/images/logo.png"),
      name: "상품3",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명3",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "16",
      uri: require("@/assets/images/logo.png"),
      name: "상품1",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명1",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "17",
      uri: require("@/assets/images/logo.png"),
      name: "상품2",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명2",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "18",
      uri: require("@/assets/images/logo.png"),
      name: "상품3",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명3",
      averageRate: 3.4,
      reviewCount: 1280,
    },
  ];


  const stores = [
    {
      id: "1",
      uri: require("@/assets/images/logo.png"),
      name: "오늘의김밥",
      category: "분식",
      description: "신선한 재료로 매일 아침 준비하는 수제 김밥 맛있는 김밥입니다 진짜 어쩌구저쩌구 2줄을 위함",
      averageRate: 4.6,
      reviewCount: 1324,
    },
    {
      id: "2",
      uri: require("@/assets/images/logo.png"),
      name: "마포숯불갈비",
      category: "한식",
      description: "참숯에 구워 깊은 풍미를 살린 돼지갈비 전문점",
      averageRate: 4.3,
      reviewCount: 987,
    },
    {
      id: "3",
      uri: require("@/assets/images/logo.png"),
      name: "바다한접시",
      category: "해산물",
      description: "당일 공수한 신선한 해산물 요리",
      averageRate: 4.1,
      reviewCount: 542,
    },
    {
      id: "4",
      uri: require("@/assets/images/logo.png"),
      name: "과일상회 청과",
      category: "과일",
      description: "제철 과일을 합리적인 가격으로 판매합니다",
      averageRate: 4.7,
      reviewCount: 2140,
    },
    {
      id: "5",
      uri: require("@/assets/images/logo.png"),
      name: "달콤한하루",
      category: "디저트",
      description: "수제 케이크와 마카롱이 인기인 디저트 카페",
      averageRate: 4.8,
      reviewCount: 1763,
    },
    {
      id: "6",
      uri: require("@/assets/images/logo.png"),
      name: "오렌지마켓",
      category: "과일",
      description: "산지 직송 과일 전문 매장",
      averageRate: 4.2,
      reviewCount: 689,
    },
    {
      id: "7",
      uri: require("@/assets/images/logo.png"),
      name: "무드웨어",
      category: "옷가게",
      description: "데일리룩부터 오피스룩까지 트렌디한 의류",
      averageRate: 4.4,
      reviewCount: 953,
    },
    {
      id: "8",
      uri: require("@/assets/images/logo.png"),
      name: "스트릿핏",
      category: "옷가게",
      description: "캐주얼 스트릿 패션 전문 스토어",
      averageRate: 4.0,
      reviewCount: 418,
    },
    {
      id: "9",
      uri: require("@/assets/images/logo.png"),
      name: "클래식룸",
      category: "옷가게",
      description: "미니멀하고 깔끔한 남녀 공용 의류",
      averageRate: 4.5,
      reviewCount: 1120,
    },
    {
      id: "10",
      uri: require("@/assets/images/logo.png"),
      name: "동네파스타",
      category: "양식",
      description: "가성비 좋은 파스타와 스테이크 맛집",
      averageRate: 4.3,
      reviewCount: 764,
    },
  ];

  return (
    <View style={styles.searchResultView}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff" }} />
      )}

      <View style={styles.container}>
        {insets.top > 0 && (
          <View style={{ height: insets.top, backgroundColor: "#fff" }} />
        )}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>
            검색 결과
          </Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.productResultContainer}>
          <View style={styles.productAndStoreTab}>
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
              >상품</Text>
            </Pressable>
            <Pressable
              style={[
                styles.tabButton,
                activeTab === "store" && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab("store")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "store" && styles.tabTextActive,
                ]}
              >상점</Text>
            </Pressable>
          </View>

          <View style={styles.searchResult}>
            <View style={styles.infoContainer}>
              <Text style={styles.resultCountHeaderText}>
                총 {activeTab === "product" ? products.length : stores.length}개
              </Text>
              <Text style={styles.filter}>리뷰 순</Text>
            </View >

            {activeTab === "product" ? (
              <View>
                <FlatList
                  data={products}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item: product }) => (
                    <View>
                      <TouchableOpacity onPress={() => router.push('/(cust)/product-detail')} style={styles.products}>
                        <Image resizeMode='contain' source={product.uri} style={styles.productImage} />
                        <View style={styles.productInfo}>
                          <Text style={styles.name}>{product.name}</Text>
                          <View style={styles.priceInfo}>
                            <Text style={styles.originalPriceText}>{product.originalPrice}원</Text>
                            <Text style={styles.discountRateText}>{product.discountRate}% </Text>
                          </View>
                          <Text style={styles.priceText}>{product.price}원</Text>
                          <View style={styles.reviewInfo}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={styles.averageRate}> {product.averageRate}</Text>
                            <Text style={styles.reviewCount}>({product.reviewCount})</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={true}
                />
              </View>
            ) : (
              <View>
                <FlatList
                  data={stores}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item: store }) => (
                    <View style={styles.stores}>
                      <Image resizeMode='contain' source={store.uri} style={styles.storeImage} />
                      <View style={styles.storeInfo}>
                        <View style={styles.storeNameRow}>
                          <Text style={styles.name}>{store.name}</Text>
                          <Text style={styles.category}>{store.category}</Text>
                        </View>
                        <Text ellipsizeMode="tail" numberOfLines={2} style={styles.descriptionText}>{store.description}</Text>
                        <View style={styles.reviewInfo}>
                          <Ionicons name="star" size={16} color="#FFD700" />
                          <Text style={styles.averageRate}> {store.averageRate}</Text>
                          <Text style={styles.reviewCount}>({store.reviewCount})</Text>
                        </View>
                      </View>
                    </View>
                  )}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={true}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
