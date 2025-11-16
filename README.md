# StackNScroll

> 나중에 보려고 저장했지만 잊어버린 것들, 생각 없이 스크롤만 해도 다시 만나게 해주는 초저에너지 정보 피드.

## 기술 스택

- **React Native** (Expo)
- **TypeScript**
- **Firebase** (Authentication, Firestore, Cloud Functions)
- **Expo Router** (파일 기반 라우팅)

## 시작하기

### 1. Firebase 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. Authentication 활성화 (Email/Password)
3. Firestore Database 생성 (프로덕션 모드)
4. 프로젝트 설정에서 웹 앱 추가
5. Firebase 설정 정보 복사

### 2. 환경 변수 설정

`.env.example` 파일을 `.env`로 복사하고 Firebase 설정 정보 입력:

```bash
cp .env.example .env
```

`.env` 파일 내용:
```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Firestore 보안 규칙 설정

Firebase Console > Firestore Database > 규칙에서:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    match /links/{linkId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }
  }
}
```

### 4. 패키지 설치

```bash
npm install
```

### 5. 개발 서버 실행

```bash
npm start
```

Expo Go 앱에서 QR 코드를 스캔하거나:

**iOS 시뮬레이터:**
```bash
npm run ios
```

**Android 에뮬레이터:**
```bash
npm run android
```

## 주요 기능

### 구현 완료 ✅
- ✅ React Native + Expo 프로젝트 구조
- ✅ Firebase 연동 (Auth, Firestore)
- ✅ Zustand 상태 관리
- ✅ 스와이프 제스처 (왼쪽: 아카이브, 오른쪽: 메모)
- ✅ 링크 카드 UI 컴포넌트
- ✅ 메모 및 태그 추가 모달
- ✅ 피드 화면 (링크 목록)
- ✅ 아카이브 화면
- ✅ Pull-to-refresh

### 다음 단계 🚀
- 🔜 사용자 인증 화면 (회원가입/로그인)
- 🔜 Share Extension (iOS/Android)
- 🔜 링크 미리보기 자동 생성 (Cloud Functions)
- 🔜 순환 무한 스크롤 구현
- 🔜 태그 기반 필터링
- 🔜 검색 기능
- 🔜 다크 모드 지원

## 프로젝트 구조

```
stacknscroll/
├── app/                 # Expo Router 화면
│   ├── (tabs)/         # 탭 네비게이션
│   └── _layout.tsx     # 루트 레이아웃
├── src/
│   ├── components/     # 재사용 컴포넌트
│   ├── services/       # Firebase 서비스
│   ├── hooks/          # 커스텀 훅
│   ├── store/          # 상태 관리
│   ├── types/          # TypeScript 타입
│   └── utils/          # 유틸리티 함수
└── functions/          # Firebase Cloud Functions
```

## 설계 문서

자세한 설계 내용은 [DESIGN.md](./DESIGN.md)를 참조하세요.

## 라이선스

MIT
