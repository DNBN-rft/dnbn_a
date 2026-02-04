// 전화번호 포맷팅 함수
export const formatPhoneNumber = (text: string): string => {
  const numbers = text.replace(/[^0-9]/g, "");
  const limitedNumbers = numbers.slice(0, 11);

  if (limitedNumbers.length <= 3) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 7) {
    return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3)}`;
  } else {
    return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3, 7)}-${limitedNumbers.slice(7)}`;
  }
};

// 이름 검증
export const validateName = (name: string): string => {
  if (!name.trim()) {
    return "이름을 입력해주세요.";
  }
  if (name.length < 2) {
    return "이름은 2자 이상 입력해주세요.";
  }
  return "";
};

// 이메일 검증
export const validateEmail = (email: string): string => {
  if (!email.trim()) {
    return "이메일을 입력해주세요.";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "올바른 이메일 형식을 입력해주세요.";
  }
  return "";
};

// 아이디 검증
export const validateUserId = (userId: string): string => {
  if (!userId.trim()) {
    return "아이디를 입력해주세요.";
  }
  if (userId.length < 4) {
    return "아이디는 4자 이상 입력해주세요.";
  }
  return "";
};

// 전화번호 검증
export const validatePhone = (phone: string): string => {
  if (!phone.trim()) {
    return "휴대폰 번호를 입력해주세요.";
  }
  const numbers = phone.replace(/[^0-9]/g, "");
  if (numbers.length !== 11) {
    return "휴대폰 번호 11자리를 입력해주세요.";
  }
  if (!numbers.startsWith("010")) {
    return "010으로 시작하는 번호를 입력해주세요.";
  }
  return "";
};
