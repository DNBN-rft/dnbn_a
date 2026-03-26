// 이미지 파일 타입
export interface FileInfo {
  originalName: string;
  fileUrl: string;
  order: number;
}

export interface FileMasterResponse {
  files: FileInfo[];
}

// 할인 상품 타입
export type SaleType = "RATE" | "AMOUNT";
export type SaleStatus = "ONGOING" | "UPCOMING";

export interface SaleProduct {
  productImage: FileMasterResponse;
  productCode: string;
  productNm: string;
  originalPrice: number;
  saleValue: number;
  discountedPrice: number;
  saleType: SaleType;
  saleStatus: SaleStatus;
  startDateTime: string;
  endDateTime: string;
}

// 네고 상품 타입
export type NegoStatus = "ONGOING" | "UPCOMING";

export interface NegoProduct {
  productImage: FileMasterResponse;
  productCode: string;
  productNm: string;
  productPrice: number;
  negoStatus: NegoStatus;
  startDateTime: string;
  endDateTime: string;
  categoryNm: string;
}

// 일반 상품 타입
export interface Product {
  productImage: FileMasterResponse;
  productCode: string;
  productNm: string;
  productPrice: number;
  isNego: boolean;
  isSale: boolean;
  averageReviewRating: number;
  reviewCount: number;
}

// 리뷰 타입
export interface Review {
  reviewImage: FileMasterResponse;
  custNick: string;
  reviewProductCode: string;
  reviewRate: number;
  regDateTime: string;
  reviewContent: string;
  productNm: string;
  reviewAnswerContent?: string | null;
}

// 매장 기본 정보 API 응답 타입
export interface StoreInfoResponse {
  storeImage: FileMasterResponse;
  storeCode: string;
  storeNm: string;
  storeTel: string;
  storeAddress: string;
  totalProductCount: number;
  totalSaleProductCount: number;
  totalNegoProductCount: number;
  totalReviewCount: number;
  averageReviewRating: number;
  products: Product[];
  hasMoreProducts: boolean;
  isWishStore: boolean;
}

// 상품 목록 페이지네이션 응답
export interface ProductsPageResponse {
  content: Product[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// 할인 상품 목록 페이지네이션 응답
export interface SaleProductsPageResponse {
  content: SaleProduct[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// 네고 상품 목록 페이지네이션 응답
export interface NegoProductsPageResponse {
  content: NegoProduct[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// 리뷰 목록 페이지네이션 응답
export interface ReviewsPageResponse {
  content: Review[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
