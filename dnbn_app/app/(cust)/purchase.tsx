import { router } from 'expo-router';
import { Pressable, TextInput, Modal, ScrollView, View, Text } from 'react-native';
import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './purchase.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PurchaseScreen() {
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<'UNUSED' | 'USED'>('UNUSED');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const [status, setStatus] = useState<'ALL' | 'CANCEL' | 'USED'>('ALL');
  const [period, setPeriod] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('1Y');

  // 모달 내에서 임시로 상태를 관리
  const [tempStatus, setTempStatus] = useState<'ALL' | 'CANCEL' | 'USED'>('ALL');
  const [tempPeriod, setTempPeriod] = useState<'1M' | '3M' | '6M' | '1Y'>('1M');

  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleOpenFilterModal = () => {
    setTempStatus(status);
    setTempPeriod(period === 'ALL' ? '1M' : period);
    setFilterModalOpen(true);
  };

  const handleApplyFilter = () => {
    setStatus(tempStatus);
    setPeriod(tempPeriod);
    setFilterModalOpen(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>

        <Text style={styles.headerTitle}>구매 내역</Text>
      </View>

      <View style={styles.topContainer}>
        <Pressable
          style={[
            styles.tabButton,
            activeTab === 'UNUSED' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('UNUSED')}
        >
          <Text>미사용</Text>
        </Pressable>

        <Pressable
          style={[
            styles.tabButton,
            activeTab === 'USED' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('USED')}
        >
          <Text>사용완료</Text>
        </Pressable>
      </View>


      <TextInput
        placeholder="구매한 상품/스토어를 검색해보세요"
        style={[styles.searchContainer, searchFocused && styles.searchContainerFocused]}
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
      />

      <View style={styles.filterContainer}>
        {/* 상태 */}
        <Pressable
          style={styles.selectBox}
          onPress={handleOpenFilterModal}
        >
          <Text style={styles.selectBoxText}>
            {status === 'ALL' && '전체'}
            {status === 'CANCEL' && '취소'}
            {status === 'USED' && '사용완료'}
          </Text>
        </Pressable>

        {/* 기간 */}
        <Pressable
          style={styles.selectBox}
          onPress={handleOpenFilterModal}
        >
          <Text style={styles.selectBoxText}>
            {period === '1M' && '최근 1개월'}
            {period === '3M' && '최근 3개월'}
            {period === '6M' && '최근 6개월'}
            {period === '1Y' && '최근 1년'}
            {period === 'ALL' && '기간선택'}
          </Text>
        </Pressable>
      </View>


      <ScrollView ref={scrollViewRef} style={styles.listContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.orderContainer}>
          <View style={styles.orderTopContainer}>
            <Text style={styles.orderDate}>2026.01.05</Text>
            <Pressable style={styles.orderDetailButton}>
              <Text style={styles.orderDetailButtonText}>주문상세 ></Text>
            </Pressable>
          </View>

          <View style={styles.orderItemContainer}>
            <View style={styles.orderStoreContainer}>
              <Text style={styles.storeName}>가게이름</Text>
            </View>

            <View style={styles.orderStateContainer}>
              <Text style={styles.orderState}>구매확정</Text>
            </View>

            <View style={styles.orderProductInfoContainer}>
              <View style={styles.orderProductImgContainer}>
              </View>

              <View style={styles.orderProductDetailContainer}>
                <Text style={styles.productName}>맛있는 두쫀쿠</Text>
                <Text style={styles.productQuantity}>수량: 1개</Text>
                <Text style={styles.productPrice}>5,500원</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.orderContainer}>
          <View style={styles.orderTopContainer}>
            <Text style={styles.orderDate}>2026.01.05</Text>
            <Pressable style={styles.orderDetailButton}>
              <Text style={styles.orderDetailButtonText}>주문상세 ></Text>
            </Pressable>
          </View>

          <View style={styles.orderItemContainer}>
            <View style={styles.orderStoreContainer}>
              <Text style={styles.storeName}>가게이름</Text>
            </View>

            <View style={styles.orderStateContainer}>
              <Text style={styles.orderState}>구매확정</Text>
            </View>

            <View style={styles.orderProductInfoContainer}>
              <View style={styles.orderProductImgContainer}>
              </View>

              <View style={styles.orderProductDetailContainer}>
                <Text style={styles.productName}>맛있는 두쫀쿠</Text>
                <Text style={styles.productQuantity}>수량: 1개</Text>
                <Text style={styles.productPrice}>5,500원</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.orderContainer}>
          <View style={styles.orderTopContainer}>
            <Text style={styles.orderDate}>2026.01.05</Text>
            <Pressable style={styles.orderDetailButton}>
              <Text style={styles.orderDetailButtonText}>주문상세 ></Text>
            </Pressable>
          </View>

          <View style={styles.orderItemContainer}>
            <View style={styles.orderStoreContainer}>
              <Text style={styles.storeName}>가게이름</Text>
            </View>

            <View style={styles.orderStateContainer}>
              <Text style={styles.orderState}>구매확정</Text>
            </View>

            <View style={styles.orderProductInfoContainer}>
              <View style={styles.orderProductImgContainer}>
              </View>

              <View style={styles.orderProductDetailContainer}>
                <Text style={styles.productName}>맛있는 두쫀쿠</Text>
                <Text style={styles.productQuantity}>수량: 1개</Text>
                <Text style={styles.productPrice}>5,500원</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FloatingButton - 최상단 이동 */}
      <Pressable style={styles.scrollToTopButton} onPress={scrollToTop}>
        <Text style={styles.scrollToTopButtonText}>▲</Text>
      </Pressable>

      <Modal
        visible={filterModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterModalOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setFilterModalOpen(false)}
        >
          <View style={styles.filterModalContent}>
            {/* 필터 제목 */}
            <View style={styles.filterModalHeader}>
              <Pressable onPress={() => setFilterModalOpen(false)}>
                <Text style={styles.filterModalCloseButton}>닫기</Text>
              </Pressable>
            </View>

            {/* 주문 상태 선택 */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>주문 상태</Text>
              <View style={styles.filterOptions}>
                <Pressable
                  style={[
                    styles.filterOptionButton,
                    tempStatus === 'ALL' && styles.filterOptionButtonActive
                  ]}
                  onPress={() => setTempStatus('ALL')}
                >
                  <Text>전체</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.filterOptionButton,
                    tempStatus === 'CANCEL' && styles.filterOptionButtonActive
                  ]}
                  onPress={() => setTempStatus('CANCEL')}
                >
                  <Text>취소</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.filterOptionButton,
                    tempStatus === 'USED' && styles.filterOptionButtonActive
                  ]}
                  onPress={() => setTempStatus('USED')}
                >
                  <Text>사용완료</Text>
                </Pressable>
              </View>
            </View>

            {/* 기간 선택 */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>기간</Text>
              <View style={styles.filterDateOptions}>
                <Pressable
                  style={[
                    styles.filterDateButton,
                    tempPeriod === '1M' && styles.filterDateButtonActive
                  ]}
                  onPress={() => setTempPeriod('1M')}
                >
                  <Text>최근 1개월</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.filterDateButton,
                    tempPeriod === '3M' && styles.filterDateButtonActive
                  ]}
                  onPress={() => setTempPeriod('3M')}
                >
                  <Text>최근 3개월</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.filterDateButton,
                    tempPeriod === '6M' && styles.filterDateButtonActive
                  ]}
                  onPress={() => setTempPeriod('6M')}
                >
                  <Text>최근 6개월</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.filterDateButton,
                    tempPeriod === '1Y' && styles.filterDateButtonActive
                  ]}
                  onPress={() => setTempPeriod('1Y')}
                >
                  <Text>최근 1년</Text>
                </Pressable>
              </View>
            </View>

            {/* 조회하기 버튼 */}
            <Pressable
              style={styles.applyButton}
              onPress={handleApplyFilter}
            >
              <Text style={styles.applyButtonText}>조회하기</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
