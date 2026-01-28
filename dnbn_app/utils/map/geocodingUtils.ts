const KAKAO_REST_API_KEY = "4739cdd728a97e32f1ad213ae111e099";

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface KakaoAddressDocument {
  address_name: string;
  x: string; // longitude
  y: string; // latitude
  road_address?: {
    address_name: string;
  };
}

export interface KakaoCoord2AddressDocument {
  road_address?: {
    address_name: string;
  };
  address?: {
    address_name: string;
  };
}

//Kakao API 요청 헤더를 생성합니다
export const createKakaoHeaders = (): Record<string, string> => {
  return {
    Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
  };
};

// Kakao 주소 검색 API를 호출합니다
export const searchKakaoAddress = async (address: string): Promise<KakaoAddressDocument[]> => {
  const response = await fetch(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
    {
      headers: createKakaoHeaders(),
    }
  );
  const data = await response.json();
  return data.documents || [];
};

// Kakao 좌표를 주소로 변환 API를 호출합니다
export const searchKakaoCoordToAddress = async (
  longitude: number,
  latitude: number
): Promise<KakaoCoord2AddressDocument[]> => {
  const response = await fetch(
    `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}`,
    {
      headers: createKakaoHeaders(),
    }
  );
  const data = await response.json();
  return data.documents || [];
};

// 주소를 좌표로 변환합니다 (Geocoding)
export const geocodeAddress = async (address: string): Promise<GeocodingResult | null> => {
  try {
    const documents = await searchKakaoAddress(address);

    if (documents.length > 0) {
      const location = documents[0];
      const latitude = parseFloat(location.y);
      const longitude = parseFloat(location.x);

      return {
        latitude,
        longitude,
        address: location.address_name,
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

// 좌표를 주소로 변환합니다 (Reverse Geocoding)
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  try {
    const documents = await searchKakaoCoordToAddress(longitude, latitude);

    if (documents.length > 0) {
      const roadAddress =
        documents[0].road_address?.address_name ||
        documents[0].address?.address_name ||
        "주소를 찾을 수 없습니다";

      return roadAddress;
    }
    return "주소를 찾을 수 없습니다";
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return "주소 조회 실패";
  }
};
