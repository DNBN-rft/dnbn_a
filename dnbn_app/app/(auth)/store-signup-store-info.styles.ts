/**
 * 스토어 회원가입 Step 3: 가게 정보 입력 스타일
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
    padding: 20,
    paddingBottom: 24,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#FF6F2B',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#fff',
  },
  addressButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  addressText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  addressPlaceholder: {
    fontSize: 15,
    color: '#ccc',
  },
  daySelector: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  dayButton: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dayButtonActive: {
    borderColor: '#FF6F2B',
    backgroundColor: '#FF6F2B',
  },
  dayButtonText: {
    fontSize: 15,
    color: '#666',
  },
  dayButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  timeInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  timeText: {
    fontSize: 15,
    color: '#333',
  },
  timePlaceholder: {
    fontSize: 15,
    color: '#ccc',
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
