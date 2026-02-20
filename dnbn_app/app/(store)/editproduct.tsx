import CategorySelectModal from "@/components/modal/CategorySelectModal";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { apiGet, apiPutFormDataWithImage } from "@/utils/api";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
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
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(true);

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
        const response = await apiGet(`/store/product/detail/${productCode}`);
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
        const response = await apiGet(`/store/product/detail/${productCode}`);
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

  const pickImage = async () => {
    if (images.length >= 3) {
      Alert.alert("알림", "이미지는 최대 3개까지만 등록할 수 있습니다");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setImages([
        ...images,
        {
          uri: asset.uri,
          name: asset.uri.split("/").pop() || "image.jpg",
          isNew: true,
        },
      ]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
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

    try {
      setIsSaving(true);

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
      formData.append("productDetailDescription", description);

      // 새로운 이미지만 추가 (isNew === true)
      images.forEach((img) => {
        if (img.isNew) {
          formData.append("productImgs", {
            uri: img.uri,
            type: "image/jpeg",
            name: img.name,
          } as any);
        }
      });

      // API 요청
      const response = await apiPutFormDataWithImage(
        `/store/product/${productCode}`,
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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

        <View style={styles.formGroup}>
          <Text style={styles.label}>상품 상세정보</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="상품에 대한 상세 설명을 입력하세요"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
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
                    <Ionicons name="close-circle" size={24} color="#ff4444" />
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
          style={[styles.submitButton, isSaving && styles.submitButtonDisabled]}
          onPress={handleUpdate}
          disabled={isSaving}
        >
          <Text style={styles.submitButtonText}>
            {isSaving ? "수정 중..." : "수정 완료"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
