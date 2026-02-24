import { Stack } from "expo-router";

export default function StoreLayout() {
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
        name="orders"
        options={{
          title: "주문 관리",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="storeQuestion"
        options={{
          title: "문의사항",
          headerShown: false,
          headerTitle: "문의사항",
        }}
      />
      <Stack.Screen
        name="storeQuestionReg"
        options={{
          title: "문의하기",
          headerShown: false,
          headerTitle: "문의하기",
        }}
      />
      <Stack.Screen
        name="storeQuestion-answer"
        options={{
          title: "문의상세",
          headerShown: false,
          headerTitle: "문의상세",
        }}
      />
      <Stack.Screen
        name="storeQuestion-answer-edit"
        options={{
          title: "문의 수정",
          headerShown: false,
          headerTitle: "문의 수정",
        }}
      />
    </Stack>
  );
}
