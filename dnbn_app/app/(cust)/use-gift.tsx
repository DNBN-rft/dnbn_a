import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { styles } from "./use-gift.styles";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";

export default function UseGift() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("useinfo");
  const { height } = useWindowDimensions();

  const infoContainerHeight = (height - insets.top - insets.bottom - 64) * 0.5;

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
        <Text style={styles.title} pointerEvents="none">
          선물함
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.infoContainer, { height: infoContainerHeight }]}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.giftImage}
          />

          <Text style={styles.storeName}>별다방</Text>
          <Text style={styles.productName}>얼죽아 + 케이크</Text>
          <Image
            source={require("@/assets/images/qr.png")}
            style={styles.qrImage}
          />
        </View>

        <View style={styles.explanationContainer}>
          <View style={styles.explanationTab}>
            <Text
              style={styles.explanationTabText}
              onPress={() => setActiveTab("useinfo")}
            >
              이용안내
            </Text>
            <Text
              style={styles.explanationTabText}
              onPress={() => setActiveTab("detailinfo")}
            >
              상세정보
            </Text>
          </View>

          <View style={styles.explanationContent}>
            {activeTab === "useinfo" ? (
              <Text style={styles.explanationText}>
                <Ionicons name="qr-code-outline" size={20} color="#666" />
                {"  "}매장 방문 시, QR 코드를 제시하여 상품을 사용하세요.
                {"\n\n"}
                <Ionicons name="time-outline" size={20} color="#666" />
                {"  "}유효기간 내에 사용하지 않은 상품은 자동으로 만료됩니다.
                {"\n\n"}
                <Ionicons name="call-outline" size={20} color="#666" />
                {"  "}상품 관련 문의는 가맹점으로 연락주세요.
              </Text>
            ) : (
              <View style={styles.explanationTextToggle}>
                <View style={styles.explanationToggle}>
                  <Text>상품고시정보</Text>
                  <Ionicons name="arrow-down-outline" size={20} color="#666" />
                </View>
                <View style={styles.explanationToggle}>
                  <Text>취소/환불 정책 및 방법</Text>
                  <Ionicons name="arrow-down-outline" size={20} color="#666" />
                </View>
                <View style={styles.explanationToggle}>
                  <Text>거래 조건에 관한 정보</Text>
                  <Ionicons name="arrow-down-outline" size={20} color="#666" />
                </View>
                <View style={styles.explanationToggle}>
                  <Text>구매 시 주의사항</Text>
                  <Ionicons name="arrow-down-outline" size={20} color="#666" />
                </View>
              </View>
            )}
          </View>
        </View>
        <View style={styles.giftDetailInfo}>
          <Text style={styles.giftDetailTitle}>선물 사용 정보</Text>
          <View style={styles.giftDetailRow}>
            <Text style={styles.giftDetailLabel}>금액</Text>
            <Text style={styles.giftDetailValue}>10,000원</Text>
          </View>
          <View style={styles.giftDetailRow}>
            <Text style={styles.giftDetailLabel}>유효기간</Text>
            <Text style={styles.giftDetailValue}>2024.01.01 ~ 2024.12.31</Text>
          </View>
          <View style={styles.giftDetailRow}>
            <Text style={styles.giftDetailLabel}>주문번호</Text>
            <Text style={styles.giftDetailValue}>ORD134952</Text>
          </View>
          <View style={styles.giftDetailRow}>
            <Text style={styles.giftDetailLabel}>교환처</Text>
            <Text style={styles.giftDetailValue}>별다방</Text>
          </View>
          <View style={styles.giftDetailRow}>
            <Text style={styles.giftDetailLabel}>선물 주문일</Text>
            <Text style={styles.giftDetailValue}>2024.06.15</Text>
          </View>
          <View style={styles.giftDetailRow}>
            <Text style={styles.giftDetailLabel}>사용상태</Text>
            <Text style={styles.giftDetailValue}>사용 가능</Text>
          </View>
        </View>
      </ScrollView>
        <TouchableOpacity style={styles.useButton}>
          <Text style={styles.useButtonText}>사용하기</Text>
        </TouchableOpacity>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
