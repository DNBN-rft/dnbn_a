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
    addButton: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        borderColor: '#EF7810',
        borderWidth: 1,
        marginHorizontal: 20,
        marginBottom: 20,
    },
    addButtonText: {
        color: '#EF7810',
        fontSize: 16,
        fontWeight: '600',
    },
    list: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        marginVertical: 1,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        justifyContent: 'space-between',
    },
    itemText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    itemDetailText: {
        fontSize: 14,
        color: '#555',
        marginTop: 5
    },
    deleteButton: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        justifyContent: 'center'
    },
    deleteButtonText: {
        fontSize: 20,
        color: '#999',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 40,
    },

});