# Astrophysics Hub - API 명세서

**버전**: 1.0.0  
**기준 URL**: `https://api.astrophysics-hub.com`  
**인증**: JWT (Bearer Token)

---

## 목차
1. [인증 API](#인증-api)
2. [이론 API](#이론-api)
3. [논문 API](#논문-api)
4. [게시판 API](#게시판-api)
5. [사용자 API](#사용자-api)

---

## 인증 API

### POST /api/auth/register
**설명**: 새 사용자 회원가입

**Request**
```json
{
  "email": "user@example.com",
  "password": "securePassword123!",
  "username": "physicistKim",
  "affiliation": "Seoul National University"
}
```

**Response** (200 OK)
```json
{
  "id": "user_12345",
  "email": "user@example.com",
  "username": "physicistKim",
  "token": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  },
  "role": "user",
  "createdAt": "2025-01-20T10:30:00Z"
}
```

---

### POST /api/auth/login
**설명**: 사용자 로그인

**Request**
```json
{
  "email": "user@example.com",
  "password": "securePassword123!"
}
```

**Response** (200 OK)
```json
{
  "id": "user_12345",
  "username": "physicistKim",
  "email": "user@example.com",
  "token": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  },
  "role": "user",
  "lastLogin": "2025-01-20T10:30:00Z"
}
```

---

### POST /api/auth/refresh
**설명**: 액세스 토큰 갱신

**Request** (Header)
```
Authorization: Bearer <refreshToken>
```

**Response** (200 OK)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

---

## 이론 API

### GET /api/theory/topics
**설명**: 모든 이론 주제 목록 조회

**Query Parameters**
- `category`: (optional) `relativity`, `stars`, `galaxies`, `cosmology`, `observations`
- `limit`: (optional) 기본값 20
- `offset`: (optional) 기본값 0

**Response** (200 OK)
```json
{
  "total": 11,
  "topics": [
    {
      "id": "theory_001",
      "slug": "general-relativity",
      "title": "일반상대성이론 및 메트릭 이론",
      "category": "relativity",
      "description": "Einstein Field Equation, Schwarzschild/Kerr 메트릭...",
      "createdAt": "2024-12-01T00:00:00Z",
      "updatedAt": "2025-01-20T10:00:00Z"
    }
  ]
}
```

---

### GET /api/theory/topics/{slug}
**설명**: 특정 이론 주제 상세 조회

**Response** (200 OK)
```json
{
  "id": "theory_001",
  "slug": "general-relativity",
  "title": "일반상대성이론 및 메트릭 이론",
  "category": "relativity",
  "description": "...",
  "content": {
    "overview": "일반상대성이론은 중력을 시공간의 곡률로...",
    "keyPoints": [
      "Einstein Field Equation: Gμν = 8πGTμν",
      "..."
    ],
    "keyFormulas": [
      {
        "id": "formula_001",
        "tex": "G_{\\mu\\nu} = R_{\\mu\\nu} - \\frac{1}{2}g_{\\mu\\nu}R = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}",
        "description": "Einstein Field Equation"
      }
    ],
    "observations": "수성의 근일점 이동...",
    "relatedPapers": [
      "The Mathematical Theory of Black Holes (Chandrasekhar, 1983)"
    ]
  },
  "viewCount": 523,
  "lastModified": "2025-01-20T10:00:00Z"
}
```

---

## 논문 API

### GET /api/papers
**설명**: 논문 요약 목록 조회

**Query Parameters**
- `searchText`: (optional) 제목 또는 저자 검색
- `year`: (optional) 발행연도 필터
- `sortBy`: (optional) `date`, `relevance`, `citations`
- `limit`: (optional) 기본값 20
- `offset`: (optional) 기본값 0

**Response** (200 OK)
```json
{
  "total": 5,
  "papers": [
    {
      "id": "paper_001",
      "title": "Observation of Gravitational Waves from a Binary Black Hole Merger",
      "authors": ["Abbott, B. P.", "et al."],
      "year": 2016,
      "arxivId": "1602.03837",
      "doi": "10.1103/PhysRevLett.116.061102",
      "journal": "Physical Review Letters 116, 061102",
      "abstract": "On 14 September 2015 at 09:50:45 UTC...",
      "summary": {
        "background": "일반상대성이론 예측 100년 후...",
        "methodology": "Matched filtering 기법...",
        "theory": "Einstein Field Equation...",
        "dataAnalysis": "Advanced LIGO (2년 감지도)...",
        "results": "중성자별 비 (질량비)...",
        "limitingFactors": "검출기의 shot noise..."
      },
      "tags": ["gravitation", "LIGO", "black-holes"],
      "citations": 12540,
      "createdAt": "2024-12-10T00:00:00Z"
    }
  ]
}
```

---

### POST /api/papers/summarize
**설명**: 사용자 제공 논문 초록으로부터 요약 생성

**Request**
```json
{
  "title": "User Research on Accretion Disks",
  "abstract": "We investigate the properties of accretion disks around rotating black holes using magnetohydrodynamic simulations...",
  "authors": ["User, A."],
  "year": 2025
}
```

**Response** (200 OK)
```json
{
  "id": "paper_user_001",
  "title": "User Research on Accretion Disks",
  "summary": {
    "background": "자기유체역학 시뮬레이션을 통한...",
    "methodology": "GRMHD 수치 시뮬레이션...",
    "results": "회전 블랙홀의 강착 원판 특성...",
    "limitingFactors": "계산 해상도 및..."
  },
  "createdAt": "2025-01-20T12:00:00Z"
}
```

---

## 게시판 API

### GET /api/board/categories
**설명**: 게시판 카테고리 목록

**Response** (200 OK)
```json
{
  "categories": [
    {
      "id": 1,
      "name": "이론 및 수학",
      "description": "상대성이론, 양자효과, 미분방정식 등의 이론적 질문",
      "postCount": 156,
      "createdAt": "2024-12-01T00:00:00Z"
    }
  ]
}
```

---

### GET /api/board/categories/{categoryId}/posts
**설명**: 특정 카테고리의 게시물 목록

**Query Parameters**
- `sortBy`: (optional) `date`, `replies`, `views`
- `limit`: (optional) 기본값 20
- `offset`: (optional) 기본값 0

**Response** (200 OK)
```json
{
  "category": {
    "id": 1,
    "name": "이론 및 수학"
  },
  "total": 156,
  "posts": [
    {
      "id": "post_001",
      "title": "Schwarzschild 메트릭의 특이점: 실제 특이점 vs 좌표 특이점",
      "content": "Schwarzschild 메트릭에서 r=r_s에서의 특이점은 왜...",
      "author": {
        "id": "user_12345",
        "username": "physicistKim",
        "affiliation": "Seoul National University"
      },
      "category": 1,
      "replies": 8,
      "views": 342,
      "createdAt": "2025-01-20T10:30:00Z",
      "updatedAt": "2025-01-20T14:22:00Z",
      "tags": ["relativity", "metrics", "singularities"]
    }
  ]
}
```

---

### POST /api/board/categories/{categoryId}/posts
**설명**: 새 게시물 작성 (인증 필요)

**Request** (Header)
```
Authorization: Bearer <accessToken>
```

**Request Body**
```json
{
  "title": "New Discussion Topic",
  "content": "Let's discuss the implications of...",
  "tags": ["topic1", "topic2"]
}
```

**Response** (201 Created)
```json
{
  "id": "post_new_001",
  "title": "New Discussion Topic",
  "content": "Let's discuss the implications of...",
  "author": {
    "id": "user_12345",
    "username": "physicistKim"
  },
  "category": 1,
  "replies": 0,
  "views": 0,
  "createdAt": "2025-01-20T15:00:00Z",
  "tags": ["topic1", "topic2"]
}
```

---

### POST /api/board/posts/{postId}/comments
**설명**: 게시물에 댓글 달기 (인증 필요)

**Request**
```json
{
  "content": "Great question! I think the answer relates to coordinate singularities..."
}
```

**Response** (201 Created)
```json
{
  "id": "comment_001",
  "postId": "post_001",
  "author": {
    "id": "user_67890",
    "username": "qftPhysicist"
  },
  "content": "Great question! I think...",
  "replies": 0,
  "votes": 5,
  "createdAt": "2025-01-20T14:22:00Z"
}
```

---

## 사용자 API

### GET /api/users/profile
**설명**: 현재 사용자 프로필 조회 (인증 필요)

**Request** (Header)
```
Authorization: Bearer <accessToken>
```

**Response** (200 OK)
```json
{
  "id": "user_12345",
  "email": "user@example.com",
  "username": "physicistKim",
  "affiliation": "Seoul National University",
  "bio": "PhD student in astrophysics",
  "avatar": "https://api.astrophysics-hub.com/avatars/user_12345.jpg",
  "role": "user",
  "reputation": 345,
  "postCount": 28,
  "commentCount": 156,
  "bookmarkedPapers": 42,
  "createdAt": "2024-06-15T00:00:00Z",
  "lastLogin": "2025-01-20T10:30:00Z"
}
```

---

### PUT /api/users/profile
**설명**: 사용자 프로필 업데이트 (인증 필요)

**Request**
```json
{
  "username": "physicistKim_updated",
  "bio": "PostDoc researcher in black hole physics",
  "affiliation": "Harvard-Smithsonian Center for Astrophysics"
}
```

**Response** (200 OK)
```json
{
  "id": "user_12345",
  "username": "physicistKim_updated",
  "bio": "PostDoc researcher in black hole physics",
  "affiliation": "Harvard-Smithsonian Center for Astrophysics",
  "updatedAt": "2025-01-20T15:30:00Z"
}
```

---

### GET /api/users/bookmarks
**설명**: 사용자가 북마크한 논문 목록 (인증 필요)

**Response** (200 OK)
```json
{
  "total": 42,
  "bookmarks": [
    {
      "id": "bookmark_001",
      "paper": {
        "id": "paper_001",
        "title": "Observation of Gravitational Waves...",
        "year": 2016
      },
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

---

## 에러 응답

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Missing required field: email",
  "code": "MISSING_FIELD"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "code": "INVALID_TOKEN"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions",
  "code": "INSUFFICIENT_PERMISSIONS"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Paper not found",
  "code": "RESOURCE_NOT_FOUND"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "code": "INTERNAL_ERROR"
}
```

---

## HTTP 상태 코드

| 코드 | 설명 |
|------|------|
| 200 | OK - 요청 성공 |
| 201 | Created - 리소스 생성 성공 |
| 400 | Bad Request - 잘못된 요청 |
| 401 | Unauthorized - 인증 필요 |
| 403 | Forbidden - 권한 없음 |
| 404 | Not Found - 리소스 없음 |
| 500 | Internal Server Error - 서버 오류 |

---

## JWT 토큰 구조

**Access Token** (3600초 = 1시간 유효)
```json
{
  "iss": "astrophysics-hub",
  "sub": "user_12345",
  "email": "user@example.com",
  "role": "user",
  "iat": 1705747800,
  "exp": 1705751400
}
```

**Refresh Token** (7일 유효)
```json
{
  "iss": "astrophysics-hub",
  "sub": "user_12345",
  "type": "refresh",
  "iat": 1705747800,
  "exp": 1706352600
}
```

---

## Rate Limiting

- **일반 엔드포인트**: 분당 60 요청
- **인증 엔드포인트**: 분당 5 요청 (로그인/회원가입)
- **데이터 집약적 엔드포인트**: 분당 20 요청

응답 헤더:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1705748100
```
