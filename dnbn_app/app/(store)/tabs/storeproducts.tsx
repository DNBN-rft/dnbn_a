import Ionicons from "@expo/vector-icons/build/Ionicons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Modal, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./storeproducts.styles";
export default function StoreProducts() {
  const insets = useSafeAreaInsets();
  const [detailModal, setDetailModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedProductCode, setSelectedProductCode] = useState<string | null>(null);
  const [saleModal, setSaleModal] = useState(false);
  const [negoModal, setNegoModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [saleStartDate, setSaleStartDate] = useState(new Date());
  const [discountType, setDiscountType] = useState<'rate' | 'price'>('rate'); // 할인률 또는 할인가
  const [discountValue, setDiscountValue] = useState('');
  const [currentProductPrice, setCurrentProductPrice] = useState(10000); // 예시로 현재 상품 가격
  const [discountDurationHours, setDiscountDurationHours] = useState(24); // DB에서 가져온 할인 기간(시간)

  const products = [
    { id: "1", uri: require("@/assets/images/image1.jpg"), name: "상품 1", price: 10000, categoryName: "카테고리 1"},
    { id: "2", uri: require("@/assets/images/image1.jpg"), name: "상품 2", price: 20000, categoryName: "카테고리 2"},
    { id: "3", uri: require("@/assets/images/image1.jpg"), name: "상품 3", price: 30000, categoryName: "카테고리 3"},
  ];
  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
      )}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title} pointerEvents="none">
          상품 관리
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.navigate("/(store)/addproduct")}
        >
          <Ionicons name="add" size={28} color="#EF7810" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'ios' ? insets.bottom + 60 : 0
        }}
        renderItem={({ item: products }) => (
          <View style={styles.content}>
            <TouchableOpacity style={styles.productTouchable}>
              <View style={styles.productContainer}>
                <View style={styles.productImageContainer}>
                  <Image source={products.uri} style={styles.productImage} resizeMode="cover"/>
                </View>
                <View style={styles.productInfoContainer}>
                  <Text style={styles.categoryName}>{products.categoryName}</Text>
                  <Text style={styles.productName}>{products.name}</Text>
                  <Text style={styles.price}>
                    {products.price.toLocaleString()}원
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.productButtonContainer}>
              <TouchableOpacity style={styles.saleButton}
              onPress={() => setSaleModal(true)}>
                <Text style={styles.saleButtonText}>할인 등록</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.negoButton}
              onPress={() => setNegoModal(true)}>
                <Text style={styles.negoButtonText}>네고 등록</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.moreButton}
              onPress={() => {
                // products.id에서 products.productCode로 변경 필요함
                setSelectedProductCode(products.id);
                setDetailModal(true);
              }}>
                <Text><Ionicons name="ellipsis-horizontal" size={20} color="#666" /></Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal
        visible={detailModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDetailModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDetailModal(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setDetailModal(false);
                router.push({
                  pathname: "/(store)/detailproduct",
                  params: { productCode: selectedProductCode}
                });
              }}
            >
              <Ionicons name="information-circle-outline" size={20} color="#333" />
              <Text style={styles.modalButtonText}>상세정보</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setDetailModal(false);
                // 수정 페이지로 이동 (상품 ID 전달)
                router.push({
                  pathname: "/(store)/editproduct",
                  params: { productCode: selectedProductCode, mode: 'edit' }
                });
              }}
            >
              <Ionicons name="create-outline" size={20} color="#333" />
              <Text style={styles.modalButtonText}>수정</Text>
            </TouchableOpacity>
            
            <View style={styles.modalDivider} />
            
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setDetailModal(false);
                setDeleteModal(true);
              }}
            >
              <Ionicons name="trash-outline" size={20} color="#ff3b30" />
              <Text style={[styles.modalButtonText, { color: '#ff3b30' }]}>삭제</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={deleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalTitle}>상품 삭제</Text>
            <Text style={styles.deleteModalMessage}>
              정말로 이 상품을 삭제하시겠습니까?{"\n"}삭제된 상품은 복구할 수 없습니다.
            </Text>
            
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={[styles.deleteModalButton, styles.confirmButton]}
                onPress={() => {
                  // 여기서 실제 삭제 로직 구현
                  setDeleteModal(false);
                  setSelectedProductCode(null);
                  // TODO: 실제 삭제 API 호출
                }}>
                <Text style={styles.confirmButtonText}>삭제</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.deleteModalButton, styles.cancelButton]}
                onPress={() => setDeleteModal(false)}>
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={saleModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSaleModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSaleModal(false)}
        >
          <View style={styles.saleModalWrapper}>
            <TouchableOpacity 
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
              style={styles.saleModalContent}
            >
              <View style={styles.saleModalHeader}>
                <Text style={styles.saleModalTitle}>할인 등록</Text>
              </View>

              <View style={styles.saleOptionGroup}>
                <Text style={styles.saleLabel}>할인 방식 선택</Text>
                <View style={styles.saleRadioGroup}>
                  <TouchableOpacity 
                    style={styles.saleRadioOption}
                    onPress={() => {
                      setDiscountType('rate');
                      setDiscountValue('');
                    }}
                  >
                    <View style={styles.saleRadioCircle}>
                      {discountType === 'rate' && <View style={styles.saleRadioCircleSelected} />}
                    </View>
                    <Text style={styles.saleRadioText}>할인률 (%)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.saleRadioOption}
                    onPress={() => {
                      setDiscountType('price');
                      setDiscountValue('');
                    }}
                  >
                    <View style={styles.saleRadioCircle}>
                      {discountType === 'price' && <View style={styles.saleRadioCircleSelected} />}
                    </View>
                    <Text style={styles.saleRadioText}>할인가 (원)</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.saleInputGroup}>
                <Text style={styles.saleLabel}>할인 값</Text>
                <TextInput 
                  style={styles.saleInput}
                  placeholder="숫자를 입력하세요"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                  value={discountValue}
                  onChangeText={(text) => {
                    const numValue = parseInt(text) || 0;
                    if (discountType === 'rate') {
                      if (numValue >= 1 && numValue <= 100) {
                        setDiscountValue(text);
                      } else if (text === '') {
                        setDiscountValue('');
                      }
                    } else {
                      if (numValue >= 1 && numValue <= currentProductPrice) {
                        setDiscountValue(text);
                      } else if (text === '') {
                        setDiscountValue('');
                      }
                    }
                  }}
                />
              </View>

              <View style={styles.saleInputGroup}>
                <Text style={styles.saleLabel}>할인 시작 시간</Text>
                <TouchableOpacity 
                  style={styles.saleDateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Ionicons name="calendar-outline" size={20} color="#ef7810" />
                  <Text style={styles.saleDateText}>
                    {saleStartDate.toLocaleDateString('ko-KR')} {saleStartDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </TouchableOpacity>
                
                {showDatePicker && (
                  <DateTimePicker
                    value={saleStartDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(Platform.OS === 'ios');
                      if (selectedDate) {
                        setSaleStartDate(selectedDate);
                        if (Platform.OS !== 'ios') {
                          setShowTimePicker(true);
                        }
                      }
                    }}
                  />
                )}
                
                {showTimePicker && (
                  <DateTimePicker
                    value={saleStartDate}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                      setShowTimePicker(Platform.OS === 'ios');
                      if (selectedDate) {
                        setSaleStartDate(selectedDate);
                      }
                    }}
                  />
                )}
              </View>

              <View style={styles.saleInputGroup}>
                <Text style={styles.saleLabel}>할인 종료일시</Text>
                <View style={[styles.saleInput, styles.saleInputDisabled]}>
                  <Text style={styles.saleInputDisabledText}>
                    {(() => {
                      const endDate = new Date(saleStartDate);
                      endDate.setHours(endDate.getHours() + discountDurationHours);
                      return `${endDate.toLocaleDateString('ko-KR')} ${endDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
                    })()}
                  </Text>
                </View>
                <Text style={styles.saleHelpText}>시작 시간으로부터 {discountDurationHours}시간 후 자동 종료</Text>
              </View>

              <View style={styles.saleModalButtons}>
                <TouchableOpacity style={styles.saleConfirmButton}>
                  <Text style={styles.saleConfirmButtonText}>등록</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.saleCancelButton}
                  onPress={() => setSaleModal(false)}
                >
                  <Text style={styles.saleCancelButtonText}>취소</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={negoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setNegoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.negoModalContent}>
            <Text>네고 등록</Text>
            <Text>
              네고 등록 모달 내용이 여기에 들어갑니다.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}