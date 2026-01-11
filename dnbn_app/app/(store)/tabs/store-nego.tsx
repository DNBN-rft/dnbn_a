import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./store-nego.styles";

export default function StoreNego() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#ffffff" }} />
      )}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title} pointerEvents="none">
          네고 관리
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView>
        <View style={styles.negoProduct}>
          <View style={styles.productContainer}>
            <View style={styles.productImageContainer}>
              <Image
                style={styles.productImage}
                source={require('@/assets/images/logo.png')} />
            </View>

            <View style={styles.productInfoContainer}>
              <Text>아이패드 에어5 블루 64GB + 애플펜슬 2세대</Text>
              
              <View style={styles.priceContainer}>
                <View style={styles.registPriceContainer}>
                  <Text style={styles.registPriceText}>665,000원</Text>
                </View>

                <View style={styles.negoPriceContainer}>
                  <Text style={styles.negoPriceText}>
                    {/* <Ionicons name="arrow-forward"></Ionicons> */}
                  600,000원</Text>
                </View>
              </View>

              <View style={styles.statusContainer} >
                <Text style={styles.statusText}>대기</Text>
              </View>
            </View>
          </View>

          <View style={styles.cancelButtonContainer}>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>상세</Text>
            </TouchableOpacity>
          </View>
        </View>


        <View style={styles.negoProduct}>
          <View style={styles.productContainer}>
            <View style={styles.productImageContainer}>
              <Image
                style={styles.productImage}
                source={require('@/assets/images/logo.png')} />
            </View>

            <View style={styles.productInfoContainer}>
              <Text>아이패드 에어5 블루 64GB + 애플펜슬 2세대</Text>
              
              <View style={styles.priceContainer}>
                <View style={styles.registPriceContainer}>
                  <Text style={styles.registPriceText}>665,000원</Text>
                </View>

                <View style={styles.negoPriceContainer}>
                  <Text style={styles.negoPriceText}>
                    {/* <Ionicons name="arrow-forward"></Ionicons> */}
                  600,000원</Text>
                </View>
              </View>

              <View style={styles.statusContainer} >
                <Text style={styles.statusText}>대기</Text>
              </View>
            </View>
          </View>

          <View style={styles.cancelButtonContainer}>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>상세</Text>
            </TouchableOpacity>
          </View>
        </View>


        <View style={styles.negoProduct}>
          <View style={styles.productContainer}>
            <View style={styles.productImageContainer}>
              <Image
                style={styles.productImage}
                source={require('@/assets/images/logo.png')} />
            </View>

            <View style={styles.productInfoContainer}>
              <Text>아이패드 에어5 블루 64GB + 애플펜슬 2세대</Text>
              
              <View style={styles.priceContainer}>
                <View style={styles.registPriceContainer}>
                  <Text style={styles.registPriceText}>665,000원</Text>
                </View>

                <View style={styles.negoPriceContainer}>
                  <Text style={styles.negoPriceText}>
                    {/* <Ionicons name="arrow-forward"></Ionicons> */}
                  600,000원</Text>
                </View>
              </View>

              <View style={styles.statusContainer} >
                <Text style={styles.statusText}>대기</Text>
              </View>
            </View>
          </View>

          <View style={styles.cancelButtonContainer}>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>상세</Text>
            </TouchableOpacity>
          </View>
        </View>

        
        
      </ScrollView>


    </View>
  );
}
