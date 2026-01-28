import { apiGet } from "@/utils/api";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./faqlist.styles";

export default function FaqListScreen() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedSubject, setSelectedSubject] = useState("전체");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [faqData, setFaqData] = useState<
    {
      faqType: string;
      faqList: { faqTitle: string; faqContent: string }[];
    }[]
  >([]);

  const toggleExpand = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setExpandedItem((prev) => (prev === key ? null : key));
  };

  useEffect(() => {
    const fetchFaqList = async () => {
      try {
        const response = await apiGet("/cust/faq");
        if (response.ok) {
          const data = await response.json();
          setFaqData(data);
        } else {
          console.error("FAQ 리스트 가져오기 실패:", response.status);
        }
      } catch (error) {
        console.error("FAQ 리스트 가져오기 에러:", error);
      }
    };

    fetchFaqList();
  }, []);

  const currentFaqItems =
    selectedSubject === "전체"
      ? faqData
      : faqData.filter((faq) => faq.faqType === selectedSubject);

  const allSubjects = ["전체", ...faqData.map((faq) => faq.faqType)];

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
      )}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>자주 묻는 질문</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.faqInnerContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.faqHeaderContainer}>
          <View style={styles.faqSearchContainer}>
            <TextInput
              style={styles.faqSearchPlaceholderText}
              placeholder="검색어를 입력해 주세요."
            />

            <Ionicons name="search" size={20} color="#CCCCCC" />
          </View>
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={allSubjects}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.faqSubjectContainer}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.faqSubjectButton,
                selectedSubject === item
                  ? styles.faqSubjectButtonSelected
                  : styles.faqSubjectButtonUnselected,
              ]}
              onPress={() => setSelectedSubject(item)}
            >
              <Text
                style={[
                  styles.faqSubjectButtonText,
                  selectedSubject === item
                    ? styles.faqSubjectButtonTextSelected
                    : styles.faqSubjectButtonTextUnselected,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          )}
        />

        <View style={styles.faqListContainer}>
          {currentFaqItems.map((faqCategory, categoryIndex) => (
            <View key={categoryIndex}>
              {faqCategory.faqList.map((item, index) => {
                const itemKey = `${categoryIndex}-${index}`;
                const isExpanded = expandedItem === itemKey;

                return (
                  <View key={index} style={styles.faqItemWrapper}>
                    <Pressable
                      style={[
                        styles.faqItemContainer,
                        isExpanded && styles.faqItemContainerExpanded,
                      ]}
                      onPress={() => toggleExpand(categoryIndex, index)}
                    >
                      <View style={styles.faqItemQuestionRow}>
                        <Text style={styles.faqItemQuestionLabel}>Q</Text>

                        <Text style={styles.faqItemQuestionText}>
                          {item.faqTitle}
                        </Text>
                      </View>

                      <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#EF7810"
                      />
                    </Pressable>

                    {isExpanded && (
                      <View style={styles.faqItemAnswerContainer}>
                        <View style={styles.faqItemAnswerRow}>
                          <Text style={styles.faqItemAnswerLabel}>A</Text>

                          <Text style={styles.faqItemAnswerText}>
                            {item.faqContent}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        <View style={styles.questionReqContainer}>
          <Text style={styles.questionReqText}>
            원하는 답변을 찾지 못하셨나요?
          </Text>
          <View style={styles.questionBtnContainer}>
            <TouchableOpacity
              style={styles.questionReqButton}
              onPress={() => router.navigate("/(cust)/questionReg")}
            >
              <Text style={styles.questionReqButtonText}>1:1 문의하기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.questionListViewButton}
              onPress={() => router.navigate("/(cust)/question")}
            >
              <Text style={styles.questionListViewText}>내 문의 목록 보기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
