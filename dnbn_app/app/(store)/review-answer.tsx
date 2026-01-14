import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./review-answer.style";


const reviewData =
{
  id: "1",
  productImage: require('@/assets/images/image1.jpg'),
  reviewImages: [
    require('@/assets/images/image1.jpg'),
    require('@/assets/images/image1.jpg'),
    require('@/assets/images/image1.jpg'),
  ],
  category: "음료",
  productName: "아메리카노",
  rating: 5,
  date: "2026.01.10",
  reviewContent: "정말 맛있어요! 커피 향이 진하고 깔끔합니다. 매장 분위기도 좋고 다음에 또 방문하고 싶어요.",
  userName: "김진용",
  reviewAnswerContent: null,
};

export default function ReviewAnswer() {
  const insets = useSafeAreaInsets();
  // reviewAnswerContent가 null이 아니면 등록된 상태(true), null이면 등록 전(false)
  const [isRegist, setIsRegist] = useState(reviewData.reviewAnswerContent !== null);
  const [answerText, setAnswerText] = useState(reviewData.reviewAnswerContent || "");

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff"}} />
      )}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>
          리뷰 답변
        </Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView >
            <View style={styles.reviewAnswerContainer}>
              <View style={styles.reviewContainer}>
                <View style={styles.reviewInfoContainer}>
                  <View style={styles.reviewDetails}>
                    <View>
                      <Text style={styles.categoryText}>{reviewData.category}</Text>

                      <Text style={styles.productNameText}>{reviewData.productName}</Text>
                    </View>

                    <View>
                      <View style={styles.reviewHeader}>
                        <View style={styles.ratingContainer}>
                          <Ionicons name="star" size={14} color="#FFD700" />

                          <Text style={styles.ratingText}>{reviewData.rating}</Text>
                        </View>

                        <Text style={styles.dateText}>{reviewData.date}</Text>
                      </View>

                      <View>
                        <Text style={styles.userNameText}>{reviewData.userName}</Text>

                        <Text style={styles.reviewContentText}>
                          {reviewData.reviewContent}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* 리뷰 이미지들 */}
                <View style={styles.reviewImagesContainer}>
                  {reviewData.reviewImages.map((imageSource, index) => (
                    <Image key={index} source={imageSource} style={styles.reviewImageItem} />
                  ))}
                </View>
              </View>

              {/* 답변 입력 영역 */}
              <View style={styles.answerContainer}>
                <View style={styles.answerContentContainer}>
                  {isRegist ? (
                    // 등록된 답변 표시
                    <Text style={styles.answerContentText}>{answerText}</Text>
                  ) : (
                    // 답변 작성 입력
                    <TextInput
                      style={styles.answerContentInput}
                      placeholder="답변을 작성해주세요"
                      placeholderTextColor={"#777"}
                      multiline
                      textAlignVertical="top"
                      value={answerText}
                      onChangeText={setAnswerText}
                    />
                  )}
                </View>

                <View style={styles.buttonsContainer}>
                  {isRegist ? (
                    // 수정 & 취소 버튼 (등록된 상태)
                    <View style={styles.buttonsContainer}>
                      <TouchableOpacity
                        style={styles.registerButton}
                        onPress={() => setIsRegist(false)}  
                      >
                        <Text style={styles.registerButtonText}>수정</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>취소</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    // 등록 버튼만 (등록 전 상태)
                    <TouchableOpacity 
                      style={styles.registerButton}
                      onPress={() => setIsRegist(true)}
                    >
                      <Text style={styles.registerButtonText}>등록</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  )
}