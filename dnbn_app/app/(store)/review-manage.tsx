import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./review-manage.style";


export default function ReviewManage() {
  const insets = useSafeAreaInsets();
  
  const reviewList = [
    {
      id: "1",
      productImage: require('@/assets/images/image1.jpg'),
      category: "음료",
      productName: "아메리카노",
      rating: 5.0,
      date: "2026.01.10",
      reviewContent: "정말 맛있어요! 커피 향이 진하고 깔끔합니다. 매장 분위기도 좋고 다음에 또 방문하고 싶어요.",
      userName: "김진용",
      isHidden: false,
      hasAnswer: false,
    },
    {
      id: "2",
      productImage: require('@/assets/images/image1.jpg'),
      category: "디저트",
      productName: "초콜릿 케이크",
      rating: 4.2,
      date: "2026.01.09",
      reviewContent: "달콤하고 부드러운 케이크였습니다. 다만 가격이 조금 비싼 것 같아요.",
      userName: "박소윤",
      isHidden: false,
      hasAnswer: true,
    },
    {
      id: "3",
      productImage: require('@/assets/images/image1.jpg'),
      category: "음료",
      productName: "카페라떼",
      rating: 3.4,
      date: "2026.01.08",
      reviewContent: "보통이었어요. 특별히 나쁘지도 좋지도 않았습니다.",
      userName: "전형운",
      isHidden: true,
      hasAnswer: false,
    },
    {
      id: "4",
      productImage: require('@/assets/images/image1.jpg'),
      category: "베이커리",
      productName: "크루아상",
      rating: 5.0,
      date: "2026.01.07",
      reviewContent: "겉은 바삭하고 속은 촉촉한 완벽한 크루아상입니다. 아침 식사로 최고예요!",
      userName: "이민준",
      isHidden: false,
      hasAnswer: true,
    },
  ];
  
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
        <Text style={styles.title} pointerEvents="none">
          리뷰 관리
        </Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={reviewList}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.reviewContainer}>
            <View style={styles.reviewInfoContainer}>
              <View style={styles.reviewImageContainer}>
                <Image
                  source={item.productImage}
                  style={styles.reviewImage}
                />
              </View>
              
              <View style={styles.reviewDetails}>
                <View>
                  <Text style={styles.categoryText}>{item.category}</Text>
                  <Text style={styles.productNameText}>{item.productName}</Text>
                </View>

                <View>
                  <View style={styles.reviewHeader}>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                    <Text style={styles.dateText}>{item.date}</Text>
                  </View>

                  <View>
                    <Text style={styles.userNameText}>{item.userName}</Text>
                    <Text style={styles.reviewContentText} numberOfLines={2} ellipsizeMode="tail">
                      {item.reviewContent}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {item.isHidden && (
              <View style={styles.hideInfoContainer}>
                <Ionicons name="information-circle-outline" size={14} color="#999" />
                <Text style={styles.hideInfoText}>이전에 숨김 요청했던 리뷰입니다.</Text>
              </View>
            )}

            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={[styles.answerButtonContainer, item.hasAnswer && styles.answeredButton]}
              >
                <Text style={[styles.answerButtonText, item.hasAnswer && styles.answeredButtonText]}>
                  {item.hasAnswer ? "답변 완료" : "답변하기"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.hideButtonContainer, item.isHidden && styles.hiddenButton]}
              >
                <Text style={[styles.hideButtonText, item.isHidden && styles.hiddenButtonText]}>
                  {item.isHidden ? "숨김 해제" : "숨김"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
{insets.bottom > 0 && (
                <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
            )}
    </View>
  );
}