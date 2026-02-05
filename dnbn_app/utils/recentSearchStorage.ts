import AsyncStorage from "@react-native-async-storage/async-storage";

const MAX_SEARCHES = 10;

// custCode별 key 생성
const getStorageKey = (custCode: string) => {
  return `recentSearches_${custCode}`;
};

// 검색어 저장
export const addRecentSearch = async (
  keyword: string,
  custCode: string,
): Promise<string[]> => {
  try {
    const key = getStorageKey(custCode);
    const existing = await getRecentSearches(custCode);

    const updated = [
      keyword,
      ...existing.filter((item) => item !== keyword),
    ].slice(0, MAX_SEARCHES);

    await AsyncStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error("검색어 저장 실패:", error);
    return [];
  }
};

// 검색어 불러오기
export const getRecentSearches = async (
  custCode: string,
): Promise<string[]> => {
  try {
    const key = getStorageKey(custCode);
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("검색어 불러오기 실패:", error);
    return [];
  }
};

// 개별 검색어 삭제
export const removeRecentSearch = async (
  keyword: string,
  custCode: string,
): Promise<string[]> => {
  try {
    const key = getStorageKey(custCode);
    const existing = await getRecentSearches(custCode);
    const updated = existing.filter((item) => item !== keyword);
    await AsyncStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error("검색어 삭제 실패:", error);
    return [];
  }
};

// 전체 검색어 삭제
export const clearRecentSearches = async (custCode: string): Promise<void> => {
  try {
    const key = getStorageKey(custCode);
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("검색어 전체 삭제 실패:", error);
  }
};
