// 시간 포맷팅 (초 -> MM:SS)
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// 시간 포맷팅 (초 -> HH:MM:SS)
export const formatTimeLong = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '0:00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// 진행률 계산 (0-1)
export const calculateProgress = (currentTime: number, duration: number): number => {
  if (duration === 0) return 0;
  return Math.min(Math.max(currentTime / duration, 0), 1);
};

// 진행률을 시간으로 변환
export const progressToTime = (progress: number, duration: number): number => {
  return progress * duration;
};

// 볼륨 레벨을 데시벨로 변환 (대략적)
export const volumeToDecibels = (volume: number): number => {
  if (volume === 0) return -Infinity;
  return 20 * Math.log10(volume);
};

// 데시벨을 볼륨 레벨로 변환
export const decibelsToVolume = (db: number): number => {
  if (db === -Infinity) return 0;
  return Math.pow(10, db / 20);
};

// 오디오 파일 크기 추정 (초당 128kbps 기준)
export const estimateAudioFileSize = (durationSeconds: number, bitrate = 128): number => {
  return (durationSeconds * bitrate * 1000) / 8; // bytes
};

// 오디오 파일 크기를 사람이 읽기 쉬운 형태로 변환
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// 오디오 버퍼링 상태 확인
export const checkBufferingState = (audio: HTMLAudioElement): 'buffering' | 'ready' | 'stalled' => {
  if (!audio) return 'ready';
  
  if (audio.readyState < 3) {
    return 'buffering';
  }
  
  if (audio.networkState === 3) {
    return 'stalled';
  }
  
  return 'ready';
};

// 오디오 품질 추정
export const estimateAudioQuality = (duration: number, fileSize: number): 'low' | 'medium' | 'high' => {
  const bitrate = (fileSize * 8) / (duration * 1000); // kbps
  
  if (bitrate < 96) return 'low';
  if (bitrate < 192) return 'medium';
  return 'high';
};

// 오디오 파일 확장자 확인
export const getAudioFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

// 지원되는 오디오 포맷 확인
export const isSupportedAudioFormat = (filename: string): boolean => {
  const extension = getAudioFileExtension(filename);
  const supportedFormats = ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'];
  return supportedFormats.includes(extension);
};

// 오디오 메타데이터 추출 (제한적)
export const extractAudioMetadata = async (file: File): Promise<{
  duration?: number;
  size: number;
  type: string;
  name: string;
}> => {
  return new Promise((resolve) => {
    const audio = new Audio();
    const url = URL.createObjectURL(file);
    
    audio.addEventListener('loadedmetadata', () => {
      const metadata = {
        duration: audio.duration,
        size: file.size,
        type: file.type,
        name: file.name,
      };
      
      URL.revokeObjectURL(url);
      resolve(metadata);
    });
    
    audio.addEventListener('error', () => {
      const metadata = {
        size: file.size,
        type: file.type,
        name: file.name,
      };
      
      URL.revokeObjectURL(url);
      resolve(metadata);
    });
    
    audio.src = url;
  });
};

// 오디오 스트림 URL 생성 (Web Audio API용)
export const createAudioStream = (audioElement: HTMLAudioElement): MediaStream | null => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaElementSource(audioElement);
    const destination = audioContext.createMediaStreamDestination();
    
    source.connect(destination);
    source.connect(audioContext.destination); // 스피커 출력 유지
    
    return destination.stream;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to create audio stream:', error);
    }
    return null;
  }
};

// 오디오 스펙트럼 분석 (기본)
export const analyzeAudioSpectrum = (audioElement: HTMLAudioElement): number[] => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioElement);
    
    analyser.fftSize = 256;
    source.connect(analyser);
    source.connect(audioContext.destination);
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    
    return Array.from(dataArray);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to analyze audio spectrum:', error);
    }
    return [];
  }
};