import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./category.styles";

export default function CategoryScreen() {
    const insets = useSafeAreaInsets();
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const categories = [
        { id: "1", uri: require('@/assets/images/category/retail_goods.png'), name: "소매/잡화" },
        { id: "2", uri: require('@/assets/images/category/food_cafe.png'), name: "음식/카페" },
        { id: "3", uri: require('@/assets/images/category/beauty_health.png'), name: "뷰티/헬스" },
        { id: "4", uri: require('@/assets/images/category/life_service.png'), name: "생활서비스" },
        { id: "5", uri: require('@/assets/images/category/medical_health.png'), name: "의료/건강" },
        { id: "6", uri: require('@/assets/images/category/edu_hobby.png'), name: "교육/취미" },
        { id: "7", uri: require('@/assets/images/category/hostel_rental.png'), name: "숙박/랜탈" },
        { id: "8", uri: require('@/assets/images/category/service_pro.png'), name: "서비스/전문" },
        { id: "9", uri: require('@/assets/images/category/game_sport.png'), name: "오락/스포츠" },
        { id: "10", uri: require('@/assets/images/category/etc.png'), name: "기타" },
    ]

    const toggleCategory = (id: string) => {
        if (selectedCategories.includes(id)) {
            setSelectedCategories(selectedCategories.filter(cat => cat !== id));
        } else {
            setSelectedCategories([...selectedCategories, id]);
        }
    };

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
                <Text style={styles.title}>
                    관심 카테고리 설정
                </Text>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.categoryContainer}>
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id}
                    numColumns={3}
                    scrollEnabled={true}
                    renderItem={({ item: category }) => (
                        <Pressable
                            style={[
                                styles.categoryItem,
                                selectedCategories.includes(category.id) && styles.categoryItemSelected
                            ]}
                            onPress={() => toggleCategory(category.id)}
                        >
                            <Image source={category.uri} style={styles.categoryImage} resizeMode="contain" />
                            <Text style={[
                                styles.categoryText,
                                selectedCategories.includes(category.id) && styles.categoryTextSelected
                            ]}>
                                {category.name}
                            </Text>
                        </Pressable>
                    )}
                />
            </View>

            <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                    // 리뷰 제출 로직
                }}
            >
                <Text style={styles.submitButtonText}>저장</Text>
            </TouchableOpacity>
            {insets.bottom > 0 && (
                <View style={{ height: insets.bottom, backgroundColor: '#000' }} />
            )}
        </View>

    );
}