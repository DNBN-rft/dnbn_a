import { apiGet, apiPost } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./category.styles";

interface FileItem {
  originalName: string;
  fileUrl: string;
  order: number;
}

interface FileMasterResponse {
  files: FileItem[];
}

interface CategoryResponse {
  categoryIdx: number;
  categoryNm: string;
  fileMasterResponse: FileMasterResponse;
  isActive: boolean;
}

export default function CategoryScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await apiGet("/category/cust?custCode=CUST_001");

      if (response.ok) {
        const data: CategoryResponse[] = await response.json();
        setCategories(data);

        const activeCategories = data
          .filter((cat) => cat.isActive)
          .map((cat) => cat.categoryIdx.toString());
        setSelectedCategories(activeCategories);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (id: string) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const handleSave = async () => {
    try {
      const categoryIdxList = selectedCategories.map((id) => Number(id));

      const response = await apiPost("/category/active", {
        custCode: "CUST_001",
        categoryIdxList: categoryIdxList,
      });

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.success) {
          if (Platform.OS === "web") {
            window.alert(responseData.message);
            router.back();
          } else {
            Alert.alert("완료", responseData.message, [
              {
                text: "확인",
                onPress: () => {
                  router.back();
                },
              },
            ]);
          }
        } else {
          if (Platform.OS === "web") {
            window.alert(responseData.message);
          } else {
            Alert.alert("오류", responseData.message);
          }
        }
      } else {
        if (Platform.OS === "web") {
          window.alert("카테고리 저장에 실패했습니다");
        } else {
          Alert.alert("오류", "카테고리 저장에 실패했습니다");
        }
      }
    } catch (error) {
      if (Platform.OS === "web") {
        window.alert("카테고리 저장 중 오류가 발생했습니다");
      } else {
        Alert.alert("오류", "카테고리 저장 중 오류가 발생했습니다");
      }
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
        <Text style={styles.title}>관심 카테고리 설정</Text>
        <View style={styles.placeholder} />
      </View>

      {loading ? (
        <View style={styles.categoryContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#999" />
          <Text style={styles.emptyText}>서버 오류가 발생했습니다</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={fetchCategories}
          >
            <Ionicons name="refresh" size={20} color="#EF7810" />
            <Text style={styles.refreshButtonText}>새로고침</Text>
          </TouchableOpacity>
        </View>
      ) : categories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="grid-outline" size={60} color="#999" />
          <Text style={styles.emptyText}>불러올 카테고리 정보가 없습니다</Text>
        </View>
      ) : (
        <View style={styles.categoryContainer}>
          <FlatList
            data={categories}
            keyExtractor={(item) => item.categoryIdx.toString()}
            numColumns={3}
            scrollEnabled={true}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={({ item: category }) => (
              <Pressable
                style={[
                  styles.categoryItem,
                  selectedCategories.includes(
                    category.categoryIdx.toString(),
                  ) && styles.categoryItemSelected,
                ]}
                onPress={() => toggleCategory(category.categoryIdx.toString())}
              >
                {category.fileMasterResponse?.files &&
                category.fileMasterResponse.files.length > 0 ? (
                  <Image
                    source={{
                      uri: category.fileMasterResponse.files[0].fileUrl,
                    }}
                    style={styles.categoryImage}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.categoryImage} />
                )}
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategories.includes(
                      category.categoryIdx.toString(),
                    ) && styles.categoryTextSelected,
                  ]}
                >
                  {category.categoryNm}
                </Text>
              </Pressable>
            )}
          />
        </View>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
        <Text style={styles.submitButtonText}>저장</Text>
      </TouchableOpacity>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
