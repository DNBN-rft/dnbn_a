import { apiGet, apiPost } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./negologlist.styles";

type TabType = "current" | "complete";

// 네고 요청 내역 (CURRENT)
export interface CustNegoCurrentResponse {
  requestIdx: number;
  requestDateTime: string;
  productImg: ProductImage | null;
  storeNm: string;
  productNm: string;
  productCode: string;
  requestPrice: number;
  originalPrice: number;
}

// 네고 완료 내역 (COMPLETE)
export interface CustNegoCompleteResponse {
  requestLogIdx: number;
  responseDateTime: string;
  productImg: ProductImage | null;
  storeNm: string;
  productNm: string;
  requestStatus: "APPROVED" | "REJECTED" | "CANCELED";
  requestPrice: number;
  originalPrice: number;
}

export interface ProductImage {
  originalName: string;
  fileUrl: string;
  order: number;
}

export type NegoStatus = "CURRENT" | "COMPLETE";

export default function NegoLogListScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>("current");
  const [currentNegoList, setCurrentNegoList] = useState<
    CustNegoCurrentResponse[]
  >([]);
  const [completeNegoList, setCompleteNegoList] = useState<
    CustNegoCompleteResponse[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] =
    useState<CustNegoCurrentResponse | null>(null);
  const [editNegoAmount, setEditNegoAmount] = useState("");
  const [requesting, setRequesting] = useState(false);

  // 네고 목록 조회
  const fetchNegoList = async (status: NegoStatus) => {
    try {
      setLoading(true);
      setError(false);

      let custCode = "";
      if (Platform.OS === "web") {
        custCode = localStorage.getItem("custCode") || "";
      } else {
        custCode = (await SecureStore.getItemAsync("custCode")) || "";
      }

      if (!custCode) {
        setError(true);
        Alert.alert("오류", "고객 정보를 찾을 수 없습니다.");
        return;
      }

      const response = await apiGet(`/cust/nego?negoStatus=${status}`, {});

      if (response.ok) {
        const data = await response.json();

        if (status === "CURRENT") {
          setCurrentNegoList(data || []);
        } else {
          setCompleteNegoList(data || []);
        }
      } else {
        setError(true);
        console.error(`네고 ${status} 목록 조회 실패:`, response.status);
      }
    } catch (error) {
      setError(true);
      console.error("네고 목록 조회 중 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  // 탭 변경 시 데이터 로드
  useEffect(() => {
    const status = activeTab === "current" ? "CURRENT" : "COMPLETE";
    fetchNegoList(status);
  }, [activeTab]);

  // 초기 로드
  useEffect(() => {
    fetchNegoList("CURRENT");
    fetchNegoList("COMPLETE");
  }, []);

  // 네고 요청 수정
  const handleEditNego = (item: CustNegoCurrentResponse) => {
    setEditingItem(item);
    setEditNegoAmount(item.requestPrice.toString());
    setEditModalVisible(true);
  };

  // 네고 요청 취소
  const handleCancelNego = (item: CustNegoCurrentResponse) => {
    Alert.alert("협상 취소", "이 협상 요청을 취소하시겠습니까?", [
      { text: "아니오", onPress: () => {} },
      {
        text: "예",
        onPress: async () => {
          try {
            const response = await apiPost(
              `/cust/nego/cancel/${item.requestIdx}`,
              {},
            );

            if (response.ok) {
              Alert.alert("성공", "네고 요청이 취소되었습니다.");
              fetchNegoList("CURRENT");
            } else {
              Alert.alert("오류", "네고 취소에 실패했습니다.");
            }
          } catch (error) {
            console.error("네고 취소 실패:", error);
            Alert.alert("오류", "네고 취소 중 오류가 발생했습니다.");
          }
        },
      },
    ]);
  };

  const renderCurrentItem = ({ item }: { item: CustNegoCurrentResponse }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemDateTime}>
          {new Date(item.requestDateTime).toLocaleDateString()}{" "}
          {new Date(item.requestDateTime).toLocaleTimeString()}
        </Text>
      </View>
      <View style={styles.itemContent}>
        <View style={styles.itemImageContainer}>
          {item.productImg ? (
            <Image
              source={{ uri: item.productImg.fileUrl }}
              style={styles.itemImage}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="image-outline" size={32} color="#CCCCCC" />
          )}
        </View>
        <View style={styles.itemDetails}>
          <View>
            <Text style={styles.storeName}>{item.storeNm}</Text>
            <Text style={styles.productName} numberOfLines={2}>
              {item.productNm}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.requestPrice}>
              요청가: {item.requestPrice.toLocaleString()}원
            </Text>
            <Text style={styles.originalPrice}>
              원가: {item.originalPrice.toLocaleString()}원
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.itemFooter}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditNego(item)}
        >
          <Text style={styles.editButtonText}>수정</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleCancelNego(item)}
        >
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCompleteItem = ({ item }: { item: CustNegoCompleteResponse }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case "APPROVED":
          return {
            badge: styles.statusBadgeApproved,
            text: styles.statusTextApproved,
            label: "승인됨",
          };
        case "REJECTED":
          return {
            badge: styles.statusBadgeRejected,
            text: styles.statusTextRejected,
            label: "거절됨",
          };
        case "CANCELED":
          return {
            badge: styles.statusBadgeCanceled,
            text: styles.statusTextCanceled,
            label: "취소됨",
          };
        default:
          return {
            badge: styles.statusBadgeApproved,
            text: styles.statusTextApproved,
            label: status,
          };
      }
    };

    const statusColor = getStatusColor(item.requestStatus);

    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemDateTime}>
            응답일: {new Date(item.responseDateTime).toLocaleDateString()}{" "}
            {new Date(item.responseDateTime).toLocaleTimeString()}
          </Text>
          <View style={[styles.statusBadge, statusColor.badge]}>
            <Text style={[styles.statusText, statusColor.text]}>
              {statusColor.label}
            </Text>
          </View>
        </View>
        <View style={styles.itemContent}>
          <View style={styles.itemImageContainer}>
            {item.productImg ? (
              <Image
                source={{ uri: item.productImg.fileUrl }}
                style={styles.itemImage}
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="image-outline" size={32} color="#CCCCCC" />
            )}
          </View>
          <View style={styles.itemDetails}>
            <View>
              <Text style={styles.storeName}>{item.storeNm}</Text>
              <Text style={styles.productName} numberOfLines={2}>
                {item.productNm}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.requestPrice}>
                요청가: {item.requestPrice.toLocaleString()}원
              </Text>
              <Text style={styles.originalPrice}>
                원가: {item.originalPrice.toLocaleString()}원
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const dataList = activeTab === "current" ? currentNegoList : completeNegoList;

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
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
          <Text style={styles.title}>네고내역</Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      {/* 탭 네비게이션 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "current" && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab("current")}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "current" && styles.tabButtonTextActive,
            ]}
          >
            네고요청내역
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "complete" && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab("complete")}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "complete" && styles.tabButtonTextActive,
            ]}
          >
            네고 완료 내역
          </Text>
        </TouchableOpacity>
      </View>

      {/* 콘텐츠 */}
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#EF7810" />
        </View>
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#999" />
          <Text style={styles.emptyText}>데이터를 불러올 수 없습니다</Text>
          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={() => {
              const status = activeTab === "current" ? "CURRENT" : "COMPLETE";
              fetchNegoList(status as NegoStatus);
            }}
          >
            <Text style={{ color: "#EF7810", fontWeight: "600" }}>
              다시 시도
            </Text>
          </TouchableOpacity>
        </View>
      ) : dataList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-outline" size={60} color="#999" />
          <Text style={styles.emptyText}>
            {activeTab === "current"
              ? "요청 내역이 없습니다"
              : "완료된 내역이 없습니다"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={dataList as any}
          keyExtractor={(item: any, index) => {
            if (activeTab === "current") {
              return `current-${item.requestIdx}`;
            } else {
              return `complete-${item.requestLogIdx}`;
            }
          }}
          renderItem={
            (activeTab === "current"
              ? renderCurrentItem
              : renderCompleteItem) as any
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}

      {/* 네고 수정 모달 */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setEditModalVisible(false);
          setEditingItem(null);
          setEditNegoAmount("");
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.negoModalContent}>
            <Text style={styles.negoModalTitle}>네고 요청 수정</Text>

            <Text style={styles.negoModalLabel}>희망 금액</Text>
            <Text style={styles.negoModalSubLabel}>
              최대 {editingItem?.originalPrice.toLocaleString()}원까지 입력 가능
            </Text>
            <TextInput
              style={styles.negoInput}
              placeholder="금액을 입력하세요"
              keyboardType="numeric"
              value={editNegoAmount}
              maxLength={10}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, "");
                const numericValue = parseInt(numericText) || 0;

                if (editingItem && numericValue <= editingItem.originalPrice) {
                  setEditNegoAmount(numericText);
                } else if (editingItem) {
                  setEditNegoAmount(editingItem.originalPrice.toString());
                }
              }}
            />

            {editNegoAmount && (
              <Text style={styles.negoAmountDisplay}>
                {parseInt(editNegoAmount).toLocaleString()}원
              </Text>
            )}

            <View style={styles.negoModalButtons}>
              <TouchableOpacity
                style={[styles.negoModalButton, styles.negoConfirmButton]}
                disabled={requesting || !editNegoAmount}
                onPress={async () => {
                  if (!editingItem) {
                    Alert.alert("오류", "필요한 정보가 없습니다.");
                    return;
                  }

                  try {
                    setRequesting(true);
                    const response = await apiPost(
                      `/cust/nego/${editingItem.requestIdx}`,
                      {
                        price: parseInt(editNegoAmount),
                        productCode: editingItem.productCode,
                      },
                    );

                    if (response.ok) {
                      Alert.alert("성공", "협상 금액이 수정되었습니다.");
                      setEditModalVisible(false);
                      setEditingItem(null);
                      setEditNegoAmount("");
                      // 목록 새로고침
                      fetchNegoList("CURRENT");
                    } else {
                      Alert.alert("오류", "협상 수정에 실패했습니다.");
                    }
                  } catch (error) {
                    console.error("협상 수정 실패:", error);
                    Alert.alert("오류", "협상 수정 중 오류가 발생했습니다.");
                  } finally {
                    setRequesting(false);
                  }
                }}
              >
                <Text style={styles.negoConfirmButtonText}>
                  {requesting ? "처리 중..." : "요청"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.negoModalButton, styles.negoCancelButton]}
                disabled={requesting}
                onPress={() => {
                  setEditModalVisible(false);
                  setEditingItem(null);
                  setEditNegoAmount("");
                }}
              >
                <Text style={styles.negoCancelButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
