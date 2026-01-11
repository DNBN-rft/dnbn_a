import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./mypage.styles";

export default function Mypage() {
  const insets = useSafeAreaInsets();
  const [openInfo, setOpenInfo] = useState(false);
  const { userType } = useAuth();

  const changeArrow = () => {
    setOpenInfo((prev) => !prev);
  };

  return (
    <View style={[styles.mypageViewContainer]}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
      )}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (userType === "store") {
              router.push("/(store)/tabs/storehome");
            } else {
              router.back();
            }
          }}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title} pointerEvents="none">
          마이페이지
        </Text>
        {userType === "store" && (
          <TouchableOpacity
            style={styles.storeButton}
            onPress={() => router.push("/(store)/tabs/storehome")}
          >
            <Text style={styles.storeButtonText}>Store</Text>
          </TouchableOpacity>
        )}
        {userType !== "store" && <View style={styles.placeholder} />}
      </View>

      <ScrollView
        style={styles.mypageView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentView}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>회원 정보</Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.navigate("/(cust)/myInfo")}
            >
              <Text style={styles.menuText}>내 정보</Text>
              <Ionicons name="chevron-forward" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.navigate("/(cust)/tabs/custhome")}
            >
              <Text style={styles.menuText}>카테고리 설정</Text>
              <Ionicons name="chevron-forward" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.navigate("/(cust)/tabs/custhome")}
            >
              <Text style={styles.menuText}>알림 설정</Text>
              <Ionicons name="chevron-forward" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>히스토리</Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.navigate("/(cust)/purchase")}
            >
              <Text style={styles.menuText}>구매내역</Text>
              <Ionicons name="chevron-forward" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.navigate("/(cust)/gift-box")}
            >
              <Text style={styles.menuText}>선물함</Text>
              <Ionicons name="chevron-forward" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.navigate("/(cust)/review")}
            >
              <Text style={styles.menuText}>리뷰</Text>
              <Ionicons name="chevron-forward" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>서비스</Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.navigate("/(cust)/notice")}
            >
              <Text style={styles.menuText}>공지사항</Text>
              <Ionicons name="chevron-forward" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.navigate("/(cust)/faqList")}
            >
              <Text style={styles.menuText}>자주 묻는 질문</Text>
              <Ionicons name="chevron-forward" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.navigate("/(cust)/tabs/custhome")}
            >
              <Text style={styles.menuText}>신고</Text>
              <Ionicons name="chevron-forward" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.navigate("/(auth)/login")}
            >
              <Text style={styles.menuText}>로그아웃</Text>
              <Ionicons name="chevron-forward" size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dnbnInfoContainer}>
          <TouchableOpacity
            onPress={() => changeArrow()}
            style={{ flexDirection: "row" }}
          >
            <Text style={styles.sectionTitle}>동네방네</Text>
            <Ionicons
              name={openInfo ? "chevron-down" : "chevron-up"}
              size={18}
              color="black"
            ></Ionicons>
          </TouchableOpacity>

          <View style={styles.textBlock}>
            <Text style={styles.regularText}>
              동네방네는 통신판매중개자로서 통신판매의 거래당사자가 아니며,
              {"\n"}
              상품정보 및 거래에 대해 동네방네는 일체 책임을 지지 않습니다.
            </Text>
            <Text style={styles.copyRight}>
              © 2026 DongneBangne. All Rights Reserved.
            </Text>
          </View>

          <Text style={styles.labelText}>나이스PAY 에스크로 가입사실 확인</Text>

          <View
            style={[
              styles.textBlock,
              openInfo ? { display: "contents" } : { display: "none" },
            ]}
          >
            <Text style={styles.regularText}>
              대표이사 : 홍길동 대전광역시 동구동 123
            </Text>
            <Text style={styles.regularText}>042-123-5678</Text>
            <Text style={styles.regularText}>
              통신판매업 신고번호 : 제2024-대전서구-12345호
            </Text>
            <Text style={styles.regularText}>
              사업자등록번호 : 214-86-12345
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
