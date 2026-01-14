import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./detailnego.styles";

export default function DetailNegoProductPage() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff" }} />
      )}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>네고 상세</Text>
        <View style={styles.placeholder}></View>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.productDetailContainer}>
          <View style={styles.contentRow}>
            <View style={styles.productImagesContainer}>
              <View style={styles.productMetaContainer}>
                <Text style={styles.productStatus}>네고 진행 중</Text>
                <Text style={styles.registrationDate}>등록일: 2024.01.12</Text>
              </View>
              
              <View style={styles.mainImageContainer}>
                <TouchableOpacity
                  style={styles.mainImageButton}
                  onPress={() => {/*이전 이미지 함수 */}}
                >
                  <Ionicons name="chevron-back" size={24} color="#666" />
                </TouchableOpacity>
                
                <Image 
                  style={styles.productMainImage}
                  source={{ uri: 'https://via.placeholder.com/300' }}
                />
                
                <TouchableOpacity
                  style={styles.mainImageButton}
                  onPress={() => {/*다음 이미지 함수 */}}
                >
                  <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.productSubImages}>
                <Image 
                  style={styles.productSubImage}
                  source={{ uri: 'https://via.placeholder.com/80' }}
                />
                <Image 
                  style={styles.productSubImage}
                  source={{ uri: 'https://via.placeholder.com/80' }}
                />
                <Image 
                  style={styles.productSubImage}
                  source={{ uri: 'https://via.placeholder.com/80' }}
                />
              </View>
            </View>

            <View style={styles.productInfoContainer}>
              <Text style={styles.categoryName}>전자제품</Text>
              <Text style={styles.productName}>고급 무선 이어폰</Text>
              <Text style={styles.productPrice}>₩ 89,000</Text>
              <Text style={styles.productStock}>재고: 15개</Text>
              <Text style={styles.productDescription}>
                고음질 사운드를 제공하는 프리미엄 무선 이어폰입니다.
                노이즈 캔슬링 기능과 긴 배터리 수명을 자랑합니다.
              </Text>
            </View>
          </View>

          <View style={styles.productStatusContainer}>
            <View style={styles.statusInfoRow}>
              <Text style={styles.statusInfoTitle}>네고 기간</Text>
              <Text style={styles.statusInfoContent}>2024.01.12 10:00 ~ 2024.01.13 10:00</Text>
            </View>

            <View style={styles.statusInfoRow}>
              <Text style={styles.statusInfoTitle}>상품 구분</Text>
              <Text style={styles.statusInfoContent}>일반</Text>
            </View>

            <View style={styles.statusInfoRow}>
              <Text style={styles.statusInfoTitle}>상품 타입</Text>
              <Text style={styles.statusInfoContent}>일반</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}