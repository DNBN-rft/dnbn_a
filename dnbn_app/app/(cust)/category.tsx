import { Ionicons } from "@expo/vector-icons";
import { FlatList, Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./category.styles";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import Constants from "expo-constants";

interface FileInfo {
    originalName: string;
    fileUrl: string;
    order: number;
}

interface CategoryResponse {
    categoryIdx: number;
    categoryNm: string;
    fileMasterResponse: {
        files: FileInfo[];
    };
}

export default function CategoryScreen() {
    const insets = useSafeAreaInsets();
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://fallback-url:8080';

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/category`);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data: CategoryResponse[] = await response.json();
            setCategories(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : '카테고리 로드 실패');
            console.error('카테고리 로드 오류:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleCategory = (id: number) => {
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
                {loading && <Text style={{ textAlign: 'center', marginTop: 20 }}>로딩 중...</Text>}
                {error && <Text style={{ textAlign: 'center', marginTop: 20, color: 'red' }}>{error}</Text>}
                {!loading && !error && (
                    <FlatList
                        data={categories}
                        keyExtractor={(item) => item.categoryIdx.toString()}
                        numColumns={3}
                        scrollEnabled={true}
                        renderItem={({ item: category }) => (
                            <Pressable
                                style={[
                                    styles.categoryItem,
                                    selectedCategories.includes(category.categoryIdx) && styles.categoryItemSelected
                                ]}
                                onPress={() => toggleCategory(category.categoryIdx)}
                            >
                                <Image
                                    source={{
                                        uri: `${API_URL}${category.fileMasterResponse?.files?.[0]?.fileUrl || ''}`
                                    }}
                                    style={styles.categoryImage}
                                    resizeMode="contain"
                                />
                                <Text style={[
                                    styles.categoryText,
                                    selectedCategories.includes(category.categoryIdx) && styles.categoryTextSelected
                                ]}>
                                    {category.categoryNm}
                                </Text>
                            </Pressable>
                        )}
                    />
                )}
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