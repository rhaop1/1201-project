# Database Schema Design - Astrophysics Hub

**데이터베이스 시스템**: PostgreSQL 13+  
**ORM**: SQLAlchemy (Python) 또는 TypeORM (Node.js)  
**마이그레이션 도구**: Alembic 또는 Flyway

---

## 데이터베이스 구조도

```
users (인증 및 프로필)
  ├── user_roles (역할 관리)
  ├── user_bookmarks (북마크)
  └── user_activity_logs (활동 기록)

theory_topics (이론 콘텐츠)
  ├── theory_formulas (수식)
  └── theory_references (참고문헌)

papers (논문 콘텐츠)
  ├── paper_summaries (요약)
  ├── paper_equations (수식)
  ├── paper_methods (방법론)
  └── paper_citations (인용)

board_categories (게시판)
  ├── board_posts (게시물)
  │   ├── post_comments (댓글)
  │   └── post_votes (투표)
  └── post_tags (태그)
```

---

## 테이블 스키마

### 1. users (사용자)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  affiliation VARCHAR(255),
  bio TEXT,
  avatar_url VARCHAR(512),
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  reputation_score INTEGER DEFAULT 0,
  email_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_username (username),
  INDEX idx_created_at (created_at)
);
```

**Column 설명**:
- `id`: 고유 사용자 ID (UUID)
- `email`: 로그인 이메일 (고유)
- `password_hash`: bcrypt 또는 argon2로 해시된 비밀번호
- `affiliation`: 소속 기관 (대학, 연구소)
- `role`: 사용자 역할 (user, moderator, admin)
- `reputation_score`: 게시물, 댓글, 투표 기반 평판 점수
- `deleted_at`: 소프트 삭제 타임스탐프

---

### 2. user_roles (역할 관리)
```sql
CREATE TABLE user_roles (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('moderator', 'reviewer', 'contributor')),
  granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  granted_by UUID REFERENCES users(id),
  
  UNIQUE(user_id, role),
  INDEX idx_user_id (user_id)
);
```

---

### 3. user_bookmarks (북마크)
```sql
CREATE TABLE user_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  paper_id UUID REFERENCES papers(id) ON DELETE CASCADE,
  theory_id UUID REFERENCES theory_topics(id) ON DELETE CASCADE,
  bookmark_type VARCHAR(50) NOT NULL CHECK (bookmark_type IN ('paper', 'theory')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  
  UNIQUE(user_id, paper_id, theory_id),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);
```

---

### 4. theory_topics (이론 콘텐츠)
```sql
CREATE TABLE theory_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  category VARCHAR(100) NOT NULL CHECK (category IN ('relativity', 'stars', 'galaxies', 'cosmology', 'observations')),
  description TEXT NOT NULL,
  overview TEXT NOT NULL,
  content_json JSONB NOT NULL,
  author_id UUID REFERENCES users(id),
  
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  published_at TIMESTAMP,
  
  INDEX idx_slug (slug),
  INDEX idx_category (category),
  INDEX idx_created_at (created_at),
  FULLTEXT INDEX idx_title_description (title, description)
);
```

**content_json 구조**:
```json
{
  "keyPoints": ["Point 1", "Point 2"],
  "keyFormulas": [
    {
      "id": "formula_001",
      "tex": "E = mc^2",
      "description": "Mass-energy equivalence"
    }
  ],
  "observations": "Observational evidence...",
  "relatedPapers": [
    {
      "title": "Paper Title",
      "year": 2023,
      "doi": "10.1038/..."
    }
  ]
}
```

---

### 5. theory_formulas (수식)
```sql
CREATE TABLE theory_formulas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theory_id UUID NOT NULL REFERENCES theory_topics(id) ON DELETE CASCADE,
  formula_index INTEGER NOT NULL,
  latex_code TEXT NOT NULL,
  formula_description TEXT,
  category VARCHAR(100),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  
  INDEX idx_theory_id (theory_id)
);
```

---

### 6. papers (논문)
```sql
CREATE TABLE papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  authors JSONB NOT NULL,
  year INTEGER NOT NULL,
  arxiv_id VARCHAR(50),
  doi VARCHAR(100),
  journal VARCHAR(255),
  abstract TEXT NOT NULL,
  
  summary_json JSONB NOT NULL,
  
  tags JSONB DEFAULT '[]'::jsonb,
  
  submission_type VARCHAR(50) DEFAULT 'research' CHECK (submission_type IN ('research', 'review', 'user_submitted')),
  status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'peer_review', 'published', 'archived')),
  
  citation_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  submitted_by UUID REFERENCES users(id),
  verified_by UUID REFERENCES users(id),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  published_at TIMESTAMP,
  
  INDEX idx_year (year),
  INDEX idx_doi (doi),
  INDEX idx_arxiv_id (arxiv_id),
  INDEX idx_created_at (created_at),
  FULLTEXT INDEX idx_title_abstract (title, abstract)
);
```

**authors, summary_json 구조**:
```json
{
  "authors": ["Author1, A.", "Author2, B."],
  "summary": {
    "background": "...",
    "methodology": "...",
    "theory": "...",
    "data_analysis": "...",
    "results": "...",
    "limiting_factors": "..."
  }
}
```

---

### 7. paper_equations (논문 수식)
```sql
CREATE TABLE paper_equations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id UUID NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
  equation_index INTEGER NOT NULL,
  latex_code TEXT NOT NULL,
  equation_category VARCHAR(100),
  description TEXT,
  
  INDEX idx_paper_id (paper_id)
);
```

---

### 8. paper_methods (논문 방법론)
```sql
CREATE TABLE paper_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id UUID NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
  method_name VARCHAR(255),
  description TEXT NOT NULL,
  mathematical_basis TEXT,
  data_requirements JSONB,
  
  INDEX idx_paper_id (paper_id)
);
```

---

### 9. board_categories (게시판 카테고리)
```sql
CREATE TABLE board_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color_code VARCHAR(7),
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

---

### 10. board_posts (게시물)
```sql
CREATE TABLE board_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id INTEGER NOT NULL REFERENCES board_categories(id) ON DELETE RESTRICT,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  
  view_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  vote_count INTEGER DEFAULT 0,
  
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP,
  
  INDEX idx_category_id (category_id),
  INDEX idx_author_id (author_id),
  INDEX idx_created_at (created_at),
  INDEX idx_is_pinned (is_pinned),
  FULLTEXT INDEX idx_title_content (title, content)
);
```

---

### 11. post_comments (댓글)
```sql
CREATE TABLE post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES board_posts(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  
  content TEXT NOT NULL,
  
  vote_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP,
  
  INDEX idx_post_id (post_id),
  INDEX idx_parent_comment_id (parent_comment_id),
  INDEX idx_author_id (author_id),
  INDEX idx_created_at (created_at)
);
```

---

### 12. post_tags (태그)
```sql
CREATE TABLE post_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES board_posts(id) ON DELETE CASCADE,
  tag_name VARCHAR(100) NOT NULL,
  
  UNIQUE(post_id, tag_name),
  INDEX idx_post_id (post_id),
  INDEX idx_tag_name (tag_name)
);
```

---

### 13. post_votes (투표)
```sql
CREATE TABLE post_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES board_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  
  UNIQUE(post_id, user_id, vote_type),
  UNIQUE(comment_id, user_id, vote_type),
  INDEX idx_user_id (user_id)
);
```

---

### 14. user_activity_logs (활동 로그)
```sql
CREATE TABLE user_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('login', 'post_created', 'comment_added', 'vote_cast', 'paper_viewed', 'theory_viewed')),
  resource_type VARCHAR(50),
  resource_id UUID,
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  
  INDEX idx_user_id (user_id),
  INDEX idx_activity_type (activity_type),
  INDEX idx_created_at (created_at)
);
```

---

## 인덱스 및 성능 최적화

### 주요 인덱스
```sql
-- 검색 성능
CREATE INDEX idx_theory_category_created ON theory_topics(category, created_at DESC);
CREATE INDEX idx_papers_year_citations ON papers(year DESC, citation_count DESC);
CREATE INDEX idx_posts_category_created ON board_posts(category_id, created_at DESC)
  WHERE deleted_at IS NULL;

-- 조인 성능
CREATE INDEX idx_user_bookmarks_user ON user_bookmarks(user_id, created_at DESC);
CREATE INDEX idx_comments_post ON post_comments(post_id, created_at ASC);

-- 텍스트 검색 (PostgreSQL fulltext)
CREATE INDEX idx_theory_fts ON theory_topics USING GIN(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_papers_fts ON papers USING GIN(to_tsvector('english', title || ' ' || abstract));
```

---

## 데이터 정규화 및 관계

**정규화 수준**: 3NF (제3정규형)

**주요 제약조건**:
- Foreign Key: 참조 무결성
- Unique: 중복 데이터 방지
- Check: 데이터 타입 제약
- NOT NULL: 필수 필드 보장

---

## 마이그레이션 전략

### 초기 마이그레이션 파일 예시 (Alembic)
```python
# alembic/versions/001_initial_schema.py
from alembic import op
import sqlalchemy as sa

def upgrade():
    # users 테이블 생성
    op.create_table(
        'users',
        sa.Column('id', sa.UUID, primary_key=True),
        sa.Column('email', sa.String(255), unique=True, nullable=False),
        # ... 다른 컬럼
    )

def downgrade():
    op.drop_table('users')
```

---

## 백업 및 복구 전략

```bash
# 전체 데이터베이스 백업
pg_dump -U postgres astrophysics_hub > backup_$(date +%Y%m%d_%H%M%S).sql

# 특정 테이블만 백업
pg_dump -U postgres -t users astrophysics_hub > users_backup.sql

# 복구
psql -U postgres astrophysics_hub < backup_20250120_100000.sql
```

---

## 트랜잭션 관리

**격리 수준**: READ_COMMITTED (기본)

**중요 트랜잭션**:
```sql
-- 게시물 작성 + 활동 로그 기록
BEGIN TRANSACTION;
  INSERT INTO board_posts (title, content, author_id, category_id) VALUES (...);
  INSERT INTO user_activity_logs (user_id, activity_type, ...) VALUES (...);
COMMIT;

-- 투표 + 평판 점수 업데이트
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
  INSERT INTO post_votes (post_id, user_id, vote_type) VALUES (...);
  UPDATE users SET reputation_score = reputation_score + 1 WHERE id = ...;
COMMIT;
```

---

## 용량 계획

**예상 데이터 규모** (첫 5년):
- Users: ~50,000명
- Papers: ~20,000편
- Posts: ~500,000개
- Comments: ~2,000,000개

**저장소 요구량**:
- 기본 데이터: ~100 GB
- 백업: ~300 GB
- 로그: ~50 GB
- **총합**: ~450 GB

