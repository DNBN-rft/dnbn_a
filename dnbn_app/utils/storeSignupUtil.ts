import React from "react";
import { TextInput } from "react-native";

/**
 * 이메일 로컬 파트와 도메인을 합쳐 전체 이메일 주소를 반환합니다.
 * - local이 없으면 빈 문자열 반환
 * - domain이 없으면 local만 반환
 */
export const buildEmail = (local: string, domain: string): string => {
  if (!local) return "";
  if (!domain) return local;
  return `${local}@${domain}`;
};

/**
 * selectedDomain에 따라 실제 도메인 문자열을 반환합니다.
 * '직접입력'이면 직접 입력한 emailDomain을, 아니면 selectedDomain을 반환합니다.
 */
export const resolveEmailDomain = (
  emailDomain: string,
  selectedDomain: string,
): string => {
  return selectedDomain === "직접입력" ? emailDomain : selectedDomain;
};

/**
 * 스토어 회원가입용 전화번호 첫 번째 자리(3자리) 입력 핸들러
 * 숫자만 허용하고, 3자리 입력 시 다음 필드로 포커스를 이동합니다.
 */
export const handleStorePhoneFirstChange = (
  text: string,
  phoneMiddle: string,
  phoneLast: string,
  setPhoneFirst: (v: string) => void,
  phoneMiddleRef: React.RefObject<TextInput | null>,
  onUpdate: (combined: string) => void,
) => {
  const numbers = text.replace(/[^0-9]/g, "");
  const first = numbers.slice(0, 3);
  setPhoneFirst(first);
  if (numbers.length === 3) {
    phoneMiddleRef.current?.focus();
  }
  onUpdate(first + phoneMiddle + phoneLast);
};

/**
 * 스토어 회원가입용 전화번호 중간 자리(4자리) 입력 핸들러
 * 숫자만 허용하고, 4자리 입력 시 다음 필드로 포커스를 이동합니다.
 */
export const handleStorePhoneMiddleChange = (
  text: string,
  phoneFirst: string,
  phoneLast: string,
  setPhoneMiddle: (v: string) => void,
  phoneLastRef: React.RefObject<TextInput | null>,
  onUpdate: (combined: string) => void,
) => {
  const numbers = text.replace(/[^0-9]/g, "");
  const middle = numbers.slice(0, 4);
  setPhoneMiddle(middle);
  if (numbers.length === 4) {
    phoneLastRef.current?.focus();
  }
  onUpdate(phoneFirst + middle + phoneLast);
};

/**
 * 스토어 회원가입용 전화번호 마지막 자리(4자리) 입력 핸들러
 * 숫자만 허용합니다.
 */
export const handleStorePhoneLastChange = (
  text: string,
  phoneFirst: string,
  phoneMiddle: string,
  setPhoneLast: (v: string) => void,
  onUpdate: (combined: string) => void,
) => {
  const numbers = text.replace(/[^0-9]/g, "");
  const last = numbers.slice(0, 4);
  setPhoneLast(last);
  onUpdate(phoneFirst + phoneMiddle + last);
};
