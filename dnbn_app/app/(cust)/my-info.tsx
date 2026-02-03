import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./my-info.styles";

export default function MyInfoScreen() {
  const [pwModalVisible, setPwModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const insets = useSafeAreaInsets();

  const fetchUserData = async () => {
    let custCode = null;

    if (Platform.OS === "web") {
      custCode = localStorage.getItem("custCode");
    } else {
      custCode = await SecureStore.getItemAsync("custCode");
    }

    console.log("고객 코드:", custCode);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

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
        <Text style={styles.title}>내 정보</Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push("/(cust)/EditMyInfo")}
        >
          <Ionicons name="create-outline" size={20} color="#EF7810" />
          <Text style={styles.editText}>수정</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.myInfoContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.myInfoContentContainer}>
          {/* 내 정보 */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionInfoHeader}>
              <Ionicons name="person" size={22} color="#EF7810" />
              <Text style={styles.sectionTitle}>내 정보</Text>
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>이름</Text>
                <Text style={styles.infoValue}>김철수</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>전화번호</Text>
                <Text style={styles.infoValue}>010-1234-5678</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>성별</Text>
                <Text style={styles.infoValue}>남성</Text>
              </View>
            </View>
          </View>

          {/*결제 정보 */}
          <View style={styles.sectionCard}>
            <Pressable
              style={styles.sectionHeaderPressable}
              onPress={() => router.push("/(cust)/PaymentList")}
            >
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="card" size={22} color="#EF7810" />
                <Text style={styles.sectionTitle}>결제 정보</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#EF7810" />
            </Pressable>
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>카드 종류</Text>
                <Text style={styles.infoValue}>신용카드/신용카드/계좌이체</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>카드 번호</Text>
                <Text style={styles.infoValue}>**** **** **** 1234</Text>
              </View>
            </View>
          </View>

          {/* 내 위치 */}
          <View style={styles.sectionCard}>
            <Pressable
              style={styles.sectionHeaderPressable}
              onPress={() => router.push("/(cust)/address")}
            >
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="location" size={22} color="#EF7810" />
                <Text style={styles.sectionTitle}>내 위치</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#EF7810" />
            </Pressable>
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>위치 이름</Text>
                <Text style={styles.infoValue}>
                  서울특별시 중구 세종대로 110
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>위치 이름</Text>
                <Text style={styles.infoValue}>
                  서울특별시 강남구 테헤란로 427
                </Text>
              </View>
            </View>
          </View>

          {/* 미수령상품 */}
          <View style={styles.sectionCard}>
            <Pressable
              style={styles.sectionHeaderPressable}
              onPress={() => router.push("/(cust)/gift-box")}
            >
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="cube" size={22} color="#EF7810" />
                <Text style={styles.sectionTitle}>미수령 상품</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#EF7810" />
            </Pressable>
            <View style={styles.giftinfoContainer}>
              <View style={styles.giftBox}>
                <Image
                  source={require("@/assets/images/qr.png")}
                  style={styles.giftImage}
                  resizeMode="contain"
                />
                <Text style={styles.infoValue}>2024-05-15</Text>
              </View>
              <View style={styles.giftBox}>
                <Image
                  source={require("@/assets/images/image1.jpg")}
                  style={styles.giftImage}
                  resizeMode="contain"
                />
                <Text style={styles.infoValue}>2024-07-15</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 비밀번호 변경 모달 */}
      <Modal
        visible={pwModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPwModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>비밀번호 변경</Text>

            <View style={styles.modalInputSection}>
              <Text style={styles.modalText}>현재 비밀번호 *</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="현재 비밀번호 입력"
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
            </View>

            <View style={styles.modalInputSection}>
              <Text style={styles.modalText}>새 비밀번호 *</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="새 비밀번호 입력"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <Text style={styles.modalPasswordHint}>
                영문 대소문자, 숫자, 특수문자 포함 8~20자 이내로 입력해주세요.
              </Text>
            </View>

            <View style={styles.modalInputSection}>
              <Text style={styles.modalText}>비밀번호 확인 *</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="비밀번호 확인"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <View style={styles.modalButtonContainer}>
              <Pressable
                style={styles.modalConfirmButton}
                onPress={() => {
                  // 비밀번호 변경 로직
                  setPwModalVisible(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
              >
                <Text style={styles.modalConfirmButtonText}>변경</Text>
              </Pressable>
              <Pressable
                style={styles.modalCancelButton}
                onPress={() => setPwModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>취소</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
