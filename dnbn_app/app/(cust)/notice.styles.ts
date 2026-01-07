import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 16,
        padding: 8,
    },
    headerTitleText: {
        fontSize: 18,
        fontWeight: '600',
    },
    noticeListContainer: {
        padding: 16,
    },
    noticeItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 70,           // 원하는 행 높이
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    noticeItemDetailContainer:{
        flex:1
    },
    noticeItemTitleText: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 6,
    },
    noticeItemDateText: {
        fontSize: 12,
        color: '#666',
    },
});