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
    </Stack>
  );
}
