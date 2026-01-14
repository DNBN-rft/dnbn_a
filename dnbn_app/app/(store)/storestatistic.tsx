import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./storestatistic.styles";

type PeriodType = "week" | "month";

export default function StoreStatistic() {
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("week");

  // API 호출로 가져올 데이터 (샘플)
  const lineData = [
    { value: 15000, label: "월" },
    { value: 30000, label: "화" },
    { value: 26000, label: "수" },
    { value: 40000, label: "목" },
    { value: 36000, label: "금" },
    { value: 60000, label: "토" },
    { value: 54000, label: "일" },
  ];

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
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>매출 통계</Text>
        <View style={styles.placeholder}></View>
      </View>

      <ScrollView
        style={styles.sectionContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 기간 선택 필터 */}
        <View style={styles.periodFilter}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === "week" && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod("week")}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === "week" && styles.periodButtonTextActive,
              ]}
            >
              주간
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === "month" && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod("month")}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === "month" && styles.periodButtonTextActive,
              ]}
            >
              월간
            </Text>
          </TouchableOpacity>
        </View>

        {/* 요약 통계 카드 */}
        <View style={styles.topSection}>
          <View style={styles.topSectionBox}>
            <Text style={styles.topSectionLabel}>총 매출액</Text>
            <Text style={styles.topSectionPrice}>₩2,610,000</Text>
            <View style={styles.changeIndicator}>
              <Ionicons name="trending-up" size={16} color="#22C55E" />
              <Text style={styles.changeText}>+15.3%</Text>
            </View>
          </View>
          <View style={styles.topSectionBox}>
            <Text style={styles.topSectionLabel}>주문 건수</Text>
            <Text style={styles.topSectionPrice}>47건</Text>
            <View style={styles.changeIndicator}>
              <Ionicons name="trending-up" size={16} color="#22C55E" />
              <Text style={styles.changeText}>+8.2%</Text>
            </View>
          </View>
        </View>

        <View style={styles.topSection}>
          <View style={styles.topSectionBox}>
            <Text style={styles.topSectionLabel}>평균 주문액</Text>
            <Text style={styles.topSectionPrice}>₩55,500</Text>
            <View style={styles.changeIndicator}>
              <Ionicons name="trending-down" size={16} color="#EF4444" />
              <Text style={[styles.changeText, { color: "#EF4444" }]}>-3.1%</Text>
            </View>
          </View>
          <View style={styles.topSectionBox}>
            <Text style={styles.topSectionLabel}>취소/환불</Text>
            <Text style={styles.topSectionPrice}>3건</Text>
            <View style={styles.changeIndicator}>
              <Ionicons name="remove" size={16} color="#94A3B8" />
              <Text style={[styles.changeText, { color: "#94A3B8" }]}>0%</Text>
            </View>
          </View>
        </View>

        {/* 매출 그래프 */}
        <View style={styles.graphSection}>
          <Text style={styles.sectionTitle}>매출 추이</Text>
          <View style={styles.graphContainer}>
            <LineChart
              data={lineData}
              height={200}
              width={300}
              spacing={44}
              initialSpacing={15}
              color="#EF7810"
              thickness={3}
              startFillColor="rgba(239, 120, 16, 0.3)"
              endFillColor="rgba(239, 120, 16, 0.01)"
              startOpacity={0.9}
              endOpacity={0.2}
              areaChart
              curved
              yAxisColor="#E5E7EB"
              xAxisColor="#E5E7EB"
              yAxisTextStyle={{ color: "#94A3B8", fontSize: 10 }}
              xAxisLabelTextStyle={{ color: "#94A3B8", fontSize: 10 }}
              hideDataPoints={false}
              dataPointsColor="#EF7810"
              dataPointsRadius={4}
              textShiftY={-8}
              textShiftX={-10}
              textFontSize={10}
              noOfSections={4}
              maxValue={70000}
              rulesType="solid"
              rulesColor="#E5E7EB"
            />
          </View>
        </View>

        {/* 인기 상품 TOP 3 */}
        <View style={styles.rankingSection}>
          <Text style={styles.sectionTitle}>인기 상품 TOP 3</Text>
          <View style={styles.rankingList}>
            <View style={styles.rankingItem}>
              <View style={styles.rankingLeft}>
                <View style={[styles.trophyBadge, { backgroundColor: "#FFD700" }]}>
                  <Text style={styles.rankNumber}>1</Text>
                </View>
                <View style={styles.rankingInfo}>
                  <Text style={styles.rankingProductName}>갤럭시 워치4</Text>
                  <Text style={styles.rankingProductAmount}>10개 판매</Text>
                </View>
              </View>
              <Text style={styles.rankingProductTotal}>₩500,000</Text>
            </View>

            <View style={styles.rankingDivider} />

            <View style={styles.rankingItem}>
              <View style={styles.rankingLeft}>
                <View style={[styles.trophyBadge, { backgroundColor: "#C0C0C0" }]}>
                  <Text style={styles.rankNumber}>2</Text>
                </View>
                <View style={styles.rankingInfo}>
                  <Text style={styles.rankingProductName}>줄넘기</Text>
                  <Text style={styles.rankingProductAmount}>6개 판매</Text>
                </View>
              </View>
              <Text style={styles.rankingProductTotal}>₩300,000</Text>
            </View>

            <View style={styles.rankingDivider} />

            <View style={styles.rankingItem}>
              <View style={styles.rankingLeft}>
                <View style={[styles.trophyBadge, { backgroundColor: "#CD7F32" }]}>
                  <Text style={styles.rankNumber}>3</Text>
                </View>
                <View style={styles.rankingInfo}>
                  <Text style={styles.rankingProductName}>아이폰</Text>
                  <Text style={styles.rankingProductAmount}>4개 판매</Text>
                </View>
              </View>
              <Text style={styles.rankingProductTotal}>₩200,000</Text>
            </View>
          </View>
        </View>

        {/* 카테고리별 매출 */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>카테고리별 매출</Text>
          <View style={styles.categoryList}>
            <View style={styles.categoryItem}>
              <View style={styles.categoryLeft}>
                <View style={[styles.categoryIcon, { backgroundColor: "#EFF6FF" }]}>
                  <Ionicons name="phone-portrait-outline" size={20} color="#3B82F6" />
                </View>
                <Text style={styles.categoryTitle}>가전</Text>
              </View>
              <Text style={styles.categoryPrice}>₩850,000</Text>
            </View>

            <View style={styles.categoryDivider} />

            <View style={styles.categoryItem}>
              <View style={styles.categoryLeft}>
                <View style={[styles.categoryIcon, { backgroundColor: "#F0FDF4" }]}>
                  <Ionicons name="home-outline" size={20} color="#22C55E" />
                </View>
                <Text style={styles.categoryTitle}>생활용품</Text>
              </View>
              <Text style={styles.categoryPrice}>₩620,000</Text>
            </View>

            <View style={styles.categoryDivider} />

            <View style={styles.categoryItem}>
              <View style={styles.categoryLeft}>
                <View style={[styles.categoryIcon, { backgroundColor: "#FEF3C7" }]}>
                  <Ionicons name="basketball-outline" size={20} color="#F59E0B" />
                </View>
                <Text style={styles.categoryTitle}>스포츠</Text>
              </View>
              <Text style={styles.categoryPrice}>₩440,000</Text>
            </View>

            <View style={styles.categoryDivider} />

            <View style={styles.categoryItem}>
              <View style={styles.categoryLeft}>
                <View style={[styles.categoryIcon, { backgroundColor: "#F3E8FF" }]}>
                  <Ionicons name="shirt-outline" size={20} color="#A855F7" />
                </View>
                <Text style={styles.categoryTitle}>패션</Text>
              </View>
              <Text style={styles.categoryPrice}>₩700,000</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
