import { ImageComponent, StyleSheet } from "react-native";

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
    productInfoContainer:{
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
    },
    productImage:{
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    productTextContainer:{
        marginLeft: 15,
        flex: 1,
    },
    productName:{
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    storeName:{
        fontSize: 18,
        color: "#777",
        marginTop: 4,
    },
    reviewInfoContainer:{
        paddingHorizontal: 20,
    },
    regContainer:{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    regNm:{
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    regDate:{
        fontSize: 16,
        color: "#999",
    },
    ratingText:{
        fontSize: 16,
        marginBottom: 10,
    },
    reviewContent:{
        fontSize: 18,
        color: "#555",
        lineHeight: 20,
    },
    imageContainer:{
        flexDirection: "row",
        marginBottom: 10,
    },
    imageWrapper:{
        marginRight: 10,
        borderRadius: 8,
        overflow: "hidden",
    },
    image:{
        width: 80,
        height: 80,
    },
});