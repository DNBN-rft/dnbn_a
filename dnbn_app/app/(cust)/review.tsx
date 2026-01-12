import { router } from "expo-router";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./review.styles";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface WrittenReview {
  id: string;
  uri: any;
  productName: string;
  rating: number;
  comment: string;
}

interface UnwrittenReview {
  id: string;
  uri: any;
  productName: string;
  orderDate: string;
  status: string;
}

export default function CustReviewListScreen() {
  const [selectedTab, setSelectedTab] = React.useState<"written" | "unwritten">(
    "written"
  );

  const insets = useSafeAreaInsets();

  const writtenReviews: WrittenReview[] = [
    {
      id: "1",
      uri: require("@/assets/images/logo.png"),
      productName: "상품이름asdasdasdasdasdasdasdasdasdasA",
      rating: 5,
      comment: "정말 맛있었어요! 강추합니다. 백암에서 제일로 맛있는 무언가",
    },
    {
      id: "2",
      uri: require("@/assets/images/image1.jpg"),
      productName: "상품이름B",
      rating: 4,
      comment: "서비스가 좋았어요.",
    },
  ];

  const unwrittenReviews: UnwrittenReview[] = [
    {
      id: "3",
      uri: require("@/assets/images/logo.png"),
      productName: "상품 C",
      orderDate: "2024-06-10",
      status: "사용완료"
    },
    {
      id: "4",
      uri: require("@/assets/images/logo.png"),
      productName: "상품 D",
      orderDate: "2024-06-12",
      status: "미사용"
    },
  ];

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={[styles.safeAreaTop, { height: insets.top }]} />
      )}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title} pointerEvents="none">
          리뷰
        </Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.topnav}>
        <TouchableOpacity
          style={[
            styles.topNavTab,
            selectedTab === "written" && styles.activeTabBorder,
            selectedTab === "unwritten" && styles.inactiveTabBorder,
          ]}
          onPress={() => setSelectedTab("written")}
        >
          <Text style={[styles.topnavText, selectedTab === "written" && styles.activeTabText]}>작성 리뷰</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.topNavTab,
            selectedTab === "unwritten" && styles.activeTabBorder,
            selectedTab === "written" && styles.inactiveTabBorder,
          ]}
          onPress={() => setSelectedTab("unwritten")}
        >
          <Text style={[styles.topnavText, selectedTab === "unwritten" && styles.activeTabText]}>미작성 리뷰</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.reviewContainer}>
        {selectedTab === "written" ? (
          <FlatList
            data={writtenReviews}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.reviewItemContainer}>
                <View style={styles.writtenReviewRow}>
                  {/* 사진 */}
                  <TouchableOpacity
                    onPress={() => router.push("/(cust)/productDetail")}>
                    <Image
                      source={item.uri}
                      style={styles.reviewImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.reviewContent} onPress={() => router.push("/(cust)/reviewDetail")}>
                    <Text
                      style={styles.productName}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.productName}
                    </Text>
                    <Text style={styles.ratingText}>
                      {"⭐".repeat(item.rating)}
                    </Text>
                    <Text
                      style={styles.commentText}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.comment}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        ) : (
          <FlatList
            data={unwrittenReviews}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.reviewItemContainer}>
                <View style={styles.writtenReviewRow}>
                  <Image
                    source={item.uri}
                    style={styles.reviewImage}
                    resizeMode="contain"
                  />
                  <View style={styles.reviewContent}>

                    <Text
                      style={styles.unwrittenProductName}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.productName}
                    </Text>
                    <Text style={styles.unwrittenStatus}>
                      상태: {item.status}
                    </Text>
                    <Text style={styles.unwrittenOrderDate}>
                      주문일: {item.orderDate}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.reviewWriteButton}
                  onPress={() => router.push("/(cust)/reviewReg")}>
                  <Text style={styles.reviewWriteButtonText}>리뷰 작성</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </ScrollView>
      {insets.bottom > 0 && (
        <View style={[styles.safeAreaBottom, { height: insets.bottom }]} />
      )}
    </View>
  );
}
