import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./storenego.styles";

export default function StoreNego() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"list" | "history">("list");

  const negoList = [
    { id: "1", uri: require("@/assets/images/image1.jpg"), category: "카테고리 1", productName: "상품 1", price: 9000},
    { id: "2", uri: require("@/assets/images/image1.jpg"), category: "카테고리 2", productName: "상품 2", price: 18000},
    { id: "3", uri: require("@/assets/images/image1.jpg"), category: "카테고리 3", productName: "상품 3", price: 25000},
  ];

  const negoHistory = [
    { id: "1", uri: require("@/assets/images/image1.jpg"), category: "카테고리 1", productName: "상품 1", offeredPrice: 8500, requestor: "홍길동", date: "2024-06-01" },
    { id: "2", uri: require("@/assets/images/image1.jpg"), category: "카테고리 2", productName: "상품 2", offeredPrice: 17000, requestor: "홍길동", date: "2024-06-02" },
    { id: "3", uri: require("@/assets/images/image1.jpg"), category: "카테고리 3", productName: "상품 3", offeredPrice: 24000, requestor: "홍길동", date: "2024-06-03" },
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
        <Text style={styles.title} pointerEvents="none">
          네고 관리
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View>
        <View style={styles.tabContainer}>
          <TouchableOpacity style={activeTab === "list" ? styles.tabButtonActive : styles.tabButton} onPress={() => setActiveTab("list")}>
            <Text style={activeTab === "list" ? styles.tabButtonTextActive : styles.tabButtonText}>목록</Text>
          </TouchableOpacity>
          <TouchableOpacity style={activeTab === "history" ? styles.tabButtonActive : styles.tabButton} onPress={() => setActiveTab("history")}>
            <Text style={activeTab === "history" ? styles.tabButtonTextActive : styles.tabButtonText}>이력</Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === "list" ? (
        <FlatList
                data={negoList}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item: negoList }) => (
                  <View style={styles.content}>
                        <TouchableOpacity style={styles.listTouchable}>
                          <View style={styles.listContainer}>
                            <View style={styles.listImageContainer}>
                              <Image source={negoList.uri} style={styles.listImage} resizeMode="cover"/>
                            </View>
                            <View style={styles.listInfoContainer}>
                              <Text style={styles.listcategoryName}>{negoList.category}</Text>
                              <Text style={styles.listproductName}>{negoList.productName}</Text>
                              <Text style={styles.listprice}>
                                {negoList.price.toLocaleString()}원
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
            
                        <View style={styles.listButtonContainer}>
                          <TouchableOpacity style={styles.negoCancelButton}>
                            <Text style={styles.negoCancelButtonText}>네고 취소</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.moreButton}>
                            <Text><Ionicons name="ellipsis-horizontal" size={20} color="#666" /></Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  ></FlatList>
      ) : (
        <FlatList
                data={negoHistory}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item: negoHistory }) => (
                  <View style={styles.content}>
                        <TouchableOpacity style={styles.historyTouchable}>
                          <View style={styles.historyContainer}>
                            <View style={styles.historyImageContainer}>
                              <Image source={negoHistory.uri} style={styles.historyImage} resizeMode="cover"/>
                            </View>
                            <View style={styles.historyInfoContainer}>
                              <Text style={styles.historycategoryName}>{negoHistory.category}</Text>
                              <Text style={styles.historyproductName}>{negoHistory.productName}</Text>
                              <Text style={styles.historyofferedPrice}>
                                {negoHistory.offeredPrice.toLocaleString()}원
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
            
                        <View style={styles.historyButtonContainer}>
                          <TouchableOpacity style={styles.approveButton}>
                            <Text style={styles.approveButtonText}>승인</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.rejectButton}>
                            <Text style={styles.rejectButtonText}>거절</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.moreButton}>
                            <Text><Ionicons name="ellipsis-horizontal" size={20} color="#666" /></Text>
                          </TouchableOpacity>
                        </View>
                  </View>
                )}
              ></FlatList>
      )}
    </View>
  );
}
