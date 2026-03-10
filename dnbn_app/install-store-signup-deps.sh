#!/bin/bash
# 스토어 회원가입 구현 후 필수 패키지 설치 스크립트

echo "🚀 스토어 회원가입 필수 패키지 설치 시작..."

# expo-checkbox 설치
echo "📦 expo-checkbox 설치 중..."
npx expo install expo-checkbox

echo "✅ 설치 완료!"
echo ""
echo "📝 다음 단계:"
echo "1. npx expo start 실행"
echo "2. app/_layout.tsx에 StoreSignupProvider 추가"
echo "3. STORE_SIGNUP_README.md 참고"
