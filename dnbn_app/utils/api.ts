import {
  getStorageItem,
  removeMultipleItems,
  setStorageItem,
} from "@/utils/storageUtil";

//소윤: 67, 형운: 68, 진용: 136
export const API_BASE_URL = "http://192.168.0.136:8080/api";

// 토큰 갱신 중인지 추적
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}[] = [];

// 토큰 만료 시 공통 처리
const handleTokenExpired = async () => {
  await removeMultipleItems(["accessToken", "refreshToken"]);
  // TODO: 로그인 페이지로 리다이렉트
};

// 대기 중인 요청 처리
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  isRefreshing = false;
  failedQueue = [];
};

// 401 응답 처리
const handle401Response = async (
  url: string,
  options: RequestInit,
): Promise<Response> => {
  if (!isRefreshing) {
    isRefreshing = true;
    try {
      const refreshToken = await getStorageItem("refreshToken");
      const userType = await getStorageItem("userType");
      const custCode = await getStorageItem("custCode");

      // userType에 따라 다른 엔드포인트 사용
      const refreshEndpoint =
        userType === "cust" ? "/cust/refresh" : "/store/app/refresh";

      // cust 사용자는 custCode도 함께 전송
      const refreshBody =
        userType === "cust" ? { refreshToken, custCode } : { refreshToken };

      const refreshResponse = await fetch(`${API_BASE_URL}${refreshEndpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(refreshBody),
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        await setStorageItem("accessToken", data.accessToken);
        processQueue(null, data.accessToken);

        const newOptions = {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${data.accessToken}`,
          },
        };
        return fetch(url, newOptions);
      } else {
        processQueue(new Error("Token refresh failed"), null);
        isRefreshing = false;
        await handleTokenExpired();
        return refreshResponse;
      }
    } catch (error) {
      processQueue(error as Error, null);
      isRefreshing = false;
      await handleTokenExpired();
      throw error;
    }
  } else {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then(async () => {
      const token = await getStorageItem("accessToken");
      const newOptions = {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      };
      return fetch(url, newOptions);
    });
  }
};

/**
 * API 요청 래퍼 함수
 */
const apiCall = async (
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> => {
  const url = `${API_BASE_URL}${endpoint}`;
  // TODO: 로그인 연동 후 활성화
  const token = await getStorageItem("accessToken");

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      // TODO: 로그인 연동 후 활성화
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  try {
    let response = await fetch(url, defaultOptions);

    // TODO: 로그인 연동 후 활성화
    if (response.status === 401) {
      response = await handle401Response(url, defaultOptions);
    }

    return response;
  } catch (error) {
    console.error("API 요청 실패:", error);
    throw error;
  }
};

export const apiGet = async (
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> => {
  return apiCall(endpoint, {
    ...options,
    method: "GET",
  });
};

export const apiPost = async (
  endpoint: string,
  data: any = null,
  options: RequestInit = {},
): Promise<Response> => {
  return apiCall(endpoint, {
    ...options,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
};

export const apiPut = async (
  endpoint: string,
  data: any = null,
  options: RequestInit = {},
): Promise<Response> => {
  return apiCall(endpoint, {
    ...options,
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
};

export const apiDelete = async (
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> => {
  return apiCall(endpoint, {
    ...options,
    method: "DELETE",
  });
};

export const apiPostFormDataWithImage = async (
  endpoint: string,
  formData: FormData,
  options: RequestInit = {},
): Promise<Response> => {
  const url = `${API_BASE_URL}${endpoint}`;

  // 기본 헤더 설정 (Content-Type 제외 - FormData가 자동으로 multipart/form-data로 설정)
  const defaultHeaders: HeadersInit = {};

  // options.headers에서 명시적인 Content-Type을 제거
  const customHeaders = (options.headers as Record<string, string>) || {};
  const filteredHeaders = Object.keys(customHeaders)
    .filter((key) => key.toLowerCase() !== "content-type")
    .reduce(
      (acc, key) => {
        acc[key] = customHeaders[key];
        return acc;
      },
      {} as Record<string, string>,
    );

  const defaultOptions: RequestInit = {
    ...options,
    method: "POST",
    body: formData,
    headers: {
      ...defaultHeaders,
      ...filteredHeaders,
    },
  };

  try {
    const response = await fetch(url, defaultOptions);
    return response;
  } catch (error) {
    console.error("API 요청 실패:", error);
    throw error;
  }
};

export const apiPutFormDataWithImage = async (
  endpoint: string,
  formData: FormData,
  options: RequestInit = {},
): Promise<Response> => {
  const url = `${API_BASE_URL}${endpoint}`;

  // 기본 헤더 설정 (Content-Type 제외 - FormData가 자동으로 multipart/form-data로 설정)
  const defaultHeaders: HeadersInit = {};

  // options.headers에서 명시적인 Content-Type을 제거
  const customHeaders = (options.headers as Record<string, string>) || {};
  const filteredHeaders = Object.keys(customHeaders)
    .filter((key) => key.toLowerCase() !== "content-type")
    .reduce(
      (acc, key) => {
        acc[key] = customHeaders[key];
        return acc;
      },
      {} as Record<string, string>,
    );

  const defaultOptions: RequestInit = {
    ...options,
    method: "PUT",
    body: formData,
    headers: {
      ...defaultHeaders,
      ...filteredHeaders,
    },
  };

  try {
    const response = await fetch(url, defaultOptions);
    return response;
  } catch (error) {
    console.error("API 요청 실패:", error);
    throw error;
  }
};

const apiClient = {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiPostFormDataWithImage,
  apiPutFormDataWithImage,
  API_BASE_URL,
};

export default apiClient;
