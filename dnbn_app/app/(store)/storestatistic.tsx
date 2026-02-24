import { apiPost } from "@/utils/api";
import { getStorageItem } from "@/utils/storageUtil";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./storestatistic.styles";

type PeriodType = "week" | "month";

type OrderGraphItem = {
  date: string;
  amount: number;
  total: number;
};

type StatisticsResponse = {
  total: number;
  orderPrice: number;
  orderCount: number;
  average: number;
  topProductNm: string;
  topProductAmount: number;
  topProductTotal: number;
  secondProductNm: string;
  secondProductAmount: number;
  secondProductTotal: number;
  thirdProductNm: string;
  thirdProductAmount: number;
  thirdProductTotal: number;
  topCategoryNm: string;
  topCategoryTotal: number;
  secondCategoryNm: string;
  secondCategoryTotal: number;
  thirdCategoryNm: string;
  thirdCategoryTotal: number;
  orderGraph: OrderGraphItem[];
};

export default function StoreStatistic() {
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("week");
  const [statistics, setStatistics] = useState<StatisticsResponse | null>(null);

  // 날짜를 요일 라벨로 변환
  const getDateLabel = (dateStr: string, period: PeriodType) => {
    const date = new Date(dateStr);
    if (period === "week") {
      const days = ["일", "월", "화", "수", "목", "금", "토"];
      return days[date.getDay()];
    } else {
      // 월간인 경우 날짜 표시
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
  };

  // 가격 포맷팅
  const formatPrice = (price: number) => {
    return `₩${price.toLocaleString()}`;
  };

  // API 호출하여 통계 데이터 가져오기
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const storeCode = await getStorageItem("storeCode");

        const periodType = selectedPeriod === "week" ? "WEEKLY" : "MONTHLY";

        const response = await apiPost(`/store/app/statistics/${storeCode}`, {
          periodType: periodType,
        });
        const data: StatisticsResponse = await response.json();

        console.log("통계 데이터:", data);
        setStatistics(data);
      } catch (error) {
        console.error("통계 데이터 호출 실패:", error);
      }
    };

    fetchStatistics();
  }, [selectedPeriod]);

  // 그래프 데이터 변환
  const lineData =
    statistics?.orderGraph.map((item) => ({
      value: item.total,
      label: getDateLabel(item.date, selectedPeriod),
    })) || [];

  // 최대값 계산 (그래프 스케일링)
  const maxValue = Math.max(...lineData.map((d) => d.value), 100000);

  // 취소/환불 건수 (total - orderCount)
  const cancelCount = (statistics?.total || 0) - (statistics?.orderCount || 0);

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
          <Text style={styles.title}>매출 통계</Text>
        </View>
        <View style={styles.rightSection} />
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
            <Text style={styles.topSectionPrice}>
              {formatPrice(statistics?.orderPrice || 0)}
            </Text>
          </View>
          <View style={styles.topSectionBox}>
            <Text style={styles.topSectionLabel}>주문 건수</Text>
            <Text style={styles.topSectionPrice}>
              {statistics?.orderCount || 0}건
            </Text>
          </View>
        </View>

        <View style={styles.topSection}>
          <View style={styles.topSectionBox}>
            <Text style={styles.topSectionLabel}>평균 주문액</Text>
            <Text style={styles.topSectionPrice}>
              {formatPrice(statistics?.average || 0)}
            </Text>
          </View>
          <View style={styles.topSectionBox}>
            <Text style={styles.topSectionLabel}>취소/환불</Text>
            <Text style={styles.topSectionPrice}>{cancelCount}건</Text>
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
              maxValue={maxValue * 1.2}
              rulesType="solid"
              rulesColor="#E5E7EB"
            />
          </View>
        </View>

        {/* 인기 상품 TOP 3 */}
        <View style={styles.rankingSection}>
          <Text style={styles.sectionTitle}>인기 상품 TOP 3</Text>
          <View style={styles.rankingList}>
            {statistics?.topProductNm && (
              <>
                <View style={styles.rankingItem}>
                  <View style={styles.rankingLeft}>
                    <View
                      style={[
                        styles.trophyBadge,
                        { backgroundColor: "#FFD700" },
                      ]}
                    >
                      <Text style={styles.rankNumber}>1</Text>
                    </View>
                    <View style={styles.rankingInfo}>
                      <Text style={styles.rankingProductName}>
                        {statistics.topProductNm}
                      </Text>
                      <Text style={styles.rankingProductAmount}>
                        {statistics.topProductAmount}개 판매
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.rankingProductTotal}>
                    {formatPrice(statistics.topProductTotal)}
                  </Text>
                </View>

                {statistics.secondProductNm && (
                  <>
                    <View style={styles.rankingDivider} />
                    <View style={styles.rankingItem}>
                      <View style={styles.rankingLeft}>
                        <View
                          style={[
                            styles.trophyBadge,
                            { backgroundColor: "#C0C0C0" },
                          ]}
                        >
                          <Text style={styles.rankNumber}>2</Text>
                        </View>
                        <View style={styles.rankingInfo}>
                          <Text style={styles.rankingProductName}>
                            {statistics.secondProductNm}
                          </Text>
                          <Text style={styles.rankingProductAmount}>
                            {statistics.secondProductAmount}개 판매
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.rankingProductTotal}>
                        {formatPrice(statistics.secondProductTotal)}
                      </Text>
                    </View>
                  </>
                )}

                {statistics.thirdProductNm && (
                  <>
                    <View style={styles.rankingDivider} />
                    <View style={styles.rankingItem}>
                      <View style={styles.rankingLeft}>
                        <View
                          style={[
                            styles.trophyBadge,
                            { backgroundColor: "#CD7F32" },
                          ]}
                        >
                          <Text style={styles.rankNumber}>3</Text>
                        </View>
                        <View style={styles.rankingInfo}>
                          <Text style={styles.rankingProductName}>
                            {statistics.thirdProductNm}
                          </Text>
                          <Text style={styles.rankingProductAmount}>
                            {statistics.thirdProductAmount}개 판매
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.rankingProductTotal}>
                        {formatPrice(statistics.thirdProductTotal)}
                      </Text>
                    </View>
                  </>
                )}
              </>
            )}

            {!statistics?.topProductNm && (
              <Text
                style={{ textAlign: "center", color: "#94A3B8", padding: 20 }}
              >
                데이터가 없습니다.
              </Text>
            )}
          </View>
        </View>

        {/* 카테고리별 매출 */}
        {statistics?.topCategoryNm && (
          <View style={styles.categorySection}>
            <Text style={styles.sectionTitle}>카테고리별 매출</Text>
            <View style={styles.categoryList}>
              <View style={styles.categoryItem}>
                <View style={styles.categoryLeft}>
                  <View
                    style={[
                      styles.categoryIcon,
                      { backgroundColor: "#EFF6FF" },
                    ]}
                  >
                    <Ionicons
                      name="phone-portrait-outline"
                      size={20}
                      color="#3B82F6"
                    />
                  </View>
                  <Text style={styles.categoryTitle}>
                    {statistics.topCategoryNm}
                  </Text>
                </View>
                <Text style={styles.categoryPrice}>
                  {formatPrice(statistics.topCategoryTotal)}
                </Text>
              </View>

              {statistics.secondCategoryNm && (
                <>
                  <View style={styles.categoryDivider} />
                  <View style={styles.categoryItem}>
                    <View style={styles.categoryLeft}>
                      <View
                        style={[
                          styles.categoryIcon,
                          { backgroundColor: "#F0FDF4" },
                        ]}
                      >
                        <Ionicons
                          name="home-outline"
                          size={20}
                          color="#22C55E"
                        />
                      </View>
                      <Text style={styles.categoryTitle}>
                        {statistics.secondCategoryNm}
                      </Text>
                    </View>
                    <Text style={styles.categoryPrice}>
                      {formatPrice(statistics.secondCategoryTotal)}
                    </Text>
                  </View>
                </>
              )}

              {statistics.thirdCategoryNm && (
                <>
                  <View style={styles.categoryDivider} />
                  <View style={styles.categoryItem}>
                    <View style={styles.categoryLeft}>
                      <View
                        style={[
                          styles.categoryIcon,
                          { backgroundColor: "#FEF3C7" },
                        ]}
                      >
                        <Ionicons
                          name="basketball-outline"
                          size={20}
                          color="#F59E0B"
                        />
                      </View>
                      <Text style={styles.categoryTitle}>
                        {statistics.thirdCategoryNm}
                      </Text>
                    </View>
                    <Text style={styles.categoryPrice}>
                      {formatPrice(statistics.thirdCategoryTotal)}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
