import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { styles } from './noticedetail.styles'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function NoticeDetailScreen() {
    const insets = useSafeAreaInsets();

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
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.noticeDetailHeaderContainer}>
                    <Text style={styles.noticeDetailTitleText}>공지사항 제목이 들어갑니다</Text>
                    <Text style={styles.noticeDetailDateText}>2024.06.01</Text>
                </View>
                <View style={styles.noticeDetailContentContainer}>
                    <Text style={styles.noticeDetailContentText}>공지사항 내용이 들어갑니다.공지사항 내용이 들어갑니다.공지사항 내용이 들어갑니다.공지사항 내용이 들어갑니다.공지사항 내용이 들어갑니다.공지사항 내용이 들어갑니다.공지사항 내용이 들어갑니다.공지사항 내용이 들어갑니다.공지사항 내용이 들어갑니다.공지사항 내용이 들어갑니다.공지사항 내용이 들어갑니다.공지사항 내용이 들어갑니다.공지사항 내용이 들어갑니다.공지사항 내용이 들어갑니다.공지사항 내용이 들어갑니다.공지사항 내용이 들어갑니다.</Text>
                    <View style={styles.noticeDetailImageContainer}>
                        <Text>공지사항 이미지</Text>
                    </View>
                    <View style={styles.noticeDetailFileContainer}>
                        <View style={styles.noticeDetailFileItemContainer}>
                            <Text style={styles.noticeDetailFileText}>첨부파일 이름.jpg</Text>
                            <Text style={styles.noticeDetailFileSizeText}>120KB</Text>
                        </View>
                        <Ionicons name="download-outline" size={24} color="#000" />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};  