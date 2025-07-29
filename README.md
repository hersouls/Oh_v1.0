# 🎧 문유 (Moonwave Oh Anna) - 13개의 순간

> "평범함에서 특별함으로" - 재능보다 노력으로, 한계를 넘어 자신만의 빛을 찾아가는 여정을 13개의 트랙으로 표현한 음악 플레이어

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-blue?style=flat-square)](https://oh.moonwave.kr)
[![React](https://img.shields.io/badge/React-18.0+-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-purple?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0+-cyan?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-green?style=flat-square&logo=pwa)](https://web.dev/progressive-web-apps/)

## 📖 프로젝트 개요

**문유**는 리듬체조 선수 오안나의 성장 여정을 13곡의 음악으로 재해석한 웹 기반 음악 플레이어입니다. 평범한 재능에서 시작해 비범한 노력으로 국가대표가 된 오안나의 스토리를 음악과 함께 경험할 수 있습니다.

### 🌟 주요 특징

- 🎵 **13곡 음악 플레이어**: 오안나의 여정을 담은 13개 트랙
- 📱 **PWA 지원**: 모바일 앱처럼 설치 가능
- 🎨 **글래스모피즘 디자인**: 현대적이고 세련된 UI
- 📖 **가사 싱크**: 실시간 가사 하이라이팅
- 💫 **스토리텔링**: 음악과 함께하는 감정적 여정
- ♿ **접근성**: 모든 사용자를 위한 포용적 디자인

### 🎯 핵심 메시지

> "타고난 것보다 만들어가는 것" - 재능보다 노력으로, 한계를 넘어 자신만의 빛을 찾아가는 여정

## 🚀 라이브 데모

**🌐 웹사이트**: [https://oh.moonwave.kr](https://oh.moonwave.kr)

## 🛠️ 기술 스택

### Frontend
- **React 18** - 사용자 인터페이스 구축
- **Vite** - 빠른 개발 환경 및 빌드 도구
- **TypeScript** - 타입 안전성 보장

### Styling & UI
- **Tailwind CSS** - 유틸리티 퍼스트 CSS 프레임워크
- **Catalyst UI** - 모던 React 컴포넌트 라이브러리
- **Framer Motion** - 부드러운 애니메이션

### Audio & Media
- **HTML5 Audio API** - 음악 재생 제어
- **Web Audio API** - 고급 오디오 처리

### Deployment & Hosting
- **GitHub Pages** - 정적 웹사이트 호스팅
- **GitHub Actions** - 자동 배포 파이프라인

### PWA Features
- **Service Worker** - 오프라인 지원
- **Web App Manifest** - 앱 설치 기능
- **Cache API** - 리소스 캐싱

## 📁 프로젝트 구조

```
Oh_v1.0/
├── docs/                    # 프로젝트 문서
│   ├── 화면정의서          # UI/UX 상세 정의
│   ├── PRD                 # 제품 요구사항 문서
│   ├── Profile             # 오안나 프로필 정보
│   └── 디자인가이드        # 브랜드 디자인 가이드
├── public/                  # 정적 리소스
│   ├── music/              # 음원 파일 (.mp3)
│   ├── covers/             # 앨범 커버 이미지
│   ├── sample-tracks.json  # 트랙 메타데이터
│   └── moonwave_log.png    # 브랜드 로고
├── src/                    # 소스 코드
│   ├── components/         # React 컴포넌트
│   ├── pages/             # 페이지 컴포넌트
│   ├── hooks/             # 커스텀 훅
│   ├── utils/             # 유틸리티 함수
│   └── types/             # TypeScript 타입 정의
├── README.md              # 프로젝트 문서
└── package.json           # 의존성 관리
```

## 🎵 음원 구성

### 트랙 목록
1. **Shine Bright** - 자신만의 빛을 찾아가는 마지막 선언곡
2. **Beginning** - 평범한 시작의 순간
3. **Growth** - 노력과 성장의 과정
4. **Challenge** - 도전과 극복의 여정
5. **Shine** - 자신만의 빛을 발산하는 순간
6. **Rhythm** - 리듬체조의 리듬을 음악으로
7. **Grace** - 우아함과 아름다움
8. **Passion** - 열정과 의지
9. **Dream** - 꿈을 향한 여정
10. **Victory** - 승리의 순간
11. **Light** - 내면의 빛
12. **Future** - 미래를 향한 발걸음
13. **Eternal** - 영원한 빛

### 데이터 구조
```json
{
  "id": 1,
  "title": "Shine Bright",
  "artist": "문유",
  "audioUrl": "/music/shine-bright.mp3",
  "coverUrl": "/covers/shine-bright.jpg",
  "description": "오안나가 자신의 리듬, 궤적, 침묵, 파동 위에 스스로 빛이 되어 무대를 밝혀낸 마지막 선언곡",
  "lyrics": "숨죽인 무대 위...",
  "interpretation": "이 곡은 외부 조명 없이도 자신의 내면에서 발산되는 빛을 상징합니다...",
  "sync": [
    { "time": 0, "line": "숨죽인 무대 위" },
    { "time": 5, "line": "조명 없는 나의 길" }
  ],
  "theme": "shine"
}
```

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary**: Purple (#a855f7) - 메인 브랜드 컬러
- **Secondary**: Pink (#ec4899) - 보조 컬러
- **Background**: White/Gray - 깔끔한 배경
- **Text**: Dark Gray - 가독성 높은 텍스트

### 타이포그래피
- **한글**: Pretendard - 한글 최적화 폰트
- **영문**: Inter - 현대적인 영문 폰트

### 컴포넌트
- **글래스모피즘**: 반투명 배경과 블러 효과
- **카드 디자인**: 그림자와 둥근 모서리
- **버튼**: 호버 효과와 부드러운 전환

## 📱 화면 구성

### 1. 인트로 페이지
- 프로젝트 소개 및 브랜딩
- "음악으로 만나기" CTA 버튼
- 페이드인/아웃 애니메이션

### 2. 메인 페이지
- 13개 트랙 그리드 레이아웃
- 하단 고정 플레이어
- 반응형 디자인 (1-4열 그리드)

### 3. 상세 뷰 페이지
- 트랙별 상세 정보
- 가사/해석/싱크 가사 탭
- 실시간 가사 하이라이팅

### 4. 오안나 소개 페이지
- 오안나의 스토리와 타임라인
- 리듬체조 선수로서의 여정
- 음악과 연결된 내러티브

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.0 이상
- npm 또는 yarn

### 설치 및 실행

1. **저장소 클론**
```bash
git clone https://github.com/hersouls/Oh_v1.0.git
cd Oh_v1.0
```

2. **의존성 설치**
```bash
npm install
# 또는
yarn install
```

3. **개발 서버 실행**
```bash
npm run dev
# 또는
yarn dev
```

4. **브라우저에서 확인**
```
http://localhost:5173
```

### 빌드 및 배포

1. **프로덕션 빌드**
```bash
npm run build
# 또는
yarn build
```

2. **빌드 결과 확인**
```bash
npm run preview
# 또는
yarn preview
```

## 🔧 개발 가이드

### 컴포넌트 개발
```tsx
// 예시: 트랙 카드 컴포넌트
import { Card, Button, Heading, Text } from '@catalyst/ui';

interface TrackCardProps {
  track: Track;
  onPlay: (track: Track) => void;
}

export const TrackCard = ({ track, onPlay }: TrackCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <div className="relative">
        <img 
          src={track.coverUrl} 
          alt={track.title}
          className="aspect-square object-cover rounded-lg"
        />
        <Button
          shape="circle"
          className="absolute inset-center"
          onClick={() => onPlay(track)}
        >
          <PlayIcon />
        </Button>
      </div>
      <CardContent>
        <Heading level={3}>{track.title}</Heading>
        <Text color="gray">문유</Text>
      </CardContent>
    </Card>
  );
};
```

### 상태 관리
```tsx
// 예시: 플레이어 상태 관리
export const usePlayerState = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    playTrack,
    togglePlay,
    setCurrentTime
  };
};
```

## 📱 PWA 기능

### 설치 방법
1. 웹사이트 방문
2. 브라우저 주소창의 설치 아이콘 클릭
3. "홈 화면에 추가" 선택

### 오프라인 지원
- 음원 및 이미지 캐싱
- 기본 UI 오프라인 동작
- 백그라운드 동기화

## ♿ 접근성

### 지원 기능
- **키보드 네비게이션**: 모든 기능 키보드로 접근 가능
- **스크린 리더**: ARIA 라벨 및 역할 정의
- **고대비 모드**: 색상 대비 최적화
- **음성 안내**: 재생 상태 및 가사 읽기

### 접근성 컴포넌트
```tsx
// 예시: 접근성 개선된 플레이어
<div role="region" aria-label="음악 플레이어">
  <Button
    aria-label={isPlaying ? "음악 정지" : "음악 재생"}
    onClick={togglePlay}
  >
    {isPlaying ? <PauseIcon /> : <PlayIcon />}
  </Button>
</div>
```

## 🧪 테스트

### 실행 방법
```bash
npm run test
# 또는
yarn test
```

### 테스트 커버리지
```bash
npm run test:coverage
# 또는
yarn test:coverage
```

## 📦 배포

### GitHub Pages 자동 배포
- `main` 브랜치에 푸시 시 자동 배포
- GitHub Actions 워크플로우 구성
- 빌드 결과 자동 업로드

### 배포 URL
- **프로덕션**: https://oh.moonwave.kr
- **개발**: https://hersouls.github.io/Oh_v1.0

## 🤝 기여하기

### 기여 방법
1. 이 저장소를 포크합니다
2. 새로운 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

### 개발 가이드라인
- TypeScript 사용
- ESLint 규칙 준수
- 컴포넌트 단위 테스트 작성
- 접근성 고려

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👥 팀

- **개발**: Moonwave Team
- **디자인**: Moonwave Design Team
- **음악**: 문유 (Moonwave Music)

## 📞 문의

- **이메일**: contact@moonwave.kr
- **웹사이트**: https://moonwave.kr
- **GitHub**: https://github.com/hersouls

## 🙏 감사의 말

- 오안나 선수와 그녀의 영감을 주는 여정
- 리듬체조의 아름다움과 예술성
- 모든 사용자들의 지지와 피드백

---

**⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!**

---

*"평범함에서 특별함으로" - 문유와 함께하는 13개의 순간*
