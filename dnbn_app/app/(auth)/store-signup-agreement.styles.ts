/**
 * 스토어 회원가입 Step 0: 약관 동의 화면 스타일
 */
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  topContent: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: '#fff',
  },
  topTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  topText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  allAgreeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f8f8f8',
    marginBottom: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 12,
  },
  allAgreeText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  agreeListSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  agreeListTitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  agreeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  agreeItemFirst: {
    borderTopWidth: 0,
  },
  agreeItemLast: {
    marginBottom: 0,
  },
  agreeItemText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
  },
  required: {
    color: '#FF6F2B',
    fontWeight: '600',
  },
  arrowButton: {
    padding: 4,
  },
  bottomButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  nextButton: {
    height: 56,
    backgroundColor: '#FF6F2B',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
  },
});
