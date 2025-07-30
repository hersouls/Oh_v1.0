# Moonwave 오안나 음악 플레이어

> "평범함에서 특별함으로" - 재능보다 노력으로, 한계를 넘어 자신만의 빛을 찾아가는 여정을 13개의 트랙으로 표현한 음악 플레이어

## 🌟 프로덕션 배포 가이드

### 🚀 빠른 배포

```bash
# 프로덕션 빌드 및 배포
npm run deploy:prod

# 또는 배포 스크립트 사용
./scripts/deploy.sh
```

### 📋 배포 전 체크리스트

- [ ] 모든 테스트 통과
- [ ] 린팅 검사 통과
- [ ] TypeScript 타입 체크 통과
- [ ] 프로덕션 빌드 성공
- [ ] 번들 크기 최적화 확인
- [ ] SSL 인증서 설정
- [ ] 도메인 DNS 설정
- [ ] CDN 설정 (선택사항)

### 🔧 서버 설정

#### Nginx 설정

1. `nginx.conf` 파일을 서버의 nginx 설정 디렉토리에 복사
2. SSL 인증서 경로 수정
3. 루트 디렉토리 경로 수정
4. nginx 재시작

```bash
sudo cp nginx.conf /etc/nginx/sites-available/oh.moonwave.kr
sudo ln -s /etc/nginx/sites-available/oh.moonwave.kr /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### SSL 인증서 설정

Let's Encrypt 사용 예시:

```bash
sudo certbot --nginx -d oh.moonwave.kr
```

### 📦 배포 파일 구조

```
dist/
├── index.html
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── music/
├── covers/
├── manifest.json
├── sw.js
├── sitemap.xml
└── robots.txt
```

### 🔒 보안 설정

- HTTPS 강제 리다이렉트
- 보안 헤더 설정
- Rate limiting
- 파일 접근 제한
- CSP (Content Security Policy)

### ⚡ 성능 최적화

- Gzip 압축
- 정적 자산 캐싱
- 오디오 파일 캐싱
- 번들 분할
- 이미지 최적화

### 📱 PWA 기능

- 오프라인 지원
- 앱 설치 가능
- 백그라운드 동기화
- 푸시 알림 (선택사항)

### 🔍 SEO 최적화

- 메타 태그 최적화
- 구조화된 데이터
- 사이트맵
- robots.txt
- Open Graph 태그

### 📊 모니터링

- Google Analytics 설정
- 에러 로깅
- 성능 모니터링
- 사용자 행동 분석

### 🚨 문제 해결

#### 일반적인 문제들

1. **SPA 라우팅 문제**
   - nginx에서 `try_files` 설정 확인
   - 모든 경로가 `index.html`로 리다이렉트되는지 확인

2. **캐싱 문제**
   - 브라우저 캐시 클리어
   - 서버 캐시 설정 확인

3. **SSL 문제**
   - 인증서 경로 확인
   - 인증서 만료일 확인

4. **성능 문제**
   - 번들 분석 실행: `npm run analyze`
   - 이미지 최적화 확인
   - CDN 사용 고려

### 📞 지원

- 이슈 리포트: [GitHub Issues](https://github.com/hersouls/Oh_v1.0/issues)
- 이메일: support@moonwave.kr

---

## 🛠️ 개발 환경

### 필수 요구사항

- Node.js >= 18.0.0
- npm >= 8.0.0

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 테스트 실행
npm run test

# 린팅 검사
npm run lint
```

### 스크립트

- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run build:prod` - 최적화된 프로덕션 빌드
- `npm run preview` - 빌드 결과 미리보기
- `npm run test` - 테스트 실행
- `npm run lint` - 코드 린팅
- `npm run analyze` - 번들 분석
- `./scripts/deploy.sh` - 자동 배포 스크립트

## 🎵 음악 플레이어 기능

- 13곡의 완전한 음악 여정
- 고품질 오디오 재생
- 가사 싱크 기능
- 반응형 디자인
- PWA 지원
- 오프라인 재생

## 🎨 기술 스택

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Audio**: Howler.js
- **Build**: Vite
- **Testing**: Jest, Playwright
- **Deployment**: Nginx, SSL

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

**Moonwave Team** - 평범함에서 특별함으로 🌙✨
