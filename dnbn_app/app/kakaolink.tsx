import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function KakaoLinkRedirect() {
  const { screen, productCode, storeCode } = useLocalSearchParams<{
    screen?: string;
    productCode?: string;
    storeCode?: string;
  }>();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (screen === "product-detail" && productCode) {
        router.replace({
          pathname: "/(guest)/product-detail",
          params: { productCode },
        });
      } else if (screen === "sale-product-detail" && productCode) {
        router.replace({
          pathname: "/(guest)/sale-product-detail",
          params: { productCode },
        });
      } else if (screen === "nego-product-detail" && productCode) {
        router.replace({
          pathname: "/(guest)/nego-product-detail",
          params: { productCode },
        });
      } else if (screen === "storeInfo" && storeCode) {
        router.replace({
          pathname: "/(guest)/storeInfo",
          params: { storeCode },
        });
      } else {
        router.replace("/");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return <View />;
}
