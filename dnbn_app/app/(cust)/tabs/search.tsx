import Ionicons from '@expo/vector-icons/build/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, Pressable, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './search.styles';


export default function SearchView() {
  const insets = useSafeAreaInsets();

  const recentSearch = [
    { id: "1", keyword: "상품1" },
    { id: "2", keyword: "상품22222222" },
    { id: "3", keyword: "상품3" },
    { id: "4", keyword: "상품4" },
    { id: "5", keyword: "상품5" },
  ];

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

  return (
    <View style={[styles.searchView, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/tabs/search')}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title} pointerEvents="none">
          검색
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBarContainer}>
          <TextInput
            placeholder={
              "어떤 가게나 메뉴를 검색하고 싶으세요?"
            }
            style={styles.searchBar}
          />
          <Pressable
            onPress={() => router.push("/tabs/search-result")}
            style={styles.searchButton}
          >
            <Text style={styles.searchButtonText}>검색</Text>
          </Pressable>
        </View>

        <View style={styles.recentSearchContainer}>
          <Text style={styles.recentSearchKeywordText}>최근 검색어</Text>
          <FlatList
            data={recentSearch}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.recentSearchKeyword}>
                <Text style={styles.recentKeywordText}>{item.keyword}</Text>
                <Pressable style={styles.deleteButton}>
                  <Ionicons name="close" size={16} color="black" />
                </Pressable>
              </View>
            )}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.recommendProductContainer}>
          <Text style={styles.recommendProductText}>추천 상품</Text>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item: product }) => (
              <View>
                <TouchableOpacity onPress={() => router.push('/(cust)/productDetail')} style={styles.products}>
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
      </View>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
