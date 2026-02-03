import { Stack } from "expo-router";

export default function CustLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* 탭이 있는 메인 화면 */}
      <Stack.Screen
        name="tabs"
        options={{
          headerShown: false,
        }}
      />

      {/* 탭이 없는 추가 화면들 */}
      <Stack.Screen
        name="cart"
        options={{
          title: "장바구니",
          headerShown: false,
          headerTitle: "장바구니",
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: "알림",
          headerShown: false,
          headerTitle: "알림",
        }}
      />
      <Stack.Screen
        name="address"
        options={{
          title: "주소 관리",
          headerShown: false,
          headerTitle: "배송지 관리",
        }}
      />
      <Stack.Screen
        name="address-select"
        options={{
          title: "주소 선택",
          headerShown: false,
          headerTitle: "주소 선택",
        }}
      />
      <Stack.Screen
        name="review"
        options={{
          title: "리뷰 작성",
          headerShown: false,
          headerTitle: "리뷰 작성",
        }}
      />
      <Stack.Screen
        name="my-info"
        options={{
          title: "내 정보 수정",
          headerShown: false,
          headerTitle: "내 정보 수정",
        }}
      />
      <Stack.Screen
        name="notification-setting"
        options={{
          title: "알림 설정",
          headerShown: false,
          headerTitle: "알림 설정",
        }}
      />
      <Stack.Screen
        name="purchase-box"
        options={{
          title: "선물함",
          headerShown: false,
          headerTitle: "선물함",
        }}
      />
      <Stack.Screen
        name="use-gift"
        options={{
          title: "선물함 사용하기",
          headerShown: false,
          headerTitle: "선물함 사용하기",
        }}
      />
      <Stack.Screen
        name="notice"
        options={{
          title: "공지사항",
          headerShown: false,
          headerTitle: "공지사항",
        }}
      />
      <Stack.Screen
        name="noticeDetail"
        options={{
          title: "공지사항상세",
          headerShown: false,
          headerTitle: "공지사항상세",
        }}
      />
      <Stack.Screen
        name="faqList"
        options={{
          title: "자주 묻는 질문",
          headerShown: false,
          headerTitle: "자주 묻는 질문",
        }}
      />
      <Stack.Screen
        name="question"
        options={{
          title: "문의사항",
          headerShown: false,
          headerTitle: "문의사항",
        }}
      />
      <Stack.Screen
        name="questionReg"
        options={{
          title: "문의하기",
          headerShown: false,
          headerTitle: "문의하기",
        }}
      />
      <Stack.Screen
        name="product-detail"
        options={{
          title: "상품 상세",
          headerShown: false,
          headerTitle: "상품 상세",
        }}
      />
      <Stack.Screen
        name="purchase"
        options={{
          title: "구매 내역",
          headerShown: false,
          headerTitle: "구매 내역",
        }}
      />
      <Stack.Screen
        name="storeInfo"
        options={{
          title: "가게 정보",
          headerShown: false,
          headerTitle: "가게 정보 ",
        }}
      />
    </Stack>
  );
}
