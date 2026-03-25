import CategorySelectModal from "@/components/modal/CategorySelectModal";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { apiGet, apiPutFormDataWithImage } from "@/utils/api";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./editproduct.styles";

interface Category {
  categoryIdx: number;
  categoryNm: string;
  fileMasterResponse?: {
    files: images[];
  };
}

interface images {
  fileUrl: string;
  originalName: string;
  order: number;
}

interface ProductDetailResponse {
  productNm: string;
  productCode: string;
  categoryNm: string;
  productPrice: number;
  productAmount: number;
  productState: string;
  isSale: boolean;
  isNego: boolean;
  isStock: boolean;
  isAdult: boolean;
  productDetailDescription: string;
  regNm: string;
  regDateTime: string;
  modNm: string;
  modDateTime: string;
  imgs: {
    files: images[];
  };
}

interface ImageFile {
  uri: string;
  name: string;
  isNew?: boolean;
}

export default function EditProductPage() {
  const insets = useSafeAreaInsets();
  const { productCode } = useLocalSearchParams<{ productCode: string }>();

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [productType, setProductType] = useState<"일반" | "성인">("일반");
  const [serviceType, setServiceType] = useState<"일반" | "서비스">("일반");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [pendingDescImages, setPendingDescImages] = useState<
    { uri: string; name: string; mimeType: string }[]
  >([]);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const richEditorRef = useRef<RichEditor>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const editorYRef = useRef(0);
  const scrollOffsetRef = useRef(0);
  const [editorHeight, setEditorHeight] = useState(300);
  const [editorKey, setEditorKey] = useState(0);
  const [editorInitialized, setEditorInitialized] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const editorHeightRef = useRef(300);

  // 상품 상세 조회
  useEffect(() => {
    const loadProductDetail = async () => {
      if (!productCode) {
        Alert.alert("알림", "상품 정보를 찾을 수 없습니다");
        router.back();
        return;
      }

      try {
        setIsLoading(true);
        const response = await apiGet(
          `/store/app/product/detail/${productCode}`,
        );
        if (response.ok) {
          const data: ProductDetailResponse = await response.json();
          setProductName(data.productNm);
          setPrice(data.productPrice.toString());
          setProductType(data.isAdult ? "성인" : "일반");
          setServiceType(data.isStock ? "일반" : "서비스");
          setStock(data.productAmount.toString());
          setDescription(data.productDetailDescription);

          // 이미지 설정
          const imageList =
            data.imgs?.files?.map((img) => ({
              uri: img.fileUrl,
              name: img.originalName,
              isNew: false,
            })) || [];
          setImages(imageList);
          setEditorInitialized(false);
          setEditorReady(false);
          setEditorHeight(300);
          editorHeightRef.current = 300;
          setEditorKey((prev) => prev + 1);
        } else {
          Alert.alert("알림", "상품 정보를 불러올 수 없습니다");
        }
      } catch (error) {
        console.error("상품 상세 조회 오류:", error);
        Alert.alert("오류", "상품 정보 조회 중 오류가 발생했습니다");
      } finally {
        setIsLoading(false);
      }
    };

    loadProductDetail();
  }, [productCode]);

  // 에디터 초기화 후 원격 이미지 로드 감시 (라이브러리 내부 UPDATE_HEIGHT가 1회만 실행되므로 직접 주입)
  useEffect(() => {
    if (editorInitialized && richEditorRef.current) {
      const injectImageWatcher = () => {
        richEditorRef.current?.commandDOM(
          "var content=$('#content');if(content){var imgs=content.querySelectorAll('img');imgs.forEach(function(img){if(!img.complete){img.addEventListener('load',function(){var h=content.scrollHeight;window.ReactNativeWebView.postMessage(JSON.stringify({type:'OFFSET_HEIGHT',data:h}));});}});var h=content.scrollHeight;window.ReactNativeWebView.postMessage(JSON.stringify({type:'OFFSET_HEIGHT',data:h}));}",
        );
      };
      const t1 = setTimeout(injectImageWatcher, 300);
      const t2 = setTimeout(injectImageWatcher, 1500);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [editorInitialized]);

  // 카테고리 조회
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await apiGet("/category");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);

          // 상품 정보 로드 후 카테고리 선택
          if (!isLoading && data.length > 0) {
            const selectedCat = data.find(
              (cat: Category) => cat.categoryNm === category?.categoryNm,
            );
            if (selectedCat) setCategory(selectedCat);
          }
        }
      } catch (error) {
        console.error("카테고리 조회 오류:", error);
      } finally {
        setCategoryLoading(false);
      }
    };

    loadCategories();
  }, []);

  // 상품 상세 로드 후 카테고리 설정
  useEffect(() => {
    if (!isLoading && categories.length > 0 && !category) {
      const loadProductDetail = async () => {
        const response = await apiGet(
          `/store/app/product/detail/${productCode}`,
        );
        if (response.ok) {
          const data: ProductDetailResponse = await response.json();
          const selectedCat = categories.find(
            (cat) => cat.categoryNm === data.categoryNm,
          );
          if (selectedCat) setCategory(selectedCat);
        }
      };
      loadProductDetail();
    }
  }, [categories, isLoading]);

  const pickImage = () => {
    if (images.length >= 3) {
      Alert.alert("알림", "이미지는 최대 3개까지만 등록할 수 있습니다");
      return;
    }

    const addFromAsset = (asset: ImagePicker.ImagePickerAsset) => {
      const extFromMime = asset.mimeType
        ? asset.mimeType.split("/").pop()?.replace("jpeg", "jpg") || "jpg"
        : "jpg";
      const rawName = asset.fileName || asset.uri.split("/").pop() || "";
      const hasExt = rawName.includes(".");
      const name = hasExt
        ? rawName
        : `${rawName || `image_${Date.now()}`}.${extFromMime}`;
      setImages([...images, { uri: asset.uri, name, isNew: true }]);
    };

    Alert.alert("이미지 추가", "어떤 방법으로 추가할까요?", [
      {
        text: "카메라로 촬영",
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") {
            Alert.alert(
              "카메라 권한 필요",
              "카메라로 촬영하려면 기기 설정에서 카메라 접근 권한을 허용해주세요.",
              [
                {
                  text: "설정으로 이동",
                  onPress: () => Linking.openSettings(),
                },
                { text: "취소", style: "cancel" },
              ],
            );
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: "images",
            allowsEditing: true,
            aspect: [4, 3],
          });
          if (!result.canceled) addFromAsset(result.assets[0]);
        },
      },
      {
        text: "갤러리에서 선택",
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsEditing: true,
            aspect: [4, 3],
          });
          if (!result.canceled) addFromAsset(result.assets[0]);
        },
      },
      { text: "취소", style: "cancel" },
    ]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleInsertDescriptionImage = () => {
    const insertImage = async (fromCamera: boolean) => {
      if (fromCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "카메라 권한 필요",
            "카메라로 촬영하려면 기기 설정에서 카메라 접근 권한을 허용해주세요.",
            [
              { text: "설정으로 이동", onPress: () => Linking.openSettings() },
              { text: "취소", style: "cancel" },
            ],
          );
          return;
        }
      }
      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: "images",
            allowsEditing: false,
            base64: true,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsEditing: false,
            base64: true,
          });
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const ext =
          asset.mimeType?.split("/").pop()?.replace("jpeg", "jpg") || "jpg";
        const name =
          asset.fileName ||
          asset.uri.split("/").pop() ||
          `desc_image_${Date.now()}.${ext}`;
        const mimeType = asset.mimeType || "image/jpeg";
        const dataUrl = `data:${mimeType};base64,${asset.base64}`;
        setEditorHeight((prev) => prev + 400);
        richEditorRef.current?.insertImage(
          dataUrl,
          'style="max-width:100%;height:auto;display:block;"',
        );
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: editorYRef.current + editorHeight + 100,
            animated: true,
          });
        }, 100);
        setPendingDescImages((prev) => [
          ...prev,
          { uri: asset.uri, name, mimeType },
        ]);
      }
    };
    Alert.alert("이미지 추가", "어떤 방법으로 추가할까요?", [
      { text: "카메라로 촬영", onPress: () => insertImage(true) },
      { text: "갤러리에서 선택", onPress: () => insertImage(false) },
      { text: "취소", style: "cancel" },
    ]);
  };

  const handleUpdate = async () => {
    // 유효성 검사
    if (!productName.trim()) {
      Alert.alert("알림", "상품명을 입력하세요");
      return;
    }
    if (!price.trim() || parseInt(price) <= 0) {
      Alert.alert("알림", "올바른 가격을 입력하세요");
      return;
    }
    if (!category) {
      Alert.alert("알림", "카테고리를 선택하세요");
      return;
    }
    if (serviceType !== "서비스" && (!stock.trim() || parseInt(stock) < 0)) {
      Alert.alert("알림", "올바른 재고를 입력하세요");
      return;
    }
    if (
      !description.replace(/<[^>]*>/g, "").trim() &&
      !description.includes("<img")
    ) {
      Alert.alert("알림", "상품 상세정보를 입력하세요");
      return;
    }

    setIsSaving(true);

    try {
      // base64 img src를 placeholder로 교체 (regex 방식 - 큰 문자열 검색 없이 빠른 교체)
      let imgIndex = 0;
      const finalDescription = description.replace(
        /src="data:[^"]*"/g,
        () => `src="__PENDING_IMG_${imgIndex++}__"`,
      );

      // FormData 생성
      const formData = new FormData();
      formData.append("categoryIdx", category.categoryIdx.toString());
      formData.append("productNm", productName);
      formData.append("productPrice", parseInt(price).toString());
      formData.append("productState", "ON_SALE");
      formData.append("isAdult", productType === "성인" ? "true" : "false");
      formData.append("isStock", serviceType === "일반" ? "true" : "false");
      formData.append(
        "productAmount",
        (serviceType === "서비스" ? 0 : parseInt(stock)).toString(),
      );
      formData.append("productDetailDescription", finalDescription);
      pendingDescImages.forEach((img) => {
        formData.append("productDescriptionImgs", {
          uri: img.uri,
          name: img.name,
          type: img.mimeType,
        } as any);
      });

      // 백엔드는 기존 이미지를 전체 삭제 후 전달받은 이미지를 전체 저장하므로
      // 유지할 기존 이미지(isNew: false) + 새 이미지(isNew: true) 모두 전송
      for (const img of images) {
        const ext = img.name.split(".").pop()?.toLowerCase() || "jpg";
        const mimeType =
          ext === "png"
            ? "image/png"
            : ext === "gif"
              ? "image/gif"
              : ext === "webp"
                ? "image/webp"
                : "image/jpeg";

        // React Native FormData 파일 객체 방식으로 전송
        formData.append("productImgs", {
          uri: img.uri,
          name: img.name,
          type: mimeType,
        } as any);
      }

      // API 요청
      const response = await apiPutFormDataWithImage(
        `/store/app/product/${productCode}`,
        formData,
      );

      if (response.ok) {
        Alert.alert("성공", "상품이 수정되었습니다", [
          {
            text: "확인",
            onPress: () => router.back(),
          },
        ]);
      } else {
        const errorText = await response.text();
        console.error("상품 수정 실패:", errorText);
        Alert.alert("실패", `상품 수정에 실패했습니다 (${response.status})`);
      }
    } catch (error) {
      console.error("상품 수정 오류:", error);
      Alert.alert("오류", "상품 수정 중 오류가 발생했습니다");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={{ flex: 1, textAlign: "center", marginTop: 20 }}>
          로딩 중...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff" }} />
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
          <Text style={styles.title}>상품 수정</Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
              scrollOffsetRef.current = e.nativeEvent.contentOffset.y;
            }}
            scrollEventThrottle={16}
          >
            <View style={styles.formGroup}>
              <Text style={styles.label}>상품명</Text>
              <TextInput
                style={styles.input}
                placeholder="상품명을 입력하세요"
                value={productName}
                onChangeText={setProductName}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>상품 가격</Text>
              <TextInput
                style={styles.input}
                placeholder="가격을 입력하세요"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>카테고리</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowCategoryModal(true)}
                disabled={categoryLoading}
              >
                <Text
                  style={[
                    styles.selectButtonText,
                    !category && styles.selectButtonPlaceholder,
                  ]}
                >
                  {categoryLoading
                    ? "로딩 중..."
                    : category
                      ? category.categoryNm
                      : "카테고리를 선택하세요"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#999" />
              </TouchableOpacity>
            </View>

            <CategorySelectModal
              visible={showCategoryModal}
              categories={categories}
              selectedCategory={category}
              onSelect={setCategory}
              onClose={() => setShowCategoryModal(false)}
            />

            <View style={styles.formGroup}>
              <Text style={styles.label}>상품 구분</Text>
              <View style={styles.toggleGroup}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    productType === "일반" && styles.toggleButtonActive,
                  ]}
                  onPress={() => setProductType("일반")}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      productType === "일반" && styles.toggleTextActive,
                    ]}
                  >
                    일반
                  </Text>
                </TouchableOpacity>
                {/* 성인 선택 버튼 - 추후 구현 예정
            <TouchableOpacity
              style={[
                styles.toggleButton,
                productType === "성인" && styles.toggleButtonActive,
              ]}
              onPress={() => setProductType("성인")}
            >
              <Text
                style={[
                  styles.toggleText,
                  productType === "성인" && styles.toggleTextActive,
                ]}
              >
                성인
              </Text>
            </TouchableOpacity>
*/}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>서비스 구분</Text>
              <View style={styles.toggleGroup}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    serviceType === "일반" && styles.toggleButtonActive,
                  ]}
                  onPress={() => setServiceType("일반")}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      serviceType === "일반" && styles.toggleTextActive,
                    ]}
                  >
                    일반
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    serviceType === "서비스" && styles.toggleButtonActive,
                  ]}
                  onPress={() => setServiceType("서비스")}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      serviceType === "서비스" && styles.toggleTextActive,
                    ]}
                  >
                    서비스
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>재고</Text>
              <TextInput
                style={[
                  styles.input,
                  serviceType === "서비스" && styles.inputDisabled,
                ]}
                placeholder="재고 수량을 입력하세요"
                value={stock}
                onChangeText={setStock}
                keyboardType="numeric"
                editable={serviceType !== "서비스"}
              />
            </View>

            <View
              style={styles.formGroup}
              onLayout={(e) => {
                editorYRef.current = e.nativeEvent.layout.y;
              }}
            >
              <Text style={styles.label}>
                상품 상세정보 <Text style={{ color: "#EF7810" }}>*</Text>
              </Text>
              <RichToolbar
                editor={richEditorRef}
                actions={[
                  actions.setBold,
                  actions.setItalic,
                  actions.setUnderline,
                  actions.insertBulletsList,
                  actions.insertOrderedList,
                  actions.insertImage,
                ]}
                onPressAddImage={handleInsertDescriptionImage}
                style={richEditorStyles.toolbar}
                iconTint="#333"
                selectedIconTint="#EF7810"
              />
              {!editorReady && (
                <View
                  style={[
                    richEditorStyles.editor,
                    {
                      height: 300,
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                >
                  <Text style={{ color: "#999", fontSize: 14 }}>
                    불러오는 중...
                  </Text>
                </View>
              )}
              <RichEditor
                key={editorKey}
                ref={richEditorRef}
                style={[
                  richEditorStyles.editor,
                  { height: editorHeight },
                  !editorReady && { position: "absolute", opacity: 0 },
                ]}
                placeholder="상품에 대한 상세 설명을 입력하세요"
                initialContentHTML={description}
                onChange={setDescription}
                onHeightChange={(h) => {
                  if (h > 0) {
                    editorHeightRef.current = h;
                    setEditorHeight(h + 50);
                    if (editorInitialized) {
                      setEditorReady(true);
                    }
                  }
                }}
                scrollEnabled={false}
                initialHeight={300}
                onLoadEnd={() => {
                  setEditorInitialized(true);
                  // onHeightChange가 먼저 실행되어 height 측정이 끝났으면 바로 ready 처리
                  if (editorHeightRef.current > 300) {
                    setEditorReady(true);
                  }
                }}
                onCursorPosition={(offsetY) => {
                  const absY = editorYRef.current + offsetY;
                  const visibleTop = scrollOffsetRef.current;
                  const visibleBottom = visibleTop + 500;
                  if (absY > visibleBottom - 80 || absY < visibleTop + 40) {
                    scrollViewRef.current?.scrollTo({
                      y: absY - 200,
                      animated: true,
                    });
                  }
                }}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>상품 이미지</Text>
              <Text style={styles.helpText}>
                첫 번째 사진이 상품의 메인 이미지로 표시됩니다.
              </Text>
              <View style={styles.imageManagementBox}>
                <View style={styles.imageGrid}>
                  {images.map((img, index) => (
                    <View key={index} style={styles.imagePreview}>
                      <Image
                        source={{ uri: img.uri }}
                        style={styles.previewImage}
                      />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => removeImage(index)}
                      >
                        <Ionicons
                          name="close-circle"
                          size={24}
                          color="#ff4444"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TouchableOpacity
                    style={[
                      styles.addImageButton,
                      images.length >= 3 && styles.disabledButton,
                    ]}
                    onPress={pickImage}
                    disabled={isSaving || images.length >= 3}
                  >
                    <Ionicons
                      name="add"
                      size={32}
                      color={images.length >= 3 ? "#ccc" : "#999"}
                    />
                    <Text
                      style={[
                        styles.addImageText,
                        images.length >= 3 && styles.disabledText,
                      ]}
                    >
                      {images.length >= 3 ? "완료" : "추가"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                isSaving && styles.submitButtonDisabled,
              ]}
              onPress={handleUpdate}
              disabled={isSaving}
            >
              <Text style={styles.submitButtonText}>
                {isSaving ? "수정 중..." : "수정 완료"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}

const richEditorStyles = StyleSheet.create({
  toolbar: {
    backgroundColor: "#f5f5f5",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderBottomWidth: 0,
  },
  editor: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    minHeight: 300,
    paddingHorizontal: 4,
  },
});
