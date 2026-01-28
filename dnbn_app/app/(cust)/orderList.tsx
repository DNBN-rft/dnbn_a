import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./orderlist.styles";

export default function PurchaseScreen() {
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<"UNUSED" | "USED">("UNUSED");
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const [status, setStatus] = useState<"ALL" | "CANCEL" | "USED">("ALL");
  const [period, setPeriod] = useState<"1M" | "3M" | "6M" | "1Y" | "ALL">("1Y");

  // 모달 내에서 임시로 상태를 관리
  const [tempStatus, setTempStatus] = useState<"ALL" | "CANCEL" | "USED">(
    "ALL"
  );
  const [tempPeriod, setTempPeriod] = useState<"1M" | "3M" | "6M" | "1Y">("1M");

  const listRef = useRef<FlatList>(null);

  type OrderItem = {
    id: string;
    storeName: string;
    status: string;
    productName: string;
    quantity: number;
    price: number;
    datetime: string;
  };

  type Order = {
    id: string;
    date: string;
    items: OrderItem[];
  };

  const purchaseList: Order[] = [
    {
      id: "1",
      date: "2026.01.05",
      items: [
        {
          id: "1-1", // 지우고 구현
          storeName: "가게이름1",
          status: "구매확정",
          productName: "맛있는 두쫀쿠",
          quantity: 1,
          price: 5500,
          datetime: "2026.01.05 14:30",
        },
        {
          id: "1-2",
          storeName: "가게이름2",
          status: "구매확정",
          productName: "맛있는 케이크",
          quantity: 2,
          price: 8000,
          datetime: "2026.01.05 15:20",
        },
      ],
    },
    {
      id: "2",
      date: "2026.01.04",
      items: [
        {
          id: "2-1",
          storeName: "가게이름",
          status: "구매확정",
          productName: "맛있는 두쫀쿠",
          quantity: 1,
          price: 5500,
          datetime: "2026.01.04 10:15",
        },
      ],
    },
    {
      id: "3",
      date: "2026.01.03",
      items: [
        {
          id: "3-1",
          storeName: "가게이름1",
          status: "구매확정",
          productName: "맛있는 두쫀쿠",
          quantity: 1,
          price: 5500,
          datetime: "2026.01.03 12:45",
        },
        {
          id: "3-2",
          storeName: "가게이름3",
          status: "구매확정",
          productName: "맛있는 빵",
          quantity: 3,
          price: 3000,
          datetime: "2026.01.03 16:30",
        },
      ],
    },
    {
      id: "4",
      date: "2026.01.02",
      items: [
        {
          id: "4-1",
          storeName: "가게이름",
          status: "구매확정",
          productName: "맛있는 두쫀쿠",
          quantity: 1,
          price: 5500,
          datetime: "2026.01.02 09:00",
        },
      ],
    },
    {
      id: "5",
      date: "2026.01.01",
      items: [
        {
          id: "5-1",
          storeName: "가게이름1",
          status: "구매확정",
          productName: "맛있는 두쫀쿠",
          quantity: 1,
          price: 5500,
          datetime: "2026.01.01 11:20",
        },
        {
          id: "5-2",
          storeName: "가게이름2",
          status: "구매확정",
          productName: "맛있는 케이크",
          quantity: 2,
          price: 8000,
          datetime: "2026.01.01 13:40",
        },
      ],
    },
  ];

  const scrollToTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const handleOpenFilterModal = () => {
    setTempStatus(status);
    setTempPeriod(period === "ALL" ? "1M" : period);
    setIsOverlayVisible(true);
    setTimeout(() => {
      setFilterModalOpen(true);
    }, 20);
  };

  const closeFilterModal = () => {
    setFilterModalOpen(false);
    setTimeout(() => {
      setIsOverlayVisible(false);
    }, 300);
  };

  const handleApplyFilter = () => {
    setStatus(tempStatus);
    setPeriod(tempPeriod);
    setFilterModalOpen(false);
    setTimeout(() => {
      setIsOverlayVisible(false);
    }, 300);
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
      )}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>구매내역</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchTopContainer}>
        <TextInput
          placeholder="구매한 상품/스토어를 검색해보세요"
          style={[styles.searchText, searchFocused && styles.searchTextFocused]}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <Pressable
          onPress={() => router.push("/(cust)/tabs/custhome")}
          style={styles.searchButton}
        >
          <Text style={styles.searchButtonText}>검색</Text>
        </Pressable>
      </View>

      <View style={styles.filterContainer}>
        {/* 상태 */}
        <Pressable style={styles.selectBox} onPress={handleOpenFilterModal}>
          <Text style={styles.selectBoxText}>
            {status === "ALL" && "전체"}
            {status === "CANCEL" && "취소"}
            {status === "USED" && "사용완료"}
          </Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color="#666"
            style={{ marginLeft: 6 }}
          />
        </Pressable>

        {/* 기간 */}
        <Pressable style={styles.selectBox} onPress={handleOpenFilterModal}>
          <Text style={styles.selectBoxText}>
            {period === "1M" && "최근 1개월"}
            {period === "3M" && "최근 3개월"}
            {period === "6M" && "최근 6개월"}
            {period === "1Y" && "최근 1년"}
            {period === "ALL" && "기간선택"}
          </Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color="#666"
            style={{ marginLeft: 6 }}
          />
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={purchaseList}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        style={{ flex: 1 }}
        renderItem={({ item: order }) => (
          <View style={styles.orderContainer}>
            <View style={styles.orderDateContainer}>
              <Text style={styles.orderDate}>{order.date}</Text>
            </View>
            {order.items.map((item: OrderItem) => (
              <View key={item.id} style={styles.orderItemContainer}>
                <View style={styles.orderProductInfoContainer}>
                  <View style={styles.orderProductImgContainer} />

                  <View style={styles.orderProductDetailContainer}>
                    <View style={styles.topInfoRow}>
                      <Text style={styles.orderState}>{item.status}</Text>
                      <Pressable
                        style={styles.orderDetailButton}
                        onPress={() => router.navigate("/(cust)/orderDetail")}
                      >
                        <Text style={styles.orderDetailButtonText}>
                          주문상세
                        </Text>
                        <Ionicons
                          name="chevron-forward"
                          size={18}
                          color="#666"
                        />
                      </Pressable>
                    </View>

                    <Text style={styles.productName}>{item.productName}</Text>

                    <View style={styles.bottomInfoRow}>
                      <Text style={styles.productPrice}>
                        {item.price.toLocaleString()}원
                      </Text>
                      <Text style={styles.separator}> | </Text>
                      <Text style={styles.productDate}>{item.datetime}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      />

      {/* FloatingButton - 최상단 이동 */}
      <Pressable
        style={[styles.scrollToTopButton, { bottom: insets.bottom + 20 }]}
        onPress={scrollToTop}
      >
        <Text style={styles.scrollToTopButtonText}>▲</Text>
      </Pressable>

      {/* 필터 모달 배경 */}
      {isOverlayVisible && (
        <Pressable style={styles.modalOverlay} onPress={closeFilterModal} />
      )}

      <Modal
        visible={filterModalOpen}
        transparent
        animationType="slide"
        onRequestClose={closeFilterModal}
      >
        <View style={styles.modalContentWrapper}>
          <View style={styles.filterModalContent}>
            {/* 주문 상태 선택 */}
            <View style={styles.filterSection}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={styles.filterSectionTitle}>주문 상태</Text>
                <Pressable onPress={closeFilterModal}>
                  <Ionicons name="close" size={24} color="#666" />
                </Pressable>
              </View>
              <View style={styles.filterOptions}>
                <Pressable
                  style={[
                    styles.filterOptionButton,
                    tempStatus === "ALL" && styles.filterOptionButtonActive,
                  ]}
                  onPress={() => setTempStatus("ALL")}
                >
                  <Text style={styles.filterOptionButtonText}>전체</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.filterOptionButton,
                    tempStatus === "CANCEL" && styles.filterOptionButtonActive,
                  ]}
                  onPress={() => setTempStatus("CANCEL")}
                >
                  <Text style={styles.filterOptionButtonText}>취소</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.filterOptionButton,
                    tempStatus === "USED" && styles.filterOptionButtonActive,
                  ]}
                  onPress={() => setTempStatus("USED")}
                >
                  <Text style={styles.filterOptionButtonText}>사용완료</Text>
                </Pressable>
              </View>
            </View>

            {/* 기간 선택 */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>기간</Text>
              <View style={styles.filterDateOptions}>
                <Pressable
                  style={[
                    styles.filterDateButton,
                    tempPeriod === "1M" && styles.filterDateButtonActive,
                  ]}
                  onPress={() => setTempPeriod("1M")}
                >
                  <Text style={styles.filterOptionButtonText}>최근 1개월</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.filterDateButton,
                    tempPeriod === "3M" && styles.filterDateButtonActive,
                  ]}
                  onPress={() => setTempPeriod("3M")}
                >
                  <Text style={styles.filterOptionButtonText}>최근 3개월</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.filterDateButton,
                    tempPeriod === "6M" && styles.filterDateButtonActive,
                  ]}
                  onPress={() => setTempPeriod("6M")}
                >
                  <Text style={styles.filterOptionButtonText}>최근 6개월</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.filterDateButton,
                    tempPeriod === "1Y" && styles.filterDateButtonActive,
                  ]}
                  onPress={() => setTempPeriod("1Y")}
                >
                  <Text style={styles.filterOptionButtonText}>최근 1년</Text>
                </Pressable>
              </View>
            </View>

            {/* 조회하기 버튼 */}
            <Pressable style={styles.applyButton} onPress={handleApplyFilter}>
              <Text style={styles.applyButtonText}>조회하기</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
