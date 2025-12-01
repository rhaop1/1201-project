# GitHub Pages 배포 가이드

## 1. GitHub 저장소 생성
- GitHub에서 새 저장소 생성: https://github.com/new
- 저장소명: `1201-project`
- Public으로 설정

## 2. 로컬에서 GitHub에 푸시

```bash
# 원격 저장소 연결
git remote add origin https://github.com/YOUR_USERNAME/1201-project.git

# main 브랜치로 변경 (필요시)
git branch -M main

# 코드 푸시
git push -u origin main
```

## 3. GitHub Pages 배포

### 옵션 A: gh-pages 자동 배포 (권장)
```bash
npm run deploy
```

이 명령어가 실행하는 작업:
1. `npm run build` - dist 폴더 생성
2. `gh-pages -d dist` - dist를 gh-pages 브랜치로 배포

### 옵션 B: GitHub Actions로 자동 배포
저장소의 `.github/workflows/deploy.yml` 파일 생성:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 4. GitHub Pages 설정 확인

1. GitHub 저장소에서 **Settings** → **Pages**로 이동
2. Source: `gh-pages` 브랜치 선택
3. 저장

## 5. 배포 완료

몇 분 후 사이트가 배포됩니다:
- URL: `https://YOUR_USERNAME.github.io/1201-project/`

## 팁

- `vite.config.js`의 `base: '/1201-project/'` 설정이 중요합니다
- 매번 푸시할 때마다 `npm run deploy` 실행
- `.gitignore`에 `dist/` 포함되어 있으므로 로컬 dist는 커밋 안됨

## 문제 해결

**사이트가 404 오류 표시:**
- `vite.config.js`의 base 경로 확인
- GitHub Pages 설정에서 gh-pages 브랜치 선택 확인

**CSS/JS가 로드 안됨:**
- base 경로가 저장소명과 일치하는지 확인
- 브라우저 캐시 비우기 (Ctrl+Shift+Delete)

**사이트가 아예 안 보임:**
- `npm run build` 실행 확인
- dist 폴더 생성 확인
- gh-pages 브랜치 존재 확인 (`git branch -a`)
