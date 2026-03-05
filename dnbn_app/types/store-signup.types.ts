/**
 * 스토어 회원가입 타입 정의
 * 
 * 5단계 회원가입 플로우:
 * Step 0: 약관 동의 (Agreement)
 * Step 1: 회원 정보 (MemberInfo)
 * Step 2: 사업자 정보 (BizInfo)
 * Step 3: 가맹점 정보 (StoreInfo)
 * Step 4: 파일 업로드 (FileUpload)
 */

/**
 * 약관 동의 데이터
 */
export interface AgreementData {
  terms: boolean;        // [필수] 이용약관 동의
  privacy: boolean;      // [필수] 개인정보 수집이용 동의
  seller: boolean;       // [필수] 판매회원 이용약관 동의
  marketing: boolean;    // [선택] 마케팅 정보 및 알림 수신 동의
}

/**
 * 회원 정보 데이터
 */
export interface MemberInfoData {
  loginId: string;       // 로그인 아이디 (6~15자)
  password: string;      // 비밀번호 (8~16자, 영문+숫자+특수문자)
  email: string;         // 이메일 (user@example.com)
}

/**
 * 사업자 정보 데이터
 */
export interface BizInfoData {
  ownerNm: string;       // 대표 이름
  ownerTelNo: string;    // 대표 전화번호 (010-1234-5678)
  bizNm: string;         // 사업명
  bizNo: string;         // 사업자 번호 (123-45-67890)
  bizRegDate: string;    // 개업일 (YYYY-MM-DD)
  bizType: string;       // 업종/업태
  storeAccNo: string;    // 계좌번호
  bankId?: string;       // 은행 ID
}

/**
 * 가맹점(가게) 정보 데이터
 */
export interface StoreInfoData {
  storeNm: string;       // 가게 이름
  storeTelNo: string;    // 가게 전화번호
  storeZipCode: string;  // 우편번호
  storeAddr: string;     // 주소
  storeDetailAddr: string; // 상세 주소
  storeOpenDate: string[]; // 영업일 (예: ["MON", "TUE", "WED", "THU", "FRI"])
  storeOpenTime: string; // 영업 시작 시간 (HH:mm)
  storeCloseTime: string; // 영업 종료 시간 (HH:mm)
  storeType?: string;    // 사업 유형
}

/**
 * 파일 업로드 데이터
 */
export interface FileUploadData {
  storeImage: {
    uri: string;
    type: string;
    name: string;
  } | null;
  businessDocs: Array<{
    uri: string;
    type: string;
    name: string;
  }>;
}

/**
 * 전체 회원가입 폼 데이터
 */
export interface StoreSignupFormData {
  agreement: AgreementData;
  memberInfo: MemberInfoData;
  bizInfo: BizInfoData;
  storeInfo: StoreInfoData;
  fileUpload: FileUploadData;
}

/**
 * 회원가입 단계별 유효성 검사 결과
 */
export interface ValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * 회원가입 네비게이션 스택 파라미터
 */
export type StoreSignupStackParamList = {
  'store-signup-agreement': undefined;
  'store-signup-member-info': undefined;
  'store-signup-biz-info': undefined;
  'store-signup-store-info': undefined;
  'store-signup-file-upload': undefined;
};
