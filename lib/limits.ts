/** 방명록 글 입력 규칙. 폼의 maxLength와 서버 검증이 같은 값을 쓴다. */
export const LIMITS = {
  nameMaxLength: 20,
  messageMaxLength: 500,
  passwordMinLength: 4,
  passwordMaxLength: 50,
} as const;
