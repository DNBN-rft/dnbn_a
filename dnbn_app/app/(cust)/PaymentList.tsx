import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./paymentlist.styles";

interface PaymentMethod {
  id: string;
  type: "신용카드" | "체크카드";
  number: string;
  isDefault: boolean;
}

export default function PaymentListScreen() {
  const insets = useSafeAreaInsets();
  const [payments, setPayments] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "신용카드",
      number: "**** **** **** 1234",
      isDefault: true,
    },
    {
      id: "2",
      type: "체크카드",
      number: "536610**** 434*",
      isDefault: false,
    },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    Alert.alert("결제수단 삭제", "정말 이 결제수단을 삭제하시겠습니까?", [
      {
        text: "취소",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "삭제",
        onPress: () => {
          setPayments(payments.filter((p) => p.id !== id));
          setSelectedId(null);
        },
        style: "destructive",
      },
    ]);
  };

  const handleSetDefault = (id: string) => {
    setPayments(
      payments.map((p) => ({
        ...p,
        isDefault: p.id === id,
      })),
    );
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case "신용카드":
        return "card";
      case "체크카드":
        return "card";
      default:
        return "card";
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
          <Text style={styles.title}>결제수단 관리</Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      <View style={styles.content}>
        {payments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="card-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>등록된 결제수단이 없습니다.</Text>
          </View>
        ) : (
          <>
            {/* 기본 결제수단 */}
            {payments.some((p) => p.isDefault) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>기본 결제수단</Text>
                <FlatList
                  data={payments.filter((p) => p.isDefault)}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.paymentCard,
                        selectedId === item.id && styles.paymentCardSelected,
                      ]}
                      onPress={() =>
                        setSelectedId(selectedId === item.id ? null : item.id)
                      }
                    >
                      <View style={styles.paymentCardContent}>
                        <View style={styles.paymentCardLeft}>
                          <View style={styles.cardIconContainer}>
                            <Ionicons name="card" size={24} color="#EF7810" />
                          </View>
                          <View style={styles.paymentCardInfo}>
                            <Text style={styles.paymentCardType}>
                              {item.type}
                            </Text>
                            <Text style={styles.paymentCardNumber}>
                              {item.number}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* 펼쳐진 상태에서의 액션 버튼들 */}
                      {selectedId === item.id && (
                        <View style={styles.actionButtons}>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.deleteButton]}
                            onPress={() => handleDelete(item.id)}
                          >
                            <Ionicons
                              name="trash-outline"
                              size={18}
                              color="#fff"
                            />
                            <Text
                              style={[
                                styles.actionButtonText,
                                styles.deleteButtonText,
                              ]}
                            >
                              삭제
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

            {/* 기타 결제수단 */}
            {payments.some((p) => !p.isDefault) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>기타 결제수단</Text>
                <FlatList
                  data={payments.filter((p) => !p.isDefault)}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.paymentCard,
                        selectedId === item.id && styles.paymentCardSelected,
                      ]}
                      onPress={() =>
                        setSelectedId(selectedId === item.id ? null : item.id)
                      }
                    >
                      <View style={styles.paymentCardContent}>
                        <View style={styles.paymentCardLeft}>
                          <View style={styles.cardIconContainer}>
                            <Ionicons name="card" size={24} color="#EF7810" />
                          </View>
                          <View style={styles.paymentCardInfo}>
                            <Text style={styles.paymentCardType}>
                              {item.type}
                            </Text>
                            <Text style={styles.paymentCardNumber}>
                              {item.number}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* 펼쳐진 상태에서의 액션 버튼들 */}
                      {selectedId === item.id && (
                        <View style={styles.actionButtons}>
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleSetDefault(item.id)}
                          >
                            <Ionicons
                              name="checkmark-circle"
                              size={18}
                              color="#fff"
                            />
                            <Text style={styles.actionButtonText}>
                              기본수단으로
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.deleteButton]}
                            onPress={() => handleDelete(item.id)}
                          >
                            <Ionicons
                              name="trash-outline"
                              size={18}
                              color="#fff"
                            />
                            <Text
                              style={[
                                styles.actionButtonText,
                                styles.deleteButtonText,
                              ]}
                            >
                              삭제
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </>
        )}
      </View>

      {/* 결제수단 등록 버튼 */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/(cust)/CardReg")}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>결제수단 등록</Text>
      </TouchableOpacity>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
