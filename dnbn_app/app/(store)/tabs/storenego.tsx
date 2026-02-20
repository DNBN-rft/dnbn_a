import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "../styles/storenego.styles";

export default function StoreNego() {
  const insets = useSafeAreaInsets();
  const { tab } = useLocalSearchParams<{ tab?: "list" | "request" }>();
  const [activeTab, setActiveTab] = useState<"list" | "request">("list");

  useFocusEffect(
    useCallback(() => {
      setActiveTab(tab || "list");
    }, [tab]),
  );

  const [approveModal, setApproveModal] = useState<
    "approve" | "reject" | "noOpen"
  >("noOpen");
  const [statusNm, setStatusNm] = useState<"승인" | "거절" | "">("");

  const negoList = [
    {
      id: "1",
      uri: require("@/assets/images/image1.jpg"),
      category: "카테고리 1",
      productName: "상품 1",
      status: "진행",
      price: 9000,
    },
    {
      id: "2",
      uri: require("@/assets/images/image1.jpg"),
      category: "카테고리 2",
      productName: "상품 2",
      status: "대기",
      price: 18000,
    },
    {
      id: "3",
      uri: require("@/assets/images/image1.jpg"),
      category: "카테고리 3",
      productName: "상품 3",
      status: "진행",
      price: 25000,
    },
  ];

  const negoRequest = [
    {
      id: "1",
      uri: require("@/assets/images/image1.jpg"),
      category: "카테고리 1",
      productName: "상품 1",
      price: 9000,
      offeredPrice: 8500,
      requestor: "김진용",
      requestorPhone: "010-1234-5678",
    },
    {
      id: "2",
      uri: require("@/assets/images/image1.jpg"),
      category: "카테고리 2",
      productName: "상품 2",
      price: 92000,
      offeredPrice: 17000,
      requestor: "전형운",
      requestorPhone: "010-1234-5678",
    },
    {
      id: "3",
      uri: require("@/assets/images/image1.jpg"),
      category: "카테고리 3",
      productName: "상품 3",
      price: 90040,
      offeredPrice: 24000,
      requestor: "박소윤",
      requestorPhone: "010-1234-5678",
    },
  ];

  const handleApprove = (status) => {
    // {
    //   status === "approve" ? 승인 동작 :
    //   status === "reject" ? 거절 동작:
    //   예외처리
    // }
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#ffffff" }} />
      )}

      <View style={styles.header}>
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.centerSection}>
          <Text style={styles.title}>네고 관리</Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={
            activeTab === "list" ? styles.tabButtonActive : styles.tabButton
          }
          onPress={() => {
            setActiveTab("list");
            router.setParams({ tab: undefined });
          }}
        >
          <Text
            style={
              activeTab === "list"
                ? styles.tabButtonTextActive
                : styles.tabButtonText
            }
          >
            목록
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            activeTab === "request" ? styles.tabButtonActive : styles.tabButton
          }
          onPress={() => setActiveTab("request")}
        >
          <Text
            style={
              activeTab === "request"
                ? styles.tabButtonTextActive
                : styles.tabButtonText
            }
          >
            요청
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "list" ? (
        <FlatList
          contentContainerStyle={{
            paddingBottom: Platform.OS === "ios" ? insets.bottom + 60 : 0,
          }}
          data={negoList}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.negoProduct}>
              <View style={styles.productContainer}>
                <View style={styles.productImageContainer}>
                  <Image style={styles.productImage} source={item.uri} />
                </View>

                <View style={styles.productInfoContainer}>
                  <View>
                    <Text style={styles.categoryText}>{item.category}</Text>

                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.productNameText}
                    >
                      {item.productName}
                    </Text>
                  </View>

                  <View style={styles.negoStatusAndPriceContainer}>
                    <Text style={styles.negoPriceText}>
                      {item.price.toLocaleString()}원
                    </Text>

                    <Text style={styles.negoStatusText}>{item.status}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.detailButtonContainer}>
                <TouchableOpacity
                  style={styles.detailButton}
                  onPress={() => router.navigate("/(store)/detailnego")}
                >
                  <Text style={styles.detailButtonText}>상세</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        ></FlatList>
      ) : (
        <FlatList
          contentContainerStyle={{
            paddingBottom: Platform.OS === "ios" ? insets.bottom + 60 : 0,
          }}
          data={negoRequest}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.negoRequestProduct}>
              <View style={styles.negoRequestProductContainer}>
                <View style={styles.negoRequestProductImageContainer}>
                  <Image
                    style={styles.negoRequestProductImage}
                    source={item.uri}
                  />
                </View>

                <View style={styles.negoRequestproductInfoContainer}>
                  <View>
                    <Text style={styles.productNameText}>
                      {item.productName}
                    </Text>
                  </View>

                  <View>
                    <View>
                      <Text style={styles.registPriceText}>
                        {item.price.toLocaleString()}원
                      </Text>
                    </View>

                    <View>
                      <Text style={styles.negoPriceText}>
                        {item.offeredPrice.toLocaleString()}원
                      </Text>
                    </View>
                  </View>

                  <View style={styles.requestor}>
                    <Text>{item.requestor}</Text>
                    <Text>{item.requestorPhone}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.buttonsContainer}>
                <View style={styles.requestButtonContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setApproveModal("approve");
                      setStatusNm("승인");
                    }}
                    style={styles.approveButtonContainer}
                  >
                    <View>
                      <Text style={styles.approveButtonText}>승인</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setApproveModal("reject");
                      setStatusNm("거절");
                    }}
                    style={styles.rejectButtonContainer}
                  >
                    <View>
                      <Text style={styles.rejectButtonText}>거절</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        ></FlatList>
      )}
      <Modal
        visible={approveModal === "approve" || approveModal === "reject"}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setApproveModal("noOpen")}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalTitle}>알림</Text>
            <Text style={styles.deleteModalMessage}>
              정말로 이 요청을 {statusNm} 하시겠습니까?
            </Text>

            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={[styles.deleteModalButton, styles.confirmButton]}
                onPress={() => {
                  // 여기서 실제 삭제 로직 구현
                  setApproveModal("noOpen");
                  handleApprove(approveModal);
                  // TODO: 실제 삭제 API 호출
                }}
              >
                <Text style={styles.confirmButtonText}>{statusNm}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.deleteModalButton, styles.cancelButton]}
                onPress={() => setApproveModal("noOpen")}
              >
                <Text style={styles.modalCancelButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
