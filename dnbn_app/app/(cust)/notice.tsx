import { Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './notice.styles';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRef } from 'react';

export default function NoticeScreen() {
    const insets = useSafeAreaInsets();
    const scrollViewRef = useRef<ScrollView>(null);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title} pointerEvents="none">
                    내 위치 설정
                </Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView ref={scrollViewRef} style={styles.noticeListContainer} showsVerticalScrollIndicator={false}>
                <Pressable style={styles.noticeItemContainer}>
                    <View style={styles.noticeItemDetailContainer}>
                        <Text style={styles.noticeItemTitleText}>공지사항 제목 1</Text>
                        <Text style={styles.noticeItemDateText}>2024-06-01</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#EF7810" />
                </Pressable>
                <Pressable style={styles.noticeItemContainer}>
                    <View style={styles.noticeItemDetailContainer}>
                        <Text style={styles.noticeItemTitleText}>공지사항 제목 1</Text>
                        <Text style={styles.noticeItemDateText}>2024-06-01</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#EF7810" />
                </Pressable>
                <Pressable style={styles.noticeItemContainer}>
                    <View style={styles.noticeItemDetailContainer}>
                        <Text style={styles.noticeItemTitleText}>공지사항 제목 1</Text>
                        <Text style={styles.noticeItemDateText}>2024-06-01</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#EF7810" />
                </Pressable>
                <Pressable style={styles.noticeItemContainer}>
                    <View style={styles.noticeItemDetailContainer}>
                        <Text style={styles.noticeItemTitleText}>공지사항 제목 1</Text>
                        <Text style={styles.noticeItemDateText}>2024-06-01</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#EF7810" />
                </Pressable>
                <Pressable style={styles.noticeItemContainer}>
                    <View style={styles.noticeItemDetailContainer}>
                        <Text style={styles.noticeItemTitleText}>공지사항 제목 1</Text>
                        <Text style={styles.noticeItemDateText}>2024-06-01</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#EF7810" />
                </Pressable>
                <Pressable style={styles.noticeItemContainer}>
                    <View style={styles.noticeItemDetailContainer}>
                        <Text style={styles.noticeItemTitleText}>공지사항 제목 1</Text>
                        <Text style={styles.noticeItemDateText}>2024-06-01</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#EF7810" />
                </Pressable>
                <Pressable style={styles.noticeItemContainer}>
                    <View style={styles.noticeItemDetailContainer}>
                        <Text style={styles.noticeItemTitleText}>공지사항 제목 1</Text>
                        <Text style={styles.noticeItemDateText}>2024-06-01</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#EF7810" />
                </Pressable>
                <Pressable style={styles.noticeItemContainer}>
                    <View style={styles.noticeItemDetailContainer}>
                        <Text style={styles.noticeItemTitleText}>공지사항 제목 1</Text>
                        <Text style={styles.noticeItemDateText}>2024-06-01</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#EF7810" />
                </Pressable>
                <Pressable style={styles.noticeItemContainer}>
                    <View style={styles.noticeItemDetailContainer}>
                        <Text style={styles.noticeItemTitleText}>공지사항 제목 1</Text>
                        <Text style={styles.noticeItemDateText}>2024-06-01</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#EF7810" />
                </Pressable>
                <Pressable style={styles.noticeItemContainer}>
                    <View style={styles.noticeItemDetailContainer}>
                        <Text style={styles.noticeItemTitleText}>공지사항 제목 1</Text>
                        <Text style={styles.noticeItemDateText}>2024-06-01</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#EF7810" />
                </Pressable>
                <Pressable style={styles.noticeItemContainer}>
                    <View style={styles.noticeItemDetailContainer}>
                        <Text style={styles.noticeItemTitleText}>공지사항 제목 1</Text>
                        <Text style={styles.noticeItemDateText}>2024-06-01</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#EF7810" />
                </Pressable>
                <Pressable style={styles.noticeItemContainer}>
                    <View style={styles.noticeItemDetailContainer}>
                        <Text style={styles.noticeItemTitleText}>공지사항 제목 1</Text>
                        <Text style={styles.noticeItemDateText}>2024-06-01</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#EF7810" />
                </Pressable>
                <Pressable style={styles.noticeItemContainer}>
                    <View style={styles.noticeItemDetailContainer}>
                        <Text style={styles.noticeItemTitleText}>공지사항 제목 1</Text>
                        <Text style={styles.noticeItemDateText}>2024-06-01</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#EF7810" />
                </Pressable>
            </ScrollView>
        </View>
    );
}