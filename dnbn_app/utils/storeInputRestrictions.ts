/**
 * 스토어 회원가입 입력 제한 함수들
 * 
 * 실시간 입력 제어를 위한 유틸리티 함수
 * - 허용된 문자만 입력 가능
 * - 최대 길이 제한
 */

/**
 * 로그인 아이디 입력 제한 (영문, 숫자만 허용, 최대 15자)
 */
export const restrictLoginId = (value: string): string => {
  return value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 15);
};

/**
 * 비밀번호 입력 제한 (공백 제거, 최대 16자)
 */
export const restrictPassword = (value: string): string => {
  return value.replace(/\s/g, '').slice(0, 16);
};

/**
 * 이메일 입력 제한 (공백 제거)
 */
export const restrictEmail = (value: string): string => {
  return value.replace(/\s/g, '');
};

/**
 * 전화번호 입력 제한 (숫자만 허용, 최대 11자)
 */
export const restrictPhone = (value: string): string => {
  return value.replace(/[^0-9]/g, '').slice(0, 11);
};

/**
 * 계좌번호 입력 제한 (숫자만 허용, 최대 15자)
 */
export const restrictAccountNumber = (value: string): string => {
  return value.replace(/[^0-9]/g, '').slice(0, 15);
};

/**
 * 사업자번호 입력 제한 (숫자만 허용, 최대 10자)
 */
export const restrictBusinessNumber = (value: string): string => {
  return value.replace(/[^0-9]/g, '').slice(0, 10);
};

/**
 * 이름 입력 제한 (한글, 영문만 허용)
 */
export const restrictName = (value: string): string => {
  return value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z\s]/g, '');
};

/**
 * 사업명 입력 제한 (한글, 영문, 숫자 허용)
 */
export const restrictBusinessName = (value: string): string => {
  return value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9\s]/g, '');
};

/**
 * 업종/업태 입력 제한 (한글, 영문, 숫자, 특수문자 일부 허용)
 */
export const restrictBusinessType = (value: string): string => {
  return value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9()\s/\-,]/g, '');
};

/**
 * 전화번호 포맷팅 함수 (자동 하이픈 추가)
 * @param phone - 숫자만 포함된 전화번호
 * @returns 포맷팅된 전화번호
 */
export const formatPhone = (phone: string): string => {
  if (!phone) return '';
  
  const digitsOnly = phone.replace(/\D/g, '');
  let formatted = '';
  
  if (digitsOnly.length <= 2) {
    formatted = digitsOnly;
  } else if (digitsOnly.startsWith('02')) {
    // 02로 시작: 2-3-4 또는 2-4-4 형식 (02-123-4567 또는 02-1234-5678)
    if (digitsOnly.length <= 5) {
      formatted = `${digitsOnly.slice(0, 2)}-${digitsOnly.slice(2)}`;
    } else if (digitsOnly.length <= 9) {
      formatted = `${digitsOnly.slice(0, 2)}-${digitsOnly.slice(2, 5)}-${digitsOnly.slice(5)}`;
    } else {
      formatted = `${digitsOnly.slice(0, 2)}-${digitsOnly.slice(2, 6)}-${digitsOnly.slice(6, 10)}`;
    }
  } else {
    // 그 외 (010, 031, 070 등): 3-3-4 또는 3-4-4 형식
    if (digitsOnly.length <= 3) {
      formatted = digitsOnly;
    } else if (digitsOnly.length <= 6) {
      formatted = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
    } else if (digitsOnly.length <= 10) {
      formatted = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
    } else {
      formatted = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 7)}-${digitsOnly.slice(7, 11)}`;
    }
  }
  
  return formatted;
};

/**
 * 사업자번호 포맷팅 (123-45-67890)
 */
export const formatBusinessNumber = (bizNo: string): string => {
  if (!bizNo) return '';
  
  const digitsOnly = bizNo.replace(/\D/g, '');
  
  if (digitsOnly.length <= 3) {
    return digitsOnly;
  } else if (digitsOnly.length <= 5) {
    return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
  } else {
    return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 5)}-${digitsOnly.slice(5, 10)}`;
  }
};
