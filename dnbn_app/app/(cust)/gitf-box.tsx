import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./gitf-box.styles";


const notUsedProducts = [
{
  id: "1",
  uri: require("@/assets/images/logo.png"),
  name: "상품1",
  discountRate: 20,
  price: "가격1",
  description: "상품설명1",
  averageRate: 3.4,
  reviewCount: 1280,
},
{
  id: "2",
  uri: require("@/assets/images/logo.png"),
  name: "상품2",
  discountRate: 20,
  price: "가격2",
  description: "상품설명2",
  averageRate: 3.4,
  reviewCount: 1280,
},
{
  id: "3",
  uri: require("@/assets/images/logo.png"),
  name: "상품3",
  discountRate: 20,
  price: "가격3",
  description: "상품설명3",
  averageRate: 3.4,
  reviewCount: 1280,
},
{
  id: "4",
  uri: require("@/assets/images/logo.png"),
  name: "상품1",
  discountRate: 20,
  price: "가격1",
  description: "상품설명1",
  averageRate: 3.4,
  reviewCount: 1280,
},
{
  id: "5",
  uri: require("@/assets/images/logo.png"),
  name: "상품2",
  discountRate: 20,
  price: "가격2",
  description: "상품설명2",
  averageRate: 3.4,
  reviewCount: 1280,
},
{
  id: "6",
  uri: require("@/assets/images/logo.png"),
  name: "상품3",
  discountRate: 20,
  price: "가격3",
  description: "상품설명3",
  averageRate: 3.4,
  reviewCount: 1280,
},
{
  id: "7",
  uri: require("@/assets/images/logo.png"),
  name: "상품1",
  discountRate: 20,
  price: "가격1",
  description: "상품설명1",
  averageRate: 3.4,
  reviewCount: 1280,
},
{
  id: "8",
  uri: require("@/assets/images/logo.png"),
  name: "상품2",
  discountRate: 20,
  price: "가격2",
  description: "상품설명2",
  averageRate: 3.4,
  reviewCount: 1280,
},
{
  id: "9",
  uri: require("@/assets/images/logo.png"),
  name: "상품3",
  discountRate: 20,
  price: "가격3",
  description: "상품설명3",
  averageRate: 3.4,
  reviewCount: 1280,
},
{
  id: "10",
  uri: require("@/assets/images/logo.png"),
  name: "상품1",
  discountRate: 20,
  price: "가격1",
  description: "상품설명1",
  averageRate: 3.4,
  reviewCount: 1280,
},
{
  id: "11",
  uri: require("@/assets/images/logo.png"),
  name: "상품2",
  discountRate: 20,
  price: "가격2",
  description: "상품설명2",
  averageRate: 3.4,
  reviewCount: 1280,
},
{
  id: "12",
  uri: require("@/assets/images/logo.png"),
  name: "상품3",
  discountRate: 20,
  price: "가격3",
  description: "상품설명3",
  averageRate: 3.4,
  reviewCount: 1280,
},
{
  id: "13",
  uri: require("@/assets/images/logo.png"),
  name: "상품1",
  discountRate: 20,
  price: "가격1",
  description: "상품설명1",
  averageRate: 3.4,
  reviewCount: 1280,
},
{
  id: "14",
  uri: require("@/assets/images/logo.png"),
  name: "상품2",
  discountRate: 20,
  price: "가격2",
  description: "상품설명2",
  averageRate: 3.4,
  reviewCount: 1280,
},
{
  id: "15",
  uri: require("@/assets/images/logo.png"),
  name: "상품3",
  discountRate: 20,
  price: "가격3",
  description: "상품설명3",
  averageRate: 3.4,
  reviewCount: 1280,
},
{
  id: "16",
  uri: require("@/assets/images/logo.png"),
  name: "상품1",
  discountRate: 20,
  price: "가격1",
  description: "상품설명1",
  averageRate: 3.4,
  reviewCount: 1280,
},
{
  id: "17",
  uri: require("@/assets/images/logo.png"),
  name: "상품2",
  discountRate: 20,
  price: "가격2",
  description: "상품설명2",
  averageRate: 3.4,
  reviewCount: 1280,
},
{
  id: "18",
  uri: require("@/assets/images/logo.png"),
  name: "상품3",
  discountRate: 20,
  price: "가격3",
  description: "상품설명3",
  averageRate: 3.4,
  reviewCount: 1280,
},
];

const usedProducts = [
{
  id: "1",
  uri: require("@/assets/images/logo.png"),
  name: "상점1",
  description: "상점설명1",
  averageRate: 4.2,
  reviewCount: 850,
},
{
  id: "2",
  uri: require("@/assets/images/logo.png"),
  name: "상점2",
  description: "상점설명2",
  averageRate: 4.5,
  reviewCount: 1200,
},
{
  id: "3",
  uri: require("@/assets/images/logo.png"),
  name: "상점3",
  description: "상점설명3",
  averageRate: 3.8,
  reviewCount: 620,
},
{
  id: "4",
  uri: require("@/assets/images/logo.png"),
  name: "상점4",
  description: "상점설명4",
  averageRate: 4.2,
  reviewCount: 850,
},
{
  id: "5",
  uri: require("@/assets/images/logo.png"),
  name: "상점5",
  description: "상점설명5",
  averageRate: 4.5,
  reviewCount: 1200,
},
{
  id: "6",
  uri: require("@/assets/images/logo.png"),
  name: "상점6",
  description: "상점설명6",
  averageRate: 3.8,
  reviewCount: 620,
},
{
  id: "7",
  uri: require("@/assets/images/logo.png"),
  name: "상점7",
  description: "상점설명7",
  averageRate: 4.2,
  reviewCount: 850,
},
{
  id: "8",
  uri: require("@/assets/images/logo.png"),
  name: "상점8",
  description: "상점설명8",
  averageRate: 4.5,
  reviewCount: 1200,
},
{
  id: "9",
  uri: require("@/assets/images/logo.png"),
  name: "상점9",
  description: "상점설명9",
  averageRate: 3.8,
  reviewCount: 620,
},
{
  id: "10",
  uri: require("@/assets/images/logo.png"),
  name: "상점1",
  description: "상점설명1",
  averageRate: 4.2,
  reviewCount: 850,
},
{
  id: "11",
  uri: require("@/assets/images/logo.png"),
  name: "상점2",
  description: "상점설명2",
  averageRate: 4.5,
  reviewCount: 1200,
},
{
  id: "12",
  uri: require("@/assets/images/logo.png"),
  name: "상점3",
  description: "상점설명3",
  averageRate: 3.8,
  reviewCount: 620,
},
{
  id: "13",
  uri: require("@/assets/images/logo.png"),
  name: "상점4",
  description: "상점설명4",
  averageRate: 4.2,
  reviewCount: 850,
},
{
  id: "14",
  uri: require("@/assets/images/logo.png"),
  name: "상점5",
  description: "상점설명5",
  averageRate: 4.5,
  reviewCount: 1200,
},
{
  id: "15",
  uri: require("@/assets/images/logo.png"),
  name: "상점6",
  description: "상점설명6",
  averageRate: 3.8,
  reviewCount: 620,
},
{
  id: "16",
  uri: require("@/assets/images/logo.png"),
  name: "상점7",
  description: "상점설명7",
  averageRate: 4.2,
  reviewCount: 850,
},
{
  id: "17",
  uri: require("@/assets/images/logo.png"),
  name: "상점8",
  description: "상점설명8",
  averageRate: 4.5,
  reviewCount: 1200,
},
{
  id: "18",
  uri: require("@/assets/images/logo.png"),
  name: "상점9",
  description: "상점설명9",
  averageRate: 3.8,
  reviewCount: 620,
},
];

export default function GiftBox() {
  const [activeTab, setActiveTab] = useState<"notUsed" | "used">("notUsed");
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
      )}
      
      <View style={styles.header}>
          <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/tabs/mypage')}
          >
          <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title} pointerEvents="none">
          선물함
          </Text>
          <View style={styles.placeholder} />
      </View>

      <View style={styles.giftBoxContainer}>
        <View style={styles.notUsedAndUsedTab}>
          <TouchableOpacity
            style={
              activeTab === "notUsed" ? styles.activeTab : styles.inActiveTab
            }
            onPress={() => setActiveTab("notUsed")}
          >
            <Text style={styles.tabText}>사용 가능</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              activeTab === "used" ? styles.activeTab : styles.inActiveTab
            }
            onPress={() => setActiveTab("used")}
          >
            <Text style={styles.tabText}>사용 완료</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.giftContainer}>
          <View style={styles.infoContainer}>
              <Text style={styles.countText}>
                총 {activeTab === "notUsed" ? notUsedProducts.length : usedProducts.length}개
              </Text>
        </View>

        {activeTab === "notUsed" ? (
          <FlatList
            data={notUsedProducts}
            numColumns={2}
            columnWrapperStyle={{ gap: 10 }}
            keyExtractor={(item) => item.id}
            renderItem={({ item: product }) => (
              <TouchableOpacity style={styles.products}
                onPress={() => router.navigate('/(cust)/use-gift')}
              >
                <Image source={product.uri} style={styles.productImage} />
                <Text style={styles.notUsedAndUsedText}>미사용 상품 이름</Text>
                <Text style={styles.date}>2026-01-07</Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
          />
        ): (
          <FlatList
            data={usedProducts}
            numColumns={2}
            columnWrapperStyle={{ gap: 10 }}
            keyExtractor={(item) => item.id}
            renderItem={({ item: store }) => (
              <TouchableOpacity style={styles.products}>
                <Image source={store.uri} style={styles.productImage} />
                <Text style={styles.notUsedAndUsedText}>사용 상품 이름</Text>
                <Text style={styles.date}>2026-01-07</Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
          />
        )}
        </View>
        
      </View>

      {insets.bottom > 0 && (
                <View style={{ height: insets.bottom, backgroundColor: '#000' }} />
      )}

    </View>
  )
}