import { apiDelete, apiGet, apiPut } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./address.styles";

interface AddressData {
  locationIdx: number;
  label: string;
  address: string;
  isSelected: boolean;
}

export default function AddressScreen() {
  const insets = useSafeAreaInsets();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );

  const [addr, setAddr] = useState<AddressData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 주소 정보 불러오기
  const fetchAddresses = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiGet(`/cust/location`);

      if (response.ok) {
        const data: AddressData[] = await response.json();
        setAddr(data);
      } else {
        console.error("주소 정보를 불러오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("주소 정보 불러오기 오류:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // 새 주소 추가 페이지로 이동
  const handleAddNewAddress = useCallback(() => {
    router.push("/(cust)/address-select");
  }, []);

  const handleSelectAddress = useCallback((selectedId: number) => {
    setSelectedAddressId(selectedId);
  }, []);

  // 주소 수정 페이지로 이동
  const handleEditAddress = useCallback((addressData: AddressData) => {
    router.push({
      pathname: "/(cust)/address-select",
      params: {
        locationIdx: addressData.locationIdx.toString(),
        label: addressData.label,
        address: addressData.address,
        isSelected: addressData.isSelected.toString(),
      },
    });
  }, []);

  // 주소 삭제
  const handleDeleteAddress = useCallback(async (locationIdx: number) => {
    const confirmDelete = () => {
      return new Promise<boolean>((resolve) => {
        if (Platform.OS === "web") {
          resolve(window.confirm("이 주소를 삭제하시겠습니까?"));
        } else {
          Alert.alert("주소 삭제", "이 주소를 삭제하시겠습니까?", [
            {
              text: "취소",
              onPress: () => resolve(false),
              style: "cancel",
            },
            {
              text: "삭제",
              onPress: () => resolve(true),
              style: "destructive",
            },
          ]);
        }
      });
    };

    const confirmed = await confirmDelete();
    if (!confirmed) return;

    try {
      const response = await apiDelete(
        `/cust/location/del?locationIdx=${locationIdx}`,
      );

      if (response.ok) {
        // 삭제 성공 시 목록에서 제거
        setAddr((prevAddr) =>
          prevAddr.filter((item) => item.locationIdx !== locationIdx),
        );

        if (Platform.OS === "web") {
          window.alert("주소가 삭제되었습니다.");
        } else {
          Alert.alert("성공", "주소가 삭제되었습니다.");
        }
      } else {
        const errorData = await response.json();
        if (Platform.OS === "web") {
          window.alert(errorData.message || "주소 삭제에 실패했습니다.");
        } else {
          Alert.alert("오류", errorData.message || "주소 삭제에 실패했습니다.");
        }
      }
    } catch (error) {
      console.error("주소 삭제 오류:", error);
      if (Platform.OS === "web") {
        window.alert("주소 삭제 중 오류가 발생했습니다.");
      } else {
        Alert.alert("오류", "주소 삭제 중 오류가 발생했습니다.");
      }
    }
  }, []);

  const handleSetDefaultAddress = useCallback(async () => {
    if (selectedAddressId) {
      try {
        const response = await apiPut(
          `/cust/location/change?locationIdx=${selectedAddressId}`,
        );

        if (response.ok) {
          // 성공 시 로컬 상태 업데이트
          setAddr((prevAddr) =>
            prevAddr.map((item) => ({
              ...item,
              isSelected: item.locationIdx === selectedAddressId,
            })),
          );
          setSelectedAddressId(null);

          if (Platform.OS === "web") {
            window.alert("기본 주소로 설정되었습니다.");
          } else {
            Alert.alert("성공", "기본 주소로 설정되었습니다.");
          }
        } else {
          const errorData = await response.json();
          if (Platform.OS === "web") {
            window.alert(errorData.message || "기본 주소 설정에 실패했습니다.");
          } else {
            Alert.alert(
              "오류",
              errorData.message || "기본 주소 설정에 실패했습니다.",
            );
          }
        }
      } catch (error) {
        console.error("기본 주소 설정 오류:", error);
        if (Platform.OS === "web") {
          window.alert("기본 주소 설정 중 오류가 발생했습니다.");
        } else {
          Alert.alert("오류", "기본 주소 설정 중 오류가 발생했습니다.");
        }
      }
    }
  }, [selectedAddressId]);

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
      )}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.navigate("/(cust)/tabs/custhome")}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>내 위치 설정</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.locationSettingContainer}>
        {addr.length === 0 ? (
          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color="#EF7810"
            />
            <Text style={{ color: "#ef7810" }}>
              첫 주소는 기본 주소지로 설정됩니다.
            </Text>
          </View>
        ) : addr.length < 3 ? (
          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color="#EF7810"
            />
            <Text style={{ color: "#ef7810" }}>
              최대 3개의 주소를 저장할 수 있습니다.
            </Text>
          </View>
        ) : (
          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color="#EF7810"
            />
            <Text style={{ color: "#ef7810" }}>
              더 이상 주소를 추가할 수 없습니다.
            </Text>
          </View>
        )}

        <FlatList
          data={[...addr].sort(
            (a, b) => (b.isSelected ? 1 : 0) - (a.isSelected ? 1 : 0),
          )}
          keyExtractor={(item) => item.locationIdx.toString()}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.listItem,
                selectedAddressId === item.locationIdx &&
                  styles.listItemSelected,
              ]}
              onPress={() => handleSelectAddress(item.locationIdx)}
            >
              <View style={styles.contentContainer}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemTitleContainer}>
                    <Text style={styles.itemText}>{item.label}</Text>

                    {item.isSelected && (
                      <View style={styles.defaultAddressContainer}>
                        <Text style={styles.defaultAddress}>기본 주소지</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View>
                  <Text style={styles.itemDetailText}>{item.address}</Text>
                </View>

                <View style={styles.itemRecipientContainer}>
                  <View style={{ flex: 1 }} />
                  <View style={styles.buttonContainer}>
                    <Pressable
                      style={styles.editButton}
                      onPress={() => handleEditAddress(item)}
                    >
                      <Text style={styles.editButtonText}>수정</Text>
                    </Pressable>

                    <Pressable
                      style={styles.removeButton}
                      onPress={() => handleDeleteAddress(item.locationIdx)}
                    >
                      <Text style={styles.removeButtonText}>삭제</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Pressable>
          )}
        />
      </View>

      <View style={styles.bottomButtonContainer}>
        <Pressable
          style={[
            styles.addButton,
            addr.length >= 3 && styles.addButtonDisabled,
          ]}
          onPress={handleAddNewAddress}
          disabled={addr.length >= 3}
        >
          <Ionicons
            name="add"
            size={24}
            color={addr.length >= 3 ? "#ccc" : "#EF7810"}
          />
          <Text
            style={[
              styles.addButtonText,
              addr.length >= 3 && { color: "#ccc" },
            ]}
          >
            새 주소 추가
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.submitButton,
            !selectedAddressId && styles.submitButtonDisabled,
          ]}
          onPress={handleSetDefaultAddress}
          disabled={!selectedAddressId}
        >
          <Text style={styles.submitButtonText}>기본 주소로 설정</Text>
        </Pressable>
      </View>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
