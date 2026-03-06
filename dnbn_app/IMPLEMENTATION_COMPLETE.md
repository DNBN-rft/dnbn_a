# 🎉 스토어 회원가입 구현 완료!

## ✅ 완료된 작업

### Phase 0: 현재 상태 분석 ✓

- 기존 AuthContext, API 클라이언트, 스타일 패턴 분석
- 네이밍 컨벤션 파악 (kebab-case 파일명, camelCase 변수)
- **결정**: 새 StoreSignupContext 생성, 기존 패턴 재사용

### Phase 1: 기본 구조 설정 ✓

**생성된 파일:**

- `types/store-signup.types.ts` - TypeScript 타입 정의
- `contexts/StoreSignupContext.tsx` - 전역 상태 관리 Context

**주요 기능:**

- 5단계 FormData 통합 관리
- Step별 updateXXX 함수 제공
- resetFormData로 초기화

### Phase 2: 유효성 검사 로직 ✓

**생성된 파일:**

- `utils/storeInputRestrictions.ts` - 실시간 입력 제한 함수
- `utils/storeSignupValidation.ts` - 단계별 유효성 검사

**주요 함수:**

- `restrictLoginId`, `restrictPassword`, `restrictPhone` 등
- `formatPhone`, `formatBusinessNumber` - 자동 포맷팅
- `validateAgreement`, `validateMemberInfo`, `validateBizInfo` 등

### Phase 3: 5개 화면 구현 ✓

**Step 0: 약관 동의**

- `app/(auth)/store-signup-agreement.tsx`
- `app/(auth)/store-signup-agreement.styles.ts`
- expo-checkbox 사용
- 전체 동의 / 개별 동의

**Step 1: 회원 정보**

- `app/(auth)/store-signup-member-info.tsx`
- `app/(auth)/store-signup-member-info.styles.ts`
- 아이디 중복 체크 API
- 실시간 비밀번호 유효성 검사

**Step 2: 사업자 정보**

- `app/(auth)/store-signup-biz-info.tsx`
- `app/(auth)/store-signup-biz-info.styles.ts`
- 사업자번호 중복 체크 API
- DateTimePicker로 개업일 선택

**Step 3: 가게 정보**

- `app/(auth)/store-signup-store-info.tsx`
- `app/(auth)/store-signup-store-info.styles.ts`
- 영업일 다중 선택 (월~일)
- TimePicker로 영업시간 설정

**Step 4: 파일 업로드**

- `app/(auth)/store-signup-file-upload.tsx`
- `app/(auth)/store-signup-file-upload.styles.ts`
- 가게 대표 이미지 1장
- 사업자등록증 최대 5장

### Phase 4: 주소 검색 (Daum Postcode) ✓

**생성된 파일:**

- `components/daum-postcode.tsx`
- `components/daum-postcode.styles.ts`

**기능:**

- react-native-webview 사용
- Daum Postcode API HTML 임베딩
- postMessage로 주소 데이터 전달
- Step 3에 통합 완료

### Phase 5: 파일 업로드 (expo-image-picker) ✓

- **Step 4**에 통합
- 갤러리/카메라 접근 권한 요청
- 이미지 미리보기 및 삭제
- FormData로 multipart/form-data 전송

### Phase 6: API 연동 ✓

- 기존 `utils/api.ts` 활용
- `apiPost` - JSON 데이터 전송
- `apiPostFormDataWithImage` - 파일 포함 전송
- 401 자동 토큰 갱신 처리

---

## 📦 설치 방법

### 1. 의존성 설치

```bash
# 실행 권한 부여 후 스크립트 실행
chmod +x install-store-signup-deps.sh
./install-store-signup-deps.sh

# 또는 직접 설치
npx expo install expo-checkbox
```

### 2. Context Provider 추가

`app/_layout.tsx`에 다음 코드 추가:

```tsx
import { StoreSignupProvider } from "@/contexts/StoreSignupContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StoreSignupProvider>{/* 기존 코드 */}</StoreSignupProvider>
    </AuthProvider>
  );
}
```

### 3. 시작 화면 연결

로그인 화면 또는 메뉴에서 스토어 회원가입 진입:

```tsx
import { router } from "expo-router";

<TouchableOpacity onPress={() => router.push("/store-signup-agreement" as any)}>
  <Text>스토어 회원가입</Text>
</TouchableOpacity>;
```

---

## 🎯 주요 기능 요약

### ✅ 전역 상태 관리

- StoreSignupContext로 5단계 데이터 통합
- 단계별 updateXXX 함수로 부분 업데이트
- resetFormData로 초기화

### ✅ 실시간 유효성 검사

- 입력 제한 함수로 허용 문자만 입력
- 비밀번호 강도 실시간 표시
- 단계별 validation 함수

### ✅ API 중복 체크

- 아이디 중복 체크
- 사업자번호 중복 체크
- ActivityIndicator로 로딩 상태 표시

### ✅ 주소 검색

- Daum Postcode API WebView
- 우편번호, 주소 자동 입력

### ✅ 파일 업로드

- expo-image-picker
- 이미지 미리보기
- 최대 개수 제한

### ✅ 최종 제출

- FormData로 multipart/form-data 전송
- 전체 데이터 검증
- 성공 시 로그인 화면 이동

---

## 📋 API 엔드포인트

```typescript
POST / store / check - login - id; // 아이디 중복 체크
POST / store / check - biz - no; // 사업자번호 중복 체크
POST / store / signup; // 최종 회원가입 (FormData)
```

**Request Body (최종 제출):**

```typescript
{
  // 회원 정보
  loginId: string,
  password: string,
  email: string,

  // 사업자 정보
  ownerNm: string,
  ownerTelNo: string,
  bizNm: string,
  bizNo: string,
  bizRegDate: string,
  bizType: string,
  storeAccNo: string,
  bankId?: string,

  // 가게 정보
  storeNm: string,
  storeTelNo: string,
  storeZipCode: string,
  storeAddr: string,
  storeDetailAddr: string,
  storeOpenDate: string[],       // JSON 배열
  storeOpenTime: string,
  storeCloseTime: string,
  storeType?: string,

  // 파일 (multipart)
  storeImage: File,                // 가게 대표 이미지
  businessDocs: File[]             // 사업자등록증 (최대 5장)
}
```

---

## 🔧 커스터마이징 가이드

### 약관 상세보기 추가

현재는 Alert로 표시됩니다. 실제 약관 내용을 보여주려면:

```tsx
// store-signup-agreement.tsx
const handleShowTerms = (type: string) => {
  // 방법 1: Modal 사용
  setTermsModalVisible(true);
  setTermsContent(termsData[type]);

  // 방법 2: 새 화면으로 이동
  router.push({
    pathname: "/terms-detail",
    params: { type },
  });
};
```

### 은행 선택 추가 (Step 2)

```tsx
import { Picker } from "@react-native-picker/picker";

<View style={styles.inputSection}>
  <Text style={styles.label}>
    은행 선택 <Text style={styles.required}>*</Text>
  </Text>
  <Picker
    selectedValue={bizInfo.bankId}
    onValueChange={(value) => updateBizInfo({ bankId: value })}
  >
    <Picker.Item label="은행 선택" value="" />
    <Picker.Item label="국민은행" value="KB" />
    <Picker.Item label="신한은행" value="SH" />
    {/* ... */}
  </Picker>
</View>;
```

### 사업 유형 선택 추가 (Step 3)

```tsx
const STORE_TYPES = [
  { label: "일반 매장", value: "RETAIL" },
  { label: "음식점", value: "RESTAURANT" },
  { label: "온라인 전용", value: "ONLINE" },
];

<View style={styles.inputSection}>
  <Text style={styles.label}>사업 유형</Text>
  <View style={styles.buttonGroup}>
    {STORE_TYPES.map((type) => (
      <TouchableOpacity
        key={type.value}
        style={[
          styles.typeButton,
          storeInfo.storeType === type.value && styles.typeButtonActive,
        ]}
        onPress={() => updateStoreInfo({ storeType: type.value })}
      >
        <Text>{type.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
</View>;
```

---

## ⚠️ 알려진 이슈 및 해결

### 1. expo-checkbox import 에러

**문제:** `Cannot find module 'expo-checkbox'`

**해결:**

```bash
npx expo install expo-checkbox
```

### 2. 라우팅 타입 에러

**문제:** `Argument of type ... is not assignable`

**해결:** 이미 `as any`로 타입 단언 처리됨 (임시)

**근본 해결:** `app/(auth)` 폴더 구조 확인 후 정확한 경로 사용

### 3. StyleSheet import 에러

VSCode가 파일을 인식하지 못할 때 발생. 파일은 생성되어 있으므로:

- VSCode 재시작
- TypeScript 서버 재시작 (CMD+Shift+P → "Reload Window")

---

## 🧪 테스트 체크리스트

### Step 0: 약관 동의

- [ ] 개별 약관 체크/해제
- [ ] 전체 약관 동의 버튼
- [ ] 필수 약관 미동의 시 다음 불가

### Step 1: 회원 정보

- [ ] 아이디 6자 미만 입력 제한
- [ ] 중복 아이디 체크
- [ ] 비밀번호 강도 표시
- [ ] 비밀번호 확인 일치 검사
- [ ] 이메일 형식 검증

### Step 2: 사업자 정보

- [ ] 전화번호 자동 하이픈
- [ ] 사업자번호 포맷팅 (123-45-67890)
- [ ] 사업자번호 중복 체크
- [ ] 개업일 DatePicker

### Step 3: 가게 정보

- [ ] 주소 검색 (Daum Postcode)
- [ ] 영업일 다중 선택
- [ ] 영업 시간 TimePicker

### Step 4: 파일 업로드

- [ ] 가게 이미지 선택
- [ ] 사업자등록증 추가/삭제
- [ ] 최대 5장 제한
- [ ] 최종 제출 API 호출

---

## 📚 참고 자료

- [Expo Router](https://docs.expo.dev/router/introduction/)
- [expo-checkbox](https://docs.expo.dev/versions/latest/sdk/checkbox/)
- [expo-image-picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [react-native-webview](https://github.com/react-native-webview/react-native-webview)
- [Daum Postcode API](https://postcode.map.daum.net/guide)

---

## 🎉 완료!

모든 Phase가 완료되었습니다. 추가 기능이나 수정이 필요하면 알려주세요!

**제작:** GitHub Copilot (Claude Sonnet 4.5)
**날짜:** 2026년 3월 5일
