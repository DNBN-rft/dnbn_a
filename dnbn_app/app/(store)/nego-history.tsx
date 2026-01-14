import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./nego-history.styles";

export default function NegoHistory() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"product" | "request">("product");

  // 상품 탭 데이터 (완료/삭제 상태 포함)
  const productList = [
    { 
      id: "1", 
      uri: require("@/assets/images/image1.jpg"), 
      category: "음료", 
      productName: "아메리카노", 
      price: 4500,
      status: "완료"
    },
    { 
      id: "2", 
      uri: require("@/assets/images/image1.jpg"), 
      category: "디저트", 
      productName: "초콜릿 케이크", 
      price: 6500,
      status: "삭제"
    },
    { 
      id: "3", 
      uri: require("@/assets/images/image1.jpg"), 
      category: "음료", 
      productName: "카페라떼", 
      price: 5000,
      status: "완료"
    },
  ];

  // 요청 탭 데이터
  const requestList = [
    { 
      id: "1", 
      uri: require("@/assets/images/image1.jpg"), 
      category: "음료", 
      productName: "아메리카노", 
      originalPrice: 4500, 
      negoPrice: 4000, 
      requestor: "김진용", 
      requestorPhone: "010-1234-5678",
      requestResult: "승인",
      processDate: "2024.01.12"
    },
    { 
      id: "2", 
      uri: require("@/assets/images/image1.jpg"), 
      category: "디저트", 
      productName: "초콜릿 케이크", 
      originalPrice: 6500, 
      negoPrice: 6000, 
      requestor: "전형운", 
      requestorPhone: "010-2345-6789",
      requestResult: "거절",
      processDate: "2024.01.11"
    },
    { 
      id: "3", 
      uri: require("@/assets/images/image1.jpg"), 
      category: "음료", 
      productName: "카페라떼", 
      originalPrice: 5000, 
      negoPrice: 4500, 
      requestor: "박소윤", 
      requestorPhone: "010-3456-7890",
      requestResult: "취소",
      processDate: "2024.01.10"
    },
  ];

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#ffffff" }} />
      )}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>
          네고 이력
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={activeTab === "product" ? styles.tabButtonActive : styles.tabButton}
          onPress={() => setActiveTab("product")}
        >
          <Text style={activeTab === "product" ? styles.tabButtonTextActive : styles.tabButtonText}>
            상품
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={activeTab === "request" ? styles.tabButtonActive : styles.tabButton}
          onPress={() => setActiveTab("request")}
        >
          <Text style={activeTab === "request" ? styles.tabButtonTextActive : styles.tabButtonText}>
            요청
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "product" ? (
        <FlatList
          data={productList}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <View style={styles.productContainer}>
                <View style={styles.productImageContainer}>
                  <Image
                    style={styles.productImage}
                    source={item.uri} 
                  />
                </View>
    
                <View style={styles.productInfoContainer}>
                  <View>
                    <Text style={styles.categoryText}>{item.category}</Text>

                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.productNameText}
                    >{item.productName}</Text>
                  </View>
                  
                  <View>
                    <Text style={styles.priceText}>
                      {item.price.toLocaleString()}원
                    </Text>
                    
                    <Text style={[styles.statusText, item.status === "완료" ? styles.statusComplete : styles.statusDelete]}>
                      {item.status}
                    </Text>
                  </View>
                </View>
              </View>
    
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.detailButton}
                  onPress={() => {
                    router.navigate('/(store)/nego-history-detail');
                  }}
                >
                  <Text style={styles.detailButtonText}>상세</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <FlatList
          data={requestList}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.requestCard}>
              <View style={styles.requestHeaderContainer}>
                <Text style={[
                  styles.requestResultText,
                  item.requestResult === "승인" ? styles.requestResultApprove :
                  item.requestResult === "거절" ? styles.requestResultReject :
                  styles.requestResultCancel
                ]}>
                  {item.requestResult}
                </Text>
                <Text style={styles.processDateText}>처리일: {item.processDate}</Text>
              </View>
              
              <View style={styles.requestContainer}>
                <View style={styles.requestImageContainer}>
                  <Image
                    style={styles.requestImage}
                    source={item.uri} 
                  />
                </View>
    
                <View style={styles.requestInfoContainer}>
                  <View>
                    <Text style={styles.categoryText}>{item.category}</Text>
                    
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.productNameText}
                    >{item.productName}</Text>
                  </View>
                  
                  <View style={styles.priceContainer}>
                    <Text style={styles.originalPriceText}>
                      {item.originalPrice.toLocaleString()}원
                    </Text>
                    <Text style={styles.negoPriceText}>
                      {item.negoPrice.toLocaleString()}원
                    </Text>
                  </View>

                  <View style={styles.requestorContainer}>
                    <Text style={styles.requestorText}>{item.requestor}</Text>
                    <Text style={styles.requestorPhoneText}>{item.requestorPhone}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      )}
      
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  )
}