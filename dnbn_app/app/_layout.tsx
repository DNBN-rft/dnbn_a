import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Linking, Platform } from 'react-native';
import 'react-native-reanimated';

import { AuthProvider } from '@/contexts/AuthContext';
import { StoreSignupProvider } from '@/contexts/StoreSignupContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { setLogoutCallback } from '@/utils/api';
import { requestNotificationPermission } from '@/utils/notificationUtil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

/** 카카오 공유 링크 클릭 시 앱이 실행될 때의 딥링크를 처리합니다.
 *  URL 형식: kakao{nativeAppKey}://kakaolink?screen=XXX&productCode=YYY
 */
function handleKakaoDeepLink(url: string) {
  if (!url.startsWith('kakao')) return;
  try {
    const queryString = url.split('?')[1];
    if (!queryString) return;
    const params: Record<string, string> = {};
    queryString.split('&').forEach((pair) => {
      const [key, value] = pair.split('=');
      if (key) params[decodeURIComponent(key)] = decodeURIComponent(value ?? '');
    });
    const { screen, productCode, storeCode } = params;
    if (screen === 'product-detail' && productCode) {
      router.push({ pathname: '/(cust)/product-detail', params: { productCode } });
    } else if (screen === 'sale-product-detail' && productCode) {
      router.push({ pathname: '/(cust)/sale-product-detail', params: { productCode } });
    } else if (screen === 'nego-product-detail' && productCode) {
      router.push({ pathname: '/(cust)/nego-product-detail', params: { productCode } });
    } else if (screen === 'storeInfo' && storeCode) {
      router.push({ pathname: '/(cust)/storeInfo', params: { storeCode } });
    }
  } catch (err) {
    console.error('카카오 딥링크 처리 오류:', err);
  }
}

function RootLayoutContent() {
  const colorScheme = useColorScheme();

  // 앱 시작 시 로그아웃 콜백 설정
  useEffect(() => {
    setLogoutCallback(() => {
      router.replace('/(guest)/tabs/guesthome');
    });
  }, []);

  // 카카오 공유 딥링크 처리
  useEffect(() => {
    // 앱이 종료된 상태에서 딥링크로 진입한 경우
    Linking.getInitialURL().then((url) => {
      if (url) handleKakaoDeepLink(url);
    });
    // 앱이 백그라운드 상태에서 딥링크로 진입한 경우
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleKakaoDeepLink(url);
    });
    return () => subscription.remove();
  }, []);

  // 앱 최초 실행 시 알림 권한 1회 요청 + Android 채널 설정
  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
      const requested = await AsyncStorage.getItem('notification_permission_requested');
      if (!requested) {
        await requestNotificationPermission();
        await AsyncStorage.setItem('notification_permission_requested', 'true');
      }
    })();
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
      <StoreSignupProvider>
        <RootLayoutContent />
      </StoreSignupProvider>
    </AuthProvider>
  );
}
