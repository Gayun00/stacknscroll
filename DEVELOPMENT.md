# 개발 가이드

## 프로젝트 구조 상세

```
stacknscroll/
├── app/                          # Expo Router 기반 화면
│   ├── _layout.tsx              # 루트 레이아웃 (GestureHandler 설정)
│   └── (tabs)/                  # 탭 네비게이션 그룹
│       ├── _layout.tsx          # 탭 레이아웃
│       ├── index.tsx            # 피드 화면
│       └── archive.tsx          # 아카이브 화면
│
├── src/
│   ├── components/              # 재사용 가능한 UI 컴포넌트
│   │   ├── LinkCard.tsx        # 링크 카드 컴포넌트
│   │   ├── SwipeableCard.tsx   # 스와이프 제스처 래퍼
│   │   └── MemoModal.tsx       # 메모/태그 추가 모달
│   │
│   ├── services/                # 외부 서비스 연동
│   │   ├── firebase.ts         # Firebase 초기화
│   │   ├── auth.ts             # 인증 서비스
│   │   └── firestore.ts        # Firestore CRUD 작업
│   │
│   ├── hooks/                   # 커스텀 React 훅
│   │   └── useLinks.ts         # 링크 데이터 관리 훅
│   │
│   ├── store/                   # Zustand 상태 관리
│   │   └── linkStore.ts        # 링크 상태 스토어
│   │
│   ├── types/                   # TypeScript 타입 정의
│   │   └── index.ts            # User, Link 등 타입
│   │
│   └── utils/                   # 유틸리티 함수
│
├── .env.example                 # 환경 변수 템플릿
├── app.config.js                # Expo 동적 설정
├── babel.config.js              # Babel 설정 (Reanimated 플러그인 포함)
├── tsconfig.json                # TypeScript 설정
└── package.json                 # 프로젝트 의존성
```

## 주요 컴포넌트 설명

### LinkCard
링크의 미리보기 정보를 표시하는 카드 컴포넌트

**Props:**
- `link: Link` - 표시할 링크 데이터
- `onPress?: () => void` - 카드 클릭 시 콜백

**특징:**
- Open Graph 이미지 표시
- 메모가 있으면 상단에 하이라이트 표시
- 태그 배지 렌더링

### SwipeableCard
왼쪽/오른쪽 스와이프 제스처를 지원하는 래퍼 컴포넌트

**Props:**
- `children: ReactNode` - 래핑할 컴포넌트
- `onSwipeLeft?: () => void` - 왼쪽 스와이프 시 아카이브
- `onSwipeRight?: () => void` - 오른쪽 스와이프 시 메모 추가

**구현:**
- `react-native-gesture-handler`의 `Gesture.Pan` 사용
- `react-native-reanimated`로 부드러운 애니메이션
- 100px 이상 스와이프 시 액션 실행

### MemoModal
메모와 태그를 추가/수정하는 모달 컴포넌트

**Props:**
- `visible: boolean` - 모달 표시 여부
- `initialMemo?: string` - 초기 메모 값
- `initialTags?: string[]` - 초기 태그 배열
- `onClose: () => void` - 모달 닫기 콜백
- `onSave: (memo: string, tags: string[]) => void` - 저장 콜백

**특징:**
- 키보드 회피 처리
- 태그 추가/제거 기능
- 스크롤 가능한 콘텐츠 영역

## 상태 관리 (Zustand)

### linkStore
전역 링크 상태를 관리하는 Zustand 스토어

**State:**
```typescript
{
  links: Link[];              // 활성 링크 목록
  archivedLinks: Link[];      // 아카이브된 링크 목록
  isLoading: boolean;         // 로딩 상태
  error: string | null;       // 에러 메시지
}
```

**Actions:**
- `setLinks(links)` - 링크 목록 설정
- `setArchivedLinks(links)` - 아카이브 목록 설정
- `addLink(link)` - 새 링크 추가
- `updateLink(linkId, updates)` - 링크 업데이트
- `deleteLink(linkId)` - 링크 삭제
- `archiveLink(linkId)` - 링크 아카이브
- `unarchiveLink(linkId)` - 링크 복원
- `setLoading(isLoading)` - 로딩 상태 변경
- `setError(error)` - 에러 설정

## Firebase 서비스

### auth.ts
사용자 인증 관련 함수

**주요 함수:**
- `signUp(email, password)` - 회원가입
- `signIn(email, password)` - 로그인
- `signOut()` - 로그아웃
- `onAuthChanged(callback)` - 인증 상태 변경 리스너
- `getCurrentUser()` - 현재 사용자 가져오기

### firestore.ts
Firestore 데이터베이스 작업

**주요 함수:**
- `createLink(userId, input)` - 새 링크 생성
- `updateLink(linkId, updates)` - 링크 업데이트
- `deleteLink(linkId)` - 링크 삭제
- `getLink(linkId)` - 단일 링크 조회
- `getUserLinks(userId, includeArchived)` - 사용자 링크 목록
- `getArchivedLinks(userId)` - 아카이브된 링크 목록
- `getLinksByTag(userId, tag)` - 태그로 필터링

## 커스텀 훅

### useLinks
링크 데이터 로딩 및 조작을 위한 훅

**반환값:**
```typescript
{
  links: Link[];
  archivedLinks: Link[];
  isLoading: boolean;
  error: string | null;
  loadLinks: () => Promise<void>;
  archiveLink: (linkId: string) => Promise<void>;
  unarchiveLink: (linkId: string) => Promise<void>;
  updateLink: (linkId: string, memo: string, tags: string[]) => Promise<void>;
}
```

**사용 예:**
```typescript
const { links, archiveLink, updateLink } = useLinks();
```

## 타입 시스템

### User
```typescript
interface User {
  uid: string;
  email: string;
  createdAt: Date;
  settings: UserSettings;
}
```

### Link
```typescript
interface Link {
  id: string;
  userId: string;
  url: string;

  // Metadata
  title: string;
  description: string;
  imageUrl: string;
  siteName: string;

  // User data
  memo: string | null;
  tags: string[];

  // State
  isArchived: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
}
```

## 스타일링 가이드

### 컬러 팔레트
```typescript
const colors = {
  primary: '#6366f1',        // Indigo
  background: '#f9fafb',     // Light gray
  card: '#ffffff',           // White
  text: {
    primary: '#111827',      // Almost black
    secondary: '#6b7280',    // Gray
    tertiary: '#9ca3af',     // Light gray
  },
  accent: {
    green: '#10b981',        // Success/Memo
    red: '#ef4444',          // Error/Archive
    indigo: '#4f46e5',       // Tag
  },
  border: '#e5e7eb',         // Border gray
};
```

### 스페이싱 시스템
```typescript
const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};
```

### 타이포그래피
```typescript
const typography = {
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
  },
  body: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal',
  },
};
```

## 개발 워크플로우

### 새 기능 추가하기

1. **타입 정의** (src/types/index.ts)
2. **서비스 함수** (src/services/)
3. **상태 관리** (src/store/)
4. **커스텀 훅** (src/hooks/)
5. **UI 컴포넌트** (src/components/)
6. **화면 구현** (app/)

### 코드 스타일

- TypeScript strict 모드 사용
- 함수형 컴포넌트 + Hooks
- 명시적 타입 정의 (any 사용 금지)
- 컴포넌트당 하나의 파일
- StyleSheet를 컴포넌트 하단에 정의

### 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드 설정 등
```

## 디버깅

### React Native Debugger
```bash
# Chrome DevTools 열기
# Expo 앱에서 Shake → "Debug remote JS"
```

### Firestore 데이터 확인
Firebase Console > Firestore Database에서 실시간 데이터 확인

### 로그 확인
```bash
# Metro 번들러 로그
npm start

# iOS 로그
npx react-native log-ios

# Android 로그
npx react-native log-android
```

## 트러블슈팅

### Gesture Handler 작동 안 함
- `GestureHandlerRootView`가 최상단에 있는지 확인
- babel.config.js에 reanimated 플러그인 확인

### Firebase 연결 실패
- .env 파일 확인
- app.config.js에서 환경 변수 로드 확인
- Firebase 프로젝트 설정 확인

### TypeScript 에러
```bash
npm run type-check
```

## 다음 구현 단계

### 1. 사용자 인증 UI
- 로그인/회원가입 화면
- 인증 상태 관리
- 보호된 라우트

### 2. Share Extension
- iOS Share Extension 설정
- Android Intent Filter 설정
- 딥링크 처리

### 3. 링크 미리보기 생성
- Cloud Functions 설정
- Open Graph 데이터 스크래핑
- 썸네일 이미지 최적화

### 4. 순환 스크롤
- FlatList onEndReached 처리
- 데이터 순환 로직
- 성능 최적화

## 참고 자료

- [Expo 공식 문서](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Firebase 문서](https://firebase.google.com/docs)
- [Zustand 문서](https://zustand-demo.pmnd.rs/)
