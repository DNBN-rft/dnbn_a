import Ionicons from '@expo/vector-icons/build/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/search.styles';


export default function SearchView() {
  const insets = useSafeAreaInsets();
  
  const [searchKeyword, setSearchKeyword] = useState('');
  
  const [recentSearches, setRecentSearches] = useState([
    { id: "1", keyword: "상품1" },
    { id: "2", keyword: "상품22222222" },
    { id: "3", keyword: "상품3" },
    { id: "4", keyword: "상품4" },
    { id: "5", keyword: "상품5" },
  ]);
  
  const handleDeleteSearch = (id: string) => {
    setRecentSearches(prev => prev.filter(item => item.id !== id));
  };
  
  const handleDeleteAllSearches = () => {
    setRecentSearches([]);
  };

  const categories = [
    { id: "1", name: "한식", icon: require("@/assets/images/logo.png") },
    { id: "2", name: "중식", icon: require("@/assets/images/logo.png") },
    { id: "3", name: "일식", icon: require("@/assets/images/logo.png") },
    { id: "4", name: "양식", icon: require("@/assets/images/logo.png") },
    { id: "5", name: "분식", icon: require("@/assets/images/logo.png") },
    { id: "6", name: "카페", icon: require("@/assets/images/logo.png") },
    { id: "7", name: "디저트", icon: require("@/assets/images/logo.png") },
    { id: "8", name: "패션", icon: require("@/assets/images/logo.png") },
    { id: "9", name: "라이프", icon: require("@/assets/images/logo.png") },
    { id: "10", name: "기타", icon: require("@/assets/images/logo.png") },
  ];

  const discountProducts = [
    { id: "1", uri: require("@/assets/images/logo.png"), storeName: "맛집1", name: "할인상품1", originalPrice: "10000", saleType: "percent", saleValue: 20, price: "8000" },
    { id: "2", uri: require("@/assets/images/logo.png"), storeName: "맛집2", name: "할인상품2", originalPrice: "9000", saleType: "price", saleValue: 2000, price: "7000" },
    { id: "3", uri: require("@/assets/images/logo.png"), storeName: "맛집3", name: "할인상품3", originalPrice: "8000", saleType: "percent", saleValue: 25, price: "6000" },
    { id: "4", uri: require("@/assets/images/logo.png"), storeName: "맛집4", name: "할인상품4", originalPrice: "11000", saleType: "price", saleValue: 2000, price: "9000" },
    { id: "5", uri: require("@/assets/images/logo.png"), storeName: "맛집5", name: "할인상품5", originalPrice: "7000", saleType: "price", saleValue: 3000, price: "4000" },
  ];

  const negoProducts = [
    { id: "6", uri: require("@/assets/images/logo.png"), storeName: "가게1", name: "네고상품1", price: "협상가능" },
    { id: "7", uri: require("@/assets/images/logo.png"), storeName: "가게2", name: "네고상품2", price: "협상가능" },
    { id: "8", uri: require("@/assets/images/logo.png"), storeName: "가게3", name: "네고상품3", price: "협상가능" },
    { id: "9", uri: require("@/assets/images/logo.png"), storeName: "가게4", name: "네고상품4", price: "협상가능" },
    { id: "10", uri: require("@/assets/images/logo.png"), storeName: "가게5", name: "네고상품5", price: "협상가능" },
  ];

  const normalProducts = [
    { id: "11", uri: require("@/assets/images/logo.png"), storeName: "상점1", name: "일반상품1", price: "10000" },
    { id: "12", uri: require("@/assets/images/logo.png"), storeName: "상점2", name: "일반상품2", price: "12000" },
    { id: "13", uri: require("@/assets/images/logo.png"), storeName: "상점3", name: "일반상품3", price: "11000" },
    { id: "14", uri: require("@/assets/images/logo.png"), storeName: "상점4", name: "일반상품4", price: "13000" },
    { id: "15", uri: require("@/assets/images/logo.png"), storeName: "상점5", name: "일반상품5", price: "15000" },
  ];

  const getProductsWithMore = (products: any[], type: string) => {
    const maxItems = 5;
    const displayProducts = products.slice(0, maxItems);
    return [...displayProducts, { id: `more-${type}`, isMore: true, type }];
  };

  return (
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
          검색
        </Text>
        <View style={styles.placeholder} />
      </View>


      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchContainer}>
          <View style={styles.searchBarContainer}>
            <TextInput
              placeholder={"어떤 가게나 메뉴를 검색하고 싶으세요?"}
              placeholderTextColor="#999"
              style={styles.searchBar}
              value={searchKeyword}
              onChangeText={setSearchKeyword}
            />
            <Pressable
              onPress={() => router.push({ pathname: '/tabs/search-result', params: { keyword: searchKeyword } })}
              style={styles.searchButton}
            >
              <Text style={styles.searchButtonText}>검색</Text>
            </Pressable>
          </View>

          <View style={styles.recentSearchContainer}>
            <View style={styles.recentSearchHeader}>
              <Text style={styles.recentSearchKeywordText}>최근 검색어</Text>
              <TouchableOpacity onPress={handleDeleteAllSearches}>
                <Text style={styles.deleteAllText}>전체삭제</Text>
              </TouchableOpacity>
            </View>
            {recentSearches.length > 0 && (
              <FlatList
                data={recentSearches}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.recentSearchKeyword}>
                    <Text style={styles.recentKeywordText}>{item.keyword}</Text>
                    <Pressable 
                      style={styles.deleteButton}
                      onPress={() => handleDeleteSearch(item.id)}
                    >
                      <Ionicons name="close" size={16} color="black" />
                    </Pressable>
                  </View>
                )}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              />
            )}
          </View>

          {/* 카테고리 섹션 */}
          <View style={styles.categorySection}>
            <Text style={styles.sectionTitle}>카테고리</Text>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => router.push('/(cust)/category')} 
                  style={styles.categoryItem}
                >
                  <View style={styles.categoryImageBox}>
                    <Image 
                      resizeMode='contain' 
                      source={item.icon} 
                      style={styles.categoryImage} 
                    />
                  </View>
                  <Text style={styles.categoryName}>{item.name}</Text>
                </TouchableOpacity>
              )}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryContainer}
            />
          </View>

          {/* 추천 할인 상품 섹션 */}
          <View style={styles.productSection}>
            <Text style={styles.sectionTitle}>추천 할인 상품</Text>
            <FlatList
              data={getProductsWithMore(discountProducts, 'discount')}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                if (item.isMore) {
                  return (
                    <TouchableOpacity 
                      onPress={() => router.push('/(cust)/saleProductList')} 
                      style={styles.moreButton}
                    >
                      <Ionicons name="ellipsis-horizontal" size={22} color="#999" />
                    </TouchableOpacity>
                  );
                }
                return (
                  <TouchableOpacity 
                    onPress={() => router.push('/(cust)/product-detail')} 
                    style={styles.galleryItem}
                  >
                    <Image 
                      resizeMode='contain' 
                      source={item.uri} 
                      style={styles.galleryImage} 
                    />
                    <View style={styles.galleryInfo}>
                      <Text style={styles.storeName} numberOfLines={1}>{item.storeName}</Text>
                      <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                      <View style={styles.priceRow}>
                        <Text style={styles.originalPrice}>{item.originalPrice}</Text>
                        <Text style={styles.discountPrice}>{item.saleType === 'percent' ? `${item.saleValue}%` : `${item.saleValue}원`}</Text>
                      </View>
                      <Text style={styles.productPrice}>{item.price}원</Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.galleryContainer}
            />
          </View>

          {/* 추천 네고 상품 섹션 */}
          <View style={styles.productSection}>
            <Text style={styles.sectionTitle}>추천 네고 상품</Text>
            <FlatList
              data={getProductsWithMore(negoProducts, 'nego')}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                if (item.isMore) {
                  return (
                    <TouchableOpacity 
                      onPress={() => router.push('/(cust)/negoList')} 
                      style={styles.moreButton}
                    >
                      <Ionicons name="ellipsis-horizontal" size={22} color="#999" />
                    </TouchableOpacity>
                  );
                }
                return (
                  <TouchableOpacity 
                    onPress={() => router.push('/(cust)/product-detail')} 
                    style={styles.galleryItem}
                  >
                    <Image 
                      resizeMode='contain' 
                      source={item.uri} 
                      style={styles.galleryImage} 
                    />
                    <View style={styles.galleryInfo}>
                      <Text style={styles.storeName} numberOfLines={1}>{item.storeName}</Text>
                      <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.galleryContainer}
            />
          </View>

          {/* 추천 일반 상품 섹션 */}
          <View style={styles.productSection}>
            <Text style={styles.sectionTitle}>추천 일반 상품</Text>
            <FlatList
              data={getProductsWithMore(normalProducts, 'normal')}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                if (item.isMore) {
                  return (
                    <TouchableOpacity 
                      onPress={() => router.push('/(cust)/productList')} 
                      style={styles.moreButton}
                    >
                      <Ionicons name="ellipsis-horizontal" size={22} color="#999" />
                    </TouchableOpacity>
                  );
                }
                return (
                  <TouchableOpacity 
                    onPress={() => router.push('/(cust)/product-detail')} 
                    style={styles.galleryItem}
                  >
                    <Image 
                      resizeMode='contain' 
                      source={item.uri} 
                      style={styles.galleryImage} 
                    />
                    <View style={styles.galleryInfo}>
                      <Text style={styles.storeName} numberOfLines={1}>{item.storeName}</Text>
                      <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.productPrice}>{item.price}원</Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.galleryContainer}
            />
          </View>
        </View>
      </ScrollView>
    </View >
  );
}
