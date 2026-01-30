import { isWithinRange, calculateDistance } from "./locationUtils";

export interface Store {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  distance?: number;
}

export const TEST_STORES: Store[] = [
  {
    id: "test-1",
    name: "용인점",
    address: "경기도 용인시 기흥구 구성로 184",
    latitude: 37.29077309144749,
    longitude: 127.13013185986694,
    phone: "031-1111-1111",
  },
  {
    id: "test-2",
    name: "용인역점",
    address: "경기도 용인시 처인구 중부대로",
    latitude: 37.29155500046295,
    longitude: 127.12782692103407,
    phone: "031-2222-2222",
  },
  {
    id: "test-3",
    name: "기흥점",
    address: "경기도 용인시 기흥구 중심상가",
    latitude: 37.29150256069689,
    longitude: 127.12631562423036,
    phone: "031-3333-3333",
  },
  {
    id: "test-4",
    name: "백암 만다린",
    address: "경기도 용인시 처인구 백암면 백암로 100",
    latitude: 37.170682103830195,
    longitude: 127.37076993992747,
    phone: "031-4444-4444",
  },
  {
    id: "test-5",
    name: "백암 세븐일레븐",
    address: "경기도 용인시 수지구 수지로 50",
    latitude: 37.171968683256914,
    longitude: 127.37138425672894,
    phone: "031-5555-5555",
  },
];

//범위 내 가맹점을 필터링합니다
export const filterStoresInRange = (
  stores: Store[],
  latitude: number,
  longitude: number,
  threshold: number = 0.05
): Store[] => {
  return stores.filter(store =>
    isWithinRange(latitude, longitude, store.latitude, store.longitude, threshold)
  );
};

//가맹점에 거리 정보를 추가합니다
export const addDistanceToStores = (
  stores: Store[],
  latitude: number,
  longitude: number
): Store[] => {
  return stores.map(store => ({
    ...store,
    distance: calculateDistance(latitude, longitude, store.latitude, store.longitude),
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

//백엔드 API에서 가맹점을 조회합니다
export const fetchStoresFromAPI = async (
  latitude: number,
  longitude: number
): Promise<Store[]> => {
  try {
    const response = await fetch(
      `https://your-api.com/api/stores/nearby?latitude=${latitude}&longitude=${longitude}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (data.success && data.stores) {
      return data.stores;
    }

    return [];
  } catch (error) {
    console.error("Fetch stores from API error:", error);
    return [];
  }
};

//특정 좌표 주변의 가맹점을 조회합니다
export const fetchNearbyStores = async (
  latitude: number,
  longitude: number,
  threshold: number = 0.05
): Promise<Store[]> => {
  try {
    // TEST_STORES에서 범위 내 가맹점 필터링
    let stores = filterStoresInRange(TEST_STORES, latitude, longitude, threshold);

    // TEST_STORES에 없으면 백엔드 API 호출
    if (stores.length === 0) {
      stores = await fetchStoresFromAPI(latitude, longitude);
    }

    // 거리 정보 추가 및 정렬
    if (stores.length > 0) {
      stores = addDistanceToStores(stores, latitude, longitude);
      stores = sortStoresByDistance(stores);
    }

    return stores;
  } catch (error) {
    console.error("Fetch nearby stores error:", error);
    return [];
  }
};
