# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

자전거 대여소 api - http://data.seoul.go.kr/dataList/OA-13252/F/1/datasetView.do
카카오 맵 api - f07f8ececa44b29e030e9abeb1074c9c

그 외 .env 파일
VITE_API_KEY = AIzaSyBkIiZISy94TxHGWus2alDVc6_085BPBLA
VITE_AUTH_DOMAIN = darungi-23307.firebaseapp.com
VITE_PROJECT_ID = darungi-23307
VITE_STORAGE_BUCKET = darungi-23307.firebasestorage.app
VITE_MESSAGE_SENDER_ID = 158513898454
VITE_APP_ID = 1:158513898454:web:90f84c6aa97a806c5dba77
VITE_CLOUDINARY_CLOUD_NAME=djn5dn262
VITE_CLOUDINARY_UPLOAD_PRESET=darungi

UI 작성 가이드

1. 컬러 시스템

주요 컬러 (Primary Colors)
- 블루 (Blue): `#2563EB` (bg-blue-600)
  - 주요 버튼, 강조 요소
  - Hover: `#1D4ED8` (bg-blue-700)
  
- 화이트 (White): `#FFFFFF` (bg-white)
  - 카드 배경, 메인 배경

보조 컬러 (Secondary Colors)
- 라이트 블루: `#DBEAFE` (bg-blue-50)
  - 정보 카드 배경
  
- 그레이 스케일:
  - `#F3F4F6` (bg-gray-100) - 페이지 배경
  - `#E5E7EB` (border-gray-200) - 테두리
  - `#6B7280` (text-gray-600) - 보조 텍스트
  - `#1F2937` (text-gray-800) - 메인 텍스트

액션 컬러
- 레드 (Red): `#DC2626` (bg-red-600)
  - 로그아웃, 삭제 등 주의가 필요한 액션

---

3. 타이포그래피

폰트 크기
- 헤딩 1: `text-2xl` (24px) - 페이지 제목
- 헤딩 2: `text-xl` (20px) - 섹션 제목
- 헤딩 3: `text-lg` (18px) - 강조된 정보 (닉네임 등)
- 본문: `text-base` (16px) - 일반 텍스트
- 캡션: `text-sm` (14px) - 부가 정보
- 작은 텍스트: `text-xs` (12px) - 라벨, 가입일 등

폰트 굵기
- Bold: `font-bold` (700) - 주요 제목, 강조 정보
- Semibold: `font-semibold` (600) - 버튼 텍스트
- Medium: `font-medium` (500) - 일반 강조
- Regular: `font-normal` (400) - 기본 텍스트

---

4. 레이아웃

컨테이너
- 최대 너비: `max-w-md` (448px)
- 패딩: `p-8` (32px) - 데스크톱
- 패딩: `p-4` (16px) - 모바일
- 배경: 페이지 전체 `bg-gray-100`

간격 (Spacing)
- 섹션 간격: `mb-6` ~ `mb-8` (24px ~ 32px)
- 요소 간격: `gap-4` (16px)
- 작은 간격: `gap-2` ~ `gap-3` (8px ~ 12px)

정렬
- 중앙 정렬: 모든 주요 컨테이너는 화면 중앙에 배치
- 텍스트 정렬: 기본적으로 좌측 정렬, 제목은 중앙 정렬

---

5. 컴포넌트

버튼

Primary Button (주요 액션)
```css
bg-blue-600 text-white py-3.5 rounded-xl font-semibold
hover:bg-blue-700 transition-colors shadow-sm
```
- 용도: 메인 액션 (메인으로, 제출 등)
- 크기: 전체 너비 (`w-full`)

Secondary Button (보조 액션)
```css
bg-white border-2 border-blue-200 text-blue-600 py-2.5 rounded-lg
font-medium hover:bg-blue-50 transition-colors
```
- 용도: 로그아웃 등 덜 중요한 액션
- 크기: 전체 너비 또는 flex

Text Button (약한 액션)
```css
text-gray-400 hover:text-gray-600 py-2 text-sm font-medium
```
- 용도: 회원 탈퇴 등 위험한 액션

입력 필드 (Input)
```css
px-4 py-3 rounded-lg border border-gray-300
focus:outline-none focus:ring-2 focus:ring-blue-500
focus:border-transparent
```
- 플레이스홀더: 회색 텍스트
- 포커스: 파란색 링

카드 (Card)
```css
bg-white shadow-lg rounded-2xl p-8
```
- 메인 카드: 화이트 배경, 그림자
- 정보 카드: `bg-blue-50 rounded-xl p-6`

프로필 이미지
```css
w-28 h-28 rounded-full object-cover border-4 border-blue-100
```
- 크기: 112px × 112px
- 테두리: 라이트 블루

모달 (Modal)
```css
오버레이
fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50

모달 내용
bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl
```

---

6. 인터랙션

호버 효과
- 버튼: 색상 어두워짐 (hover:bg-blue-700)
- 링크: 밑줄 표시 (hover:underline)
- 트랜지션: `transition-colors` 적용

포커스
- 입력 필드: 파란색 링 (`focus:ring-2 focus:ring-blue-500`)
- 아웃라인 제거: `focus:outline-none`

트랜지션
- 기본: `transition-colors` - 색상 변화
- 속도: 기본값 (150ms)

---

7. 반응형 디자인

브레이크포인트
- 모바일: 기본 (< 768px)
- 태블릿: `md:` (≥ 768px)
- 데스크톱: `lg:` (≥ 1024px)

반응형 패턴
- 패딩: `p-4` (모바일) → `p-8` (데스크톱)
- 컨테이너: `max-w-md`로 최대 너비 제한
- 이미지: 고정 크기 유지

---

8. 접근성

기본 원칙
- 충분한 색상 대비 (WCAG AA 이상)
- 클릭 영역 최소 44px × 44px
- alt 속성 필수 포함

키보드 네비게이션
- Tab 키로 모든 인터랙티브 요소 접근 가능
- 포커스 상태 시각적으로 표시

---

9. 애니메이션

사용 가이드
- 최소한으로 사용 (버튼 호버, 트랜지션만)
- 빠른 속도 유지 (150ms 이하)
- `transition-colors` 사용

---

10. 예시 페이지

로그인 / 회원가입
- 중앙 배치 카드
- 입력 필드 세로 배치
- Primary 버튼 + 하단 링크

마이페이지
- 프로필 이미지 상단 중앙
- 정보 카드 (블루 배경)
- 버튼 계층 구조 (Primary → Secondary → Text)

메인 페이지
- (추후 작성)

---

11. 체크리스트

새로운 페이지나 컴포넌트 작성 시 확인사항:

- [ ] 컬러 시스템 준수 (블루 & 화이트)
- [ ] 일관된 간격 사용 (mb-6, gap-4 등)
- [ ] 버튼 계층 구조 명확
- [ ] 반응형 대응 (max-w-md, 패딩 조정)
- [ ] 호버/포커스 상태 구현
- [ ] 접근성 고려 (alt, 대비, 키보드)
- [ ] 트랜지션 효과 추가

---

12. 참고사항

사용 기술
- 프레임워크: React + TypeScript
- 스타일링: Tailwind CSS v3
- 라우팅: React Router
- 인증: Firebase Authentication

파일 구조
```
src/
  ├── components/     # 재사용 컴포넌트
  ├── pages/         # 페이지 컴포넌트
  │   ├── Login.tsx
  │   ├── Signup.tsx
  │   └── MyPage.tsx
  ├── firebase.ts    # Firebase 설정
  └── index.css      # Tailwind 설정
```

---

마지막 업데이트: 2025.11.20