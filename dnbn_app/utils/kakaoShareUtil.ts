import {
  shareCommerceTemplate,
  shareFeedTemplate,
} from "@react-native-kakao/share";

const WEB_BASE_URL = "https://dnbn-x5or.onrender.com";

const PRODUCT_SCREEN_MAP: Record<string, string> = {
  regular: "product-detail",
  sale: "sale-product-detail",
  nego: "nego-product-detail",
};

export async function shareProduct(params: {
  productCode: string;
  productNm: string;
  storeNm: string;
  price: number;
  discountPrice?: number;
  discountRate?: number;
  imageUrl?: string;
  type: string;
}) {
  const fallbackImage = `${WEB_BASE_URL}/default-product.png`;
  const imageUrl = params.imageUrl ?? fallbackImage;
  const screen = PRODUCT_SCREEN_MAP[params.type] ?? "product-detail";
  const link = {
    androidExecutionParams: {
      productCode: params.productCode,
      screen,
    },
    iosExecutionParams: {
      productCode: params.productCode,
      screen,
    },
    mobileWebUrl: `${WEB_BASE_URL}/product/${params.productCode}`, // 모바일인데 앱이 없을 경우 앱스토어로 연결
    webUrl: `${WEB_BASE_URL}/product/${params.productCode}`, // 웹일 경우 아임웹 페이지로 연결
  };

  await shareCommerceTemplate({
    template: {
      content: {
        title: params.productNm,
        imageUrl,
        link,
      },
      commerce: {
        productName: params.productNm,
        regularPrice: params.price,
        ...(params.discountPrice != null && {
          discountPrice: params.discountPrice,
        }),
        ...(params.discountRate != null && {
          discountRate: params.discountRate,
        }),
        currencyUnit: "원",
        currencyUnitPosition: 0,
      },
      buttons: [{ title: "앱에서 보기", link }],
    },
  });
}

export async function shareStore(params: {
  storeCode: string;
  storeNm: string;
  imageUrl?: string;
}) {
  const fallbackImage = `${WEB_BASE_URL}/default-store.png`;
  const imageUrl = params.imageUrl ?? fallbackImage;
  const link = {
    androidExecutionParams: {
      storeCode: params.storeCode,
      screen: "storeInfo",
    },
    iosExecutionParams: { storeCode: params.storeCode, screen: "storeInfo" },
    mobileWebUrl: `${WEB_BASE_URL}/store/${params.storeCode}`, // 모바일인데 앱이 없을 경우 앱스토어로 연결
    webUrl: `${WEB_BASE_URL}/store/${params.storeCode}`, // 웹일 경우 아임웹 페이지로 연결 
  };
  
  await shareFeedTemplate({
    template: {
      content: {
        title: params.storeNm,
        imageUrl,
        link,
      },
      buttons: [{ title: "앱에서 보기", link }],
    },
  });
}
