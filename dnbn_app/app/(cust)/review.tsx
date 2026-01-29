import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./review.styles";
import { apiGet } from "@/utils/api";

interface WrittenReview {
  reviewIdx: number;
  productImage?: {
    fileUrl: string;
  };
  productNm: string;
  orderDateTime: string;
  orderCode: string;
  storeNm: string;
  reviewRate: number;
  reviewContent: string;
  reviewImages: {
    files: any[];
  };
}

interface FileResponse {
  originalName: string;
  fileUrl: string;
  order: number;
}

interface UnwrittenReview {
  orderDetailIdx: number;
  productImg?: FileResponse;
  orderDateTime: string;
  orderCode: string;
  storeNm: string;
  productNm: string;
}

export default function CustReviewListScreen() {
  const [selectedTab, setSelectedTab] = React.useState<"written" | "unwritten">(
    "unwritten"
  );
  const [writtenReviews, setWrittenReviews] = useState<WrittenReview[]>([]);
  const [unwrittenReviews, setUnwrittenReviews] = useState<UnwrittenReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const insets = useSafeAreaInsets();
  const custCode = "CUST001"; // TODO: 실제 로그인한 사용자의 custCode 가져오기

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      
      // 미작성 리뷰 조회
      const unwrittenResponse = await apiGet(`/cust/review?reviewType=UNWRITTEN&custCode=${custCode}`);
      const unwrittenData = await unwrittenResponse.json();
      // 작성한 리뷰 조회
      const writtenResponse = await apiGet(`/cust/review?reviewType=WRITTEN&custCode=${custCode}`);
      const writtenData = await writtenResponse.json();
      
      if (unwrittenResponse.ok) {
        setUnwrittenReviews(unwrittenData);
      }
      
      if (writtenResponse.ok) {
        setWrittenReviews(writtenData);
      }
      
      setError(null);
    } catch (err) {
      setError('리뷰를 불러올 수 없습니다');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
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
          리뷰관리
        </Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.topnav}>
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
      </View>
      {selectedTab === "written" ? (
          isLoading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#FF5722" />
            </View>
          ) : error ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
              <Text style={{ color: '#666', textAlign: 'center', marginBottom: 16 }}>
                {error}
              </Text>
              <TouchableOpacity
                style={{ paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#FF5722', borderRadius: 4 }}
                onPress={fetchReviews}
              >
                <Text style={{ color: '#fff' }}>다시 시도</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
              data={writtenReviews}
              keyExtractor={(item) => item.reviewIdx.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.reviewItemContainer}
                  onPress={() => router.push({
                    pathname: "/(cust)/reviewDetail",
                    params: { 
                      reviewIdx: item.reviewIdx,
                      productImage: item.productImage?.fileUrl || "",
                      storeNm: item.storeNm,
                      productName: item.productNm,
                      reviewRate: item.reviewRate?.toString() || "0",
                      reviewContent: item.reviewContent,
                      reviewImages: item.reviewImages ? JSON.stringify(item.reviewImages) : JSON.stringify({ files: [] })
                    }
                  })}
                >
                  {/* 주문일자 + 주문코드 */}
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderText}>
                      {formatDate(item.orderDateTime)} ({item.orderCode})
                    </Text>
                  </View>

                  {/* 이미지 + 정보 Row */}
                  <View style={[styles.writtenReviewRow, { alignItems: 'center' }]}>
                    {item.productImage ? (
                      <Image
                        source={{ uri: item.productImage.fileUrl }}
                        style={styles.productImage}
                        resizeMode="stretch"
                      />
                    ) : (
                      <View style={[styles.reviewImage, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={{ color: '#999' }}>이미지</Text>
                      </View>
                    )}
                    <View style={[styles.writtenReviewContent, { flex: 1 }]}>
                      <Text
                        style={styles.writtenStoreName}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.storeNm}
                      </Text>
                      <Text
                        style={styles.writtenProductName}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {item.productNm}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" style={{ marginLeft: 8 }} />
                  </View>
                </TouchableOpacity>
              )}
            />
          )
        ) : (
          isLoading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#FF5722" />
            </View>
          ) : error ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
              <Text style={{ color: '#666', textAlign: 'center', marginBottom: 16 }}>
                {error}
              </Text>
              <TouchableOpacity
                style={{ paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#FF5722', borderRadius: 4 }}
                onPress={fetchReviews}
              >
                <Text style={{ color: '#fff' }}>다시 시도</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
              data={unwrittenReviews}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.reviewItemContainer}>
                  {/* 주문일자 + 주문코드 + 화살표 버튼 */}
                  <TouchableOpacity 
                    style={styles.orderHeader}
                    onPress={() => router.push("/(cust)/orderDetail")}
                  >
                    <Text style={styles.orderHeaderText}>
                      {formatDate(item.orderDateTime)} ({item.orderCode})
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                  </TouchableOpacity>
                  
                  {/* 이미지 + 정보 Row */}
                  <View style={styles.unwrittenReviewRow}>
                    {item.productImg?.fileUrl ? (
                      <Image
                        source={{ uri: item.productImg.fileUrl }}
                        style={styles.reviewImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <View style={[styles.reviewImage, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={{ color: '#999' }}>이미지</Text>
                      </View>
                    )}
                    <View style={styles.unwrittenReviewContent}>
                      <Text
                        style={styles.unwrittenStoreName}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.storeNm}
                      </Text>
                      <Text
                        style={styles.unwrittenProductName}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.productNm}
                      </Text>
                    </View>
                  </View>
                  
                  {/* 리뷰작성 버튼 */}
                  <TouchableOpacity
                    style={styles.reviewWriteButton}
                    onPress={() => router.push({
                      pathname: "/(cust)/reviewReg",
                      params: { 
                        orderDetailIdx: item.orderDetailIdx,
                        storeNm: item.storeNm,
                        productName: item.productNm,
                        productImage: item.productImg?.fileUrl || ""
                      }
                    })}
                  >
                    <Text style={styles.reviewWriteButtonText}>리뷰 작성</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )
        )}
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
