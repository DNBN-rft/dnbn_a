import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./nego-history-detail.styles";

export default function NegoHistoryDetailPage() {
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

        <Text style={styles.title}>네고 이력 상세</Text>
        <View style={styles.placeholder}></View>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.productDetailContainer}>
          <View style={styles.contentRow}>
            <View style={styles.productImagesContainer}>
              <View style={styles.productMetaContainer}>
                <Text style={styles.productStatus}>완료</Text>
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
                  source={require('@/assets/images/image1.jpg')}
                  resizeMode="contain"
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
                  source={require('@/assets/images/image1.jpg')}
                />
                <Image 
                  style={styles.productSubImage}
                  source={require('@/assets/images/image1.jpg')}
                />
                <Image 
                  style={styles.productSubImage}
                  source={require('@/assets/images/image1.jpg')}
                />
              </View>
            </View>

            <View style={styles.productInfoContainer}>
              <Text style={styles.categoryName}>음료</Text>
              <Text style={styles.productName}>아메리카노</Text>
              <Text style={styles.productPrice}>₩ 4,500</Text>
              <Text style={styles.productStock}>재고: 20개</Text>
              <Text style={styles.productDescription}>
                고급 원두로 만든 프리미엄 아메리카노입니다.
                깊고 진한 커피 향이 일품입니다.
              </Text>
            </View>
          </View>

          <View style={styles.productStatusContainer}>
            <View style={styles.statusInfoRow}>
              <Text style={styles.statusInfoTitle}>네고 기간</Text>
              <Text style={styles.statusInfoContent}>2024.01.10 10:00 ~ 2024.01.12 10:00</Text>
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
