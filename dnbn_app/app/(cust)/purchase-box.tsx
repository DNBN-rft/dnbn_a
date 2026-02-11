import { apiGet, apiPost } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./purchase-box.styles";

interface UnusedProduct {
  storeNm: string;
  productImageUrl: string;
  productNm: string;
  orderDateTime: string;
  orderCode: string;
  productCode: string;
}

interface UsedProduct {
  storeNm: string;
  productImageUrl: string;
  productNm: string;
  usedDateTime: string;
  orderCode: string;
  productCode: string;
  state: string;
}

interface PurchaseListResponse {
  unusedProducts: UnusedProduct[];
  usedProducts: UsedProduct[];
}

export default function PurchaseBox() {
  const [activeTab, setActiveTab] = useState<"notUsed" | "used">("notUsed");
  const insets = useSafeAreaInsets();
  const [unusedProducts, setUnusedProducts] = useState<UnusedProduct[]>([]);
  const [usedProducts, setUsedProducts] = useState<UsedProduct[]>([]);
  const listRef = useRef<FlatList>(null);

  const scrollToTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  useEffect(() => {
    fetchPurchaseList();
  }, []);

  const fetchPurchaseList = async () => {
    try {
      const response = await apiGet("/cust/purchase-list");

      if (response.ok) {
        const data: PurchaseListResponse = await response.json();
        console.log("구매 목록 조회 성공:", data);
        setUnusedProducts(data.unusedProducts);
        setUsedProducts(data.usedProducts);
      } else {
        console.error("구매 목록 조회 실패");
      }
    } catch (error) {
      console.error("구매 목록 조회 오류:", error);
    }
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
      )}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/tabs/mypage")}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>구매함</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.purchaseBoxContainer}>
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
            style={activeTab === "used" ? styles.activeTab : styles.inActiveTab}
            onPress={() => setActiveTab("used")}
          >
            <Text style={styles.tabText}>사용 완료</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.giftContainer}>
          <View style={styles.infoContainer}>
            <Text style={styles.countText}>
              총{" "}
              {activeTab === "notUsed"
                ? unusedProducts.length
                : usedProducts.length}
              개
            </Text>
          </View>

          {activeTab === "notUsed" ? (
            <FlatList
              ref={listRef}
              data={unusedProducts}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              keyExtractor={(item) => item.productCode}
              renderItem={({ item: notUsed }) => (
                <TouchableOpacity
                  style={styles.products}
                  onPress={() => router.navigate("/(cust)/use-gift")}
                >
                  <View style={styles.productImageContainer}>
                    <Image
                      source={
                        notUsed.productImageUrl
                          ? { uri: notUsed.productImageUrl }
                          : require("@/assets/images/logo.png")
                      }
                      style={styles.productImage}
                    />
                  </View>

                  <View style={styles.productInfoContainer}>
                    <Text style={styles.storeNameText}>{notUsed.storeNm}</Text>
                    <Text
                      style={styles.productNameText}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {notUsed.productNm}
                    </Text>
                    <Text style={styles.datetimeText}>
                      {notUsed.orderDateTime}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              scrollEnabled={true}
            />
          ) : (
            <FlatList
              ref={listRef}
              data={usedProducts}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              keyExtractor={(item) => item.productCode}
              renderItem={({ item: used }) => (
                <TouchableOpacity
                  style={styles.products}
                  onPress={() => router.navigate("/(cust)/used-gift")}
                >
                  <View style={styles.productImageContainer}>
                    <Image
                      source={
                        used.productImageUrl
                          ? { uri: used.productImageUrl }
                          : require("@/assets/images/logo.png")
                      }
                      style={styles.productImage}
                    />
                    <View
                      style={[
                        styles.statusOverlayBg,
                        used.state === "사용완료"
                          ? styles.bgUsed
                          : styles.bgCanceled,
                      ]}
                    />
                    <View
                      style={[
                        styles.statusStamp,
                        used.state === "사용완료"
                          ? styles.stampUsed
                          : styles.stampCanceled,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          used.state === "사용완료"
                            ? styles.textUsed
                            : styles.textCanceled,
                        ]}
                      >
                        {used.state}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.productInfoContainer}>
                    <Text style={styles.storeNameText}>{used.storeNm}</Text>
                    <Text
                      style={styles.productNameText}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {used.productNm}
                    </Text>
                    <Text style={styles.datetimeText}>{used.usedDateTime}</Text>
                  </View>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              scrollEnabled={true}
            />
          )}
        </View>
      </View>

      {/* FloatingButton - 최상단 이동 */}
      <TouchableOpacity
        style={[styles.scrollToTopButton, { bottom: 30 + insets.bottom }]}
        onPress={scrollToTop}
      >
        <Ionicons name="chevron-up" size={24} color="#ef7810" />
      </TouchableOpacity>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
