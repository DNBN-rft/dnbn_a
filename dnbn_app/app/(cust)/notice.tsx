import { FlatList, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './notice.styles';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRef } from 'react';

interface Notice {
    id: string;
    title: string;
    date: string;
}

const noticeList: Notice[] = [
    { id: "1", title: "공지사항 제목 1", date: "2024-06-15" },
    { id: "2", title: "공지사항 제목 2", date: "2024-06-14" },
    { id: "3", title: "공지사항 제목 3", date: "2024-06-13" },
    { id: "4", title: "공지사항 제목 4", date: "2024-06-12" },
    { id: "5", title: "공지사항 제목 5", date: "2024-06-11" },
    { id: "6", title: "공지사항 제목 6", date: "2024-06-10" },
    { id: "7", title: "공지사항 제목 7", date: "2024-06-09" },
    { id: "8", title: "공지사항 제목 8", date: "2024-06-08" },
    { id: "9", title: "공지사항 제목 9", date: "2024-06-07" },
    { id: "10", title: "공지사항 제목 10", date: "2024-06-06" },
    { id: "11", title: "공지사항 제목 11", date: "2024-06-05" },
    { id: "12", title: "공지사항 제목 12", date: "2024-06-04" },
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
                <Text style={styles.title} pointerEvents="none">
                    공지사항
                </Text>
                <View style={styles.placeholder} />
            </View>

            <FlatList
                data={noticeList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Pressable style={styles.noticeItemContainer}
                    onPress={() => router.push(`/(cust)/noticeDetail`)}>
                        <View style={styles.noticeItemDetailContainer}>
                            <Text style={styles.noticeItemTitleText}>{item.title}</Text>
                            <Text style={styles.noticeItemDateText}>{item.date}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#EF7810" />
                    </Pressable>
                )}
                scrollEnabled={false}
            />
            {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000"}} />
      )}
        </View>
    );
}