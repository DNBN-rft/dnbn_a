/**
 * Date 객체를 'YYYY-MM-DD' 형식의 문자열로 변환합니다.
 * 타임존 이슈를 방지하기 위해 로컬 시간 기준으로 변환합니다.
 */
export const formatDateToLocalString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * 웹 TextInput에서 입력받은 날짜 문자열을 'YYYY-MM-DD' 형식으로 포맷합니다.
 * 숫자 8자리가 완성되면 Date 객체도 함께 반환합니다.
 */
export const formatWebDateInput = (
  text: string,
): { formatted: string; parsedDate: Date | null } => {
  const digitsOnly = text.replace(/\D/g, "");
  const limited = digitsOnly.slice(0, 8);

  let formatted = limited;
  if (limited.length >= 5) {
    formatted = `${limited.slice(0, 4)}-${limited.slice(4, 6)}`;
    if (limited.length > 6) {
      formatted += `-${limited.slice(6, 8)}`;
    }
  } else if (limited.length > 4) {
    formatted = `${limited.slice(0, 4)}-${limited.slice(4)}`;
  }

  let parsedDate: Date | null = null;
  if (limited.length === 8) {
    const year = parseInt(limited.slice(0, 4));
    const month = parseInt(limited.slice(4, 6)) - 1;
    const day = parseInt(limited.slice(6, 8));
    parsedDate = new Date(year, month, day);
  }

  return { formatted, parsedDate };
};

/**
 * ISO 날짜 문자열을 'YYYY.MM.DD HH:mm' 형식(24시간제)으로 변환합니다.
 */
export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}.${month}.${day} ${hours}:${minutes}`;
};
