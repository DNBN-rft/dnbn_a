import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef } from 'react';
import { FlatList, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './notice.styles';

interface Notice {
    id: string;
    title: string;
    date: string;
    isPinned: boolean;
}

const noticeList: Notice[] = [
    { id: "1", title: "[필독] 중요 공지사항입니다", date: "2024-06-15", isPinned: true },
    { id: "2", title: "서비스 점검 안내", date: "2024-06-14", isPinned: true },
    { id: "3", title: "공지사항 제목 3", date: "2024-06-13", isPinned: false },
    { id: "4", title: "공지사항 제목 4", date: "2024-06-12", isPinned: false },
    { id: "5", title: "공지사항 제목 5", date: "2024-06-11", isPinned: false },
    { id: "6", title: "공지사항 제목 6", date: "2024-06-10", isPinned: false },
    { id: "7", title: "공지사항 제목 7", date: "2024-06-09", isPinned: false },
    { id: "8", title: "공지사항 제목 8", date: "2024-06-08", isPinned: false },
    { id: "9", title: "공지사항 제목 9", date: "2024-06-07", isPinned: false },
    { id: "10", title: "공지사항 제목 10", date: "2024-06-06", isPinned: false },
    { id: "11", title: "공지사항 제목 11", date: "2024-06-05", isPinned: false },
    { id: "12", title: "공지사항 제목 12", date: "2024-06-04", isPinned: false },
];

export default function NoticeScreen() {
    const insets = useSafeAreaInsets();
    const scrollViewRef = useRef<ScrollView>(null);

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
                <Text style={styles.title}>
                    공지사항
                </Text>
                <View style={styles.placeholder} />
            </View>

            <FlatList
                data={noticeList}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingTop: 12, paddingBottom: 20 }}
                renderItem={({ item }) => (
                    <Pressable 
                        style={({ pressed }) => [
                            styles.noticeItemContainer,
                            item.isPinned && styles.pinnedNoticeContainer,
                            { opacity: pressed ? 0.7 : 1 }
                        ]}
                        onPress={() => router.push(`/(cust)/noticeDetail`)}>
                        <View style={styles.noticeItemDetailContainer}>
                            {item.isPinned && (
                                <View style={styles.pinnedBadge}>
                                    <Ionicons name="pin" size={11} color="#FFFFFF" style={styles.pinnedIcon} />
                                    <Text style={styles.pinnedBadgeText}>고정</Text>
                                </View>
                            )}
                            <Text style={styles.noticeItemTitleText}>{item.title}</Text>
                            <Text style={styles.noticeItemDateText}>{item.date}</Text>
                        </View>
                        <Ionicons 
                            name="chevron-forward" 
                            size={20} 
                            color={item.isPinned ? "#EF7810" : "#C7C7CC"} 
                            style={styles.chevronIcon} 
                        />
                    </Pressable>
                )}
            />
            {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000"}} />
      )}
        </View>
    );
}