# StackNScroll 빠른 시작 가이드

## 준비물
- Node.js 18+ 설치
- Firebase 계정
- iOS 시뮬레이터 또는 Android 에뮬레이터
- Expo Go 앱 (실제 기기 테스트 시)

---

## 1단계: Firebase 프로젝트 생성

### 1.1 Firebase Console에서 프로젝트 생성
1. https://console.firebase.google.com/ 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름: `stacknscroll-dev` 입력
4. Google Analytics 비활성화 (선택사항)
5. 프로젝트 생성 완료

### 1.2 Firebase 웹 앱 추가
1. 프로젝트 개요 > 웹 앱 추가 (</> 아이콘)
2. 앱 닉네임: `StackNScroll Web`
3. Firebase Hosting 설정 안 함
4. **설정 정보 복사** (다음 단계에서 사용)

```javascript
// 이런 형식의 설정이 나옵니다
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "stacknscroll-dev.firebaseapp.com",
  projectId: "stacknscroll-dev",
  storageBucket: "stacknscroll-dev.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 1.3 Authentication 활성화
1. Firebase Console > Authentication
2. "시작하기" 클릭
3. 로그인 제공업체 > "이메일/비밀번호" 활성화
4. 저장

### 1.4 Firestore Database 생성
1. Firebase Console > Firestore Database
2. "데이터베이스 만들기" 클릭
3. **테스트 모드**로 시작 (개발용)
4. 위치: `asia-northeast3` (서울) 선택
5. 사용 설정

### 1.5 Firestore 보안 규칙 설정
Firestore Database > 규칙 탭에서:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 개발 중에는 모든 접근 허용 (나중에 변경)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

"게시" 버튼 클릭

---

## 2단계: 프로젝트 환경 설정

### 2.1 환경 변수 파일 생성
```bash
cd /Users/gygygygy/Documents/code/stacknscroll
cp .env.example .env
```

### 2.2 .env 파일 수정
Firebase 설정 정보를 입력:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=stacknscroll-dev.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=stacknscroll-dev
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=stacknscroll-dev.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 2.3 패키지 설치
```bash
# 루트 디렉토리에서
npm install

# Cloud Functions 디렉토리에서
cd functions
npm install
cd ..
```

---

## 3단계: Cloud Functions 설정

### 3.1 Firebase CLI 설치 (처음 한 번만)
```bash
npm install -g firebase-tools
```

### 3.2 Firebase 로그인
```bash
firebase login
```

### 3.3 Firebase 프로젝트 초기화
```bash
firebase init
```

선택 사항:
- **Firestore**: No (이미 설정됨)
- **Functions**: Yes
  - Language: TypeScript (이미 설정됨)
  - ESLint: No
  - Dependencies: No (이미 설치됨)
  - Overwrite: No (기존 파일 유지)
- **Hosting**: No
- **Storage**: No

### 3.4 Firebase 프로젝트 연결
```bash
firebase use --add
```
- 프로젝트 선택: `stacknscroll-dev`
- Alias: `default`

---

## 4단계: 로컬 테스트 (2가지 방법)

### 방법 A: Firebase Emulator 사용 (추천)

**장점**: Cloud Functions를 배포 없이 로컬에서 테스트 가능

```bash
# 1. Emulator 설치
firebase init emulators
# Functions, Firestore, Authentication 선택

# 2. Emulator 실행
firebase emulators:start
```

**앱에서 Emulator 사용하도록 설정**

`src/services/firebase.ts` 수정 필요 (개발 시):
```typescript
// 개발 환경에서만
if (__DEV__) {
  const { connectFunctionsEmulator } = require('firebase/functions');
  const { connectFirestoreEmulator } = require('firebase/firestore');
  const { connectAuthEmulator } = require('firebase/auth');

  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectFunctionsEmulator(functions, 'localhost', 5001);
}
```

### 방법 B: Cloud Functions 실제 배포

**간단하지만 배포 필요**

```bash
# Cloud Functions 빌드 및 배포
cd functions
npm run build
firebase deploy --only functions
cd ..
```

배포 완료 후 나오는 URL 확인:
```
✔  functions[getLinkPreview(us-central1)] Successful update operation.
Function URL: https://us-central1-stacknscroll-dev.cloudfunctions.net/getLinkPreview
```

---

## 5단계: 앱 실행

### 5.1 개발 서버 시작
```bash
npm start
```

### 5.2 앱 실행 방법 선택

**A. iOS 시뮬레이터**
```bash
# 터미널에서 'i' 입력 또는
npm run ios
```

**B. Android 에뮬레이터**
```bash
# 터미널에서 'a' 입력 또는
npm run android
```

**C. 실제 기기 (Expo Go)**
1. 앱스토어에서 "Expo Go" 설치
2. QR 코드 스캔

---

## 6단계: 기능 테스트

### 6.1 회원가입/로그인 (임시)
현재 인증 화면이 없으므로 Firebase Console에서 직접 추가:

1. Firebase Console > Authentication > Users
2. "사용자 추가" 클릭
3. 이메일: `test@example.com`
4. 비밀번호: `test1234`

**또는** 코드에서 자동 로그인 추가:

`app/(tabs)/index.tsx`에 임시 코드:
```typescript
useEffect(() => {
  // 개발용 자동 로그인
  const autoLogin = async () => {
    try {
      await signIn('test@example.com', 'test1234');
    } catch (error) {
      // 계정이 없으면 생성
      await signUp('test@example.com', 'test1234');
    }
  };
  autoLogin();
}, []);
```

### 6.2 링크 추가 테스트
1. 앱 화면에서 오른쪽 하단 **+ 버튼** 클릭
2. URL 입력: `https://github.com`
3. "추가" 버튼 클릭
4. 잠시 후 피드에 링크 카드 표시됨

### 6.3 스와이프 테스트
- **왼쪽 스와이프**: 아카이브
- **오른쪽 스와이프**: 메모 추가

### 6.4 딥링크 테스트

**iOS 시뮬레이터:**
```bash
xcrun simctl openurl booted "stacknscroll://?url=https://www.youtube.com"
```

**Android 에뮬레이터:**
```bash
adb shell am start -a android.intent.action.VIEW \
  -d "stacknscroll://?url=https://www.youtube.com"
```

---

## 문제 해결

### "Firebase not initialized" 에러
→ `.env` 파일 확인 및 앱 재시작

### "User not authenticated" 에러
→ Firebase Console에서 테스트 계정 생성 또는 자동 로그인 코드 추가

### Cloud Function 에러
→ Firebase Console > Functions > 로그 확인

### 링크 미리보기가 안 나옴
→ Cloud Functions 배포 확인 또는 Emulator 실행 확인

### Metro bundler 에러
```bash
# 캐시 삭제 후 재시작
npm start -- --reset-cache
```

---

## 빠른 체크리스트

- [ ] Firebase 프로젝트 생성
- [ ] Authentication 활성화
- [ ] Firestore Database 생성
- [ ] `.env` 파일 설정
- [ ] `npm install` 실행
- [ ] Firebase 로그인 (`firebase login`)
- [ ] Firebase 프로젝트 연결 (`firebase use --add`)
- [ ] Cloud Functions 배포 또는 Emulator 실행
- [ ] 앱 실행 (`npm start`)
- [ ] 테스트 계정 생성
- [ ] 링크 추가 테스트

---

## 다음 단계

1. **인증 화면 추가**: 제대로 된 로그인/회원가입 UI
2. **에러 처리 개선**: 사용자 친화적인 에러 메시지
3. **오프라인 지원**: 네트워크 없을 때도 작동
4. **Native Share Extension**: Expo Dev Client로 빌드

즐거운 개발 되세요! 🚀
