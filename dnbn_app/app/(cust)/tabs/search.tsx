import Ionicons from '@expo/vector-icons/build/Ionicons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './search.styles';


export default function SearchView() {
    const insets = useSafeAreaInsets();
    const [isFocused, setIsFocused] = useState(false);

    const recentSearch = [
    {id: '1', keyword: "상품1"},
    {id: '2', keyword: "상품22222222"},
    {id: '3', keyword: "상품3"},
    {id: '4', keyword: "상품4"},
    {id: '5', keyword: "상품5"},
    ]

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

    return (
        <View style={[styles.searchView, {paddingTop: insets.top}]}>

        <View style={styles.searchContainer}>
            <View style={styles.searchBarContainer}>
            <TextInput
                placeholder={isFocused ? "" : "어떤 가게나 메뉴를 검색하고 싶으세요?"}
                placeholderTextColor="black"
                style={[styles.searchBar, isFocused && { borderColor: '#EF7810' }]}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                    />
                    {/* 여기 search-result로 라우팅 되어야함. */}
            <Pressable onPress={() => router.push('/tabs/search-result')} style={styles.searchButton}>
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
                    <Text>{item.keyword}</Text>
                    <Pressable style={styles.deleteButton}>
                    <Text>x</Text>
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
                scrollEnabled={true}  // 명시적으로 true 설정
            />
            </View>
        </View>
        </View>
    );
}