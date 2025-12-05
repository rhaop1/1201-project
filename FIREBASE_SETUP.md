# Firebase 설정 가이드 (GitHub Pages 배포용)

## 현재 상태
- Firebase API 키: `src/config/firebase.js`에 저장됨 (공개 키)
- 프로젝트 ID: `shop-d542c`
- 배포 환경: GitHub Pages (`https://rhaop1.github.io/1201-project/`)

## Firebase 보안 규칙 설정

GitHub Pages에서 Firebase를 사용하려면, Firebase Console에서 보안 규칙을 다음과 같이 설정해야 합니다:

### 1. Firestore 보안 규칙
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 누구나 읽을 수 있음
    match /{document=**} {
      allow read: if request.time < timestamp.date(2026, 1, 1);
    }
    
    // 로그인한 사용자만 쓰기 가능
    match /posts/{document=**} {
      allow write: if request.auth.uid != null;
    }
    
    match /users/{document=**} {
      allow write: if request.auth.uid == resource.data.uid;
    }
  }
}
```

### 2. Authentication 설정
- **Sign-in method**: Email/Password 활성화
- **CORS 설정**: 필요 시 GitHub Pages 도메인 추가

### 3. 작동 확인

GitHub Pages 배포 후 로그인 시도:
1. 테스트 계정: `test@example.com` / `Test1234`
2. 또는 회원가입으로 새 계정 생성
3. 로그인 후 게시판 접근 가능

## Firebase 기능 활용

### 현재 구현된 기능
- ✅ 사용자 인증 (로컬스토리지 폴백)
- ✅ 게시물 저장/조회
- ✅ 댓글 기능 (로컬)
- ✅ 북마크 기능
- ✅ 사용자 프로필

### 향후 개선
- [ ] Firebase Realtime Database로 댓글 동기화
- [ ] 사용자 평판 시스템 연동
- [ ] 게시물 검색 기능 (Algolia 연동)

## 배포 체크리스트

- [x] GitHub Pages 활성화 (Settings > Pages)
- [x] React Router basename 설정 (`/1201-project/`)
- [x] Firebase 설정 파일 포함
- [x] 로컬스토리지 폴백 구현
- [x] 게시물 상세 페이지 추가
- [ ] Firebase 보안 규칙 업데이트 (수동 필요)

## 문제 해결

**Q: "Failed to get document because the client is offline" 에러**
A: 로컬스토리지 폴백이 자동으로 작동합니다. 테스트 계정으로 로그인 가능합니다.

**Q: 게시물이 저장되지 않음**
A: Firebase 보안 규칙을 확인하고, 브라우저 개발자 도구의 Console에서 오류 확인

**Q: 댓글이 보관되지 않음**
A: 현재는 세션 중에만 댓글 표시. Firebase Realtime 연동 필요

---

마지막 업데이트: 2025-12-05
