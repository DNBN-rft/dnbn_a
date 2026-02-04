import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

interface PurchaseModalProps {
  visible: boolean;
  productName: string;
  productCode: string;
  price: number;
  stock: number;
  onClose: () => void;
  onPurchase: (quantity: number) => void;
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  closeButton: {
    padding: 5,
  },
  productInfoSection: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  productNameText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 8,
  },
  priceText: {
    fontSize: 14,
    color: "#EF7810",
    fontWeight: "600",
    marginBottom: 5,
  },
  stockText: {
    fontSize: 12,
    color: "#999",
  },
  quantitySection: {
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 10,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  quantityInput: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    paddingVertical: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 15,
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 10,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#EF7810",
  },
  addButton: {
    backgroundColor: "#EF7810",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default function PurchaseModal({
  visible,
  productName,
  productCode,
  price,
  stock,
  onClose,
  onPurchase,
}: PurchaseModalProps) {
  const [quantity, setQuantity] = useState<string>("1");

  const handleQuantityChange = (text: string) => {
    const numValue = parseInt(text) || 0;
    if (numValue > stock) {
      setQuantity(stock.toString());
    } else {
      setQuantity(text);
    }
  };

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

  const handlePurchase = () => {
    const qty = parseInt(quantity) || 1;
    if (qty < 1) {
      alert("수량을 1개 이상 입력해주세요.");
      return;
    }
    if (qty > stock) {
      alert(`최대 ${stock}개까지 구매 가능합니다.`);
      return;
    }

    onPurchase(qty);
  };

  const totalPrice = (parseInt(quantity) || 0) * price;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>수량 선택</Text>
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
              >
                <Ionicons name="remove" size={20} color="#333" />
              </TouchableOpacity>

              <TextInput
                style={styles.quantityInput}
                value={quantity}
                onChangeText={handleQuantityChange}
                keyboardType="number-pad"
                placeholder="1"
              />

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleIncrement}
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
            style={styles.addButton}
            onPress={handlePurchase}
          >
            <Text style={styles.addButtonText}>구매하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
