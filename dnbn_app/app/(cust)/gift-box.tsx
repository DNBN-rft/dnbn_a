import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./gift-box.styles";

const notUsedProducts = [
{
  id: "1",
  uri: require("@/assets/images/logo.png"),
  storeName: "가맹점1",
  name: "상품1",
  from: "보낸사람1",
  datetime: "2026-01-07 12:00",
},
{
  id: "2",
  uri: require("@/assets/images/logo.png"),
  storeName: "가맹점2",
  name: "상품2",
  from: "보낸사람2",
  datetime: "2026-01-08 15:30",
},
{
  id: "3",
  uri: require("@/assets/images/logo.png"),
  storeName: "가맹점3",
  name: "상품3",
  from: "보낸사람3",
  datetime: "2026-01-09 09:45",
},
{
  id: "4",
  uri: require("@/assets/images/logo.png"),
  storeName: "가맹점4",
  name: "상품1",
  from: "보낸사람4",
  datetime: "2026-01-10 18:20",
},
{
  id: "5",
  uri: require("@/assets/images/logo.png"),
  storeName: "가맹점5",
  name: "상품2",
  from: "보낸사람5",
  datetime: "2026-01-11 11:10",
},
{
  id: "6",
  uri: require("@/assets/images/logo.png"),
  storeName: "가맹점6",
  name: "상품3",
  from: "보낸사람6",
  datetime: "2026-01-12 14:55",
},
{
  id: "7",
  uri: require("@/assets/images/logo.png"),
  storeName: "가맹점7",
  name: "상품1",
  from: "보낸사람7",
  datetime: "2026-01-13 16:40",
},
{
  id: "8",
  uri: require("@/assets/images/logo.png"),
  storeName: "가맹점8",
  name: "상품2",
  from: "보낸사람8",
  datetime: "2026-01-14 10:25",
},
{
  id: "9",
  uri: require("@/assets/images/logo.png"),
  storeName: "가맹점9",
  name: "상품3",
  from: "보낸사람9",
  datetime: "2026-01-15 13:15",
},
{
  id: "10",
  uri: require("@/assets/images/logo.png"),
  storeName: "가맹점10",
  name: "상품1",
  from: "보낸사람10",
  datetime: "2026-01-16 17:00",
},
];

const usedProducts = [
{
  id: "1",
  uri: require("@/assets/images/logo.png"),
  storeName: "가맹점1",
  name: "상품1",
  from: "보낸사람1",
  datetime: "2026-01-05 14:00",
  status: "사용완료",
},
{
  id: "2",
  uri: require("@/assets/images/logo.png"),
  storeName: "가맹점2",
  name: "상품2",
  from: "보낸사람2",
  datetime: "2026-01-06 09:30",
  status: "취소",
},
{
  id: "3",
  uri: require("@/assets/images/logo.png"),
  storeName: "가맹점3",
  name: "상품3",
  from: "보낸사람3",
  datetime: "2026-01-07 18:45",
  status: "사용완료",
},
{
  id: "4",
  uri: require("@/assets/images/logo.png"),
  storeName: "가맹점4",
  name: "상품4",
  from: "보낸사람4",
  datetime: "2026-01-08 12:20",
  status: "사용완료",
},
{
  id: "5",
  uri: require("@/assets/images/logo.png"),
  storeName: "가맹점5",
  name: "상품5",
  from: "보낸사람5",
  datetime: "2026-01-09 13:15",
  status: "취소",
},
{
  id: "6",
  uri: require("@/assets/images/logo.png"),
  storeName: "가맹점6",
  name: "상품6",
  from: "보낸사람6",
  datetime: "2026-01-10 17:00",
  status: "사용완료",
},
{
  id: "7",
  uri: require("@/assets/images/logo.png"),
  storeName: "가맹점7",
  name: "상품7",
  from: "보낸사람7",
  datetime: "2026-01-11 16:40",
  status: "사용완료",
},
{
  id: "8",
  uri: require("@/assets/images/logo.png"),
  storeName: "가맹점8",
  name: "상품8",
  from: "보낸사람8",
  datetime: "2026-01-12 14:55",
  status: "취소",
},
{
  id: "9",
  uri: require("@/assets/images/logo.png"),
  storeName: "가맹점9",
  name: "상품9",
  from: "보낸사람9",
  datetime: "2026-01-13 16:40",
  status: "사용완료",
},
{
  id: "10",
  uri: require("@/assets/images/logo.png"),
  storeName: "가맹점10",
  name: "상품10",
  from: "보낸사람10",
  datetime: "2026-01-14 10:25",
  status: "사용완료",
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
          <Text style={styles.title}>
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
            columnWrapperStyle={{ justifyContent: 'space-around' }}
            keyExtractor={(item) => item.id}
            renderItem={({ item: notUsed }) => (
              <TouchableOpacity style={styles.products}
                onPress={() => router.navigate('/(cust)/use-gift')}
              >
                <View style={styles.productImageContainer}>
                  <Image source={notUsed.uri} style={styles.productImage} />
                </View>
                
                <View style={styles.productInfoContainer}>
                  <Text style={styles.storeNameText}>{notUsed.storeName}</Text>
                  <Text style={styles.productNameText} numberOfLines={1} ellipsizeMode="tail">
                    {notUsed.name}
                  </Text>
                  <Text style={styles.fromText}>from. {notUsed.from}</Text>
                  <Text style={styles.datetimeText}>{notUsed.datetime}</Text>
                </View>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
          />
        ): (
          <FlatList
            data={usedProducts}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-around' }}
            keyExtractor={(item) => item.id}
            renderItem={({ item: used }) => (
              <TouchableOpacity style={styles.products}>
                <View style={styles.productImageContainer}>
                  <Image source={used.uri} style={styles.productImage} />
                  <View style={[
                    styles.statusOverlayBg,
                    used.status === '사용완료' ? styles.bgUsed : styles.bgCanceled
                  ]} />
                  <View style={[
                    styles.statusStamp,
                    used.status === '사용완료' ? styles.stampUsed : styles.stampCanceled
                  ]}>
                    <Text style={[
                      styles.statusText,
                      used.status === '사용완료' ? styles.textUsed : styles.textCanceled
                    ]}>{used.status}</Text>
                  </View>
                </View>
                
                <View style={styles.productInfoContainer}>
                  <Text style={styles.storeNameText}>{used.storeName}</Text>
                  <Text style={styles.productNameText} numberOfLines={1} ellipsizeMode="tail">
                    {used.name}
                  </Text>
                  <Text style={styles.fromText}>from. {used.from}</Text>
                  <Text style={styles.datetimeText}>{used.datetime}</Text>
                </View>
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