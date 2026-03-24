import { apiGet, apiPost } from "@/utils/api";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./qrcheckout.styles";

type ProductItem = {
  orderDetailIdx: number;
  productNm: string;
  productCode: string;
  categoryNm: string;
  productAmount: number;
  imgs?: { files: { originalName: string; fileUrl: string; order: number }[] };
  paymentDateTime?: string;
  isUsed?: boolean;
};

export default function QRCheckoutScreen() {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const isProcessing = useRef(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [selectedIdxList, setSelectedIdxList] = useState<Set<number>>(
    new Set(),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scannedToken = useRef<string>("");

  const resetScan = () => {
    setScanned(false);
    isProcessing.current = false;
  };

  const toggleSelect = (idx: number) => {
    const item = products.find((p) => p.orderDetailIdx === idx);
    if (item?.isUsed) return;
    setSelectedIdxList((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  // 전체 선택/해제 (미사용 상품만 대상)
  const toggleSelectAll = () => {
    const unusedItems = products.filter((p) => !p.isUsed);
    if (selectedIdxList.size === unusedItems.length && unusedItems.length > 0) {
      setSelectedIdxList(new Set());
    } else {
      setSelectedIdxList(new Set(unusedItems.map((p) => p.orderDetailIdx)));
    }
  };

  // 모달 닫기 → 카메라로 복귀
  const closeModal = () => {
    setModalVisible(false);
    setProducts([]);
    setSelectedIdxList(new Set());
    scannedToken.current = "";
    resetScan();
  };

  // QR 스캔 완료 → 상품 목록 조회
  const handleBarcodeScanned = useCallback(({ data }: { data: string }) => {
    if (isProcessing.current) return;
    isProcessing.current = true;
    setScanned(true);
    scannedToken.current = data;

    (async () => {
      try {
        const response = await apiGet(
          `/store/app/qr/check/${encodeURIComponent(data)}`,
        );
        const result = await response.json();

        if (response.ok) {
          const list: ProductItem[] = Array.isArray(result)
            ? result
            : (result.products ?? []);
          if (list.length === 0) {
            Alert.alert("알림", "교환할 상품이 없습니다.", [
              { text: "확인", onPress: resetScan },
            ]);
            return;
          }
          setProducts(list);
          setSelectedIdxList(
            new Set(list.filter((p) => !p.isUsed).map((p) => p.orderDetailIdx)),
          );
          setModalVisible(true);
        } else {
          const errorMsg =
            result.message ||
            (response.status === 410
              ? "만료된 QR 코드입니다."
              : response.status === 409
                ? "이미 사용된 QR 코드입니다."
                : "QR 코드 처리에 실패했습니다.");
          Alert.alert("처리 실패", errorMsg, [
            { text: "다시 스캔", onPress: resetScan },
          ]);
        }
      } catch {
        Alert.alert("오류", "네트워크 오류가 발생했습니다.", [
          { text: "다시 스캔", onPress: resetScan },
        ]);
      }
    })();
  }, []);

  // 선택한 상품 수령 처리
  const handleConfirm = async () => {
    if (selectedIdxList.size === 0) {
      Alert.alert("알림", "수령 처리할 상품을 선택해주세요.");
      return;
    }
    setIsSubmitting(true);
    const confirmedCount = selectedIdxList.size;
    try {
      const response = await apiPost("/store/app/qr/confirm", {
        orderDetailIdxList: Array.from(selectedIdxList),
      });

      // 응답 바디가 없거나 JSON이 아닐 수 있으므로 안전하게 파싱
      let result: Record<string, unknown> = {};
      try {
        result = await response.json();
      } catch {
        // 빈 바디 또는 비JSON 응답 허용
      }

      if (response.ok) {
        // 갱신된 상품 목록 재조회, 실패 시 로컬에서 isUsed 업데이트
        let refreshed = false;
        try {
          const refreshResponse = await apiGet(
            `/store/app/qr/check/${encodeURIComponent(scannedToken.current)}`,
          );
          if (refreshResponse.ok) {
            const refreshResult = await refreshResponse.json();
            const list: ProductItem[] = Array.isArray(refreshResult)
              ? refreshResult
              : (refreshResult.products ?? []);
            setProducts(list);
            setSelectedIdxList(new Set());
            refreshed = true;
          }
        } catch {
          // 재조회 실패 시 무시
        }
        if (!refreshed) {
          // 백엔드 재조회 불가 시 로컬에서 처리한 항목을 사용됨으로 표시
          setProducts((prev) =>
            prev.map((p) =>
              selectedIdxList.has(p.orderDetailIdx)
                ? { ...p, isUsed: true }
                : p,
            ),
          );
          setSelectedIdxList(new Set());
        }
        Alert.alert(
          "수령 처리 완료",
          `${confirmedCount}개 상품이 수령 처리되었습니다.`,
          [{ text: "확인" }],
          { cancelable: false },
        );
      } else {
        Alert.alert(
          "처리 실패",
          (result.message as string) ?? "수령 처리에 실패했습니다.",
        );
      }
    } catch {
      Alert.alert("오류", "네트워크 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 권한 로딩 중
  if (!permission) {
    return (
      <View style={styles.container}>
        {insets.top > 0 && (
          <View style={{ height: insets.top, backgroundColor: "#000" }} />
        )}
        <View style={styles.centerContent}>
          <Text style={styles.messageText}>카메라 권한 확인 중...</Text>
        </View>
      </View>
    );
  }

  // 권한 거부
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        {insets.top > 0 && (
          <View style={{ height: insets.top, backgroundColor: "#000" }} />
        )}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← 뒤로</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>QR 결제</Text>
        </View>
        <View style={styles.centerContent}>
          <Text style={styles.messageText}>
            카메라 접근 권한이 필요합니다.{"\n"}QR 코드를 스캔하려면 권한을
            허용해 주세요.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>카메라 권한 허용</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff" }} />
      )}

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QR 결제</Text>
      </View>

      {/* 카메라 뷰 */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={
            scanned || modalVisible ? undefined : handleBarcodeScanned
          }
        />

        {/* 스캔 가이드 오버레이 */}
        <View style={styles.overlay}>
          <View style={styles.overlayTop} />
          <View style={styles.overlayMiddle}>
            <View style={styles.overlaySide} />
            <View style={styles.scanArea}>
              {/* 모서리 표시 */}
              <View style={[styles.corner, styles.cornerTopLeft]} />
              <View style={[styles.corner, styles.cornerTopRight]} />
              <View style={[styles.corner, styles.cornerBottomLeft]} />
              <View style={[styles.corner, styles.cornerBottomRight]} />
            </View>
            <View style={styles.overlaySide} />
          </View>
          <View style={styles.overlayBottom}>
            <Text style={styles.guideText}>
              {scanned ? "처리 중..." : "QR 코드를 네모 안에 맞춰주세요"}
            </Text>
          </View>
        </View>
      </View>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}

      {/* 상품 목록 모달 */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {/* 모달 헤더 */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>교환 상품 목록</Text>
            <TouchableOpacity
              onPress={closeModal}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* 전체 선택 */}
          <TouchableOpacity
            style={styles.selectAllRow}
            onPress={toggleSelectAll}
          >
            {(() => {
              const unusedCount = products.filter((p) => !p.isUsed).length;
              const allUnusedSelected =
                selectedIdxList.size === unusedCount && unusedCount > 0;
              return (
                <>
                  <View
                    style={[
                      styles.checkbox,
                      allUnusedSelected && styles.checkboxChecked,
                    ]}
                  >
                    {allUnusedSelected && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <Text style={styles.selectAllText}>
                    전체 선택 ({selectedIdxList.size}/{products.length})
                  </Text>
                </>
              );
            })()}
          </TouchableOpacity>

          {/* 상품 목록 */}
          <FlatList
            data={products}
            keyExtractor={(item) => item.orderDetailIdx.toString()}
            contentContainerStyle={styles.productList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.productRow, item.isUsed && { opacity: 0.5 }]}
                onPress={() => toggleSelect(item.orderDetailIdx)}
                activeOpacity={item.isUsed ? 1 : 0.7}
                disabled={item.isUsed}
              >
                {/* 체크박스 */}
                <View
                  style={[
                    styles.checkbox,
                    selectedIdxList.has(item.orderDetailIdx) &&
                      styles.checkboxChecked,
                  ]}
                >
                  {selectedIdxList.has(item.orderDetailIdx) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>

                {/* 이미지 + 라벨 */}
                <View style={styles.productImageWrapper}>
                  {item.imgs?.files?.[0]?.fileUrl ? (
                    <Image
                      source={{ uri: item.imgs.files[0].fileUrl }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.productImagePlaceholder} />
                  )}
                  <View
                    style={[
                      styles.usageBadge,
                      item.isUsed
                        ? styles.usageBadgeUsed
                        : styles.usageBadgeNew,
                    ]}
                  >
                    <Text style={styles.usageBadgeText}>
                      {item.isUsed ? "사용" : "미사용"}
                    </Text>
                  </View>
                </View>

                {/* 상품 정보 */}
                <View style={styles.productInfo}>
                  <Text style={styles.categoryNm}>{item.categoryNm}</Text>
                  <Text style={styles.productName} numberOfLines={2}>
                    {item.productNm}
                  </Text>
                  {item.paymentDateTime && (
                    <Text style={styles.productDetail}>
                      결제일:{" "}
                      {new Date(item.paymentDateTime).toLocaleDateString(
                        "ko-KR",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        },
                      )}{" "}
                      {new Date(item.paymentDateTime).toLocaleTimeString(
                        "ko-KR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </Text>
                  )}
                  <Text style={styles.productDetail}>
                    수량: {item.productAmount}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />

          {/* 확인 버튼 */}
          <View style={styles.modalFooter}>
            {insets.bottom > 0 && <View style={{ height: 8 }} />}
            <View style={styles.footerButtonRow}>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  (selectedIdxList.size === 0 || isSubmitting) &&
                    styles.confirmButtonDisabled,
                ]}
                onPress={handleConfirm}
                disabled={selectedIdxList.size === 0 || isSubmitting}
              >
                <Text style={styles.confirmButtonText}>
                  {isSubmitting
                    ? "처리 중..."
                    : `사용 처리 (${selectedIdxList.size}개)`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelButtonText}>창닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
