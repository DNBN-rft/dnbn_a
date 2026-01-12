import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function CustLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#EF7810',
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
        name="custhome"
        options={{
          title: '홈',
          headerTitle: 'DNBN',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: '지도',
          headerTitle: '매장 찾기',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "map" : "map-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: '관심 매장',
          headerTitle: '관심 매장',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "heart" : "heart-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: '검색',
          headerTitle: '검색',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "search" : "search-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: '마이페이지',
          headerTitle: '마이페이지',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />
          ),
        }}
      />
      
      {/* 탭에 표시하지 않는 추가 화면들 */}
      <Tabs.Screen
        name="cart"
        options={{
          href: null, // 탭바에서 숨김
          title: '장바구니',
          headerTitle: '장바구니',
        }}
      />
      <Tabs.Screen
        name="search-result"
        options={{
          href: null, // 탭바에서 숨김
          title: '검색 결과',
          headerTitle: '검색 결과',
        }}
      />
    </Tabs>
  );
}
