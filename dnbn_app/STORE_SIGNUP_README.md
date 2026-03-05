# 스토어 회원가입 구현 완료 ✅

## 📦 설치된 패키지

기존 프로젝트에 이미 설치되어 있는 패키지:
- ✅ `@react-native-community/datetimepicker` (8.4.4)
- ✅ `expo-image-picker` (~17.0.10)
- ✅ `react-native-webview` (^13.15.0)

추가로 설치가 필요한 패키지:
- ❌ `expo-checkbox` (Checkbox 컴포넌트)

## 🚀 설치 명령어

```bash
# expo-checkbox 설치
npx expo install expo-checkbox
```

## 📁 생성된 파일 목록

### 1️⃣ 타입 정의
- `types/store-signup.types.ts` - 회원가입 타입 정의

### 2️⃣ Context
- `contexts/StoreSignupContext.tsx` - 전역 상태 관리

### 3️⃣ Utils
- `utils/storeInputRestrictions.ts` - 입력 제한 함수
- `utils/storeSignupValidation.ts` - 유효성 검사 함수

### 4️⃣ 화면 (5단계)
- `app/(auth)/store-signup-agreement.tsx` - Step 0: 약관 동의
- `app/(auth)/store-signup-agreement.styles.ts`
- `app/(auth)/store-signup-member-info.tsx` - Step 1: 회원 정보
- `app/(auth)/store-signup-member-info.styles.ts`
- `app/(auth)/store-signup-biz-info.tsx` - Step 2: 사업자 정보
- `app/(auth)/store-signup-biz-info.styles.ts`
- `app/(auth)/store-signup-store-info.tsx` - Step 3: 가게 정보
- `app/(auth)/store-signup-store-info.styles.ts`
- `app/(auth)/store-signup-file-upload.tsx` - Step 4: 파일 업로드
- `app/(auth)/store-signup-file-upload.styles.ts`

### 5️⃣ 컴포넌트
- `components/daum-postcode.tsx` - Daum 주소 검색 WebView
- `components/daum-postcode.styles.ts`

## 🔧 사용 방법

### 1. 의존성 설치
```bash
npx expo install expo-checkbox
```

### 2. Context Provider 추가

`app/_layout.tsx` 파일을 수정하여 `StoreSignupProvider`를 추가하세요:

```tsx
import { StoreSignupProvider } from '@/contexts/StoreSignupContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StoreSignupProvider>
        {/* 기존 코드 */}
      </StoreSignupProvider>
    </AuthProvider>
  );
}
```

### 3. 시작 화면 접근

```tsx
// 예시: 로그인 화면에서 스토어 회원가입으로 이동
import { router } from 'expo-router';

<TouchableOpacity onPress={() => router.push('/(auth)/store-signup-agreement')}>
  <Text>스토어 회원가입</Text>
</TouchableOpacity>
```

## 📋 5단계 플로우

```
Step 0: 약관 동의 
   ↓
Step 1: 회원 정보 (아이디, 비밀번호, 이메일)
   ↓
Step 2: 사업자 정보 (대표자, 사업자번호, 계좌)
   ↓
Step 3: 가게 정보 (가게명, 주소, 영업시간)
   ↓
Step 4: 파일 업로드 (가게이미지, 사업자등록증)
   ↓
회원가입 완료 → 로그인 화면
```

## 🎯 주요 기능

### ✅ 약관 동의 (Step 0)
- 전체 동의 / 개별 동의
- 필수 약관 3개 + 선택 약관 1개
- 약관 상세보기 (Modal/새 스크린, TODO)

### ✅ 회원 정보 (Step 1)
- 아이디 중복 체크 API
- 실시간 비밀번호 유효성 검사
- 이메일 형식 검증

### ✅ 사업자 정보 (Step 2)
- 사업자번호 중복 체크 API
- 전화번호 자동 포맷팅
- DateTimePicker로 개업일 선택

### ✅ 가게 정보 (Step 3)
- **Daum Postcode API 주소 검색** (WebView)
- 영업일 다중 선택 (월~일)
- TimePicker로 영업시간 설정

### ✅ 파일 업로드 (Step 4)
- expo-image-picker로 이미지 선택
- 가게 대표 이미지 1장
- 사업자등록증 최대 5장
- FormData로 multipart/form-data 전송

## 🔌 API 엔드포인트

구현된 API 호출:
- `POST /store/check-login-id` - 아이디 중복 체크
- `POST /store/check-biz-no` - 사업자번호 중복 체크
- `POST /store/signup` - 최종 회원가입 제출 (FormData)

## ⚠️ 주의사항

1. **API 엔드포인트 확인**
   - 백엔드 API 경로가 `/store/signup` 등으로 되어있는지 확인
   - 필요시 `utils/api.ts`의 `API_BASE_URL` 수정

2. **약관 상세보기**
   - 현재는 Alert로 표시
   - 실제 약관 내용을 표시할 Modal/Screen 추가 필요

3. **은행 선택**
   - Step 2에서 `bankId` 필드가 있지만 UI 미구현
   - 필요시 Picker 추가

4. **사업 유형**
   - Step 3에서 `storeType` 필드가 있지만 UI 미구현
   - 필요시 Picker 추가

## 🧪 테스트

```bash
# 개발 서버 실행
npx expo start

# iOS 시뮬레이터
npx expo start --ios

# Android 에뮬레이터
npx expo start --android
```

## 📝 TypeScript 엄격 모드

모든 코드는 `strict: true` 모드를 통과합니다:
- 모든 타입 명시
- null/undefined 안전성 보장
- any 사용 최소화

## 🎨 스타일 가이드

- StyleSheet.create 사용
- 기존 프로젝트 컬러 팔레트 유지 (#FF6F2B)
- SafeAreaView로 노치 대응
- KeyboardAvoidingView로 키보드 처리

## 🔗 통합 체크리스트

- [x] Phase 0: 기존 코드 분석
- [x] Phase 1: 기본 구조 설정 (타입, Context)
- [x] Phase 2: 유효성 검사 로직
- [x] Phase 3: 5개 화면 구현
- [x] Phase 4: 주소 검색 (Daum Postcode WebView)
- [x] Phase 5: 파일 업로드 (expo-image-picker)
- [x] Phase 6: API 연동 (기존 api.ts 활용)

## 📞 문의

구현 완료! 추가 수정이나 기능 확장이 필요하면 알려주세요.
