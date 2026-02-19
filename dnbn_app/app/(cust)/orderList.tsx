import { apiGet } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
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

  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const [status, setStatus] = useState<
    "ALL" | "PURCHASE" | "CANCEL" | "REFUND"
  >("ALL");
  const [period, setPeriod] = useState<"1M" | "3M" | "6M" | "1Y" | "ALL">(
    "ALL",
  );
  const [keyword, setKeyword] = useState("");

  const [loading, setLoading] = useState(false);
  const [purchaseList, setPurchaseList] = useState<Order[]>([]);
  const [error, setError] = useState(false);

  // 모달 내에서 임시로 상태를 관리
  const [tempStatus, setTempStatus] = useState<
    "ALL" | "PURCHASE" | "CANCEL" | "REFUND"
  >("ALL");
  const [tempPeriod, setTempPeriod] = useState<
    "1M" | "3M" | "6M" | "1Y" | "ALL"
  >("1M");

  const listRef = useRef<FlatList>(null);

  type OrderItem = {
    orderCode: string;
    storeName: string;
    status: string;
    imageUrl: string;
    productName: string;
    quantity: number;
    price: number;
    datetime: string;
  };

  type Order = {
    date: string;
    items: OrderItem[];
  };

  // API로 구매내역 조회
  const fetchPurchaseHistory = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await apiGet(`/cust/order/purchase-history`);

      if (response.ok) {
        const data = await response.json();
        setPurchaseList(data.purchaseList || []);
      } else {
        console.error("구매내역 조회 실패:", response.status);
        setError(true);
      }
    } catch (error) {
      console.error("구매내역 조회 에러:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // 필터 적용된 구매내역 조회
  const fetchPurchaseHistoryWithFilter = async (
    filterStatus?: "ALL" | "PURCHASE" | "CANCEL" | "REFUND",
    filterPeriod?: "1M" | "3M" | "6M" | "1Y" | "ALL",
    filterKeyword?: string,
  ) => {
    try {
      setLoading(true);
      setError(false);

      // 파라미터가 있으면 사용, 없으면 상태값 사용
      const currentStatus = filterStatus !== undefined ? filterStatus : status;
      const currentPeriod = filterPeriod !== undefined ? filterPeriod : period;
      const currentKeyword =
        filterKeyword !== undefined ? filterKeyword : keyword;

      // status 매핑: ALL -> "", PURCHASE -> "구매", CANCEL -> "취소", REFUND -> "환불"
      const statusMap: Record<string, string> = {
        ALL: "",
        PURCHASE: "구매",
        CANCEL: "취소",
        REFUND: "환불",
      };
      const mappedStatus = statusMap[currentStatus] || "";

      // dateRange 매핑: 1M -> "1month", 3M -> "3months", etc.
      const dateRangeMap: Record<string, string> = {
        "1M": "1month",
        "3M": "3months",
        "6M": "6months",
        "1Y": "1year",
        ALL: "",
      };
      const mappedDateRange = dateRangeMap[currentPeriod] || "";

      const response = await apiGet(
        `/cust/order/purchase-history/filter?status=${mappedStatus}&keyword=${encodeURIComponent(currentKeyword)}&dateRange=${mappedDateRange}`,
      );

      if (response.ok) {
        const data = await response.json();
        setPurchaseList(data.purchaseList || []);
      } else {
        console.error("필터 구매내역 조회 실패:", response.status);
        setError(true);
      }
    } catch (error) {
      console.error("필터 구매내역 조회 에러:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchPurchaseHistory();
  }, []);

  const scrollToTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const handleOpenFilterModal = () => {
    setTempStatus(status);
    setTempPeriod(period);
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
    // 필터 적용하여 검색 (tempStatus와 tempPeriod를 직접 전달)
    fetchPurchaseHistoryWithFilter(tempStatus, tempPeriod, keyword);
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
          placeholder="구매한 상품을 검색해보세요"
          style={[styles.searchText, searchFocused && styles.searchTextFocused]}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          value={keyword}
          onChangeText={setKeyword}
        />
        <Pressable
          onPress={() => fetchPurchaseHistoryWithFilter()}
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
            {status === "PURCHASE" && "구매"}
            {status === "CANCEL" && "취소"}
            {status === "REFUND" && "환불"}
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

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#999" />
          <Text style={styles.emptyText}>서버 오류가 발생했습니다</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={fetchPurchaseHistory}
          >
            <Ionicons name="refresh" size={20} color="#EF7810" />
            <Text style={styles.refreshButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      ) : purchaseList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={60} color="#999" />
          <Text style={styles.emptyText}>주문내역이 존재하지 않습니다</Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={purchaseList}
          keyExtractor={(item) => item.date}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          style={{ flex: 1 }}
          renderItem={({ item: order }) => (
            <View style={styles.orderContainer}>
              <View style={styles.orderDateContainer}>
                <Text style={styles.orderDate}>{order.date}</Text>
              </View>
              {order.items.map((item: OrderItem, index: number) => (
                <View
                  key={`${order.date}-${index}`}
                  style={styles.orderItemContainer}
                >
                  <View style={styles.orderProductInfoContainer}>
                    <View style={styles.orderProductImgContainer}>
                      <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.orderProductImg}
                        resizeMode="cover"
                      />
                    </View>

                    <View style={styles.orderProductDetailContainer}>
                      <View style={styles.topInfoRow}>
                        <Text style={styles.orderState}>{item.status}</Text>
                        <Pressable
                          style={styles.orderDetailButton}
                          onPress={() =>
                            router.navigate({
                              pathname: "/(cust)/orderDetail",
                              params: { orderCode: item.orderCode },
                            })
                          }
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
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        />
      )}

      {/* FloatingButton - 최상단 이동 */}
      <TouchableOpacity
        style={[styles.scrollToTopButton, { bottom: 30 + insets.bottom }]}
        onPress={scrollToTop}
      >
        <Ionicons name="chevron-up" size={24} color="#ef7810" />
      </TouchableOpacity>

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
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.filterSectionTitle}>주문 상태</Text>
                <Pressable onPress={closeFilterModal}>
                  <Ionicons name="close" size={24} color="#666" />
                </Pressable>
              </View>
              <View style={styles.filterOptions}>
                <TouchableOpacity
                  style={[
                    styles.filterOptionButton,
                    tempStatus === "ALL" && styles.filterOptionButtonActive,
                  ]}
                  onPress={() => setTempStatus("ALL")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.filterOptionButtonText}>전체</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterOptionButton,
                    tempStatus === "PURCHASE" &&
                      styles.filterOptionButtonActive,
                  ]}
                  onPress={() => setTempStatus("PURCHASE")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.filterOptionButtonText}>구매</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterOptionButton,
                    tempStatus === "CANCEL" && styles.filterOptionButtonActive,
                  ]}
                  onPress={() => setTempStatus("CANCEL")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.filterOptionButtonText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterOptionButton,
                    tempStatus === "REFUND" && styles.filterOptionButtonActive,
                  ]}
                  onPress={() => setTempStatus("REFUND")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.filterOptionButtonText}>환불</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 기간 선택 */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>기간</Text>
              <View style={styles.filterDateOptions}>
                <TouchableOpacity
                  style={[
                    styles.filterDateButton,
                    tempPeriod === "1M" && styles.filterDateButtonActive,
                  ]}
                  onPress={() => setTempPeriod("1M")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.filterOptionButtonText}>최근 1개월</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterDateButton,
                    tempPeriod === "3M" && styles.filterDateButtonActive,
                  ]}
                  onPress={() => setTempPeriod("3M")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.filterOptionButtonText}>최근 3개월</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterDateButton,
                    tempPeriod === "6M" && styles.filterDateButtonActive,
                  ]}
                  onPress={() => setTempPeriod("6M")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.filterOptionButtonText}>최근 6개월</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterDateButton,
                    tempPeriod === "1Y" && styles.filterDateButtonActive,
                  ]}
                  onPress={() => setTempPeriod("1Y")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.filterOptionButtonText}>최근 1년</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterDateButton,
                    tempPeriod === "ALL" && styles.filterDateButtonActive,
                  ]}
                  onPress={() => setTempPeriod("ALL")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.filterOptionButtonText}>모든 기간</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 조회하기 버튼 */}
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyFilter}
              activeOpacity={0.7}
            >
              <Text style={styles.applyButtonText}>조회하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
