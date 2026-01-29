/**
 * API 사용 예시
 * utils/api.ts 사용법
 */

import { apiDelete, apiGet, apiPost, apiPut } from "./api";

// ============================================
// GET 요청 예시
// ============================================
export const getProductList = async () => {
  try {
    const response = await apiGet("/products");

    if (response.ok) {
      const data = await response.json();
      console.log("상품 목록:", data);
      return data;
    } else {
      console.error("요청 실패:", response.status);
      return null;
    }
  } catch (error) {
    console.error("에러 발생:", error);
    return null;
  }
};

// ============================================
// POST 요청 예시
// ============================================
export const createProduct = async () => {
  try {
    const newProduct = {
      name: "신상품",
      price: 10000,
      description: "상품 설명",
    };

    const response = await apiPost("/products", newProduct);

    if (response.ok) {
      const data = await response.json();
      console.log("생성된 상품:", data);
      return data;
    } else {
      console.error("생성 실패:", response.status);
      return null;
    }
  } catch (error) {
    console.error("에러 발생:", error);
    return null;
  }
};

// ============================================
// PUT 요청 예시
// ============================================
export const updateProduct = async () => {
  try {
    const productId = "1";
    const updateData = {
      name: "수정된 상품명",
      price: 15000,
    };

    const response = await apiPut(`/products/${productId}`, updateData);

    if (response.ok) {
      const data = await response.json();
      console.log("수정된 상품:", data);
      return data;
    } else {
      console.error("수정 실패:", response.status);
      return null;
    }
  } catch (error) {
    console.error("에러 발생:", error);
    return null;
  }
};

// ============================================
// DELETE 요청 예시
// ============================================
export const deleteProduct = async () => {
  try {
    const productId = "1";
    const response = await apiDelete(`/products/${productId}`);

    if (response.ok) {
      console.log("삭제 완료");
      return true;
    } else {
      console.error("삭제 실패:", response.status);
      return false;
    }
  } catch (error) {
    console.error("에러 발생:", error);
    return false;
  }
};
