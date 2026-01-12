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
    productContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    productImage: {
        width: 60,
        height: 60,
        marginRight: 15,
    },
    productTextContainer: {
        flex: 1,
    },
    productName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    storeName: {
        fontSize: 16,
        color: "#777",
        marginTop: 4,
    },
    reviewContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    titleText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
    },
    ratingContainer: {
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
    },
    ratingPlaceholder: {
        fontSize: 14,
        color: "#aaa",
    },
    starButton: {
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    starText: {
        fontSize: 36,
    },
    reviewLabel: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
    },
    textInputPlaceholder: {
        height: 120,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
    submitButton: {
        borderWidth: 1,
        borderColor: "#FF6B35",
        backgroundColor: "#fff",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    submitButtonText: {
        color: "#FF6B35",
        fontSize: 18,
        fontWeight: "bold",
    },
    photoContainer: {
        marginBottom: 20,
    },
    photoLabel: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 12,
    },
    photoGridContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
    },
    photoSlot: {
        flex: 1,
        aspectRatio: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        overflow: "hidden",
    },
    photoUploadButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9f9f9",
    },
    photoWrapper: {
        flex: 1,
        position: "relative",
    },
    photoImage: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    removePhotoButton: {
        position: "absolute",
        top: 4,
        right: 4,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: 12,
    },
    photoUploadButtonText: {
        fontSize: 16,
        color: "#888888",
        marginLeft: 10,
    },
});