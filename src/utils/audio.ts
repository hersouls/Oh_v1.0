// 시간을 MM:SS 형식으로 변환
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// 시간을 초 단위로 변환
export const parseTime = (timeString: string): number => {
  const parts = timeString.split(':').map(Number);
  const minutes = parts[0] || 0;
  const seconds = parts[1] || 0;
  return minutes * 60 + seconds;
};

// 볼륨을 퍼센트로 변환
export const volumeToPercent = (volume: number): number => {
  return Math.round(volume * 100);
};

// 퍼센트를 볼륨으로 변환
export const percentToVolume = (percent: number): number => {
  return percent / 100;
};

// 오디오 파일 로드 상태 확인
export const checkAudioLoadStatus = (audio: HTMLAudioElement): Promise<boolean> => {
  return new Promise((resolve) => {
    if (audio.readyState >= 2) {
      resolve(true);
    } else {
      audio.addEventListener('canplaythrough', () => resolve(true), { once: true });
      audio.addEventListener('error', () => resolve(false), { once: true });
    }
  });
};

// 오디오 파일 프리로드
export const preloadAudio = (url: string): Promise<HTMLAudioElement> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.preload = 'metadata';
    
    audio.addEventListener('canplaythrough', () => resolve(audio), { once: true });
    audio.addEventListener('error', () => reject(new Error(`Failed to load audio: ${url}`)), { once: true });
    
    audio.src = url;
  });
};

// 오디오 파일 메타데이터 가져오기
export const getAudioMetadata = (url: string): Promise<{ duration: number }> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.preload = 'metadata';
    
    audio.addEventListener('loadedmetadata', () => {
      resolve({ duration: audio.duration });
    }, { once: true });
    
    audio.addEventListener('error', () => {
      reject(new Error(`Failed to load audio metadata: ${url}`));
    }, { once: true });
    
    audio.src = url;
  });
};