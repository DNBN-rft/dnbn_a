import CategorySelectModal from "@/components/modal/CategorySelectModal";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiPostFormDataWithImage, apiGet } from "@/utils/api";
import { styles } from "./addproduct.styles";

interface Category {
  categoryIdx: number;
  categoryNm: string;
  fileMasterResponse?: {
    files: Array<{ fileUrl: string; originalName: string; order: number }>;
  };
}

interface ImageFile {
  uri: string;
  name: string;
}

export default function AddProduct() {
  const insets = useSafeAreaInsets();
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [productType, setProductType] = useState<'일반' | '성인'>('일반');
  const [serviceType, setServiceType] = useState<'일반' | '서비스'>('일반');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(true);

  // 카테고리 조회
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await apiGet('/category');
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
      setImages([...images, {
        uri: asset.uri,
        name: asset.uri.split('/').pop() || 'image.jpg'
      }]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
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
    if (serviceType !== '서비스' && (!stock.trim() || parseInt(stock) < 0)) {
      Alert.alert("알림", "올바른 재고를 입력하세요");
      return;
    }

    try {
      setIsLoading(true);

      // FormData 생성
      const formData = new FormData();
      formData.append('categoryIdx', category.categoryIdx.toString());
      formData.append('productName', productName);
      formData.append('productPrice', parseInt(price).toString());
      formData.append('productState', 'ON_SALE');
      formData.append('isAdult', productType === '성인' ? 'true' : 'false');
      formData.append('isStock', serviceType === '일반' ? 'true' : 'false');
      formData.append('productAmount', (serviceType === '서비스' ? 0 : parseInt(stock)).toString());
      formData.append('productDetailDescription', description);

      // 이미지 추가
      images.forEach((img) => {
        formData.append('productImgs', {
          uri: img.uri,
          type: 'image/jpeg',
          name: img.name,
        } as any);
      });

      // API 요청
      const response = await apiPostFormDataWithImage('/store/app/product', formData);

      if (response.ok) {
        Alert.alert("성공", "상품이 등록되었습니다", [
          {
            text: "확인",
            onPress: () => router.back()
          }
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>상품 등록</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}
      showsVerticalScrollIndicator={false}>
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
            <Text style={[styles.selectButtonText, !category && styles.selectButtonPlaceholder]}>
              {categoryLoading ? '로딩 중...' : (category ? category.categoryNm : '카테고리를 선택하세요')}
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
              style={[styles.toggleButton, productType === '일반' && styles.toggleButtonActive]}
              onPress={() => setProductType('일반')}
            >
              <Text style={[styles.toggleText, productType === '일반' && styles.toggleTextActive]}>일반</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, productType === '성인' && styles.toggleButtonActive]}
              onPress={() => setProductType('성인')}
            >
              <Text style={[styles.toggleText, productType === '성인' && styles.toggleTextActive]}>성인</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>서비스 구분</Text>
          <View style={styles.toggleGroup}>
            <TouchableOpacity
              style={[styles.toggleButton, serviceType === '일반' && styles.toggleButtonActive]}
              onPress={() => setServiceType('일반')}
            >
              <Text style={[styles.toggleText, serviceType === '일반' && styles.toggleTextActive]}>일반</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, serviceType === '서비스' && styles.toggleButtonActive]}
              onPress={() => setServiceType('서비스')}
            >
              <Text style={[styles.toggleText, serviceType === '서비스' && styles.toggleTextActive]}>서비스</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>재고</Text>
          <TextInput
            style={[styles.input, serviceType === '서비스' && styles.inputDisabled]}
            placeholder="재고 수량을 입력하세요"
            value={stock}
            onChangeText={setStock}
            keyboardType="numeric"
            editable={serviceType !== '서비스'}
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
          <TouchableOpacity
            style={[styles.imageUploadButton, images.length >= 3 && styles.disabledButton]}
            onPress={pickImage}
            disabled={isLoading || images.length >= 3}
          >
            <Ionicons name="camera-outline" size={32} color={images.length >= 3 ? "#ccc" : "#999"} />
            <Text style={[styles.imageUploadText, images.length >= 3 && styles.disabledText]}>
              {images.length >= 3 ? "이미지 추가 완료" : "이미지 추가"}
            </Text>
          </TouchableOpacity>
          {images.length > 0 && (
            <View style={styles.imagePreviewContainer}>
              {images.map((img, index) => (
                <View key={index} style={styles.imagePreview}>
                  <Image source={{ uri: img.uri }} style={styles.previewImage} />
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
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>{isLoading ? '등록 중...' : '상품 등록'}</Text>
        </TouchableOpacity>
      </ScrollView>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
