import React, { useState } from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './search-result.styles';
import Ionicons from '@expo/vector-icons/build/Ionicons';

export default function SearchView() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'product' | 'store'>('product');

  const products = [
    {id: "1", uri: require('@/assets/images/logo.png'),name: "상품1", discountRate: 20, price: "가격1", description:"상품설명1", averageRate: 3.4, reviewCount: 1280},
    {id: "2", uri: require('@/assets/images/logo.png'), name: "상품2", discountRate: 20, price: "가격2", description:"상품설명2", averageRate: 3.4, reviewCount: 1280},
    {id: "3", uri: require('@/assets/images/logo.png'), name: "상품3", discountRate: 20, price: "가격3", description:"상품설명3", averageRate: 3.4, reviewCount: 1280},
    {id: "4", uri: require('@/assets/images/logo.png'),name: "상품1", discountRate: 20, price: "가격1", description:"상품설명1", averageRate: 3.4, reviewCount: 1280},
    {id: "5", uri: require('@/assets/images/logo.png'), name: "상품2", discountRate: 20, price: "가격2", description:"상품설명2", averageRate: 3.4, reviewCount: 1280},
    {id: "6", uri: require('@/assets/images/logo.png'), name: "상품3", discountRate: 20, price: "가격3", description:"상품설명3", averageRate: 3.4, reviewCount: 1280},
    {id: "7", uri: require('@/assets/images/logo.png'),name: "상품1", discountRate: 20, price: "가격1", description:"상품설명1", averageRate: 3.4, reviewCount: 1280},
    {id: "8", uri: require('@/assets/images/logo.png'), name: "상품2", discountRate: 20, price: "가격2", description:"상품설명2", averageRate: 3.4, reviewCount: 1280},
    {id: "9", uri: require('@/assets/images/logo.png'), name: "상품3", discountRate: 20, price: "가격3", description:"상품설명3", averageRate: 3.4, reviewCount: 1280},
    {id: "10", uri: require('@/assets/images/logo.png'),name: "상품1", discountRate: 20, price: "가격1", description:"상품설명1", averageRate: 3.4, reviewCount: 1280},
    {id: "11", uri: require('@/assets/images/logo.png'), name: "상품2", discountRate: 20, price: "가격2", description:"상품설명2", averageRate: 3.4, reviewCount: 1280},
    {id: "12", uri: require('@/assets/images/logo.png'), name: "상품3", discountRate: 20, price: "가격3", description:"상품설명3", averageRate: 3.4, reviewCount: 1280},
    {id: "13", uri: require('@/assets/images/logo.png'),name: "상품1", discountRate: 20, price: "가격1", description:"상품설명1", averageRate: 3.4, reviewCount: 1280},
    {id: "14", uri: require('@/assets/images/logo.png'), name: "상품2", discountRate: 20, price: "가격2", description:"상품설명2", averageRate: 3.4, reviewCount: 1280},
    {id: "15", uri: require('@/assets/images/logo.png'), name: "상품3", discountRate: 20, price: "가격3", description:"상품설명3", averageRate: 3.4, reviewCount: 1280},
    {id: "16", uri: require('@/assets/images/logo.png'),name: "상품1", discountRate: 20, price: "가격1", description:"상품설명1", averageRate: 3.4, reviewCount: 1280},
    {id: "17", uri: require('@/assets/images/logo.png'), name: "상품2", discountRate: 20, price: "가격2", description:"상품설명2", averageRate: 3.4, reviewCount: 1280},
    {id: "18", uri: require('@/assets/images/logo.png'), name: "상품3", discountRate: 20, price: "가격3", description:"상품설명3", averageRate: 3.4, reviewCount: 1280},
  ]

  const stores = [
    {id: "1", uri: require('@/assets/images/logo.png'), name: "상점1", description:"상점설명1", averageRate: 4.2, reviewCount: 850},
    {id: "2", uri: require('@/assets/images/logo.png'), name: "상점2", description:"상점설명2", averageRate: 4.5, reviewCount: 1200},
    {id: "3", uri: require('@/assets/images/logo.png'), name: "상점3", description:"상점설명3", averageRate: 3.8, reviewCount: 620},
    {id: "4", uri: require('@/assets/images/logo.png'), name: "상점4", description:"상점설명4", averageRate: 4.2, reviewCount: 850},
    {id: "5", uri: require('@/assets/images/logo.png'), name: "상점5", description:"상점설명5", averageRate: 4.5, reviewCount: 1200},
    {id: "6", uri: require('@/assets/images/logo.png'), name: "상점6", description:"상점설명6", averageRate: 3.8, reviewCount: 620},
    {id: "7", uri: require('@/assets/images/logo.png'), name: "상점7", description:"상점설명7", averageRate: 4.2, reviewCount: 850},
    {id: "8", uri: require('@/assets/images/logo.png'), name: "상점8", description:"상점설명8", averageRate: 4.5, reviewCount: 1200},
    {id: "9", uri: require('@/assets/images/logo.png'), name: "상점9", description:"상점설명9", averageRate: 3.8, reviewCount: 620},
    {id: "10", uri: require('@/assets/images/logo.png'), name: "상점1", description:"상점설명1", averageRate: 4.2, reviewCount: 850},
    {id: "11", uri: require('@/assets/images/logo.png'), name: "상점2", description:"상점설명2", averageRate: 4.5, reviewCount: 1200},
    {id: "12", uri: require('@/assets/images/logo.png'), name: "상점3", description:"상점설명3", averageRate: 3.8, reviewCount: 620},
    {id: "13", uri: require('@/assets/images/logo.png'), name: "상점4", description:"상점설명4", averageRate: 4.2, reviewCount: 850},
    {id: "14", uri: require('@/assets/images/logo.png'), name: "상점5", description:"상점설명5", averageRate: 4.5, reviewCount: 1200},
    {id: "15", uri: require('@/assets/images/logo.png'), name: "상점6", description:"상점설명6", averageRate: 3.8, reviewCount: 620},
    {id: "16", uri: require('@/assets/images/logo.png'), name: "상점7", description:"상점설명7", averageRate: 4.2, reviewCount: 850},
    {id: "17", uri: require('@/assets/images/logo.png'), name: "상점8", description:"상점설명8", averageRate: 4.5, reviewCount: 1200},
    {id: "18", uri: require('@/assets/images/logo.png'), name: "상점9", description:"상점설명9", averageRate: 3.8, reviewCount: 620},
  ]


  return (
    <View style={[styles.searchResultView, {paddingTop: insets.top}]}>

      <View style={styles.productResultContainer}>
        <View style={styles.productAndStoreTab}>
        <Pressable
          style={activeTab === 'product' ? styles.activeTab : styles.inActiveTab}
          onPress={() => setActiveTab('product')}
        >
          <Text style={styles.tabText}>상품</Text>
        </Pressable>
        <Pressable
          style={activeTab === 'store' ? styles.activeTab : styles.inActiveTab}
          onPress={() => setActiveTab('store')}
        >
          <Text style={styles.tabText}>상점</Text>
        </Pressable>
      </View>
      <View style={styles.searchResult}>
        <View style={styles.infoContainer}>
          <Text>총 {activeTab === 'product' ? products.length : stores.length}개</Text>
          <Text>리뷰 순</Text>
        </View>
        {activeTab === 'product' ? (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item: product }) => (
              <View style={styles.products}>
                <Image source={product.uri} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text>{product.name}</Text>
                  <View style={styles.priceInfo}>
                    <Text>{product.discountRate}% </Text>
                    <Text>{product.price}원</Text>
                  </View>
                  <Text>{product.description}</Text>
                  <View style={styles.reviewInfo}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text> {product.averageRate}</Text>
                    <Text>({product.reviewCount})</Text>
                  </View>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={true}
            scrollEnabled={true}
          />
        ) : (
          <FlatList
            data={stores}
            keyExtractor={(item) => item.id}
            renderItem={({ item: store }) => (
              <View style={styles.stores}>
                <Image source={store.uri} style={styles.storeImage} />
                <View style={styles.storeInfo}>
                  <Text>{store.name}</Text>
                  <Text>{store.description}</Text>
                  <View style={styles.reviewInfo}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text> {store.averageRate}</Text>
                    <Text>({store.reviewCount})</Text>
                  </View>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={true}
            scrollEnabled={true}
          />
        )}
        </View>
      </View>
    </View>
  );
}