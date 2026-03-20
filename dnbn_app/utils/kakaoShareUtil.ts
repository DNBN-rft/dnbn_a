import {
  shareCommerceTemplate,
  shareFeedTemplate,
} from "@react-native-kakao/share";
import { Alert } from "react-native";

/** 카카오 공유 링크 클릭 시 앱이 없을 때 열리는 대체 웹 URL */
const FALLBACK_URL = "https://dnbn-x5or.onrender.com";

/** 이미지가 없을 때 사용할 기본 이미지 (Kakao는 imageUrl 필수) */
const DEFAULT_IMAGE_URL =
  "https://developers.kakao.com/tool/resource/static/img/button/kakaolink/kakaolink_btn_medium.png";

export type ProductShareType = "regular" | "sale" | "nego";

export interface ProductShareParams {
  productCode: string;
  productNm: string;
  storeNm: string;
  price: number;
  imageUrl?: string;
  type: ProductShareType;
}

export interface StoreShareParams {
  storeCode: string;
  storeNm: string;
  imageUrl?: string;
}

const screenByType: Record<ProductShareType, string> = {
  regular: "product-detail",
  sale: "sale-product-detail",
  nego: "nego-product-detail",
};

/**
 * 상품 페이지를 카카오톡으로 공유합니다.
 * 공유 링크 클릭 시 앱이 설치된 경우 해당 상품 상세 페이지로 이동합니다.
 */

/**
 * 매장 페이지를 카카오톡으로 공유합니다.
 * 공유 링크 클릭 시 앱이 설치된 경우 해당 매장 페이지로 이동합니다.
 */
