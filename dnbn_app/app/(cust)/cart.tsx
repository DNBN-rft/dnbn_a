import { apiDelete, apiGet, apiPut } from "@/utils/api";
import {
  isAllSelected,
  isStoreAllSelected,
  toggleAllSelection,
  toggleItemSelection,
  toggleStoreSelection,
  updateItemQuantity,
} from "@/utils/cartUtil";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./cart.styles";

// 백엔드 데이터 타입 정의
interface ItemImage {
  originalName: string;
  fileUrl: string;
  order: number;
}

interface CartItem {
  cartItemIdx: number;
  storeCode: string;
  productNm: string;
  price: number;
  discountPrice: number;
  quantity: number;
  productAmount: number;
  itemImg: ItemImage;
  selected?: boolean;
}

interface CartStore {
  storeNm: string;
  items: CartItem[];
  selected?: boolean;
}

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const [cartData, setCartData] = useState<CartStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const cartDataRef = useRef<CartStore[]>([]);

  // cartData 변경 시 ref 업데이트
  useEffect(() => {
    cartDataRef.current = cartData;
  }, [cartData]);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await apiGet(`/cust/cart`);

      if (response.ok) {
        const data = await response.json();
        console.log("장바구니 데이터:", data);
        setCartData(data);
        setError(false);
      } else {
        console.error("장바구니 조회 실패:", response.status);
        setError(true);
      }
    } catch (error) {
      console.error("장바구니 조회 에러:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // 선택된 아이템 정보 저장
  const saveCartChanges = async () => {
    try {
      const selectedItems = cartDataRef.current
        .flatMap((store) => store.items)
        .filter((item) => item.selected)
        .map((item) => ({
          cartItemIdx: item.cartItemIdx,
          quantity: item.quantity,
        }));

      if (selectedItems.length === 0) {
        console.log("선택된 아이템이 없습니다.");
        return;
      }

      const response = await apiPut("/cust/cart", selectedItems);

      if (response.ok) {
        console.log("장바구니 변경사항 저장 완료");
      } else {
        console.error("장바구니 저장 실패:", response.status);
      }
    } catch (error) {
      console.error("장바구니 저장 에러:", error);
    }
  };

  // 선택된 상품 삭제
  const handleDeleteSelected = async () => {
    try {
      const selectedCartItemIdxs = cartData
        .flatMap((store) => store.items)
        .filter((item) => item.selected)
        .map((item) => item.cartItemIdx);

      if (selectedCartItemIdxs.length === 0) {
        console.log("삭제할 상품을 선택해주세요.");
        return;
      }

      const response = await apiDelete("/cust/cart", {
        body: JSON.stringify({ cartItemIdxs: selectedCartItemIdxs }),
      });

      if (response.ok) {
        console.log("상품 삭제 완료");
        // 삭제 후 데이터 재조회
        fetchCartData();
      } else {
        console.error("상품 삭제 실패:", response.status);
      }
    } catch (error) {
      console.error("상품 삭제 에러:", error);
    }
  };

  // 컴포넌트 마운트 시 API 호출
  useEffect(() => {
    fetchCartData();

    // 페이지를 벗어날 때 저장
    return () => {
      saveCartChanges();
    };
  }, []);

  // 포맷팅 함수
  const formatPrice = (price: number) => {
    return price.toLocaleString("ko-KR") + "원";
  };

  // 수량 조절 핸들러
  const handleQuantityChange = (cartItemIdx: number, delta: number) => {
    setCartData((prevData) => updateItemQuantity(prevData, cartItemIdx, delta));
  };

  // 체크박스 토글 핸들러
  const handleItemCheck = (cartItemIdx: number) => {
    setCartData((prevData) => toggleItemSelection(prevData, cartItemIdx));
  };

  const handleSelectAll = () => {
    setCartData((prevData) => toggleAllSelection(prevData));
  };

  const handleStoreSelectAll = (storeNm: string) => {
    setCartData((prevData) => toggleStoreSelection(prevData, storeNm));
  };

  // 선택된 상품 총액 및 개수 계산
  const calculateTotal = () => {
    let totalAmount = 0;
    let totalCount = 0;

    cartData.forEach((store) => {
      store.items.forEach((item) => {
        if (item.selected) {
          totalAmount += (item.price - item.discountPrice) * item.quantity;
          totalCount += 1;
        }
      });
    });

    return { totalAmount, totalCount };
  };

  const { totalAmount, totalCount } = calculateTotal();

  // 가맹점별 렌더링
  const renderStoreItem = ({ item: store }: { item: CartStore }) => (
    <View key={store.storeNm} style={styles.cartItemContainer}>
      {/* 가맹점 헤더 */}
      <View style={styles.cartStoreInfoContainer}>
        <Pressable
          style={styles.storeCheckboxArea}
          onPress={() => handleStoreSelectAll(store.storeNm)}
        >
          <Ionicons
            name={isStoreAllSelected(store) ? "checkbox" : "square-outline"}
            size={20}
            color={isStoreAllSelected(store) ? "#EF7810" : "#666"}
          />
          <Text style={styles.cartStoreNameText}>{store.storeNm}</Text>
        </Pressable>
      </View>

      {/* 상품 목록 */}
      {store.items.map((item) => (
        <View key={item.cartItemIdx} style={styles.productItemWrapper}>
          {/* 상품 정보 영역 */}
          <View style={styles.productContentArea}>
            {/* 체크박스 */}
            <Pressable
              style={styles.productCheckboxArea}
              onPress={() => handleItemCheck(item.cartItemIdx)}
            >
              <Ionicons
                name={item.selected ? "checkbox" : "square-outline"}
                size={20}
                color={item.selected ? "#EF7810" : "#666"}
              />
            </Pressable>

            {/* 상품 이미지 */}
            <View style={styles.cartItemImgContainer}>
              {item.itemImg?.fileUrl ? (
                <Image
                  source={{ uri: item.itemImg.fileUrl }}
                  style={styles.productImage}
                />
              ) : (
                <Ionicons name="image-outline" size={40} color="#ccc" />
              )}
            </View>

            {/* 상품 정보 */}
            <View style={styles.cartItemInfoContainer}>
              <Text style={styles.cartItemNmText} numberOfLines={2}>
                {item.productNm}
              </Text>
              {item.discountPrice > 0 && (
                <Text style={styles.discountPriceText}>
                  {formatPrice(item.discountPrice)}
                </Text>
              )}
              <View style={styles.cartItemPriceContainer}>
                <Text style={styles.cartItemSalePriceText}>
                  {formatPrice(item.price)}
                </Text>
              </View>
              {/* 수량 조절 */}
              <View style={styles.cartItemQtyContainer}>
                <Pressable
                  style={[
                    styles.cartItemQtyButton,
                    item.quantity <= 1 && styles.qtyButtonDisabled,
                  ]}
                  disabled={item.quantity <= 1}
                  onPress={() => handleQuantityChange(item.cartItemIdx, -1)}
                >
                  <Ionicons
                    name="remove"
                    size={16}
                    color={item.quantity <= 1 ? "#ccc" : "#666"}
                  />
                </Pressable>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <Pressable
                  style={[
                    styles.cartItemQtyButton,
                    item.quantity >= item.productAmount &&
                      styles.qtyButtonDisabled,
                  ]}
                  disabled={item.quantity >= item.productAmount}
                  onPress={() => handleQuantityChange(item.cartItemIdx, 1)}
                >
                  <Ionicons
                    name="add"
                    size={16}
                    color={
                      item.quantity >= item.productAmount ? "#ccc" : "#666"
                    }
                  />
                </Pressable>
              </View>
              <Text style={styles.stockText}>재고: {item.productAmount}개</Text>
            </View>
          </View>
        </View>
      ))}

      {/* 가맹점별 총액 */}
      <View style={styles.cartItemDetailTotalContainer}>
        <Text style={styles.cartItemTotalText}>총 금액</Text>
        <Text style={styles.cartItemTotalSalePriceText}>
          {formatPrice(
            store.items.reduce(
              (sum, item) =>
                item.selected
                  ? sum + (item.price - item.discountPrice) * item.quantity
                  : sum,
              0,
            ),
          )}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
      )}

      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.title}>장바구니</Text>
        <View style={styles.placeholder} />
      </View>

      {/* 전체선택 / 삭제 버튼 영역 */}
      <View style={styles.cartTopContainer}>
        <Pressable style={styles.cartTopLeftSection} onPress={handleSelectAll}>
          <Ionicons
            name={isAllSelected(cartData) ? "checkbox" : "square-outline"}
            size={20}
            color={isAllSelected(cartData) ? "#EF7810" : "#666"}
          />
          <Text style={styles.cartTopSelectAllText}>전체선택</Text>
        </Pressable>
        <Pressable
          style={styles.cartTopDeleteButton}
          onPress={handleDeleteSelected}
        >
          <Text style={styles.cartTopDeleteButtonText}>선택삭제</Text>
        </Pressable>
      </View>

      {/* 장바구니 목록 */}
      {loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>로딩 중...</Text>
        </View>
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>장바구니를 불러오지 못했습니다</Text>
          <Pressable style={styles.retryButton} onPress={fetchCartData}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={cartData}
          renderItem={renderStoreItem}
          keyExtractor={(item, index) => `${item.storeNm}-${index}`}
          contentContainerStyle={styles.flatListContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cart-outline" size={80} color="#ccc" />
              <Text style={styles.emptyText}>장바구니가 비어있어요</Text>
            </View>
          }
        />
      )}

      {/* 결제 정보 */}
      {!loading && !error && cartData.length > 0 && (
        <>
          <View style={styles.purchaseContainer}>
            <View style={styles.purchaseSummaryRow}>
              <Text style={styles.purchaseText}>선택상품</Text>
              <Text style={styles.purchaseValue}>{totalCount}개</Text>
            </View>
            <View style={styles.purchaseSummaryRow}>
              <Text style={styles.purchaseText}>총 결제금액</Text>
              <Text style={styles.purchaseValueOriginal}>
                {formatPrice(totalAmount)}
              </Text>
            </View>
          </View>

          <View style={styles.purchaseButtonWrapper}>
            <Pressable
              style={[
                styles.purchaseButtonContainer,
                totalCount === 0 && styles.purchaseButtonDisabled,
              ]}
              disabled={totalCount === 0}
            >
              <Text
                style={[
                  styles.purchaseButtonText,
                  totalCount === 0 && styles.purchaseButtonTextDisabled,
                ]}
              >
                {totalCount > 0
                  ? `주문하기 (${totalCount}개)`
                  : "상품을 선택해주세요"}
              </Text>
            </Pressable>
          </View>
        </>
      )}

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
