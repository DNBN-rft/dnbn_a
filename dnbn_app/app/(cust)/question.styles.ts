import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container:{
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
    questionListContainer: {
        flex: 1,
        padding: 16,
    },
    questionItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 70,         
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    questionItemDetailContainer: {
        flex: 1,
    },
    questionItemTitleText: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 6,
    },
    questionItemDateText: {
        fontSize: 14,
        color: '#666',
    },
    questionItemStatusContainer: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(241, 129, 30, 0.2)',
        marginRight: 12,
    },
    questionItemStatusText: {
        fontSize: 14,
        color: 'rgba(241, 129, 30, 1)',
    },
});