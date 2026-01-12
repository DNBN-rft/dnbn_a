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
    productItemContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#fff",
        marginVertical: 8,
        marginHorizontal: 14,
        borderRadius: 8,
        overflow: "hidden",
        elevation: 2,
        borderBottomWidth: 1,
        paddingBottom: 16,
        borderColor: "rgba(0, 0, 0, 0.05)",
    },
    productImage: {
        width: 160,
        height: 140,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#eee",
    },
    productInfo: {
        marginLeft: 12,
        flex: 1,
        justifyContent: "center",
        alignSelf: "flex-start",
    },
    productName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    storeName: {
        fontSize: 18,
        marginBottom: 8,
        color: "#666",
    },
    priceText: {
        fontSize: 18,
        color: "#333",
        fontWeight: "bold",
    },
});