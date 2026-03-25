import CategorySelectModal from "@/components/modal/CategorySelectModal";
import { apiGet, apiPostFormDataWithImage } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
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
import { styles } from "./addproduct.styles";

interface Category {
  categoryIdx: number;
  categoryNm: string;
  fileMasterResponse?: {
    files: { fileUrl: string; originalName: string; order: number }[];
  };
}

interface ImageFile {
  uri: string;
  name: string;
}

export default function AddProduct() {
  const insets = useSafeAreaInsets();
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
  const [isLoading, setIsLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const richEditorRef = useRef<RichEditor>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const editorYRef = useRef(0);
  const scrollOffsetRef = useRef(0);
  const [editorHeight, setEditorHeight] = useState(200);

  // 카테고리 조회
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await apiGet("/category");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error("카테고리 조회 실패:", response.status);
          Alert.alert("알림", "카테고리를 불러올 수 없습니다");
        }
      } catch (error) {
        console.error("카테고리 조회 오류:", error);
      } finally {
        setCategoryLoading(false);
      }
    };

    loadCategories();
  }, []);

  const pickImage = () => {
    if (images.length >= 3) {
      Alert.alert("알림", "이미지는 최대 3개까지만 등록할 수 있습니다");
      return;
    }
    Alert.alert("이미지 추가", "어떤 방법으로 추가할까요?", [
      {
        text: "카메라로 촬영",
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") {
            Alert.alert(
              "카메라 권한 필요",
              "사진 촬영을 위해 카메라 접근 권한이 필요합니다.",
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
          if (!result.canceled) {
            const asset = result.assets[0];
            setImages([
              ...images,
              {
                uri: asset.uri,
                name: asset.uri.split("/").pop() || "image.jpg",
              },
            ]);
          }
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
          if (!result.canceled) {
            const asset = result.assets[0];
            setImages([
              ...images,
              {
                uri: asset.uri,
                name: asset.uri.split("/").pop() || "image.jpg",
              },
            ]);
          }
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
            "사진 촬영을 위해 카메라 접근 권한이 필요합니다.",
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

        setEditorHeight((prev) => prev + 300);
        richEditorRef.current?.insertImage(
          dataUrl,
          'style="max-width:100%;height:auto;"',
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

  const handleSubmit = async () => {
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
    if (images.length === 0) {
      Alert.alert("알림", "상품 이미지를 최소 1개 이상 등록하세요");
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
      Alert.alert("알림", "상품 상세 정보를 입력하세요");
      return;
    }

    try {
      setIsLoading(true);

      // base64 img src를 placeholder로 교체 (regex 방식 - 순서 보장)
      let imgIndex = 0;
      const finalDescription = description.replace(
        /src="data:[^"]*"/g,
        () => `src="__PENDING_IMG_${imgIndex++}__"`,
      );

      // FormData 생성
      const formData = new FormData();
      formData.append("categoryIdx", category.categoryIdx.toString());
      formData.append("productName", productName);
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

      // 이미지 추가
      images.forEach((img) => {
        formData.append("productImgs", {
          uri: img.uri,
          type: "image/jpeg",
          name: img.name,
        } as any);
      });

      // API 요청
      const response = await apiPostFormDataWithImage(
        "/store/app/product",
        formData,
      );

      if (response.ok) {
        Alert.alert("성공", "상품이 등록되었습니다", [
          {
            text: "확인",
            onPress: () => router.back(),
          },
        ]);
      } else {
        const errorText = await response.text();
        console.error("상품 등록 실패:", errorText);
        Alert.alert("실패", `상품 등록에 실패했습니다 (${response.status})`);
      }
    } catch (error) {
      console.error("상품 등록 오류:", error);
      Alert.alert("오류", "상품 등록 중 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

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
          <Text style={styles.title}>상품 등록</Text>
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
                {/* <TouchableOpacity
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
            </TouchableOpacity> */}
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
              <Text style={styles.label}>상품 상세정보</Text>
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
              <RichEditor
                ref={richEditorRef}
                style={[richEditorStyles.editor, { height: editorHeight }]}
                placeholder="상품에 대한 상세 설명을 입력하세요"
                onChange={setDescription}
                onHeightChange={(h) => setEditorHeight(Math.max(200, h + 50))}
                scrollEnabled={false}
                initialHeight={200}
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
              <Text style={styles.label}>
                상품 이미지 <Text style={styles.requiredMark}>*</Text>
              </Text>
              <Text style={styles.imageHint}>
                최소 1개 이상 등록 필수 (최대 3개)
              </Text>
              <TouchableOpacity
                style={[
                  styles.imageUploadButton,
                  images.length >= 3 && styles.disabledButton,
                ]}
                onPress={pickImage}
                disabled={isLoading || images.length >= 3}
              >
                <Ionicons
                  name="camera-outline"
                  size={32}
                  color={images.length >= 3 ? "#ccc" : "#999"}
                />
                <Text
                  style={[
                    styles.imageUploadText,
                    images.length >= 3 && styles.disabledText,
                  ]}
                >
                  {images.length >= 3 ? "이미지 추가 완료" : "이미지 추가"}
                </Text>
              </TouchableOpacity>
              {images.length > 0 && (
                <View style={styles.imagePreviewContainer}>
                  {images.map((img, index) => (
                    <View key={index} style={styles.imagePreview}>
                      <Image
                        source={{ uri: img.uri }}
                        style={styles.previewImage}
                      />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => removeImage(index)}
                        disabled={isLoading}
                      >
                        <Ionicons name="close-circle" size={24} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                isLoading && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? "등록 중..." : "상품 등록"}
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
    minHeight: 200,
    paddingHorizontal: 4,
  },
});
