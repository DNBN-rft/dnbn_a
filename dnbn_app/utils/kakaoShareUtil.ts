import { shareListTemplate } from "@react-native-kakao/share";

export async function shareProduct(params: {
  productCode: string;
  productNm: string;
  storeNm: string;
  price: number;
  imageUrl?: string;
  type: string;
}) {
  const fallbackImage = "https://your-domain.com/default-product.png"; // 기본 이미지 URL로 교체
  const imageUrl = params.imageUrl ?? fallbackImage;
  const link = {
    androidExecutionParams: {
      productCode: params.productCode,
      type: params.type,
    },
    iosExecutionParams: { productCode: params.productCode, type: params.type },
    mobileWebUrl: `https://your-domain.com/product/${params.productCode}`,
    webUrl: `https://your-domain.com/product/${params.productCode}`,
  };

  await shareListTemplate({
    template: {
      headerTitle: "지금 이 상품 어때요?",
      headerLink: link,
      contents: [
        {
          title: params.productNm,
          description: `${params.price.toLocaleString()}원`,
          imageUrl,
          link,
        },
        {
          title: params.storeNm,
          description: "매장 바로가기",
          imageUrl,
          link,
        },
      ],
      buttons: [
        {
          title: "앱에서 보기",
          link,
        },
      ],
    },
  });
}
