# Moonwave 오류 해결 가이드

## 발생한 오류들

### 1. MIME 타입 오류
```
Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "application/octet-stream"
```

**원인**: JavaScript 모듈 파일이 올바른 MIME 타입으로 서빙되지 않음

**해결 방법**:
- Nginx 설정에서 JavaScript 파일에 대한 올바른 MIME 타입 설정
- Vite 설정에서 개발 서버 헤더 추가

### 2. 404 오류들
```
GET https://oh.moonwave.kr/manifest.json 404 (Not Found)
GET https://oh.moonwave.kr/moonwave_log.png 404 (Not Found)
GET https://oh.moonwave.kr/sw.js 404 (Not Found)
```

**원인**: 정적 파일들이 빌드 과정에서 올바르게 복사되지 않거나 서버에서 찾을 수 없음

**해결 방법**:
- Vite 설정에서 `publicDir` 설정 확인
- 빌드 후 정적 파일 검증 스크립트 추가
- Nginx 설정에서 파일 경로 확인

### 3. Service Worker 등록 실패
```
SW registration failed: TypeError: Failed to register a ServiceWorker
```

**원인**: Service Worker 파일이 없거나 올바르게 서빙되지 않음

**해결 방법**:
- Service Worker 파일이 빌드 출력에 포함되는지 확인
- Nginx에서 Service Worker 파일에 대한 특별한 헤더 설정

## 적용된 해결책

### 1. Vite 설정 개선
```typescript
// vite.config.ts
export default defineConfig({
  // ... 기존 설정
  server: {
    port: 3000,
    host: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
    },
  },
  preview: {
    port: 4173,
    host: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
    },
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.ico'],
})
```

### 2. Nginx 설정 개선
```nginx
# JavaScript 모듈 파일 처리
location ~* \.(js|mjs)$ {
    add_header Content-Type "application/javascript; charset=utf-8";
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
}

# Service Worker 특별 처리
location = /sw.js {
    add_header Content-Type "application/javascript; charset=utf-8";
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
}

# Manifest 파일 특별 처리
location = /manifest.json {
    add_header Content-Type "application/json; charset=utf-8";
    add_header Cache-Control "public";
    expires 1d;
}
```

### 3. 빌드 검증 스크립트 추가
```javascript
// scripts/verify-assets.js
const requiredAssets = [
  'manifest.json',
  'moonwave_log.png',
  'sw.js',
  'robots.txt'
];

// 빌드 후 필수 파일들이 존재하는지 확인
```

### 4. 오류 처리 시스템 추가
```typescript
// src/utils/errorHandler.ts
export class ErrorHandler {
  // 전역 오류 처리
  // Service Worker 오류 처리
  // 리소스 검증
}
```

### 5. 404 페이지 개선
```typescript
// src/pages/NotFoundPage.tsx
// 사용자 친화적인 404 페이지
```

## 빌드 및 배포 체크리스트

### 빌드 전
- [ ] 의존성 설치: `npm install`
- [ ] 타입 체크: `npm run type-check`
- [ ] 린트 검사: `npm run lint`

### 빌드 후
- [ ] 빌드 성공 확인: `npm run build`
- [ ] 정적 파일 검증: `npm run verify-assets`
- [ ] 프리뷰 테스트: `npm run preview`

### 배포 전
- [ ] Nginx 설정 확인
- [ ] SSL 인증서 설정
- [ ] 정적 파일 경로 확인
- [ ] MIME 타입 설정 확인

## 문제 해결 명령어

```bash
# 의존성 재설치
npm ci

# 캐시 클리어 후 빌드
npm run clean && npm run build

# 정적 파일 검증
npm run verify-assets

# 개발 서버 실행
npm run dev

# 프로덕션 프리뷰
npm run preview
```

## 모니터링

### 오류 로깅
- 전역 오류 처리기로 모든 오류 로깅
- Service Worker 오류 별도 처리
- 리소스 로딩 실패 모니터링

### 성능 모니터링
- 빌드 크기 분석: `npm run analyze`
- 번들 크기 제한 설정
- 이미지 최적화 확인

## 추가 권장사항

1. **CDN 사용**: 정적 파일들을 CDN에 배포하여 로딩 속도 개선
2. **캐싱 전략**: 브라우저 캐싱과 서버 캐싱 최적화
3. **압축**: Gzip/Brotli 압축 활성화
4. **모니터링**: 실제 사용자 오류 모니터링 시스템 구축
5. **백업**: 정적 파일들의 백업 전략 수립