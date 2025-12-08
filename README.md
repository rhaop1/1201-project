# 🌌 Astrophysics Hub - 천체물리학 연구 플랫폼

GitHub Pages에서 배포되는 현대적이고 인터랙티브한 천체물리학 학습 및 연구 플랫폼입니다.

**🌐 라이브 데모**: [https://rhaop1.github.io/1201-project/](https://rhaop1.github.io/1201-project/)

## ✨ 주요 기능

- ✅ **이론 학습** - 14개 우주 이론 (일반상대성이론, 항성물리학, 은하동역학, 우주론, 관측기법, 블랙홀 등)
- ✅ **인터랙티브 시각화** - 7개 데이터 차트 (중력파, 우주 배경 복사, 암흑물질 등)
- ✅ **과학 계산기** - 5개 물리 계산 도구 (블랙홀, 항성, 우주론 등)
- ✅ **학습 노트** - 사용자 개인 학습 기록 (localStorage 저장)
- ✅ **북마크** - 중요 개념 저장 및 관리
- ✅ **커뮤니티 게시판** - 실시간 토론 및 댓글 시스템 (localStorage 기반)
- ✅ **용어 사전** - 50+ 천체물리학 용어
- ✅ **참고 자료** - 20+ 교과서, 데이터베이스, 시뮬레이션 도구
- ✅ **GitHub Pages 최적화** - Firebase + 로컬 저장소 하이브리드 인증
- ✅ **다크/라이트 모드** - Tailwind CSS 기반 테마 전환
- ✅ **부드러운 애니메이션** - Framer Motion 기반 프레젠테이션 효과
- ✅ **반응형 디자인** - 모바일/태블릿/데스크톱 완벽 지원

## 🛠️ 기술 스택

**Frontend:**
- React 18 + React Router v6
- Tailwind CSS 3.3 + Dark Mode
- Framer Motion (애니메이션)
- Vite 5.4 (번들러)
- KaTeX (LaTeX 수식 렌더링)
- Recharts (데이터 시각화)

**인증 시스템 (하이브리드):**
- Firebase Authentication (회원가입/로그인)
- 로컬 저장소 백업 (GitHub Pages 오프라인 지원)
- 자동 폴백 (Firebase 실패 시 로컬 저장소 사용)

**호스팅:**
- GitHub Pages (정적 사이트 배포)
- Vite 빌드 출력: `/docs` 폴더
- Base URL: `/1201-project/`

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

### 3. 개발 서버 시작
```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속 ✨

### 4. 프로덕션 빌드
```bash
npm run build
```

빌드 결과는 `/docs` 폴더에 생성되며, GitHub Pages에 자동 배포됩니다.

## 📁 프로젝트 구조

```
1201-project/
├── src/
│   ├── config/
│   │   └── firebase.js                    # Firebase 초기화 설정
│   ├── context/
│   │   └── ThemeContext.jsx               # 테마 관리 (다크/라이트)
│   ├── components/
│   │   ├── Header.jsx                     # 네비게이션 헤더
│   │   ├── Layout.jsx                     # 페이지 레이아웃
│   │   ├── Login.jsx                      # 로그인 페이지
│   │   ├── Signup.jsx                     # 회원가입 페이지
│   │   ├── ProtectedRoute.jsx             # 보호된 라우트 (인증 필요)
│   │   ├── MathDisplay.jsx                # LaTeX 수식 렌더링
│   │   ├── ScrollProgressBar.jsx          # 스크롤 진행도 표시
│   │   └── ForumPostDetail.jsx            # 게시글 상세 + 댓글
│   ├── pages/
│   │   ├── Home.jsx                       # 홈페이지
│   │   ├── Concepts.jsx                   # 이론 개념 목록
│   │   ├── ConceptDetail.jsx              # 개념 상세 페이지
│   │   ├── PaperSummary.jsx               # 논문 요약
│   │   ├── Visualizations.jsx             # 7개 인터랙티브 차트
│   │   ├── Calculator.jsx                 # 5개 과학 계산기
│   │   ├── Forum.jsx                      # 게시판 (localStorage 저장)
│   │   ├── ForumPostDetail.jsx            # 게시글 상세 + 댓글
│   │   ├── Glossary.jsx                   # 50+ 용어 사전
│   │   ├── References.jsx                 # 참고 자료 링크
│   │   ├── Notes.jsx                      # 사용자 학습 노트
│   │   ├── Bookmarks.jsx                  # 북마크 관리
│   │   └── Profile.jsx                    # 프로필 (localStorage 수정)
│   ├── utils/
│   │   ├── auth.js                        # 인증 유틸리티
│   │   ├── firebaseAuthGitHub.js          # Firebase + 로컬 저장소 하이브리드
│   │   ├── virtualAuth.js                 # 순수 더미 계정 인증
│   │   └── animations.js                  # Framer Motion 애니메이션 프리셋
│   ├── data/
│   │   └── content.js                     # 모든 콘텐츠 데이터 (14이론, 7차트, 5계산기, 50용어 등)
│   ├── App.jsx                            # React Router 라우팅 설정
│   ├── main.jsx                           # 애플리케이션 진입점
│   └── index.css                          # 전역 Tailwind 스타일
├── docs/                                  # GitHub Pages 빌드 출력 (자동 생성)
│   ├── index.html
│   └── assets/
├── public/
├── vite.config.js                         # Vite 설정 (base: /1201-project/)
├── tailwind.config.js                     # Tailwind CSS 설정
├── postcss.config.js                      # PostCSS 설정
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

## 🔐 인증 시스템 (하이브리드)

GitHub Pages 배포를 위한 **Firebase + 로컬 저장소 하이브리드 인증**:

### 작동 방식

**회원가입:**
1. Firebase에 회원가입 시도 (5초 타임아웃)
2. 성공 → Firebase에 저장
3. 실패 → 자동으로 로컬 저장소(`firebaseUsers`)에 저장
4. 두 곳 모두에 사용자 정보 저장

**로그인:**
1. Firebase에서 로그인 시도 (5초 타임아웃)
2. 성공 → 로그인
3. 실패 → 로컬 저장소에서 자동 검색 후 로그인
4. 모두 실패 → 오류 메시지 표시

### 에러 처리

- `auth/email-already-in-use` → "이미 가입된 이메일입니다"
- `auth/wrong-password` → "비밀번호가 잘못되었습니다"
- `auth/user-not-found` → "등록되지 않은 계정입니다"
- Firebase 타임아웃 → 자동으로 로컬 저장소 사용

### 보안 고려사항

- 로컬 저장소 비밀번호는 Base64 인코딩 (프로토타입용, 실제 프로덕션에서는 bcrypt 권장)
- GitHub Pages에서 HTTPS 자동 적용
- 중요: 로컬 개발 시에만 로컬 저장소 사용, 프로덕션에서는 Firebase 권장

### 테스트 계정

**Firebase 사용 시:**
```
이메일: test@example.hub
비밀번호: Test1234
```

**로컬 저장소 사용 시:**
- 새로 가입한 계정으로 자동 저장

## 📊 콘텐츠 규모

| 항목 | 수량 | 특징 |
|------|------|------|
| **이론 주제** | 14개 | 관측 기법, 블랙홀, 암흑물질 등 |
| **인터랙티브 차트** | 7개 | 중력파, 우주 배경 복사, 암흑물질 탐지 등 |
| **과학 계산기** | 5개 | 블랙홀, 항성, 우주론, 중력파, 우주 확장 |
| **학습 노트** | 무제한 | 사용자 개인 기록 (localStorage) |
| **북마크** | 무제한 | 중요 개념 저장 (localStorage) |
| **게시판 글** | 무제한 | 실시간 댓글 및 대댓글 (localStorage) |
| **용어 사전** | 50+ | A-Z 천체물리학 용어 |
| **참고 자료** | 20+ | 교과서, 데이터베이스, 도구 링크 |

## 🎨 애니메이션 & 디자인

**Framer Motion 기반:**
- 🔄 페이드인/슬라이드 애니메이션
- 📊 스크롤 트리거 순차 애니메이션
- 🎯 카드 호버 효과 및 확대
- 🔘 버튼 클릭 피드백
- 📈 차트 렌더링 애니메이션

**Tailwind CSS 스타일:**
- 다크/라이트 모드 완벽 지원
- 반응형 그리드 레이아웃
- 그라데이션 배경 및 그림자
- 부드러운 색상 전환

## 🛠️ 개발 명령어

```bash
# 개발 서버 시작 (http://localhost:5173)
npm run dev

# 프로덕션 빌드 (/docs 폴더에 생성)
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 📱 로컬 저장소 데이터 구조

### forumPosts (게시판)
```javascript
localStorage.getItem('forumPosts') 
// [{id, title, content, category, author, date, replies, comments: []}]
```

### user (사용자 정보)
```javascript
localStorage.getItem('user')
// {uid, email, username, affiliation, bio, authProvider}
```

### firebaseUsers (회원 목록)
```javascript
localStorage.getItem('firebaseUsers')
// {btoa(email): {uid, email, password, username, affiliation, ...}}
```

## 🚀 GitHub Pages 배포

### 자동 배포 설정

1. **저장소 설정** → Settings → Pages
2. **Source**: Deploy from a branch
3. **Branch**: `main` / `/docs` 폴더
4. **URL**: `https://rhaop1.github.io/1201-project/`

### Vite 설정 (이미 적용됨)

```javascript
// vite.config.js
export default {
  base: '/1201-project/',
  build: {
    outDir: 'docs',
  }
}
```

### 배포 프로세스

```bash
# 1. 코드 수정 및 테스트
npm run dev

# 2. 프로덕션 빌드
npm run build

# 3. 변경사항 커밋
git add -A
git commit -m "업데이트 메시지"

# 4. GitHub에 푸시
git push origin main

# 5. GitHub Pages 자동 배포 (1-2분 소요)
# https://rhaop1.github.io/1201-project/ 에서 확인
```

## 🐛 문제 해결

| 문제 | 해결 방법 |
|------|----------|
| **로그인 안 됨** | Firebase 인증 확인 또는 새 계정 가입 시도 |
| **게시판 글이 사라짐** | localStorage 확인 (브라우저 캐시 정리 방지) |
| **프로필 수정 안 됨** | 저장 버튼 클릭 후 localStorage 확인 |
| **차트가 표시 안 됨** | 브라우저 콘솔에서 에러 확인 |
| **스타일 적용 안 됨** | `npm run build` 후 GitHub Pages 재고침 (Ctrl+F5) |
| **모바일에서 레이아웃 깨짐** | 반응형 뷰포트 확인 (Tailwind 반응형 지원) |

## 📚 참고 자료

- [React Documentation](https://react.dev)
- [Tailwind CSS Guide](https://tailwindcss.com)
- [Framer Motion Docs](https://www.framer.com/motion)
- [Vite Guide](https://vitejs.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [GitHub Pages Help](https://docs.github.com/en/pages)

## 📄 라이선스

MIT License - 교육 및 오픈소스 목적으로 자유롭게 사용 가능

## 🎓 사용 팁

### 1. 학습 경로
1. **입문** - 홈페이지에서 주요 이론 미리보기
2. **기초** - Concepts에서 14개 이론 선택해서 학습
3. **심화** - 각 개념 상세 페이지에서 수식과 설명 확인
4. **시각화** - Visualizations에서 7개 인터랙티브 차트 탐색
5. **실습** - Calculator에서 5개 과학 계산 도구 활용
6. **토론** - Forum에서 다른 학습자와 의견 공유

### 2. 데이터 저장
- **게시판 글**: 브라우저를 닫아도 자동 저장 (localStorage)
- **프로필**: 수정 후 저장 버튼 클릭 시 자동 저장
- **노트**: 입력한 내용 자동 저장
- **북마크**: 즉시 저장

### 3. 계정 관리
- **Firebase 계정**: 다른 기기에서도 로그인 가능
- **로컬 저장소**: 현재 기기에서만 사용 가능
- **프로필 수정**: Profile 페이지에서 편집 가능

## 🌟 주요 기능 하이라이트

### 🔬 과학 계산기
- **Schwarzschild 반지름**: 블랙홀 크기 계산
- **항성 질량**: 항성 밝기에서 질량 추정
- **우주 확장**: 허블 상수로 거리 계산
- **중력파 진동수**: LIGO 감지 주파수 계산
- **암흑물질 밀도**: 우주론적 매개변수로 계산

### 📊 시각화 차트
- **중력파 스펙트럼**: LIGO/Virgo 감지 범위
- **우주 배경 복사**: 전력 스펙트럼 분석
- **암흑물질 탐지**: WIMP 상호작용 단면
- **항성 진화**: HR 다이어그램
- **우주 확장 히스토리**: z 적색편이 vs 시간
- **은하 회전곡선**: 암흑물질 분포
- **은하 구조**: 거리-속도 분포

## 👨‍💻 개발 상태

| 기능 | 상태 | 설명 |
|------|------|------|
| 이론 학습 | ✅ 완성 | 14개 주제, 50+ 수식 |
| 시각화 | ✅ 완성 | 7개 인터랙티브 차트 |
| 계산기 | ✅ 완성 | 5개 과학 계산 도구 |
| 게시판 | ✅ 완성 | 실시간 댓글, localStorage 저장 |
| 프로필 | ✅ 완성 | 사용자 정보 수정 |
| 노트 | ✅ 완성 | 개인 학습 기록 |
| 북마크 | ✅ 완성 | 중요 개념 저장 |
| Firebase | ✅ 완성 | 하이브리드 인증 |
| GitHub Pages | ✅ 완성 | 자동 배포 설정 |

## 📞 피드백 & 기여

이 프로젝트는 개방적입니다. 버그 리포트, 기능 제안, 코드 개선사항은 GitHub Issues를 통해 제출해주세요.

## 👨‍🔬 개발자

**주도 개발자**: [@rhaop1](https://github.com/rhaop1)  
**프로젝트**: Astrophysics Hub  
**라이센스**: MIT  
**상태**: 🚀 적극 개발 중  
**마지막 업데이트**: 2025년 12월

---

**🌠 천체물리학의 신비로운 우주를 함께 탐험해보세요! ✨**
