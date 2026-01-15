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
        alignItems: "flex-start",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    productImage: {
        width: 80,
        height: 80,
        marginRight: 15,
        borderRadius: 8,
    },
    productInfoBox: {
        flex: 1,
        justifyContent: "center",
    },
    storeNameSmall: {
        fontSize: 12,
        color: "#999",
        marginBottom: 4,
    },
    productNameBold: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },
    questionText: {
        fontSize: 16,
        color: "#333",
        textAlign: "center",
        marginBottom: 16,
        marginTop: 8,
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
        marginBottom: 30,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        paddingVertical: 20,
    },
    ratingContainerSmall: {
        marginBottom: 20,
        paddingVertical: 10,
        justifyContent: "center",
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
        backgroundColor: "#FF6B35",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    submitButtonDisabled: {
        backgroundColor: "#f0f0f0",
        borderColor: "#ddd",
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    submitButtonTextDisabled: {
        color: "#999",
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