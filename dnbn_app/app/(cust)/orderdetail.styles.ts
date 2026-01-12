import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
        backgroundColor: "#fff",
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        position: "absolute",
        left: 0,
        right: 0,
        textAlign: "center",
        pointerEvents: "none",
    },
    placeholder: {
        width: 40,
    },
    wrapper:{
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    contentContainer:{
        flex: 1,
    },
    orderDetailContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: "#ffffff",
    },
    orderInfoContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    orderDateText: {
        fontSize: 18,
        color: "#000000ff",
        marginBottom: 4,
        fontWeight: "600",
        marginRight: 12,
    },
    orderNumberText: {
        fontSize: 16,
        color: "#999",
        marginBottom: 4,
    },
    paymentMethodText: {
        textAlign: "right",
        fontSize: 16,
        color: "#999",
        marginBottom: 4,
    },
    orderStatusText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#EF7810",
        marginBottom: 8,
    },
    storeInfoContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        marginTop: 12,
    },
    storeNameText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
        marginRight: 12,

    },
    storeAddressText: {
        fontSize: 13,
        color: "#999",
    },
    itemsContainer: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 12,
    },
    itemRow: {
        flexDirection: "row",
        marginBottom: 16,
    },
    productImageContainer: {
        width: 110,
        height: 110,
        backgroundColor: "#f5f5f5",
        borderRadius: 4,
        marginRight: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    productInfoContainer: {
        flex: 1,
        justifyContent: "space-between",
    },
    productNameText: {
        fontSize: 18,
        color: "#333",
        fontWeight: "600",
        marginBottom: 4,
    },
    productQuantityText: {
        fontSize: 16,
        color: "#999",
        marginBottom: 4,
    },
    productPriceText: {
        fontSize: 18,
        color: "#333",
        fontWeight: "bold",
        marginBottom: 8,
    },
    priceSummaryContainer: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 12,
    },
    priceSummaryItemContainer:{
        flexDirection: "row",
        justifyContent: "space-between",
    },
    totalPriceText: {
        fontSize: 18,
        color: "#333",
        marginBottom: 8,
    },
    discountPriceText: {
        fontSize: 18,
        color: "#EF7810",
        marginBottom: 8,
    },
    finalPriceText: {
        fontSize: 18    ,
        fontWeight: "bold",
        color: "#333",
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },
    timestampText: {
        fontSize: 13,
        color: "#999",
        marginBottom: 8,
    },
});