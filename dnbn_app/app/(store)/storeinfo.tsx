import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, Platform, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { useState, useEffect } from "react";
import { styles } from "./storeinfo.styles";
import { apiGet } from "@/utils/api";

interface StoreInfo {
  approvalStatus: string;
  storeNm: string;
  storeTelNo: string;
  storeAddr: string;
  storeAddrDetail: string;
  storeReport: number;

  bankNm: string;
  storeAccNo: string;
  ownerNm: string;

  bizNm: string;
  storeType: string;
  bizNo: string;
  ownerTelNo: string;
  bizRegDate: string;

  storeOpenDate: Array<string>;
  storeOpenTime: string;
  storeCloseTime: string;

  planNm: string;
  membershipStartDate: string;
  nextBillingDate: string;
  planPrice: number;
  isRenew: boolean
  membershipInfos: MembershipInfo[];
  mainImg: mainImg;
}

interface MembershipInfo {
  membershipStartDate: string;
  membershipEndDate: string;
  PlanNm: string;
  PlanPrice: number;
  PaymentDateTime: string;
  PlanType: string;
}

interface mainImg {
  fileUrl: string;
  originalName: string;
  order: number
}

export default function StoreInfoPage() {
  const insets = useSafeAreaInsets();
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        let storeCode = "";
        if (Platform.OS === "web") {
          storeCode = localStorage.getItem("storeCode") || "";
        } else {
          storeCode = (await SecureStore.getItemAsync("storeCode")) || "";
        }

        if (!storeCode) {
          setError("가맹점 코드를 찾을 수 없습니다.");
          setLoading(false);
          return;
        }

        const response = await apiGet(`/store/view/${storeCode}`);
        if (response.ok) {
          const data: StoreInfo = await response.json();
          setStoreInfo(data);
        } else {
          setError("가맹점 정보를 불러올 수 없습니다.");
        }
      } catch (err) {
        setError("오류가 발생했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreInfo();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 20 }}>로딩 중...</Text>
      </View>
    );
  }

  if (error || !storeInfo) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 20 }}>{error || "정보를 불러올 수 없습니다."}</Text>
      </View>
    );
  }
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
        <Text style={styles.title}>내 가맹점</Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            router.push({
              pathname: "/(store)/editstoreinfo",
              params: {
                storeInfo: JSON.stringify(storeInfo)
              }
            });
          }}
        >
          <Ionicons name="create-outline" size={20} color="#EF7810" />
          <Text style={styles.editText}>수정</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="storefront" size={22} color="#EF7810" />
              <Text style={styles.sectionTitle}>가맹점 정보</Text>
            </View>


            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>가맹점 대표 이미지</Text>
                <Image 
                  source={{ uri: storeInfo.mainImg.fileUrl }} 
                  style={{ width: 100, height: 100, borderRadius: 8 }}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>가맹점명</Text>
                <Text style={styles.infoValue}>{storeInfo.storeNm}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>전화번호</Text>
                <Text style={styles.infoValue}>{storeInfo.storeTelNo}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>주소</Text>
                <Text style={styles.infoValue}>{storeInfo.storeAddr} {storeInfo.storeAddrDetail}</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="card" size={22} color="#EF7810" />
              <Text style={styles.sectionTitle}>계좌 정보</Text>
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>은행명</Text>
                <Text style={styles.infoValue}>{storeInfo.bankNm}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>계좌번호</Text>
                <Text style={styles.infoValue}>{storeInfo.storeAccNo}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>예금주</Text>
                <Text style={styles.infoValue}>{storeInfo.ownerNm}</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text" size={22} color="#EF7810" />
              <Text style={styles.sectionTitle}>사업자 정보</Text>
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>사업자명</Text>
                <Text style={styles.infoValue}>{storeInfo.bizNm}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>사업자등록번호</Text>
                <Text style={styles.infoValue}>{storeInfo.bizNo}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>대표자명</Text>
                <Text style={styles.infoValue}>{storeInfo.ownerNm}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>대표 연락처</Text>
                <Text style={styles.infoValue}>{storeInfo.ownerTelNo}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>업태</Text>
                <Text style={styles.infoValue}>{storeInfo.storeType}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>사업자 등록일</Text>
                <Text style={styles.infoValue}>{storeInfo.bizRegDate}</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time" size={22} color="#EF7810" />
              <Text style={styles.sectionTitle}>운영 정보</Text>
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>영업 시간</Text>
                <Text style={styles.infoValue}>{storeInfo.storeOpenTime} ~ {storeInfo.storeCloseTime}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>영업일</Text>
                <Text style={styles.infoValue}>{storeInfo.storeOpenDate}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
