import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { styles } from "@/app/(store)/editstoreinfo.styles";

interface mainImg {
  fileUrl: string;
  originalName: string;
  order: number;
}

interface StoreInfoSectionProps {
  mainImage: mainImg | null;
  storeName: string;
  phoneNumber: string;
  address: string;
  detailedAddress: string;
  onStoreNameChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onDetailedAddressChange: (value: string) => void;
  onImagePick: () => void;
}

export default function StoreInfoSection({
  mainImage,
  storeName,
  phoneNumber,
  address,
  detailedAddress,
  onStoreNameChange,
  onPhoneNumberChange,
  onAddressChange,
  onDetailedAddressChange,
  onImagePick,
}: StoreInfoSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="storefront" size={22} color="#EF7810" />
        <Text style={styles.sectionTitle}>가맹점 정보</Text>
      </View>

      {mainImage && mainImage.fileUrl && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>가맹점 대표 이미지</Text>
          <TouchableOpacity
            onPress={onImagePick}
            style={styles.imagePickerContainer}
          >
            <Image
              source={{ uri: mainImage.fileUrl }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
            <View style={styles.imageCameraButton}>
              <Ionicons name="camera" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.imageChangedText}>
            이미지를 탭하여 변경할 수 있습니다
          </Text>
        </View>
      )}

      <View style={styles.formGroup}>
        <Text style={styles.label}>가맹점명</Text>
        <TextInput
          style={styles.input}
          placeholder="가맹점명을 입력하세요"
          value={storeName}
          onChangeText={onStoreNameChange}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>전화번호</Text>
        <TextInput
          style={styles.input}
          placeholder="전화번호를 입력하세요"
          value={phoneNumber}
          onChangeText={onPhoneNumberChange}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>주소</Text>
        <TextInput
          style={styles.input}
          placeholder="주소를 입력하세요"
          value={address}
          onChangeText={onAddressChange}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>상세 주소</Text>
        <TextInput
          style={styles.input}
          placeholder="상세 주소를 입력하세요"
          value={detailedAddress}
          onChangeText={onDetailedAddressChange}
        />
      </View>
    </View>
  );
}
