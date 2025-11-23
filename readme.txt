# 다릉이 UI 스타일 가이드

이 문서는 '다릉이' 프로젝트의 UI 일관성을 유지하기 위한 스타일 가이드입니다.

## 1. 컬러 팔레트 (Color Palette)

- **Primary (주요 색상)**
  - `blue-600`: #2563EB (주요 버튼, 링크)
  - `blue-700`: #1D4ED8 (호버 시 버튼)
  - `blue-50`: #EFF6FF (배경, 하이라이트)
  - `blue-100`: #DBEAFE (테두리, 배경)
  - `blue-200`: #BFDBFE (구분선, 테두리)

- **Secondary (보조 색상)**
  - `gray-100`: #F3F4F6 (전체 페이지 배경)
  - `gray-400`: #9CA3AF (보조 텍스트, 아이콘)
  - `gray-500`: #6B7280 (부제목)
  - `gray-600`: #4B5563 (일반 텍스트)
  - `gray-700`: #374151 (콘텐츠 텍스트)
  - `gray-800`: #1F2937 (제목)

- **Feedback (상태 표시 색상)**
  - `red-500`: #EF4444 (오류)
  - `green-500`: #22C55E (성공)

## 2. 폰트 (Typography)

- **기본 폰트**: 시스템 기본 UI 폰트 (sans-serif)
- **제목 (Heading)**
  - `h1`: 2xl (24px), font-bold
  - `h2`: xl (20px), font-bold
- **본문 (Body)**
  - 기본: base (16px), font-medium
  - 보조: sm (14px), font-normal
  - 강조: font-bold

## 3. 컴포넌트 스타일 (Component Styles)

### 버튼 (Buttons)

- **Primary Button (주요 버튼)**
  - 배경: `bg-blue-600`
  - 텍스트: `text-white`
  - 패딩: `py-3.5`
  - 둥글기: `rounded-xl`
  - 호버: `bg-blue-700`

- **Secondary Button (보조 버튼)**
  - 배경: `bg-white`
  - 텍스트: `text-blue-600`
  - 테두리: `border-2 border-blue-200`
  - 패딩: `py-2.5`
  - 둥글기: `rounded-lg`
  - 호버: `bg-blue-50`

- **Text Button (텍스트 버튼)**
  - 텍스트: `text-gray-400`
  - 호버: `text-gray-600`

### 입력 필드 (Input Fields)

- 배경: `bg-white`
- 테두리: `border border-gray-300`
- 패딩: `px-4 py-3`
- 둥글기: `rounded-lg`
- 포커스: `focus:ring-2 focus:ring-blue-500`

### 카드 / 컨테이너 (Cards / Containers)

- 배경: `bg-white`
- 둥글기: `rounded-2xl`
- 그림자: `shadow-lg`
- 패딩: `p-8`
