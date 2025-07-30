# Oh Anna Music Player E2E 테스트 가이드

## 📋 개요
이 가이드는 `oh.moonwave.kr` 음악 플레이어 애플리케이션의 E2E(End-to-End) 테스트를 실행하는 방법을 단계별로 설명합니다.

## 🚀 Step-by-Step E2E 테스트 실행

### 1단계: 환경 설정

```bash
# 프로젝트 디렉토리로 이동
cd /workspace

# 의존성 설치 (이미 설치되어 있다면 생략)
npm install

# Playwright 브라우저 설치
npx playwright install
```

### 2단계: 개발 서버 시작

```bash
# 개발 서버 시작 (백그라운드에서 실행)
npm run dev

# 또는 다른 터미널에서 실행
npm run dev &
```

### 3단계: 기본 E2E 테스트 실행

```bash
# 모든 E2E 테스트 실행
npm run test:e2e

# 또는 Playwright 직접 실행
npx playwright test
```

### 4단계: 특정 테스트 실행

```bash
# 특정 테스트 파일만 실행
npx playwright test tests/e2e/comprehensive-e2e.spec.ts

# 특정 테스트 그룹만 실행
npx playwright test --grep "Music Player Tests"

# 특정 브라우저에서만 실행
npx playwright test --project=chromium
```

### 5단계: UI 모드로 테스트 실행 (디버깅용)

```bash
# Playwright UI 모드 실행
npm run test:e2e:ui

# 또는
npx playwright test --ui
```

### 6단계: 헤드리스 모드로 테스트 실행

```bash
# 브라우저 창을 보면서 테스트 실행
npm run test:e2e:headed

# 또는
npx playwright test --headed
```

### 7단계: 디버그 모드로 테스트 실행

```bash
# 디버그 모드로 테스트 실행
npm run test:e2e:debug

# 또는
npx playwright test --debug
```

## 📊 테스트 결과 확인

### 테스트 리포트 보기

```bash
# HTML 리포트 보기
npm run test:e2e:report

# 또는
npx playwright show-report
```

### 테스트 결과 디렉토리
- `playwright-report/`: HTML 리포트
- `test-results/`: 스크린샷, 비디오, 트레이스 파일

## 🧪 테스트 시나리오별 실행

### 1. 인트로 플로우 테스트
```bash
npx playwright test --grep "Intro Flow Tests"
```

### 2. 트랙 페이지 테스트
```bash
npx playwright test --grep "Tracks Page Tests"
```

### 3. 음악 플레이어 테스트
```bash
npx playwright test --grep "Music Player Tests"
```

### 4. 반응형 디자인 테스트
```bash
npx playwright test --grep "Responsive Design Tests"
```

### 5. 성능 테스트
```bash
npx playwright test --grep "Performance Tests"
```

### 6. 접근성 테스트
```bash
npx playwright test --grep "Accessibility Tests"
```

## 🔧 문제 해결

### 웹사이트가 404 에러인 경우
현재 `oh.moonwave.kr`이 404 에러를 보여주고 있으므로, 로컬 개발 서버를 사용해야 합니다:

```bash
# 개발 서버 시작
npm run dev

# 다른 터미널에서 테스트 실행
npx playwright test
```

### 브라우저 설치 문제
```bash
# Playwright 브라우저 재설치
npx playwright install --force
```

### 테스트 타임아웃 문제
```bash
# 타임아웃 시간을 늘려서 테스트 실행
npx playwright test --timeout=60000
```

## 📱 다양한 디바이스 테스트

### 모바일 테스트
```bash
# 모바일 Chrome에서 테스트
npx playwright test --project="Mobile Chrome"

# 모바일 Safari에서 테스트
npx playwright test --project="Mobile Safari"
```

### 데스크톱 브라우저 테스트
```bash
# Chrome에서 테스트
npx playwright test --project=chromium

# Firefox에서 테스트
npx playwright test --project=firefox

# Safari에서 테스트
npx playwright test --project=webkit
```

## 🎯 CI/CD 파이프라인용 테스트

### GitHub Actions용
```bash
# CI 환경에서 테스트 실행
npm run test:e2e:ci
```

### Docker 환경에서 실행
```dockerfile
# Dockerfile 예시
FROM mcr.microsoft.com/playwright:v1.54.1-focal

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx playwright install --with-deps

CMD ["npm", "run", "test:e2e"]
```

## 📈 테스트 커버리지 확인

### 전체 테스트 실행 및 리포트 생성
```bash
# 모든 테스트 실행 후 리포트 생성
npx playwright test --reporter=html
npx playwright show-report
```

### 테스트 통계 확인
```bash
# 테스트 통계 출력
npx playwright test --reporter=list
```

## 🔍 디버깅 팁

### 실패한 테스트 디버깅
```bash
# 실패한 테스트만 재실행
npx playwright test --retries=3

# 실패한 테스트의 스크린샷 확인
ls test-results/
```

### 네트워크 문제 디버깅
```bash
# 네트워크 요청 로깅
npx playwright test --debug
```

### 성능 문제 디버깅
```bash
# 성능 메트릭 수집
npx playwright test --trace=on
```

## 📝 테스트 데이터 관리

### 테스트 데이터 설정
```bash
# 테스트 데이터 초기화
npm run test:setup

# 테스트 데이터 정리
npm run test:cleanup
```

## 🚨 주의사항

1. **웹사이트 접근성**: 현재 `oh.moonwave.kr`이 404 에러를 보여주므로 로컬 개발 서버를 사용해야 합니다.

2. **오디오 파일**: 테스트 실행 시 오디오 파일이 필요할 수 있습니다.

3. **브라우저 호환성**: 모든 주요 브라우저에서 테스트가 실행됩니다.

4. **성능**: 테스트 실행 시간은 네트워크 속도와 시스템 성능에 따라 달라질 수 있습니다.

## 📞 지원

테스트 실행 중 문제가 발생하면:
1. `playwright-report/` 디렉토리의 HTML 리포트 확인
2. `test-results/` 디렉토리의 스크린샷 및 비디오 확인
3. 콘솔 로그 확인

---

**마지막 업데이트**: 2024년 12월