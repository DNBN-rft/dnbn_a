import CategorySelectModal from "@/components/modal/CategorySelectModal";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./editproduct.styles";

const CATEGORIES = [
  { id: 1, name: '베이커리' },
  { id: 2, name: '음료' },
  { id: 3, name: '디저트' },
  { id: 4, name: '전자제품' },
];

export default function EditProductPage() {
  const insets = useSafeAreaInsets();
  
  // 기존 상품 정보 (실제로는 props나 route params로 받아올 데이터)
  const [productName, setProductName] = useState('고급 무선 이어폰');
  const [price, setPrice] = useState('89000');
  const [category, setCategory] = useState<typeof CATEGORIES[0] | null>(CATEGORIES[3]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [productType, setProductType] = useState<'일반' | '성인'>('일반');
  const [serviceType, setServiceType] = useState<'일반' | '서비스'>('일반');
  const [stock, setStock] = useState('15');
  const [description, setDescription] = useState('고음질 사운드를 제공하는 프리미엄 무선 이어폰입니다.\n노이즈 캔슬링 기능과 긴 배터리 수명을 자랑합니다.');
  const [images, setImages] = useState<string[]>([
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/80',
    'https://via.placeholder.com/80',
    'https://via.placeholder.com/80',
  ]);

  const handleUpdate = () => {
    console.log({
      productName,
      price,
      category,
      productType,
      serviceType,
      stock,
      description,
      images
    });
    // 업데이트 로직 처리 후
    router.back();
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
        <Text style={styles.title}>상품 수정</Text>
        <View style={styles.placeholder} />
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
          >
            <Text style={[styles.selectButtonText, !category && styles.selectButtonPlaceholder]}>
              {category ? category.name : '카테고리를 선택하세요'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <CategorySelectModal
          visible={showCategoryModal}
          categories={CATEGORIES}
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
          <Text style={styles.helpText}>첫 번째 사진이 상품의 메인 이미지로 표시됩니다.</Text>
          <View style={styles.imageManagementBox}>
            <View style={styles.imageGrid}>
              {images.map((img, index) => (
                <View key={index} style={styles.imagePreview}>
                  <Image source={{ uri: img }} style={styles.previewImage} />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => setImages(images.filter((_, i) => i !== index))}
                  >
                    <Ionicons name="close-circle" size={24} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.addImageButton}>
                <Ionicons name="add" size={32} color="#999" />
                <Text style={styles.addImageText}>추가</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
          <Text style={styles.submitButtonText}>수정 완료</Text>
        </TouchableOpacity>
      </ScrollView>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}