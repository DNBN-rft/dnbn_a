import { Ionicons } from '@expo/vector-icons';
import { Tabs } from "expo-router";
import { Platform } from 'react-native';

export default function StoreTabsLayout() {
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

      <Tabs.Screen
        name="storesales"
        options={{
          title: "할인관리",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "pricetag" : "pricetag-outline"} size={size} color={color} />
          ),
        }}
      />

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
    </Tabs>
  );
}
