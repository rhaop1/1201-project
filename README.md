# 🌌 Astrophysics Hub - 천체물리학 연구 플랫폼

현대적이고 인터랙티브한 천체물리학 학습 및 연구 플랫폼입니다.

## ✨ 주요 기능

- ✅ **이론 학습** - 6개 핵심 주제 (일반상대성이론, 항성물리학, 은하동역학, 우주론, 관측기법, 블랙홀)
- ✅ **논문 요약** - LIGO, EHT, JWST 등 최신 연구 논문의 구조적 분석
- ✅ **커뮤니티 게시판** - 연구자들의 토론 및 질문 공간
- ✅ **26개 용어 사전** - A-Z 천체물리학 용어
- ✅ **참고 자료** - 교과서, 데이터베이스, 시뮬레이션 도구
- ✅ **Firebase 통합** - 클라우드 기반 인증 및 실시간 데이터 저장
- ✅ **다크/라이트 모드** - 편리한 테마 전환
- ✅ **프레젠테이션 애니메이션** - 발표 보여주기식 부드러운 모션 효과

## 🛠️ 기술 스택

**Frontend:**
- React 18 + React Router v6
- Tailwind CSS 3.3
- Framer Motion (애니메이션)
- Firebase SDK (인증 & Firestore)
- Vite 5.4 (빌드 도구)

**Backend (선택):**
- Firebase Authentication (OAuth)
- Firestore (실시간 데이터베이스)
- Firebase Storage (파일 저장)

## 🚀 빠른 시작

### 1. 저장소 클론
```bash
git clone https://github.com/rhaop1/1201-project.git
cd 1201-project
```

### 2. 패키지 설치
```bash
npm install
```

### 3. Firebase 설정

#### 3.1 Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com) 방문
2. 새 프로젝트 생성 (프로젝트명: `astrophysics-hub`)

#### 3.2 웹앱 등록 및 환경 변수 설정
1. 프로젝트에서 웹앱(`</>`) 추가
2. 표시된 SDK 코드에서 설정값 복사
3. 프로젝트 루트에 `.env` 파일 생성:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### 3.3 Firebase 서비스 활성화

**Authentication (인증):**
- Build → Authentication → Sign-in method
- "이메일/비밀번호" 활성화

**Firestore Database (데이터베이스):**
- Build → Firestore Database → 데이터베이스 만들기
- 위치: `asia-northeast1` (도쿄)
- 보안 규칙 (테스트용, 프로덕션은 강화 필요):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. 개발 서버 시작
```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속 ✨

## 📁 프로젝트 구조

```
1201-project/
├── src/
│   ├── config/
│   │   └── firebase.js              # Firebase 초기화
│   ├── context/
│   │   └── ThemeContext.jsx         # 테마 관리
│   ├── components/
│   │   ├── Header.jsx               # 네비게이션 헤더
│   │   ├── Layout.jsx               # 페이지 레이아웃
│   │   ├── Login.jsx                # 로그인 (Firebase)
│   │   ├── Signup.jsx               # 회원가입 (Firebase)
│   │   ├── ProtectedRoute.jsx       # 보호된 라우트
│   │   ├── MathDisplay.jsx          # LaTeX 수식 렌더링
│   │   └── ScrollProgressBar.jsx    # 스크롤 진행도
│   ├── pages/
│   │   ├── Home.jsx                 # 홈페이지 + 애니메이션
│   │   ├── Concepts.jsx             # 이론 개념 + 애니메이션
│   │   ├── ConceptDetail.jsx        # 개념 상세
│   │   ├── PaperSummary.jsx         # 논문 요약
│   │   ├── Forum.jsx                # 게시판
│   │   ├── Glossary.jsx             # 용어 사전
│   │   ├── References.jsx           # 참고 자료
│   │   ├── Profile.jsx              # 프로필 (보호됨)
│   │   └── Bookmarks.jsx            # 북마크 (보호됨)
│   ├── utils/
│   │   ├── auth.js                  # 인증 유틸리티
│   │   ├── firebaseService.js       # Firebase 서비스
│   │   └── animations.js            # 애니메이션 프리셋
│   ├── data/
│   │   └── content.js               # 콘텐츠 데이터 (6주제, 5논문, 26용어)
│   ├── App.jsx                      # 라우팅 설정
│   ├── main.jsx                     # 진입점
│   └── index.css                    # 전역 스타일
├── docs/
│   ├── API_SPECIFICATION.md         # API 명세 (50+ 엔드포인트)
│   └── DATABASE_SCHEMA.md           # Firestore 스키마 설계
├── public/
├── .env.example                     # 환경 변수 템플릿
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 🎨 애니메이션 기능

**Framer Motion 기반 프레젠테이션 효과:**

- 🔄 **페이드인/슬라이드** - 부드러운 페이지 전환
- 📊 **스크롤 애니메이션** - 화면에 들어올 때 순차 애니메이션
- 🎯 **카드 호버** - 마우스 호버 시 확대 및 그림자 효과
- 🔘 **버튼 상호작용** - 클릭 시 탭 애니메이션
- 🎬 **컨테이너 애니메이션** - 자식 요소들의 순차 애니메이션

**사용 예시:**
```jsx
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../utils/animations';

<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
>
  {items.map((item, idx) => (
    <motion.div key={idx} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

## 🔐 인증 시스템

### Firebase Authentication 플로우

**회원가입:**
1. 이메일, 비밀번호, 사용자명 입력
2. Firebase Authentication에서 계정 생성
3. Firestore에 사용자 프로필 저장
4. 로그인 페이지로 리다이렉트

**로그인:**
1. 이메일/비밀번호 인증
2. 로컬스토리지에 사용자 정보 저장
3. 홈페이지로 리다이렉트

**보호된 라우트:**
```jsx
<ProtectedRoute>
  <Forum />
</ProtectedRoute>
```
인증되지 않은 사용자는 자동으로 로그인 페이지로 이동

## 📊 콘텐츠 규모

| 항목 | 수량 | 특징 |
|------|------|------|
| **이론 주제** | 6개 | 연구자 수준, 40+ LaTeX 수식 |
| **논문 요약** | 5개 | LIGO, EHT, JWST, 암흑물질 등 |
| **용어 사전** | 26개 | A-Z 천체물리학 용어 |
| **참고 자료** | 21개 | 교과서(8) + DB(6) + 도구(7) |
| **게시판 카테고리** | 6개 | 주제별 학습 공간 |
| **API 엔드포인트** | 50+ | 완전 문서화됨 |

## 📚 이론 주제

1. **일반상대성이론** - Einstein Field Eq., Schwarzschild 메트릭, 측지선
2. **항성물리학** - Lane-Emden 방정식, PP 핵융합 연쇄반응
3. **블랙홀 천체물리학** - Kerr 메트릭, ISCO, Hawking 복사
4. **은하동역학** - Jeans 방정식, NFW 프로필, ΛCDM
5. **우주론** - Friedmann 방정식, CMB 전력 스펙트럼
6. **관측기법** - 분광법, CCD 측광, VLBI 이미징

## 🛠️ 개발 명령어

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# 의존성 취약점 수정
npm audit fix --force
```

## 📝 Firestore 데이터 구조

### users 컬렉션
```json
{
  "uid": "firebase_uid",
  "email": "user@example.com",
  "username": "username",
  "affiliation": "University",
  "role": "user",
  "reputation_score": 0,
  "bookmarks": [...],
  "created_at": "ISO_DATE"
}
```

### posts 컬렉션
```json
{
  "id": "post_id",
  "author_id": "user_uid",
  "title": "Post Title",
  "content": "Post content",
  "category": "relativity",
  "likes": 0,
  "created_at": "ISO_DATE"
}
```

## 🐛 문제 해결

| 문제 | 해결 방법 |
|------|----------|
| **Firebase 연결 안 됨** | `.env` 파일 확인, API 키 재설정 |
| **인증 오류** | Firebase Console에서 이메일 로그인 활성화 확인 |
| **Firestore 오류** | 보안 규칙 확인, 데이터베이스 생성 확인 |
| **스타일 적용 안 됨** | `npm run build` 후 재시작 |
| **애니메이션 버벅** | 브라우저 하드웨어 가속 활성화 |

## 📚 참고 자료

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Official Docs](https://react.dev)
- [Tailwind CSS Guide](https://tailwindcss.com)
- [Framer Motion Docs](https://www.framer.com/motion)
- [Vite Guide](https://vitejs.dev)

## 📄 라이선스

MIT License - 교육 및 오픈소스 목적으로 자유롭게 사용 가능

## 🎓 학습 경로

1. **입문** - 홈페이지에서 주요 개념 미리보기
2. **기초** - Concepts에서 6가지 주제 학습
3. **심화** - 각 개념의 상세 페이지에서 수식과 관측 사례 확인
4. **연구** - Papers에서 최신 논문 요약 검토
5. **토론** - Forum에서 연구자들과 상호작용

## 👥 개발자

**주도 개발자**: @rhaop1  
**마지막 업데이트**: 2025년 1월  
**프로젝트 상태**: 🚀 적극 개발 중

---

**천체물리학과 함께 우주를 탐험해보세요! 🌠✨**
