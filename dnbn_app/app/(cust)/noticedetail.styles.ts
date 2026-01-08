import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#fff',
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
    },
    placeholder: {
        width: 40,
    },
    noticeDetailHeaderContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    noticeDetailTitleText: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    noticeDetailDateText: {
        fontSize: 18,
        color: '#888',
    },
    noticeDetailContentContainer: {
        padding: 16,
    },
    noticeDetailContentText: {
        fontSize: 18,
        lineHeight: 24,
        marginBottom: 16,
        letterSpacing: 0.2
    },
    noticeDetailImageContainer: {
        width: '100%',
        height: 200,
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    noticeDetailFileContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
        backgroundColor: 'rgba(241, 129, 30, 0.2)',
        borderRadius: 8,
        minHeight: 60,
        justifyContent: 'space-between',
    },
    noticeDetailFileItemContainer: {
        flex: 1,
    },
    noticeDetailFileText: {
        fontSize: 18,
        marginRight: 6,
    },
    noticeDetailFileSizeText: {
        fontSize: 18,
        color: '#888',
        marginRight: 6,
    },
});