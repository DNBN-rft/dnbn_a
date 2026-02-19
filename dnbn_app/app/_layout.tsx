import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AuthProvider } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { setLogoutCallback } from '@/utils/api';

function RootLayoutContent() {
  const colorScheme = useColorScheme();

  // 앱 시작 시 로그아웃 콜백 설정
  useEffect(() => {
    setLogoutCallback(() => {
      router.replace('/(auth)/login');
    });
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="(cust)" 
          options={{ 
            headerShown: false,
            // cust, store 접근 가능하도록 나중에 처리 필요
          }} 
        />
        <Stack.Screen 
          name="(store)" 
          options={{ 
            headerShown: false,
            // store만 접근 가능하도록 나중에 처리 필요
          }} 
        />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}
