import { apiGet, apiPost } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
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
  const [isInitialSetup, setIsInitialSetup] = useState(false);

  useEffect(() => {
    fetchCategories();
    checkInitialSetup();
  }, []);

  // 최초 설정인지 확인 및 알림
  useEffect(() => {
    const showInitialSetupAlert = async () => {
      let hasActCategory = false;
      if (Platform.OS === "web") {
        hasActCategory = localStorage.getItem("hasActCategory") === "true";
      } else {
        const value = await SecureStore.getItemAsync("hasActCategory");
        hasActCategory = value === "true";
      }

      if (!hasActCategory) {
        if (Platform.OS === "web") {
          window.alert("카테고리 정보가 없어요 관심 카테고리를 설정해주세요");
        } else {
          Alert.alert(
            "알림",
            "카테고리 정보가 없어요 관심 카테고리를 설정해주세요",
          );
        }
      }
    };

    showInitialSetupAlert();
  }, []);

  // 하드웨어 뒤로가기 버튼 처리
  useEffect(() => {
    if (!isInitialSetup) return;

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleBack();
        return true; // 기본 동작 방지
      },
    );

    return () => backHandler.remove();
  }, [isInitialSetup]);

  const checkInitialSetup = async () => {
    if (Platform.OS === "web") {
      const hasActCategory = localStorage.getItem("hasActCategory");
      // hasActCategory가 "false"면 최초 설정
      setIsInitialSetup(hasActCategory === "false");
    } else {
      const hasActCategory = await SecureStore.getItemAsync("hasActCategory");
      setIsInitialSetup(hasActCategory === "false");
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await apiGet("/category/cust");

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

  const handleSelectAll = () => {
    const allCategoryIds = categories.map((cat) => cat.categoryIdx.toString());
    setSelectedCategories(allCategoryIds);
  };

  const handleDeselectAll = () => {
    setSelectedCategories([]);
  };

  const handleSave = async () => {
    if (selectedCategories.length === 0) {
      if (Platform.OS === "web") {
        window.alert("최소 1개 이상의 카테고리를 선택해주세요.");
      } else {
        Alert.alert("알림", "최소 1개 이상의 카테고리를 선택해주세요.");
      }
      return;
    }

    const categoryIdxList = selectedCategories.map((id) => Number(id));

    try {
      let custCode = null;

      if (Platform.OS === "web") {
        custCode = localStorage.getItem("custCode");
      } else {
        custCode = await SecureStore.getItemAsync("custCode");
      }

      const response = await apiPost("/category/active", {
        custCode: custCode,
        categoryIdxList: categoryIdxList,
      });

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.success) {
          // 설정 완료 표시
          if (Platform.OS === "web") {
            localStorage.setItem("hasActCategory", "true");
          } else {
            await SecureStore.setItemAsync("hasActCategory", "true");
          }

          if (Platform.OS === "web") {
            window.alert(responseData.message);
            // 최초 설정이면 custhome으로, 아니면 이전 페이지로
            if (isInitialSetup) {
              router.replace("/(cust)/tabs/custhome");
            } else {
              router.back();
            }
          } else {
            Alert.alert("완료", responseData.message, [
              {
                text: "확인",
                onPress: () => {
                  // 최초 설정이면 custhome으로, 아니면 이전 페이지로
                  if (isInitialSetup) {
                    router.replace("/(cust)/tabs/custhome");
                  } else {
                    router.back();
                  }
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

  const handleBack = () => {
    if (isInitialSetup) {
      // 최초 설정 중일 때 경고
      if (Platform.OS === "web") {
        const confirmLogout = window.confirm(
          "기본 설정을 완료해야 서비스 이용이 가능합니다.\n\n로그아웃하시겠습니까?",
        );
        if (confirmLogout) {
          // 로그아웃 처리
          localStorage.removeItem("custCode");
          localStorage.removeItem("hasLocation");
          localStorage.removeItem("hasActCategory");
          router.replace("/(auth)/login");
        }
      } else {
        Alert.alert("알림", "기본 설정을 완료해야 서비스 이용이 가능합니다.", [
          {
            text: "계속",
            style: "cancel",
          },
          {
            text: "로그아웃",
            onPress: async () => {
              // 로그아웃 처리
              await SecureStore.deleteItemAsync("custCode");
              await SecureStore.deleteItemAsync("hasLocation");
              await SecureStore.deleteItemAsync("hasActCategory");
              router.replace("/(auth)/login");
            },
          },
        ]);
      }
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff" }} />
      )}

      <View style={styles.header}>
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.centerSection}>
          <Text style={styles.title}>관심 카테고리 설정</Text>
        </View>
        <View style={styles.rightSection} />
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
          <View style={styles.controlButtons}>
            <Pressable onPress={handleSelectAll}>
              <Text style={styles.controlButtonText}>전체선택</Text>
            </Pressable>
            <Text style={styles.separator}>|</Text>
            <Pressable onPress={handleDeselectAll}>
              <Text style={styles.controlButtonText}>전체해제</Text>
            </Pressable>
          </View>
          <View style={styles.listWrapper}>
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
                  onPress={() =>
                    toggleCategory(category.categoryIdx.toString())
                  }
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
        </View>
      )}

      {selectedCategories.length === 0 && (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            최소 1개 이상의 카테고리를 선택해 주세요.
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.submitButton,
          selectedCategories.length === 0 && styles.submitButtonDisabled,
        ]}
        onPress={handleSave}
        disabled={selectedCategories.length === 0}
      >
        <Text
          style={[
            styles.submitButtonText,
            selectedCategories.length === 0 && styles.submitButtonTextDisabled,
          ]}
        >
          저장
        </Text>
      </TouchableOpacity>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
