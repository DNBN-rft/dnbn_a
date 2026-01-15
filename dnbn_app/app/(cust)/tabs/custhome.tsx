import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./custhome.styles";

const screenWidth = Dimensions.get('window').width;

export default function CustHomeScreen() {
  const bannerRef = useRef<FlatList>(null);
  const currentIndex = useRef(0);
  const insets = useSafeAreaInsets();

  const banners = [
    { id: '1', uri: require('@/assets/images/logo.png') },
    { id: '2', uri: require('@/assets/images/favicon.png') },
    { id: '3', uri: require('@/assets/images/react-logo.png') },
    { id: '4', uri: require('@/assets/images/logo.png') },
  ]

  const saleImages = [
    { id: '1', uri: require('@/assets/images/image1.jpg'), productName: '신선한 사과', storeName: '과일가게', discount: 20, price: 8000 },
    { id: '2', uri: require('@/assets/images/image1.jpg'), productName: '딸기 1kg', storeName: '행복마트', discount: 15, price: 12000 },
    { id: '3', uri: require('@/assets/images/image1.jpg'), productName: '바나나', storeName: '프레시마켓', discount: 10, price: 5000 },
    { id: '4', uri: require('@/assets/images/image1.jpg'), productName: '오렌지', storeName: '과일가게', discount: 25, price: 6000 },
    { id: '5', uri: require('@/assets/images/image1.jpg'), productName: '포도', storeName: '행복마트', discount: 30, price: 15000 },
  ]

  const negoImages = [
    { id: '1', uri: require('@/assets/images/image1.jpg'), productName: '콘푸로스트', storeName: 'A마트', price: 10000 },
    { id: '2', uri: require('@/assets/images/image1.jpg'), productName: '미니건조기', storeName: 'B가전', price: 20000 },
    { id: '3', uri: require('@/assets/images/image1.jpg'), productName: '컴퓨터', storeName: 'C상가', price: 300000 },
    { id: '4', uri: require('@/assets/images/image1.jpg'), productName: '강철텀블러', storeName: 'D주조', price: 5842210 },
  ]

  const commonImages = [
    { id: '1', uri: require('@/assets/images/logo.png'), productName: '상품1', storeName: '상점1', price: 1000 },
    { id: '2', uri: require('@/assets/images/favicon.png'), productName: '상품2', storeName: '상점2', price: 2000 },
    { id: '3', uri: require('@/assets/images/logo.png'), productName: '상품3', storeName: '상점3', price: 3000 },
    { id: '4', uri: require('@/assets/images/react-logo.png'), productName: '상품4', storeName: '상점4', price: 4000 },
  ]

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      if (index !== null && index !== undefined) {
        currentIndex.current = index;
      }
    }
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex.current + 1) % banners.length;
      bannerRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 3000); // 3초마다 자동 스크롤

    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff" }} />
      )}
      <ScrollView showsVerticalScrollIndicator={false} >
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Ionicons name="location" size={24} color="#EF7810" />
            <TouchableOpacity style={styles.addr}>
              <Text style={styles.addrText}>행궁동</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={() => router.push("/(cust)/address")}>
              <Ionicons name="chevron-down" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={() => router.push("/(cust)/notifications")}>
              <Ionicons name="notifications-outline" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={() => router.push("/(cust)/cart")}>
              <Ionicons name="cart-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bannerContainer}>
          <FlatList
            ref={bannerRef}
            data={banners}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            snapToAlignment="center"
            decelerationRate="fast"
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig.current}
            getItemLayout={(data, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
            renderItem={({ item }) => (
              <View style={styles.bannerSlide}>
                <Image
                  source={item.uri}
                  style={styles.bannerImage}
                  resizeMode="stretch"
                />
              </View>
            )} />
        </View>

        <View style={styles.contentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>할인상품</Text>
            <TouchableOpacity style={styles.sectionMore} onPress={() => router.push("/(cust)/saleProductList")}>
              <Text style={styles.sectionMoreText}>+</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={saleImages}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.productCard} onPress={() => router.push("/(cust)/sale-product-detail")}>
                <Image
                  source={item.uri}
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>{item.productName}</Text>
                  <Text style={styles.storeName} numberOfLines={1}>{item.storeName}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.discount}>{item.discount}%</Text>
                    <Text style={styles.price}>{item.price.toLocaleString()}원</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )} />
        </View>

        <View style={styles.contentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>네고왕</Text>
            <TouchableOpacity style={styles.sectionMore} onPress={() => router.push("/(cust)/negoList")}>
              <Text style={styles.sectionMoreText}>+</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={negoImages}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.productCard} onPress={() => router.push("/(cust)/nego-product-detail")}>
                <Image
                  source={item.uri}
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>{item.productName}</Text>
                  <Text style={styles.storeName} numberOfLines={1}>{item.storeName}</Text>
                  <Text style={styles.price}>{item.price.toLocaleString()}원</Text>
                </View>
              </TouchableOpacity>
            )} />
        </View>

        <View style={styles.contentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>일반 상품</Text>
            <TouchableOpacity style={styles.sectionMore} onPress={() => router.push("/(cust)/productList")}>
              <Text style={styles.sectionMoreText}>+</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={commonImages}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.productCard} onPress={() => router.push("/(cust)/product-detail")}>
                <Image
                  source={item.uri}
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>{item.productName}</Text>
                  <Text style={styles.storeName} numberOfLines={1}>{item.storeName}</Text>
                  <Text style={styles.price}>{item.price.toLocaleString()}원</Text>
                </View>
              </TouchableOpacity>
            )} />
        </View>
      </ScrollView>
    </View>
  );
}


