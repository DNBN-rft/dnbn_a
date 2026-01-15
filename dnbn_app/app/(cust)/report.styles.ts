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
    reportContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },
    listContent: {
        padding: 16,
        paddingBottom: 20,
    },
    cardContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        boxShadow: "0 0px 4px rgba(0, 0, 0, 0.3)",
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    typeTag: {
        backgroundColor: "#f0f0f0",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    typeText: {
        fontSize: 13,
        color: "#666",
        fontWeight: "600",
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: "#FFF5ED",
        borderWidth: 1,
        borderColor: "#EF7810",
    },
    statusBadgeCompleted: {
        backgroundColor: "#E8F5E9",
        borderColor: "#4CAF50",
    },
    statusText: {
        fontSize: 13,
        color: "#EF7810",
        fontWeight: "600",
    },
    statusTextCompleted: {
        color: "#4CAF50",
    },
    reportTitle: {
        fontSize: 16,
        color: "#222",
        fontWeight: "600",
        marginBottom: 8,
        lineHeight: 22,
    },
    reportDate: {
        fontSize: 13,
        color: "#999",
    },
    reportAnswerContainer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
    },
    reportAnswerLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#EF7810",
        marginBottom: 8,
    },
    reportAnswer: {
        fontSize: 14,
        color: "#555",
        lineHeight: 21,
    },
});