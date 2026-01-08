import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffffff',
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
        fontSize: 20,
        fontWeight: '500',
        marginBottom: 8,
    },
    noticeItemDateText: {
        fontSize: 18,
        color: '#666',
    },
});