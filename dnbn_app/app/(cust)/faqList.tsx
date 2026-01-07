import { Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./faqlist.styles";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useRef } from "react";

export default function FaqListScreen() {
    const insets = useSafeAreaInsets();
    const scrollViewRef = useRef<ScrollView>(null);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
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
                <Text style={styles.title} pointerEvents="none">
                    자주 묻는 질문
                </Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView ref={scrollViewRef} style={styles.faqInnerContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.faqHeaderContainer}>
                    <View style={styles.faqSearchContainer}>
                        <TextInput style={styles.faqSearchPlaceholderText} placeholder="검색어를 입력해 주세요." />
                        <Ionicons name="search" size={20} color="#CCCCCC" />
                    </View>
                </View>

                <View style={styles.faqSubjectContainer}>
                    <Pressable style={styles.faqSubjectButton}>
                        <Text style={styles.faqSubjectButtonText}>주문/결제</Text>
                    </Pressable>
                    <Pressable style={styles.faqSubjectButton}>
                        <Text style={styles.faqSubjectButtonText}>배송</Text>
                    </Pressable>
                </View>
                <View style={styles.faqListContainer}>
                    <Text style={styles.faqSubjectTitleText}>주문/결제</Text>
                    <Pressable style={styles.faqItemContainer}>
                        <Text style={styles.faqItemQuestionText}>Q. 주문은 어떻게 하나요?</Text>
                        <Ionicons name="chevron-forward" size={20} color="#EF7810" />
                    </Pressable>
                    <Pressable style={styles.faqItemContainer}>
                        <Text style={styles.faqItemQuestionText}>Q. 결제 수단에는 어떤 것이 있나요?</Text>
                        <Ionicons name="chevron-forward" size={20} color="#EF7810" />
                    </Pressable>
                </View>
                <View style={styles.faqListContainer}>
                    <Text style={styles.faqSubjectTitleText}>배송</Text>
                    <Pressable style={styles.faqItemContainer}>
                        <Text style={styles.faqItemQuestionText}>Q. 배송은 얼마나 걸리나요?</Text>
                        <Ionicons name="chevron-forward" size={20} color="#EF7810" />
                    </Pressable>
                    <Pressable style={styles.faqItemContainer}>
                        <Text style={styles.faqItemQuestionText}>Q. 배송지 변경은 어떻게 하나요?</Text>
                        <Ionicons name="chevron-forward" size={20} color="#EF7810" />
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}