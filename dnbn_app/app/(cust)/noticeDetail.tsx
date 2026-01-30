import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './noticedetail.styles';
import { useEffect, useState } from 'react';
import { apiGet } from '@/utils/api';
import { useLocalSearchParams } from 'expo-router';

interface NoticeDetail {
    title: string;
    content: string;
    isPinned: boolean;
    regDateTime: string;
    modDateTime: string;
}

export default function NoticeDetailScreen() {
    const insets = useSafeAreaInsets();
    const [noticeDetail, setNoticeDetail] = useState<NoticeDetail>();
    const { noticeIdx } = useLocalSearchParams();

    useEffect(() => {
        fetchNoticeDetail();
    }, []);

    const fetchNoticeDetail = async () => {
        try {
            const response = await apiGet(`/cust/notice/${noticeIdx}`);
            const data = await response.json();
            if (response.ok) {
                setNoticeDetail(data);
            } else {
                console.error('공지사항 상세 정보를 불러올 수 없습니다');
            }
        } catch (error) {
            console.error('공지사항 상세 정보를 불러오는 중 오류가 발생했습니다', error);
        }
    };

    const formatDateTime = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

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
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.noticeDetailHeaderContainer}>
                    {noticeDetail?.isPinned && (
                        <View style={styles.pinnedBadge}>
                            <Ionicons name="pin" size={12} color="#FFFFFF" />
                            <Text style={styles.pinnedBadgeText}>고정</Text>
                        </View>
                    )}
                    <Text style={styles.noticeDetailTitleText}>{noticeDetail?.title}</Text>
                    <Text style={styles.noticeDetailDateText}>등록일: {formatDateTime(noticeDetail?.regDateTime)}</Text>
                    <Text style={styles.noticeDetailDateText}>수정일: {noticeDetail?.modDateTime ? formatDateTime(noticeDetail?.modDateTime) : '-'}</Text>
                </View>
                <View style={styles.noticeDetailContentContainer}>
                    <Text style={styles.noticeDetailContentText}>{noticeDetail?.content}    </Text>
                    {/* <View style={styles.noticeDetailImageContainer}>
                        <Text>공지사항 이미지</Text>
                    </View>
                    <View style={styles.noticeDetailFileContainer}>
                        <View style={styles.noticeDetailFileItemContainer}>
                            <Text style={styles.noticeDetailFileText}>첨부파일 이름.jpg</Text>
                            <Text style={styles.noticeDetailFileSizeText}>120KB</Text>
                        </View>
                        <TouchableOpacity style={styles.downloadIcon}>
                            <Ionicons name="download-outline" size={22} color="#EF7810" />
                        </TouchableOpacity>
                    </View> */}
                </View>
            </ScrollView>
            {insets.bottom > 0 && (
                <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
            )}
        </View>
    );
};  