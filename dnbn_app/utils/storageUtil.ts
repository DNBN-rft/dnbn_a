import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/**
 * 플랫폼에 따라 적절한 저장소에 데이터를 저장합니다.
 * Web: localStorage
 * Native: expo-secure-store
 */
export const setStorageItem = async (
  key: string,
  value: string,
): Promise<void> => {
  try {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.error(`Error setting storage item for key ${key}:`, error);
    throw error;
  }
};

/**
 * 여러 개의 키-값 쌍을 한번에 저장합니다.
 * Web: localStorage
 * Native: expo-secure-store
 */
export const setMultipleItems = async (
  items: Record<string, any>,
): Promise<void> => {
  try {
    if (Platform.OS === "web") {
      Object.entries(items).forEach(([key, value]) => {
        localStorage.setItem(key, String(value));
      });
    } else {
      await Promise.all(
        Object.entries(items).map(([key, value]) =>
          SecureStore.setItemAsync(key, String(value)),
        ),
      );
    }
  } catch (error) {
    console.error("Error setting multiple storage items:", error);
    throw error;
  }
};

/**
 * 플랫폼에 따라 적절한 저장소에서 데이터를 가져옵니다.
 * Web: localStorage
 * Native: expo-secure-store
 */
export const getStorageItem = async (key: string): Promise<string | null> => {
  try {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch (error) {
    console.error(`Error getting storage item for key ${key}:`, error);
    return null;
  }
};

/**
 * 플랫폼에 따라 적절한 저장소에서 데이터를 삭제합니다.
 * Web: localStorage
 * Native: expo-secure-store
 */
export const removeStorageItem = async (key: string): Promise<void> => {
  try {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    console.error(`Error removing storage item for key ${key}:`, error);
    throw error;
  }
};

/**
 * 여러 개의 키를 한번에 삭제합니다.
 * Web: localStorage
 * Native: expo-secure-store
 */
export const removeMultipleItems = async (keys: string[]): Promise<void> => {
  try {
    if (Platform.OS === "web") {
      keys.forEach((key) => localStorage.removeItem(key));
    } else {
      await Promise.all(keys.map((key) => SecureStore.deleteItemAsync(key)));
    }
  } catch (error) {
    console.error("Error removing multiple storage items:", error);
    throw error;
  }
};

/**
 * 플랫폼에 따라 모든 저장소 데이터를 삭제합니다.
 * Web: localStorage
 * Native: 여러 키를 개별적으로 삭제해야 함
 */
export const clearStorage = async (keys?: string[]): Promise<void> => {
  try {
    if (Platform.OS === "web") {
      if (keys && keys.length > 0) {
        keys.forEach((key) => localStorage.removeItem(key));
      } else {
        localStorage.clear();
      }
    } else {
      if (keys && keys.length > 0) {
        await Promise.all(keys.map((key) => SecureStore.deleteItemAsync(key)));
      } else {
        console.warn(
          "Native platform requires specific keys to clear. Please provide keys array.",
        );
      }
    }
  } catch (error) {
    console.error("Error clearing storage:", error);
    throw error;
  }
};

/**
 * 인증 관련 storage 정보를 삭제합니다.
 * recentSearches 등 사용자 편의 데이터는 유지됩니다.
 */
export const clearAuthData = async (
  userType?: "cust" | "store",
): Promise<void> => {
  const commonKeys = [
    "accessToken",
    "refreshToken",
    "accessTokenExpiresIn",
    "refreshTokenExpiresIn",
    "tokenType",
    "userType",
  ];

  let keysToRemove: string[] = [...commonKeys];

  if (!userType) {
    // userType이 지정되지 않은 경우 (로그인 페이지 접근 등) 모든 인증 정보 삭제
    keysToRemove = [
      ...commonKeys,
      "custCode",
      "hasLocation",
      "hasActCategory",
      "storeCode",
      "memberNm",
      "authorities",
      "memberId",
      "subscriptionNm",
      "storeAddress",
    ];
  } else if (userType === "cust") {
    // 고객 로그아웃
    keysToRemove = [...commonKeys, "custCode", "hasLocation", "hasActCategory"];
  } else if (userType === "store") {
    // 사업자 로그아웃
    keysToRemove = [
      ...commonKeys,
      "storeCode",
      "memberNm",
      "authorities",
      "memberId",
      "subscriptionNm",
      "storeAddress",
    ];
  }

  await removeMultipleItems(keysToRemove);
};
