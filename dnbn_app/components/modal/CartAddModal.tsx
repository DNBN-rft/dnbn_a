import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./CartAddModal.styles"
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CartAddModalProps {
  visible: boolean;
  productName: string;
  productCode: string;
  storeCode: string;
  price: number;
  stock: number;
  onClose: () => void;
  onAddToCart: (quantity: number) => Promise<void>;
}

export default function CartAddModal({
  visible,
  productName,
  productCode,
  storeCode,
  price,
  stock,
  onClose,
  onAddToCart,
}: CartAddModalProps) {
  const [quantity, setQuantity] = useState<string>("1");
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (text: string) => {
    const numValue = parseInt(text) || 0;
    if (numValue <= stock) {
      setQuantity(text);
    }
  };

  const insets = useSafeAreaInsets();

  const handleIncrement = () => {
    const currentQty = parseInt(quantity) || 0;
    if (currentQty < stock) {
      setQuantity((currentQty + 1).toString());
    }
  };

  const handleDecrement = () => {
    const currentQty = parseInt(quantity) || 1;
    if (currentQty > 1) {
      setQuantity((currentQty - 1).toString());
    }
  };

  const handleAddToCart = async () => {
    const qty = parseInt(quantity) || 1;
    if (qty < 1) {
      alert("수량을 1개 이상 입력해주세요.");
      return;
    }
    if (qty > stock) {
      alert(`최대 ${stock}개까지 구매 가능합니다.`);
      return;
    }

    setLoading(true);
    try {
      await onAddToCart(qty);
      setQuantity("1");
      onClose();
    } catch (error) {
      console.error("장바구니 추가 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = (parseInt(quantity) || 0) * price;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -insets.bottom}
        style={{ flex: 1 }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>장바구니에 추가</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.productInfoSection}>
              <Text style={styles.productNameText}>{productName}</Text>
              <Text style={styles.priceText}>
                {price.toLocaleString()}원 / 개
              </Text>
              <Text style={styles.stockText}>
                재고: {stock.toLocaleString()}개
              </Text>
            </View>

            <View style={styles.quantitySection}>
              <Text style={styles.quantityLabel}>수량</Text>
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={handleDecrement}
                  disabled={loading}
                >
                  <Ionicons name="remove" size={20} color="#333" />
                </TouchableOpacity>

                <TextInput
                  style={styles.quantityInput}
                  value={quantity}
                  onChangeText={handleQuantityChange}
                  keyboardType="number-pad"
                  placeholder="1"
                  editable={!loading}
                />

                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={handleIncrement}
                  disabled={loading}
                >
                  <Ionicons name="add" size={20} color="#333" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>총 금액</Text>
              <Text style={styles.totalPrice}>
                {totalPrice.toLocaleString()}원
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.addButton, loading && styles.addButtonDisabled]}
              onPress={handleAddToCart}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.addButtonText}>장바구니 추가</Text>
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}
