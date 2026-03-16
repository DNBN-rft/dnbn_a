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
  /** regular: 일반 상품, sale: 할인 상품, nego: 네고 상품 */
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
export async function shareProduct({
  productCode,
  productNm,
  storeNm,
  price,
  imageUrl,
  type,
}: ProductShareParams): Promise<void> {
  const screen = screenByType[type];
  const deepLinkParams = { screen, productCode };

  try {
    await shareCommerceTemplate({
      template: {
        content: {
          title: productNm,
          description: storeNm,
          imageUrl: imageUrl || DEFAULT_IMAGE_URL,
          link: {
            mobileWebUrl: FALLBACK_URL,
            webUrl: FALLBACK_URL,
            androidExecutionParams: deepLinkParams,
            iosExecutionParams: deepLinkParams,
          },
        },
        commerce: {
          regularPrice: price,
          currencyUnit: "원",
          currencyUnitPosition: 1,
        },
        buttons: [
          {
            title: "앱에서 보기",
            link: {
              mobileWebUrl: FALLBACK_URL,
              webUrl: FALLBACK_URL,
              androidExecutionParams: deepLinkParams,
              iosExecutionParams: deepLinkParams,
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error("카카오 상품 공유 오류:", error);
    Alert.alert("공유 실패", "카카오톡 공유에 실패했습니다.");
  }
}

/**
 * 매장 페이지를 카카오톡으로 공유합니다.
 * 공유 링크 클릭 시 앱이 설치된 경우 해당 매장 페이지로 이동합니다.
 */
export async function shareStore({
  storeCode,
  storeNm,
  imageUrl,
}: StoreShareParams): Promise<void> {
  const deepLinkParams = { screen: "storeInfo", storeCode };

  try {
    await shareFeedTemplate({
      template: {
        content: {
          title: storeNm,
          description: "동네방네 앱에서 매장을 확인해보세요!",
          imageUrl: imageUrl || DEFAULT_IMAGE_URL,
          link: {
            mobileWebUrl: FALLBACK_URL,
            webUrl: FALLBACK_URL,
            androidExecutionParams: deepLinkParams,
            iosExecutionParams: deepLinkParams,
          },
        },
        buttons: [
          {
            title: "앱에서 보기",
            link: {
              mobileWebUrl: FALLBACK_URL,
              webUrl: FALLBACK_URL,
              androidExecutionParams: deepLinkParams,
              iosExecutionParams: deepLinkParams,
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error("카카오 매장 공유 오류:", error);
    Alert.alert("공유 실패", "카카오톡 공유에 실패했습니다.");
  }
}
