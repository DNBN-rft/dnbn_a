import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
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
        pointerEvents: 'none',
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    inputDisabled: {
        backgroundColor: '#F5F5F5',
        color: '#999',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    selectButton: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectButtonText: {
        fontSize: 14,
        color: '#333',
    },
    selectButtonPlaceholder: {
        color: '#999',
    },
    toggleGroup: {
        flexDirection: 'row',
        gap: 10,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    toggleButtonActive: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    toggleText: {
        fontSize: 14,
        color: '#666',
    },
    toggleTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    imageUploadButton: {
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageUploadText: {
        marginTop: 8,
        fontSize: 14,
        color: '#999',
    },
    imagePreviewContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 10,
    },
    imagePreview: {
        width: 80,
        height: 80,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    removeImageButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 12,
    },
    submitButton: {
        backgroundColor: '#000',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    submitButtonDisabled: {
        backgroundColor: '#999',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});