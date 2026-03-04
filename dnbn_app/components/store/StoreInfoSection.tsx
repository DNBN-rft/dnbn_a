import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
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
  onAddressSearch: () => void;
  errors?: {
    storeName?: string;
    phoneNumber?: string;
    address?: string;
  };
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
  onAddressSearch,
  errors = {},
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
          style={[styles.input, !!errors.storeName && styles.inputErrorBorder]}
          placeholder="가맹점명을 입력하세요"
          value={storeName}
          onChangeText={onStoreNameChange}
        />
        {!!errors.storeName && (
          <Text style={styles.inputError}>{errors.storeName}</Text>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>전화번호</Text>
        <TextInput
          style={[styles.input, !!errors.phoneNumber && styles.inputErrorBorder]}
          placeholder="전화번호를 입력하세요"
          value={phoneNumber}
          onChangeText={onPhoneNumberChange}
          keyboardType="phone-pad"
        />
        {!!errors.phoneNumber && (
          <Text style={styles.inputError}>{errors.phoneNumber}</Text>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>주소</Text>
        <Pressable
          style={[
            styles.addressInputContainer,
            !!errors.address && styles.inputErrorBorder,
          ]}
          onPress={onAddressSearch}
        >
          <Text
            style={[
              styles.addressInputText,
              !address && styles.addressInputPlaceholder,
            ]}
          >
            {address || "주소를 검색해주세요"}
          </Text>
          <Ionicons name="search" size={20} color="#666" />
        </Pressable>
        {!!errors.address && (
          <Text style={styles.inputError}>{errors.address}</Text>
        )}
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
