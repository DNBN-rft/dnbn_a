import { Ionicons } from '@expo/vector-icons';
import { Tabs } from "expo-router";
import { Platform } from 'react-native';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export default function StoreTabsLayout() {
  const [authorities, setAuthorities] = useState<string[]>([]);

  // 권한 확인 함수
  const hasAuthority = (requiredAuth: string): boolean => {
    return authorities.includes(requiredAuth);
  };

  useEffect(() => {
    const loadAuthorities = async () => {
      try {
        let authoritiesStr: string | null = null;

        if (Platform.OS === "web") {
          authoritiesStr = localStorage.getItem("authorities");
        } else {
          authoritiesStr = await SecureStore.getItemAsync("authorities");
        }

        if (authoritiesStr) {
          try {
            const parsedAuthorities = JSON.parse(authoritiesStr);
            setAuthorities(Array.isArray(parsedAuthorities) ? parsedAuthorities : []);
          } catch (e) {
            console.error("권한 파싱 실패:", e);
          }
        }
      } catch (error) {
        console.error("권한 로드 실패:", error);
      }
    };

    loadAuthorities();
  }, []);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF9500',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="storehome"
        options={{
          title: "홈",
          headerShown: false,
          tabBarIcon: ({ color, size, focused}
          ) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
          ),
        }}
      />

      {hasAuthority("STORE_PRODUCT") && (
        <Tabs.Screen
          name="storeproducts"
          options={{
            title: "상품관리",
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "cube" : "cube-outline"} size={size} color={color} />
            ),
          }}
        />
      )}

      {hasAuthority("STORE_PRODUCT") && (
        <Tabs.Screen
          name="storesale"
          options={{
            title: "할인관리",
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "pricetag" : "pricetag-outline"} size={size} color={color} />
            ),
          }}
        />
      )}

      {hasAuthority("STORE_PRODUCT") && (
        <Tabs.Screen
          name="storenego"
          options={{
            title: "네고관리",
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "chatbubbles" : "chatbubbles-outline"} size={size} color={color} />
            ),
          }}
        />
      )}

      {hasAuthority("STORE_MYPAGE") && (
        <Tabs.Screen
          name="storemypage"
          options={{
            title: "마이페이지",
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />
            ),
          }}
        />
      )}
    </Tabs>
  );
}
