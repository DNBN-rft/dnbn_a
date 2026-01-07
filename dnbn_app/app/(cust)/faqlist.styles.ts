import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffffff',
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
    faqInnerContainer: {
        flex: 1,
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
    faqHeaderContainer: {
        alignItems: 'center',
        padding: 20,
    },
    faqSearchContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#ffffffff',
    },
    faqSearchPlaceholderText: {
        flex: 1,        
        color: '#CCCCCC',
        fontSize: 16,
    },
    faqSubjectContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    faqSubjectButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#EF7810',
        borderRadius: 20,
    },
    faqSubjectButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    faqListContainer: {
        padding: 20,
    },
    faqSubjectTitleText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    faqItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    faqItemQuestionText: {
        fontSize: 16,
        color: '#333333',
    },

});