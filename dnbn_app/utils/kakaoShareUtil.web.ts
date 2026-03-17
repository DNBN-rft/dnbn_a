/**
 * 웹 환경에서는 카카오 공유 기능을 지원하지 않습니다.
 * Metro 빌드 시 이 파일이 kakaoShareUtil.ts 대신 사용됩니다.
 */

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

export async function shareProduct(_params: ProductShareParams): Promise<void> {
  // 웹에서는 카카오 공유 불가
}

export async function shareStore(_params: StoreShareParams): Promise<void> {
  // 웹에서는 카카오 공유 불가
}
