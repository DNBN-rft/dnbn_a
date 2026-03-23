import { apiGet, apiPost } from "@/utils/api";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./qrcheckout.styles";

// TODO: 백엔드 API 응답 구조에 맞게 수정
type ProductItem = {
  productCode: string;
  productNm: string;
  quantity: number;
  // 필요한 필드 추가
};

export default function QRCheckoutScreen() {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const isProcessing = useRef(false);

  // 모달 상태
  const [modalVisible, setModalVisible] = useState(false);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scannedToken = useRef<string>("");

  const resetScan = () => {
    setScanned(false);
    isProcessing.current = false;
  };

  // 체크박스 토글
  const toggleSelect = (productCode: string) => {
    setSelectedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(productCode)) {
        next.delete(productCode);
      } else {
        next.add(productCode);
      }
      return next;
    });
  };

  // 전체 선택/해제
  const toggleSelectAll = () => {
    if (selectedCodes.size === products.length) {
      setSelectedCodes(new Set());
    } else {
      setSelectedCodes(new Set(products.map((p) => p.productCode)));
    }
  };

  // 모달 닫기 → 카메라로 복귀
  const closeModal = () => {
    setModalVisible(false);
    setProducts([]);
    setSelectedCodes(new Set());
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
        // TODO: 백엔드 API 경로 및 파라미터 확인 후 수정
        const response = await apiGet(
          `/store/qr/products?qrToken=${encodeURIComponent(data)}`,
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
          setSelectedCodes(new Set(list.map((p) => p.productCode)));
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
    if (selectedCodes.size === 0) {
      Alert.alert("알림", "수령 처리할 상품을 선택해주세요.");
      return;
    }
    setIsSubmitting(true);
    try {
      // TODO: 백엔드 API 경로 및 요청 바디 확인 후 수정
      const response = await apiPost("/store/qr/confirm", {
        qrToken: scannedToken.current,
        productCodes: Array.from(selectedCodes),
      });
      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          "수령 처리 완료",
          `${selectedCodes.size}개 상품이 수령 처리되었습니다.`,
          [
            {
              text: "확인",
              onPress: () => {
                setModalVisible(false);
                router.back();
              },
            },
          ],
          { cancelable: false },
        );
      } else {
        Alert.alert("처리 실패", result.message ?? "수령 처리에 실패했습니다.");
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
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
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
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {insets.top > 0 && (
            <View style={{ height: insets.top, backgroundColor: "#FFF" }} />
          )}

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
            <View
              style={[
                styles.checkbox,
                selectedCodes.size === products.length &&
                  products.length > 0 &&
                  styles.checkboxChecked,
              ]}
            >
              {selectedCodes.size === products.length &&
                products.length > 0 && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.selectAllText}>
              전체 선택 ({selectedCodes.size}/{products.length})
            </Text>
          </TouchableOpacity>

          {/* 상품 목록 */}
          <FlatList
            data={products}
            keyExtractor={(item) => item.productCode}
            contentContainerStyle={styles.productList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productRow}
                onPress={() => toggleSelect(item.productCode)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    selectedCodes.has(item.productCode) &&
                      styles.checkboxChecked,
                  ]}
                >
                  {selectedCodes.has(item.productCode) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.productNm}</Text>
                  <Text style={styles.productDetail}>
                    수량: {item.quantity}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />

          {/* 확인 버튼 */}
          <View style={styles.modalFooter}>
            {insets.bottom > 0 && <View style={{ height: 8 }} />}
            <TouchableOpacity
              style={[
                styles.confirmButton,
                (selectedCodes.size === 0 || isSubmitting) &&
                  styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={selectedCodes.size === 0 || isSubmitting}
            >
              <Text style={styles.confirmButtonText}>
                {isSubmitting
                  ? "처리 중..."
                  : `선택 상품 수령 처리 (${selectedCodes.size}개)`}
              </Text>
            </TouchableOpacity>
            {insets.bottom > 0 && <View style={{ height: insets.bottom }} />}
          </View>
        </View>
      </Modal>
    </View>
  );
}
