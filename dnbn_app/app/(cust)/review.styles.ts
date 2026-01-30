import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#ffffff',
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    placeholder: {
        width: 40,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        pointerEvents: "none"
    },
    topnav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    topnavText: {
        fontSize: 16,
        color: '#555',
        fontWeight: 'bold',
    },
    topNavTab: {
        paddingBottom: 10,
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    reviewContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 20,
        height: '100%',
    },
    safeAreaTop: {
        backgroundColor: '#FFFFFF',
    },
    safeAreaBottom: {
        backgroundColor: '#000',
    },
    orderInfo: {
        marginBottom: 15
    },
    orderText: {
        fontSize: 14,
        color: '#666'
    },
    reviewItemContainer: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    writtenReviewRow: {
        flexDirection: 'row',
    },
    writtenReviewContent: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    writtenStoreName: {
        fontSize: 12,
        fontWeight: '700',
        color: '#999',
        marginBottom: 4,
    },
    writtenProductName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    reviewInfoSection: {
        marginTop: 8,
    },
    reviewActionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingScore: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    actionDivider: {
        fontSize: 13,
        color: '#ccc',
    },
    reviewCommentText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
        marginBottom: 8,
    },
    reviewDateText: {
        fontSize: 12,
        color: '#999',
    },
    productImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    reviewImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    reviewContent: {
        flex: 1,
    },
    productName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    unwrittenProductName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    ratingText: {
        marginTop: 5,
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    commentText: {
        marginTop: 5,
        fontSize: 16,
        color: '#333',
        lineHeight: 20,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 8,
    },
    orderHeaderText: {
        fontSize: 14,
        color: '#999',
        fontWeight: '600',
    },
    unwrittenReviewRow: {
        flexDirection: 'row',
    },
    unwrittenReviewContent: {
        flex: 1,
        justifyContent: 'center',
    },
    unwrittenStoreName: {
        fontSize: 12,
        fontWeight: '700',
        color: '#999',
        marginBottom: 4,
    },
    unwrittenStatus: {
        fontSize: 12,
        color: '#888',
    },
    unwrittenOrderDate: {
        fontSize: 16,
        color: '#555',
        marginTop: 5,
    },
    activeTabBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#FF6B35',
    },
    inactiveTabBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    activeTabText: {
        color: '#FF6B35',
    },
    inactiveTabText: {
        color: '#555',
    },
    reviewWriteButton: {
        flex: 1,
        marginTop: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#FF6B35',
        borderRadius: 5,
        alignSelf: 'flex-start',
        width: '100%',
    },
    reviewWriteButtonText: {
        color: '#FF6B35',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        width: '80%',
        maxWidth: 320,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 15,
        color: '#666',
        marginBottom: 24,
        textAlign: 'center',
        lineHeight: 22,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    confirmButton: {
        backgroundColor: '#FF6B35',
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 15,
        fontWeight: '600',
    },
});