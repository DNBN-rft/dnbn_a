import { apiGet } from "../api";
import { calculateDistance, isWithinRange } from "./locationUtils";

export interface Store {
  id: string;
  storeCode?: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  distance?: number;
  imageUrl?: string;
  reviewAvg?: number;
  reviewCount?: number;
  category?: string;
  recentProducts?: {
    id: string;
    productCode?: string;
    imageUrl?: string;
    name?: string;
    price?: number;
    nego?: boolean;
    sale?: boolean;
  }[];
}

export const TEST_STORES: Store[] = [
  {
    id: "test-1",
    name: "용인점",
    address: "경기도 용인시 기흥구 구성로 184",
    latitude: 37.29077309144749,
    longitude: 127.13013185986694,
    phone: "031-1111-1111",
    reviewAvg: 4.5,
    reviewCount: 120,
    category: "편의점",
  },
  {
    id: "test-2",
    name: "용인역점",
    address: "경기도 용인시 처인구 중부대로",
    latitude: 37.29155500046295,
    longitude: 127.12782692103407,
    phone: "031-2222-2222",
    reviewAvg: 4.0,
    reviewCount: 85,
    category: "편의점",
  },
  {
    id: "test-3",
    name: "기흥점",
    address: "경기도 용인시 기흥구 중심상가",
    latitude: 37.29150256069689,
    longitude: 127.12631562423036,
    phone: "031-3333-3333",
    reviewAvg: 3.8,
    reviewCount: 60,
    category: "편의점",
  },
  {
    id: "test-4",
    name: "백암 만다린",
    address: "경기도 용인시 처인구 백암면 백암로 100",
    latitude: 37.170682103830195,
    longitude: 127.37076993992747,
    phone: "031-4444-4444",
    reviewAvg: 4.2,
    reviewCount: 90,
    category: "중식당",
  },
  {
    id: "test-5",
    name: "백암 세븐일레븐",
    address: "경기도 용인시 수지구 수지로 50",
    latitude: 37.171968683256914,
    longitude: 127.37138425672894,
    phone: "031-5555-5555",
    reviewAvg: 4.0,
    reviewCount: 75,
    category: "편의점",
  },
];

//범위 내 가맹점을 필터링합니다
export const filterStoresInRange = (
  stores: Store[],
  latitude: number,
  longitude: number,
  threshold: number = 0.05,
): Store[] => {
  return stores.filter((store) =>
    isWithinRange(
      latitude,
      longitude,
      store.latitude,
      store.longitude,
      threshold,
    ),
  );
};

//가맹점에 거리 정보를 추가합니다
export const addDistanceToStores = (
  stores: Store[],
  latitude: number,
  longitude: number,
): Store[] => {
  return stores.map((store) => ({
    ...store,
    distance: calculateDistance(
      latitude,
      longitude,
      store.latitude,
      store.longitude,
    ),
  }));
};

//가맹점을 거리순으로 정렬합니다
export const sortStoresByDistance = (stores: Store[]): Store[] => {
  return [...stores].sort((a, b) => {
    if (a.distance === undefined) return 1;
    if (b.distance === undefined) return -1;
    return a.distance - b.distance;
  });
};

//백엔드 API에서 주변 가맹점 목록을 조회합니다
export const fetchNearbyStores = async (
  latitude: number,
  longitude: number,
): Promise<Store[]> => {
  try {
    const response = await apiGet(
      `/map-stores?lat=${latitude}&lng=${longitude}`,
    );
    if (!response.ok) return [];
    const data = await response.json();
    const stores: Store[] = (data ?? []).map((item: any) => ({
      id: String(item.storeCode),
      storeCode: String(item.storeCode),
      name: item.storeNm ?? "",
      address: item.storeAddrDetail
        ? `${item.storeAddr} ${item.storeAddrDetail}`
        : (item.storeAddr ?? ""),
      latitude: item.storeLat,
      longitude: item.storeLng,
      imageUrl: item.storeMainImg?.files?.[0]?.fileUrl ?? undefined,
      reviewAvg: item.reviewRatioAvg ?? undefined,
      reviewCount: item.reviewCnt ?? undefined,
      category: item.bizType ?? undefined,
      // 백엔드 distance는 미터(m) 단위, calculateDistance는 km 단위 → m를 km로 변환
      distance: item.distance != null ? item.distance / 1000 : calculateDistance(latitude, longitude, item.storeLat, item.storeLng),
    }));
    return stores.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  } catch (error) {
    console.error("fetchNearbyStores error:", error);
    return [];
  }
};

//특정 가맹점 상세 정보를 조회합니다 (phone, recentProducts 포함)
export const fetchStoreDetail = async (
  storeCode: string,
  latitude: number,
  longitude: number,
): Promise<Partial<Store> | null> => {
  try {
    const response = await apiGet(
      `/map-store/${storeCode}?lat=${latitude}&lng=${longitude}`,
    );
    if (!response.ok) return null;
    const item = await response.json();
    return {
      phone: item.storeTelNo ?? undefined,
      recentProducts: (item.productList ?? []).map((p: any) => ({
        id: String(p.productCode),
        productCode: String(p.productCode),
        name: p.productNm ?? undefined,
        price: p.productPrice ?? undefined,
        imageUrl: p.productMainImg?.files?.[0]?.fileUrl ?? undefined,
        nego: p.nego ?? false,
        sale: p.sale ?? false,
      })),
    };
  } catch (error) {
    console.error("fetchStoreDetail error:", error);
    return null;
  }
};
