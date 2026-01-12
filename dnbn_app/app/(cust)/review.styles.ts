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
    reviewItemContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    writtenReviewRow: {
        flexDirection: 'row',
    },
    reviewImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 15,
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
    unwrittenStatus:{
        fontSize: 16,
        color: '#555',
        marginTop: 5,
    },
    reviewWriteButton:{
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
    reviewWriteButtonText:{
        color: '#FF6B35',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});