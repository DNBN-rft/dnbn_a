/**
 * 스토어 회원가입 유효성 검사 로직
 *
 * 각 단계별 validation 함수
 * - Step 0: 약관 동의
 * - Step 1: 회원 정보
 * - Step 2: 사업자 정보
 * - Step 3: 가맹점 정보
 * - Step 4: 파일 업로드 및 전체 검증
 */
import { ValidationResult } from "@/types/store-signup.types";

// 정규식 패턴
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W)(?=\S+$).{8,16}$/;
const phoneRegex = /^[0-9]+$/;
// 아이디: 6자 이상, 영문+숫자 혼합 필수
const loginIdRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{6,15}$/;

/**
 * 비밀번호 검증 상태 메시지 생성
 */
export const getPasswordCheckMessage = (
  password: string,
): { message: string; status: "success" | "error" | null } => {
  if (!password) {
    return { message: "", status: null };
  }

  const hasLength = password.length >= 8 && password.length <= 16;
  const hasNumber = /[0-9]/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasSpecial = /\W/.test(password);

  const errors: string[] = [];
  if (!hasLength) errors.push("8~16자");
  if (!hasNumber) errors.push("숫자");
  if (!hasLetter) errors.push("영문");
  if (!hasSpecial) errors.push("특수문자");

  if (errors.length === 0) {
    return { message: "사용 가능한 비밀번호입니다.", status: "success" };
  } else {
    return {
      message: `비밀번호는 ${errors.join(", ")}을(를) 포함해야 합니다.`,
      status: "error",
    };
  }
};

/**
 * Step 0: 약관 동의 검증
 */
export const validateAgreement = (agreement: {
  terms?: boolean;
  privacy?: boolean;
  seller?: boolean;
  marketing?: boolean;
}): ValidationResult => {
  // 필수 약관 체크 (marketing은 선택사항)
  if (!agreement.terms || !agreement.privacy) {
    return { isValid: false, message: "필수 약관에 모두 동의해주세요." };
  }

  return { isValid: true, message: "" };
};

/**
 * Step 1: 회원 정보 검증
 */
export const validateMemberInfo = (
  formData: {
    loginId?: string;
    password?: string;
    email?: string;
  },
  idCheckStatus: "idle" | "success" | "error",
  passwordConfirm: string,
): ValidationResult => {
  if (!formData.loginId || !formData.loginId.trim()) {
    return { isValid: false, message: "아이디를 입력해주세요." };
  }

  if (!loginIdRegex.test(formData.loginId)) {
    return {
      isValid: false,
      message: "아이디는 6~15자 이내 영문과 숫자를 혼합하여 입력해주세요.",
    };
  }

  if (idCheckStatus !== "success") {
    return { isValid: false, message: "아이디 중복 체크를 해주세요." };
  }

  if (!formData.password || !formData.password.trim()) {
    return { isValid: false, message: "비밀번호를 입력해주세요." };
  }

  if (!passwordRegex.test(formData.password)) {
    return {
      isValid: false,
      message: "비밀번호는 8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.",
    };
  }

  if (!passwordConfirm || !passwordConfirm.trim()) {
    return { isValid: false, message: "비밀번호 확인을 입력해주세요." };
  }

  if (formData.password !== passwordConfirm) {
    return { isValid: false, message: "비밀번호가 일치하지 않습니다." };
  }

  if (!formData.email || !formData.email.trim()) {
    return { isValid: false, message: "이메일을 입력해주세요." };
  }

  if (!emailRegex.test(formData.email)) {
    return {
      isValid: false,
      message: "유효한 이메일 형식이 아닙니다. (예: user@example.com)",
    };
  }

  return { isValid: true, message: "" };
};

/**
 * Step 2: 사업자 정보 검증
 */
export const validateBizInfo = (
  formData: {
    bizType?: string;
    storeAccNo?: string;
    bizNo?: string;
    ownerNm?: string;
    ownerTelNo?: string;
    bizNm?: string;
    bizRegDate?: string;
    bankId?: string;
  },
  bizNoDuplicate: boolean | null = null,
): ValidationResult => {
  if (!formData.ownerNm || !formData.ownerNm.trim()) {
    return { isValid: false, message: "대표 이름을 입력해주세요." };
  }

  if (!formData.ownerTelNo || !formData.ownerTelNo.trim()) {
    return { isValid: false, message: "대표 전화번호를 입력해주세요." };
  }

  if (!phoneRegex.test(formData.ownerTelNo.replace(/-/g, ""))) {
    return { isValid: false, message: "대표 전화번호는 숫자만 입력해주세요." };
  }

  if (!formData.bizNm || !formData.bizNm.trim()) {
    return { isValid: false, message: "사업명을 입력해주세요." };
  }

  if (!formData.bizNo || !formData.bizNo.trim()) {
    return { isValid: false, message: "사업자 번호를 입력해주세요." };
  }

  if (bizNoDuplicate !== false) {
    return { isValid: false, message: "사업자번호 중복 확인을 해주세요." };
  }

  if (!formData.bizRegDate) {
    return { isValid: false, message: "사업자 등록일을 입력해주세요." };
  }

  if (!formData.bizType || !formData.bizType.trim()) {
    return { isValid: false, message: "업종/업태를 입력해주세요." };
  }

  if (!formData.bankId) {
    return { isValid: false, message: "은행을 선택해주세요." };
  }

  if (!formData.storeAccNo || !formData.storeAccNo.trim()) {
    return { isValid: false, message: "계좌번호를 입력해주세요." };
  }

  return { isValid: true, message: "" };
};

/**
 * Step 3: 가맹점 정보 검증
 */
export const validateStoreInfo = (formData: {
  storeNm?: string;
  storeTelNo?: string;
  storeZipCode?: string;
  storeAddr?: string;
  storeOpenDate?: string[];
  storeOpenTime?: string;
  storeCloseTime?: string;
}): ValidationResult => {
  if (!formData.storeNm || !formData.storeNm.trim()) {
    return { isValid: false, message: "가게 이름을 입력해주세요." };
  }

  if (!formData.storeTelNo || !formData.storeTelNo.trim()) {
    return { isValid: false, message: "가게 전화번호를 입력해주세요." };
  }

  if (!phoneRegex.test(formData.storeTelNo.replace(/-/g, ""))) {
    return {
      isValid: false,
      message: "가게 전화번호는 숫자만 입력해주시기 바랍니다.",
    };
  }

  // 주소 검증
  if (!formData.storeZipCode || !formData.storeAddr) {
    return { isValid: false, message: "주소를 입력해주세요." };
  }

  if (!formData.storeOpenDate || formData.storeOpenDate.length === 0) {
    return { isValid: false, message: "영업일을 선택해주세요." };
  }

  if (!formData.storeOpenTime || !formData.storeCloseTime) {
    return { isValid: false, message: "영업시간을 입력해주세요." };
  }

  return { isValid: true, message: "" };
};

/**
 * Step 4: 파일 정보 및 전체 검증
 */
export const validateFileInfo = (
  formData: {
    loginId?: string;
    password?: string;
    email?: string;
    ownerNm?: string;
    ownerTelNo?: string;
    bizNm?: string;
    bizNo?: string;
    bizRegDate?: string;
    bankId?: string;
    storeNm?: string;
    storeTelNo?: string;
    storeZipCode?: string;
    storeAddr?: string;
    storeAccNo?: string;
    storeOpenDate?: string[];
    storeOpenTime?: string;
    storeCloseTime?: string;
    storeType?: string;
  },
  storeImage: { uri: string } | null,
  businessDocs: { uri: string }[],
): ValidationResult => {
  // Step 1 검증 (회원 정보)
  if (!formData.loginId || !formData.loginId.trim()) {
    return { isValid: false, message: "아이디가 누락되었습니다." };
  }

  if (formData.loginId.length > 15) {
    return { isValid: false, message: "아이디는 최대 15자까지 가능합니다." };
  }

  if (!formData.password || !formData.password.trim()) {
    return { isValid: false, message: "비밀번호가 누락되었습니다." };
  }

  if (!passwordRegex.test(formData.password)) {
    return {
      isValid: false,
      message: "비밀번호는 8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.",
    };
  }

  if (!formData.email || !formData.email.trim()) {
    return { isValid: false, message: "이메일이 누락되었습니다." };
  }

  if (!emailRegex.test(formData.email)) {
    return { isValid: false, message: "이메일 형식에 맞지 않습니다." };
  }

  // Step 2 검증 (사업자 정보)
  if (!formData.ownerNm || !formData.ownerNm.trim()) {
    return { isValid: false, message: "대표 이름을 입력해주세요." };
  }

  if (!formData.ownerTelNo || !formData.ownerTelNo.trim()) {
    return { isValid: false, message: "대표 전화번호를 입력해주세요." };
  }

  if (!phoneRegex.test(formData.ownerTelNo.replace(/-/g, ""))) {
    return { isValid: false, message: "대표 전화번호는 숫자만 입력해주세요." };
  }

  if (!formData.bizNm || !formData.bizNm.trim()) {
    return { isValid: false, message: "사업명을 입력해주세요." };
  }

  if (!formData.bizNo || !formData.bizNo.trim()) {
    return { isValid: false, message: "사업자 번호를 입력해주세요." };
  }

  if (!formData.bizRegDate) {
    return { isValid: false, message: "사업자 등록일을 입력해주세요." };
  }

  // Step 3 검증 (가맹점 정보)
  if (!formData.bankId) {
    return { isValid: false, message: "은행을 선택해주세요." };
  }

  if (!formData.storeNm || !formData.storeNm.trim()) {
    return { isValid: false, message: "가게 이름을 입력해주세요." };
  }

  if (!formData.storeTelNo || !formData.storeTelNo.trim()) {
    return { isValid: false, message: "가게 전화번호를 입력해주세요." };
  }

  if (!phoneRegex.test(formData.storeTelNo.replace(/-/g, ""))) {
    return {
      isValid: false,
      message: "가게 전화번호는 숫자만 입력해주시기 바랍니다.",
    };
  }

  if (!formData.storeZipCode || !formData.storeAddr) {
    return { isValid: false, message: "주소를 입력해주세요." };
  }

  if (!formData.storeAccNo || !formData.storeAccNo.trim()) {
    return { isValid: false, message: "계좌번호를 입력해주세요." };
  }

  if (!phoneRegex.test(formData.storeAccNo)) {
    return { isValid: false, message: "계좌번호는 숫자만 입력해주세요." };
  }

  if (!formData.storeOpenDate || formData.storeOpenDate.length === 0) {
    return { isValid: false, message: "영업일을 선택해주세요." };
  }

  if (!formData.storeOpenTime || !formData.storeCloseTime) {
    return { isValid: false, message: "영업시간을 입력해주세요." };
  }

  // Step 4 검증 (파일)
  if (!storeImage) {
    return { isValid: false, message: "가게 대표 이미지를 등록해주세요." };
  }

  if (businessDocs.length === 0) {
    return {
      isValid: false,
      message: "사업자 관련 서류를 등록해주세요.",
    };
  }

  return { isValid: true, message: "" };
};
