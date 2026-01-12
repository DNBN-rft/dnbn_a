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
        flexDirection: "column",
        backgroundColor: "#ffffff",
        padding: 20,
    },
    reportItemWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    reportItem:{
        flex: 1,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    reportType:{
        fontSize: 16,
        color: "#333",
        marginBottom: 4,
    },
    reportTitle:{
        fontSize: 16,
        color: "#555",
        marginBottom: 4,
    },
    reportDate:{
        fontSize: 14,
        color: "#777",
    },
    reportStatusContainer: {
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "#EF7810",
        borderRadius: 12,
        paddingVertical: 4,
    },
    reportStatus:{
        fontSize: 14,
        color: "#EF7810",
        fontWeight: "bold",
    },
    reportAnswerContainer: {
        backgroundColor: "#f9f9f9",
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    reportAnswerLabel: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#EF7810",
        marginBottom: 8,
    },
    reportAnswer: {
        fontSize: 14,
        color: "#555",
        lineHeight: 20,
    },
});