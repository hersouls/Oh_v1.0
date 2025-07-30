# Moonwave 오안나 음악 플레이어

> "평범함에서 특별함으로" - 재능보다 노력으로, 한계를 넘어 자신만의 빛을 찾아가는 여정을 13개의 트랙으로 표현한 음악 플레이어

## 🎵 프로젝트 개요

Moonwave는 리듬체조 선수 오안나의 성장 여정을 담은 13곡의 음악 앨범을 위한 인터랙티브 웹 플레이어입니다. 평범함에서 특별함으로의 변화를 4단계(시작, 성장, 도전, 빛남)로 나누어 표현하며, 각 곡마다 가사와 해석을 제공합니다.

## 🌟 주요 기능

### 🎵 음악 플레이어 기능
- **13곡 완전한 음악 여정**: 오안나의 성장 스토리를 담은 13개 트랙
- **고품질 오디오 재생**: Howler.js 기반 다중 포맷 오디오 지원
- **가사 및 해석**: 각 곡의 가사와 해석 제공
- **재생 모드**: 전체재생, 반복재생, 랜덤재생
- **볼륨 및 재생 제어**: 직관적인 컨트롤 인터페이스
- **오프라인 재생**: PWA 지원으로 오프라인에서도 재생 가능

### 🎨 UI/UX 기능
- **반응형 디자인**: 모든 디바이스에서 최적화된 경험
- **글래스모피즘**: 현대적인 글래스 효과 디자인
- **웨이브 애니메이션**: 음악에 맞춘 동적 웨이브 효과
- **다크 모드 지원**: 눈에 편안한 다크 테마
- **부드러운 전환**: 페이지 간 자연스러운 애니메이션

### 📱 PWA 기능
- **앱 설치 가능**: 홈 화면에 앱으로 설치
- **오프라인 지원**: 인터넷 없이도 재생 가능
- **백그라운드 재생**: 다른 앱 사용 중에도 음악 재생
- **푸시 알림**: 새로운 업데이트 알림

## 🛠️ 기술 스택

### Frontend
- **React 19**: 최신 React 기능 활용 (startTransition, Suspense)
- **TypeScript**: 타입 안전성과 개발 생산성 향상
- **Tailwind CSS**: 커스텀 테마와 반응형 디자인
- **Radix UI**: 접근성과 사용성을 고려한 UI 컴포넌트

### Audio & Media
- **Howler.js**: 고성능 오디오 라이브러리
- **다중 포맷 지원**: MP3, OGG, WAV 등 다양한 오디오 포맷

### Build & Development
- **Vite**: 빠른 개발 서버와 최적화된 빌드
- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅

### Testing
- **Jest**: 단위 테스트
- **Playwright**: E2E 테스트
- **React Testing Library**: 컴포넌트 테스트

### Deployment
- **Nginx**: 웹 서버
- **SSL**: 보안 연결
- **GitHub Pages**: 정적 호스팅

## 📦 프로젝트 구조

```
moonwave/
├── src/                          # 소스 코드
│   ├── components/               # React 컴포넌트
│   │   ├── ui/                  # Radix UI 기반 컴포넌트
│   │   ├── IntroPage.tsx        # 인트로 페이지
│   │   ├── MainPage.tsx         # 메인 페이지
│   │   ├── DetailPage.tsx       # 상세 페이지
│   │   ├── AboutPage.tsx        # 소개 페이지
│   │   ├── MusicPlayer.tsx      # 음악 플레이어
│   │   ├── TrackCard.tsx        # 트랙 카드
│   │   ├── WaveBackground.tsx   # 웨이브 배경
│   │   ├── WaveButton.tsx       # 웨이브 버튼
│   │   ├── GlassCard.tsx        # 글래스 카드
│   │   ├── ColorShowcase.tsx    # 컬러 쇼케이스
│   │   └── Footer.tsx           # 푸터
│   ├── hooks/                   # 커스텀 훅
│   │   └── useMusicPlayer.ts    # 음악 플레이어 로직
│   ├── data/                    # 데이터
│   │   └── tracks.ts           # 13개 트랙 정보
│   ├── types/                   # TypeScript 타입
│   │   └── index.ts            # 타입 정의
│   ├── utils/                   # 유틸리티 함수
│   ├── styles/                  # 스타일 파일
│   ├── assets/                  # 정적 자산
│   ├── App.tsx                  # 메인 앱 컴포넌트
│   └── main.tsx                 # 진입점
├── public/                      # 정적 파일
│   ├── music/                   # 오디오 파일
│   ├── cover/                   # 앨범 커버
│   └── manifest.json           # PWA 매니페스트
├── docs/                        # 문서
│   ├── development-checklist.md # 개발 체크리스트
│   ├── react-checklist.md      # React 가이드
│   ├── typescript-checklist.md # TypeScript 가이드
│   ├── tailwind-checklist.md   # Tailwind 가이드
│   ├── howler-checklist.md     # Howler.js 가이드
│   ├── vite-checklist.md       # Vite 가이드
│   ├── testing-checklist.md    # 테스트 가이드
│   ├── deployment-checklist.md # 배포 가이드
│   └── 화면정의서/             # UI/UX 정의서
├── styles/                      # 글로벌 스타일
├── guidelines/                  # 개발 가이드라인
└── .github/                     # GitHub 설정
```

## 🎵 음악 트랙 구성

### Phase 1: Beginning (시작) - 1-3번 트랙
- **Silk of Ashes Part 1**: 잿더미 위에서 피어난 실크의 여정
- **Wave.exe (OH Ver.)**: 컴퓨터 프로그램의 실행 과정을 리듬체조에 비유
- **Phantom Fairy**: 환상이 아닌 현실 위에서 만들어진 요정

### Phase 2: Growth (성장) - 4-6번 트랙
- **Silk of Ashes Part 2**: 침묵에서 태어난 리듬이 무대 위에서 우아한 선율로 피어나는 순간
- **매일의 점프**: 매일의 작은 도약들이 모여 큰 변화를 만들어가는 과정
- **Glass Vault**: 유리 금고에 보관된 꿈과 희망

### Phase 3: Challenge (도전) - 7-9번 트랙
- **Thread of Bloom Part 1**: 반복과 고요의 점들을 지나 오안나라는 이름이 무대 위에 서서히 피어나기 시작하는 흐름의 실
- **Thread of Bloom Part 2**: 성장의 과정을 다루며 점진적 축적의 미학
- **Challenge**: 도전의 순간을 담은 곡

### Phase 4: Shine (빛남) - 10-13번 트랙
- **Glass Vault**: 투명하지만 강한 유리처럼 내 꿈이 보호되고 있는 메시지
- **Shine**: 빛나는 순간을 담은 곡
- **Final**: 최종 완성된 모습을 담은 곡

## 🚀 설치 및 실행

### 필수 요구사항
- Node.js >= 18.0.0
- npm >= 8.0.0

### 설치
```bash
# 저장소 클론
git clone https://github.com/hersouls/Oh_v1.0.git
cd Oh_v1.0

# 의존성 설치
npm install
```

### 개발 서버 실행
```bash
# 개발 서버 시작
npm run dev

# 브라우저에서 http://localhost:3000 접속
```

### 빌드 및 배포
```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 배포
npm run deploy
```

## 🧪 테스트

### 단위 테스트
```bash
# Jest를 사용한 단위 테스트
npm test

# 테스트 감시 모드
npm run test:watch
```

### E2E 테스트
```bash
# Playwright를 사용한 E2E 테스트
npm run test:e2e
```

### 타입 체크
```bash
# TypeScript 타입 체크
npm run type-check
```

## 🎨 개발 가이드

### React 19 최신 기능 활용
- `startTransition`: 성능 최적화를 위한 비동기 상태 업데이트
- `Suspense`: 로딩 상태 관리
- 새로운 훅들과 동시성 기능

### TypeScript 타입 안전성
- 엄격한 타입 체크
- 인터페이스 기반 컴포넌트 설계
- 제네릭과 타입 가드 활용

### Tailwind CSS 커스텀 테마
- 음악 플레이어 전용 색상 팔레트
- 반응형 디자인 시스템
- 애니메이션 효과

### Howler.js 오디오 기능
- 다중 포맷 오디오 지원
- 플레이리스트 관리
- 볼륨 및 재생 제어
- 오디오 이펙트

## 📚 상세 문서

자세한 개발 가이드는 `docs/` 폴더를 참조하세요:

- [개발 체크리스트](docs/development-checklist.md) - 전체 개발 가이드
- [React 가이드](docs/react-checklist.md) - React 19 개발 가이드
- [TypeScript 가이드](docs/typescript-checklist.md) - TypeScript 가이드
- [Tailwind 가이드](docs/tailwind-checklist.md) - Tailwind CSS 가이드
- [Howler.js 가이드](docs/howler-checklist.md) - Howler.js 가이드
- [Vite 가이드](docs/vite-checklist.md) - Vite 설정 가이드
- [테스트 가이드](docs/testing-checklist.md) - 테스트 가이드
- [배포 가이드](docs/deployment-checklist.md) - 배포 가이드

## 🌟 주요 컴포넌트

### useMusicPlayer Hook
- 음악 재생 상태 관리
- 재생 모드 전환 (sequential, repeat-one, shuffle)
- 볼륨 및 재생 시간 제어
- 자동 재생 기능

### MusicPlayer Component
- 직관적인 재생 컨트롤
- 진행률 표시
- 볼륨 슬라이더
- 재생 모드 버튼

### TrackCard Component
- 트랙 정보 표시
- 재생/일시정지 버튼
- 호버 효과
- 반응형 디자인

### WaveBackground Component
- 동적 웨이브 애니메이션
- 음악에 맞춘 시각적 효과
- 성능 최적화

## 🔧 스크립트

```bash
# 개발
npm run dev              # 개발 서버 실행
npm run build            # 프로덕션 빌드
npm run preview          # 빌드 결과 미리보기

# 테스트
npm test                 # 단위 테스트
npm run test:watch       # 테스트 감시 모드
npm run test:e2e         # E2E 테스트

# 코드 품질
npm run lint             # ESLint 검사
npm run type-check       # TypeScript 타입 체크

# 배포
npm run deploy           # GitHub Pages 배포
```

## 🚀 배포 가이드

### 빠른 배포
```bash
# 프로덕션 빌드 및 배포
npm run deploy
```

### 수동 배포
1. 프로덕션 빌드: `npm run build`
2. `dist/` 폴더를 웹 서버에 업로드
3. Nginx 설정 적용
4. SSL 인증서 설정

### 배포 전 체크리스트
- [ ] 모든 테스트 통과
- [ ] 린팅 검사 통과
- [ ] TypeScript 타입 체크 통과
- [ ] 프로덕션 빌드 성공
- [ ] 번들 크기 최적화 확인
- [ ] SSL 인증서 설정
- [ ] 도메인 DNS 설정

## 🔒 보안 및 성능

### 보안 설정
- HTTPS 강제 리다이렉트
- 보안 헤더 설정
- CSP (Content Security Policy)
- Rate limiting

### 성능 최적화
- Gzip 압축
- 정적 자산 캐싱
- 오디오 파일 캐싱
- 번들 분할
- 이미지 최적화

## 📊 모니터링

- Google Analytics 설정
- 에러 로깅
- 성능 모니터링
- 사용자 행동 분석

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 지원

- 이슈 리포트: [GitHub Issues](https://github.com/hersouls/Oh_v1.0/issues)
- 이메일: support@moonwave.kr

---

**Moonwave Team** - 평범함에서 특별함으로 🌙✨
