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
    storeImgContainer: {
        width: '100%',
        height: 220,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#cfcfcfff',
        alignItems: 'center',
    },
    storeInfoTopContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    storeIconContainer: {
        width: 50,
        height: 50,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 28,
    },
    storeAddressContainer: {
        flex: 1,
    },
    storeNameText: {
        fontSize: 13,
        color: '#999',
        marginBottom: 4,
    },
    storeMapContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    storeAddrDetailText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    mapIconText: {
        fontSize: 16,
    },
    storeShareContainer: {
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    iconText: {
        fontSize: 12,
        color: '#666',
    },
    storeWishContainer: {
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    heartText: {
        fontSize: 18,
    },
    storeMoreContainer: {
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    moreText: {
        fontSize: 16,
        color: '#666',
    },
    storeRateInfoContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    rateText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 12,
    },
    storeInfoDetailContainer: {
        paddingHorizontal: 16,
        paddingVertical: 5,
    },
    descriptionText: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingHorizontal: 16,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabButtonActive: {
        borderBottomColor: '#EF7810',
    },
    tabText: {
        fontSize: 14,
        color: '#999',
        fontWeight: '500',
    },
    tabTextActive: {
        color: '#EF7810',
        fontWeight: '600',
    },
    reviewContainer: {
        paddingHorizontal: 16,
        paddingVertical: 32,
        alignItems: 'center',
    },
    reviewText: {
        fontSize: 14,
        color: '#999',
    },
    storeReviewContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    reviewItemContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    reviewRefInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewRegNmContainer: {
        fontSize: 13,
        fontWeight: '600',
        color: '#000',
    },
    reviewRegDateContainer: {
        fontSize: 12,
        color: '#999',
    },
    reviewRateContainer: {
        fontSize: 12,
        color: '#ff9800',
        fontWeight: '600',
        marginBottom: 8,
    },
    reviewImgContainer: {
        width: '100%',
        height: 80,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewContentContainer: {
        fontSize: 12,
        color: '#666',
        lineHeight: 16,
    },
    storeProductContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    productGridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    storeProductItemContainer: {
        width: '48%',
        height: 250,
        backgroundColor: '#fff',
    },
    storeProductImgContainer: {
        width: '100%',
        height: 140,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    storeProductNmContainer: {
        fontSize: 12,
        color: '#333',
        lineHeight: 16,
    },
    storeProductPriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap:6,
    },
    salePercentText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#ff6b6b',
    },
    priceText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#000',
    },
    ratingText: {
        fontSize: 11,
        color: '#999',
       lineHeight: 15,
    },
});