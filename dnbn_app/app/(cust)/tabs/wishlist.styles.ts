import { store } from "expo-router/build/global-state/router-store";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
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
    backButtonText: {
        width: 44,
        height: 44,
        fontWeight: 'bold',
        fontSize: 24,
        color: '#333',
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
    centertitle: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
    },
    storeItemContainer: {
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
    storeImage: {
        width: 150,
        height: 140,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#eee",
    },
    storeInfo: {
        marginLeft: 12,
        flex: 1,
        justifyContent: "center",
        alignSelf: "flex-start",
    },
    storeHeader:{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    storeName: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 4,
    },
    reviewText: {
        fontSize: 18,
        color: "#666",
        marginBottom: 8,
    },
    categoryText: {
        marginLeft: 8,
        fontSize: 16,
        color: "#666",
        marginBottom: 4,
    },
    addrText: {
        fontSize: 18,
        color: "#666",
        marginBottom: 4,
    },
    totalProductsText: {
        fontSize: 18,
        color: "#666",
    },
});