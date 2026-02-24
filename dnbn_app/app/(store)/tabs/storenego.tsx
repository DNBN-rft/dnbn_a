import { apiDelete, apiGet, apiPost } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "../styles/storenego.styles";

// 네고 리스트 API 응답 타입 정의
interface NegoImages {
  files: string[];
}

interface NegoListItem {
  negoIdx: number;
  categoryNm: string;
  images: NegoImages;
  startDateTime: string;
  endDateTime: string;
  productNm: string;
  productCode: string;
  productPrice: number;
  negoStatus: string;
}

interface PageableSort {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}

interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: PageableSort;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

interface NegoListResponse {
  content: NegoListItem[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: PageableSort;
  numberOfElements: number;
  empty: boolean;
}

// 네고 요청 API 응답 타입 정의
interface NegoRequestItem {
  images: NegoImages;
  negoRequestIdx: number;
  categoryNm: string;
  custCode: string;
  custNm: string;
  custTelNo: string;
  productCode: string;
  productNm: string;
  requestDateTime: string;
  requestPrice: number;
  requestStatus: boolean;
  storeCode: string;
}

interface NegoRequestResponse {
  content: NegoRequestItem[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: PageableSort;
  numberOfElements: number;
  empty: boolean;
}

export default function StoreNego() {
  const insets = useSafeAreaInsets();
  const { tab } = useLocalSearchParams<{ tab?: "list" | "request" }>();
  const [activeTab, setActiveTab] = useState<"list" | "request">("list");

  // 네고 리스트 상태
  const [negoList, setNegoList] = useState<NegoListItem[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 네고 요청 리스트 상태
  const [negoRequestList, setNegoRequestList] = useState<NegoRequestItem[]>([]);
  const [requestPage, setRequestPage] = useState(0);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestHasMore, setRequestHasMore] = useState(true);
  const [requestRefreshing, setRequestRefreshing] = useState(false);

  // 네고 리스트 API 호출
  const fetchNegoList = async (pageNum: number, isRefresh: boolean = false) => {
    if (loading || (!hasMore && !isRefresh)) return;

    try {
      setLoading(true);
      const response = await apiGet(`/store/app/nego?page=${pageNum}&size=10`);

      if (response.ok) {
        const data: NegoListResponse = await response.json();

        if (isRefresh) {
          setNegoList(data.content);
        } else {
          setNegoList((prev) => [...prev, ...data.content]);
        }

        setHasMore(!data.last);
        setPage(pageNum);
      } else {
        console.error("네고 리스트 조회 실패:", response.status);
      }
    } catch (error) {
      console.error("네고 리스트 API 호출 에러:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 새로고침
  const handleRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    fetchNegoList(0, true);
  };

  // 무한 스크롤 - 더 불러오기
  const loadMore = () => {
    if (!loading && hasMore) {
      fetchNegoList(page + 1);
    }
  };

  // 네고 취소 핸들러
  const negoCancelHandler = (negoIdx: number) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("정말 네고 등록 취소를 하시겠습니까?");
      if (confirmed) {
        handleCancelNego(negoIdx);
      }
    } else {
      Alert.alert(
        "네고 취소",
        "정말 네고 등록 취소를 하시겠습니까?",
        [
          {
            text: "확인",
            onPress: () => handleCancelNego(negoIdx),
            style: "destructive",
          },
          {
            text: "취소",
            style: "cancel",
          },
        ],
        { cancelable: true },
      );
    }
  };

  // 네고 취소 API 호출
  const handleCancelNego = async (negoIdx: number) => {
    try {
      const response = await apiDelete(`/store/app/nego/cancel/${negoIdx}`);

      if (response.ok) {
        if (Platform.OS === "web") {
          window.alert("네고가 취소되었습니다.");
        } else {
          Alert.alert("성공", "네고가 취소되었습니다.");
        }
        // 리스트 새로고침
        handleRefresh();
      } else {
        if (Platform.OS === "web") {
          window.alert("네고 취소에 실패했습니다.");
        } else {
          Alert.alert("실패", "네고 취소에 실패했습니다.");
        }
      }
    } catch (error) {
      console.error("네고 취소 API 호출 에러:", error);
      if (Platform.OS === "web") {
        window.alert("네고 취소 중 오류가 발생했습니다.");
      } else {
        Alert.alert("오류", "네고 취소 중 오류가 발생했습니다.");
      }
    }
  };

  // 네고 요청 리스트 API 호출
  const fetchNegoRequestList = async (
    pageNum: number,
    isRefresh: boolean = false,
  ) => {
    if (requestLoading || (!requestHasMore && !isRefresh)) return;

    try {
      setRequestLoading(true);
      const response = await apiGet(
        `/store/app/nego-req?page=${pageNum}&size=10`,
      );

      if (response.ok) {
        const data: NegoRequestResponse = await response.json();

        if (isRefresh) {
          setNegoRequestList(data.content);
        } else {
          setNegoRequestList((prev) => [...prev, ...data.content]);
        }

        setRequestHasMore(!data.last);
        setRequestPage(pageNum);
      } else {
        console.error("네고 요청 리스트 조회 실패:", response.status);
      }
    } catch (error) {
      console.error("네고 요청 리스트 API 호출 에러:", error);
    } finally {
      setRequestLoading(false);
      setRequestRefreshing(false);
    }
  };

  // 요청 새로고침
  const handleRequestRefresh = () => {
    setRequestRefreshing(true);
    setRequestHasMore(true);
    fetchNegoRequestList(0, true);
  };

  // 요청 무한 스크롤 - 더 불러오기
  const loadMoreRequest = () => {
    if (!requestLoading && requestHasMore) {
      fetchNegoRequestList(requestPage + 1);
    }
  };

  // 초기 데이터 로드
  useFocusEffect(
    useCallback(() => {
      const newTab = tab || "list";
      setActiveTab(newTab);

      if (newTab === "list" && negoList.length === 0) {
        fetchNegoList(0, true);
      } else if (newTab === "request" && negoRequestList.length === 0) {
        fetchNegoRequestList(0, true);
      }
    }, [tab]),
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<{
    idx: number;
    isAccept: boolean;
  } | null>(null);

  // 네고 요청 승인/거절 API 호출
  const handleApprove = async () => {
    if (!selectedRequest) return;

    const { idx, isAccept } = selectedRequest;
    const statusText = isAccept ? "승인" : "거절";

    try {
      const response = await apiPost(`/store/app/nego-req/${idx}`, {
        isAccept,
      });

      if (response.ok) {
        if (Platform.OS === "web") {
          window.alert(`네고 요청 ${statusText} 완료`);
        } else {
          Alert.alert(`네고 요청 ${statusText} 완료`);
        }
        handleRequestRefresh();
      } else {
        if (Platform.OS === "web") {
          window.alert(`네고 요청 ${statusText}에 실패했습니다.`);
        } else {
          Alert.alert(`네고 요청 ${statusText}에 실패했습니다.`);
        }
      }
    } catch (error) {
      console.error("네고 요청 응답 API 호출 에러:", error);
      if (Platform.OS === "web") {
        window.alert(`네고 요청 ${statusText} 중 오류가 발생했습니다.`);
      } else {
        Alert.alert(`네고 요청 ${statusText} 중 오류가 발생했습니다.`);
      }
    } finally {
      setIsModalVisible(false);
      setSelectedRequest(null);
    }
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
          onPress={() => {
            setActiveTab("request");
            if (negoRequestList.length === 0) {
              fetchNegoRequestList(0, true);
            }
          }}
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
          keyExtractor={(item, index) => `${item.productCode}-${index}`}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && !refreshing ? (
              <View style={{ padding: 20, alignItems: "center" }}>
                <ActivityIndicator size="small" color="#000" />
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={styles.negoProduct}>
              <View style={styles.productContainer}>
                <View style={styles.productImageContainer}>
                  {item.images?.files &&
                  item.images.files.length > 0 &&
                  typeof item.images.files[0] === "string" &&
                  item.images.files[0].trim() !== "" ? (
                    <Image
                      style={styles.productImage}
                      source={{ uri: item.images.files[0] }}
                    />
                  ) : (
                    <Image
                      style={styles.productImage}
                      source={require("@/assets/images/logo.png")}
                    />
                  )}
                </View>

                <View style={styles.productInfoContainer}>
                  <View>
                    <Text style={styles.categoryText}>{item.categoryNm}</Text>

                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.productNameText}
                    >
                      {item.productNm}
                    </Text>
                  </View>

                  <View style={styles.negoStatusAndPriceContainer}>
                    <Text style={styles.negoPriceText}>
                      {item.productPrice.toLocaleString()}원
                    </Text>

                    <Text style={styles.negoStatusText}>{item.negoStatus}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.detailButtonContainer}>
                <TouchableOpacity
                  style={styles.detailButton}
                  onPress={() =>
                    router.navigate({
                      pathname: "/(store)/detailnego",
                      params: { negoIdx: item.negoIdx },
                    })
                  }
                >
                  <Text style={styles.detailButtonText}>상세</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.negoCancelButton}
                  onPress={() => negoCancelHandler(item.negoIdx)}
                >
                  <Text style={styles.negoCancelButtonText}>취소</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <FlatList
          contentContainerStyle={{
            paddingBottom: Platform.OS === "ios" ? insets.bottom + 60 : 0,
          }}
          data={negoRequestList}
          keyExtractor={(item, index) => `${item.productCode}-${index}`}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRequestRefresh}
          refreshing={requestRefreshing}
          onEndReached={loadMoreRequest}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            requestLoading && !requestRefreshing ? (
              <View style={{ padding: 20, alignItems: "center" }}>
                <ActivityIndicator size="small" color="#000" />
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={styles.negoRequestProduct}>
              <View style={styles.negoRequestProductContainer}>
                <View style={styles.negoRequestProductImageContainer}>
                  {item.images?.files &&
                  item.images.files.length > 0 &&
                  typeof item.images.files[0] === "string" &&
                  item.images.files[0].trim() !== "" ? (
                    <Image
                      style={styles.negoRequestProductImage}
                      source={{ uri: item.images.files[0] }}
                    />
                  ) : (
                    <Image
                      style={styles.negoRequestProductImage}
                      source={require("@/assets/images/logo.png")}
                    />
                  )}
                </View>

                <View style={styles.negoRequestproductInfoContainer}>
                  <View>
                    <Text style={styles.productNameText}>{item.productNm}</Text>
                  </View>

                  <View>
                    <View>
                      <Text style={styles.negoPriceText}>
                        {item.requestPrice.toLocaleString()}원
                      </Text>
                    </View>
                  </View>

                  <View style={styles.requestor}>
                    <Text>{item.custNm}</Text>
                    <Text>{item.custTelNo}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.buttonsContainer}>
                <View style={styles.requestButtonContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedRequest({
                        idx: item.negoRequestIdx,
                        isAccept: true,
                      });
                      setIsModalVisible(true);
                    }}
                    style={styles.approveButtonContainer}
                  >
                    <View>
                      <Text style={styles.approveButtonText}>승인</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setSelectedRequest({
                        idx: item.negoRequestIdx,
                        isAccept: false,
                      });
                      setIsModalVisible(true);
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
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setIsModalVisible(false);
          setSelectedRequest(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalTitle}>알림</Text>
            <Text style={styles.deleteModalMessage}>
              정말로 이 요청을 {selectedRequest?.isAccept ? "승인" : "거절"}{" "}
              하시겠습니까?
            </Text>

            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={[styles.deleteModalButton, styles.confirmButton]}
                onPress={handleApprove}
              >
                <Text style={styles.confirmButtonText}>
                  {selectedRequest?.isAccept ? "승인" : "거절"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.deleteModalButton, styles.cancelButton]}
                onPress={() => {
                  setIsModalVisible(false);
                  setSelectedRequest(null);
                }}
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
