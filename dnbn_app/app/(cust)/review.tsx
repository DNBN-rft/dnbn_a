import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./review.styles";

interface WrittenReview {
  id: string;
  uri: any;
  productName: string;
  orderDate: string;
  orderCode: string;
  storeName: string;
  rating: number;
  comment: string;
  reviewDate: string;
}

interface UnwrittenReview {
  id: string;
  uri: any;
  productName: string;
  orderDate: string;
  orderCode: string;
  storeName: string;
  status: string;
}

export default function CustReviewListScreen() {
  const [selectedTab, setSelectedTab] = React.useState<"written" | "unwritten">(
    "unwritten"
  );
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [selectedReviewId, setSelectedReviewId] = React.useState<string | null>(null);

  const insets = useSafeAreaInsets();

  const handleDeletePress = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    // TODO: 실제 삭제 로직 구현
    console.log('리뷰 삭제:', selectedReviewId);
    setDeleteModalVisible(false);
    setSelectedReviewId(null);
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setSelectedReviewId(null);
  };

  const writtenReviews: WrittenReview[] = [
    {
      id: "1",
      uri: require("@/assets/images/logo.png"),
      productName: "상품이름asdasdasdasdasdasdasdasdasdasA",
      orderDate: "2024-06-05",
      orderCode: "ORD-2024-001",
      storeName: "백암점",
      rating: 5,
      comment: "정말 맛있었어요! 강추합니다. 백암에서 제일로 맛있는 무언가",
      reviewDate: "2024-06-07",
    },
    {
      id: "2",
      uri: require("@/assets/images/image1.jpg"),
      productName: "상품이름B",
      orderDate: "2024-06-08",
      orderCode: "ORD-2024-002",
      storeName: "용인점",
      rating: 4,
      comment: "서비스가 좋았어요.",
      reviewDate: "2024-06-09",
    },
  ];

  const unwrittenReviews: UnwrittenReview[] = [
    {
      id: "3",
      uri: require("@/assets/images/logo.png"),
      productName: "상품 C",
      orderDate: "2024-06-10",
      orderCode: "ORD-2024-001",
      storeName: "백암점",
      status: "사용완료"
    },
    {
      id: "4",
      uri: require("@/assets/images/logo.png"),
      productName: "상품 D",
      orderDate: "2024-06-12",
      orderCode: "ORD-2024-002",
      storeName: "용인점",
      status: "미사용"
    },
  ];

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
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
            data={writtenReviews}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.reviewItemContainer}>
                {/* 주문일자 + 주문코드 + 화살표 버튼 */}
                <TouchableOpacity 
                  style={styles.orderHeader}
                  onPress={() => router.push("/(cust)/orderDetail")}
                >
                  <Text style={styles.orderHeaderText}>
                    {item.orderDate} ({item.orderCode})
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#666" />
                </TouchableOpacity>
                
                {/* 이미지 + 정보 Row */}
                <View style={styles.writtenReviewRow}>
                  <TouchableOpacity onPress={() => router.push("/(cust)/productDetail")}>
                    <Image
                      source={item.uri}
                      style={styles.reviewImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <View style={styles.writtenReviewContent}>
                    <Text
                      style={styles.writtenStoreName}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.storeName}
                    </Text>
                    <Text
                      style={styles.writtenProductName}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.productName}
                    </Text>
                  </View>
                </View>
                
                {/* 리뷰 정보 영역 */}
                <View style={styles.reviewInfoSection}>
                  {/* 별점 + 수정/삭제 */}
                  <View style={styles.reviewActionRow}>
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingScore}>{item.rating}점</Text>
                    </View>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity onPress={() => router.push("/(cust)/reviewReg")}>
                        <Text style={styles.actionText}>수정</Text>
                      </TouchableOpacity>
                      <Text style={styles.actionDivider}>|</Text>
                      <TouchableOpacity onPress={() => handleDeletePress(item.id)}>
                        <Text style={styles.actionText}>삭제</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {/* 리뷰 내용 */}
                  <TouchableOpacity onPress={() => router.push("/(cust)/reviewDetail")}>
                    <Text
                      style={styles.reviewCommentText}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {item.comment}
                    </Text>
                  </TouchableOpacity>
                  {/* 리뷰 작성일 */}
                  <Text style={styles.reviewDateText}>{item.reviewDate}</Text>
                </View>
              </View>
            )}
          />
        ) : (
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
            data={unwrittenReviews}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.reviewItemContainer}>
                {/* 주문일자 + 주문코드 + 화살표 버튼 */}
                <TouchableOpacity 
                  style={styles.orderHeader}
                  onPress={() => router.push("/(cust)/orderDetail")}
                >
                  <Text style={styles.orderHeaderText}>
                    {item.orderDate} ({item.orderCode})
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#666" />
                </TouchableOpacity>
                
                {/* 이미지 + 정보 Row */}
                <View style={styles.unwrittenReviewRow}>
                  <Image
                    source={item.uri}
                    style={styles.reviewImage}
                    resizeMode="contain"
                  />
                  <View style={styles.unwrittenReviewContent}>
                    <Text
                      style={styles.unwrittenStoreName}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.storeName}
                    </Text>
                    <Text
                      style={styles.unwrittenProductName}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.productName}
                    </Text>
                    <Text style={styles.unwrittenStatus}>
                      {item.status}
                    </Text>
                  </View>
                </View>
                
                {/* 리뷰작성 버튼 */}
                <TouchableOpacity
                  style={styles.reviewWriteButton}
                  onPress={() => router.push("/(cust)/reviewReg")}
                >
                  <Text style={styles.reviewWriteButtonText}>리뷰 작성</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
      
      {/* 삭제 확인 모달 */}
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>리뷰 삭제</Text>
            <Text style={styles.modalMessage}>정말로 삭제하시겠습니까?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmDelete}
              >
                <Text style={styles.confirmButtonText}>확인</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelDelete}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
