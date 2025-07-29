/**
 * 시간을 MM:SS 형식으로 포맷팅
 */
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * 시간을 HH:MM:SS 형식으로 포맷팅 (1시간 이상)
 */
export const formatTimeLong = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '0:00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
};

/**
 * 퍼센트를 시간으로 변환
 */
export const percentToTime = (percent: number, duration: number): number => {
  return (percent / 100) * duration;
};

/**
 * 시간을 퍼센트로 변환
 */
export const timeToPercent = (time: number, duration: number): number => {
  if (duration === 0) return 0;
  return (time / duration) * 100;
};

/**
 * 오디오 파일 크기를 사람이 읽기 쉬운 형태로 변환
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 오디오 파일의 예상 재생 시간을 계산 (파일 크기 기반)
 */
export const estimateDuration = (fileSize: number, bitrate: number = 128): number => {
  // bitrate는 kbps 단위
  const bytesPerSecond = (bitrate * 1000) / 8;
  return fileSize / bytesPerSecond;
};

/**
 * 오디오 볼륨을 데시벨로 변환
 */
export const volumeToDb = (volume: number): number => {
  if (volume === 0) return -Infinity;
  return 20 * Math.log10(volume);
};

/**
 * 데시벨을 볼륨으로 변환
 */
export const dbToVolume = (db: number): number => {
  if (db === -Infinity) return 0;
  return Math.pow(10, db / 20);
};

/**
 * 오디오 버퍼링 상태 확인
 */
export const isAudioBuffering = (audio: HTMLAudioElement): boolean => {
  return audio.readyState < 3; // HAVE_FUTURE_DATA 미만
};

/**
 * 오디오 재생 가능 상태 확인
 */
export const isAudioReady = (audio: HTMLAudioElement): boolean => {
  return audio.readyState >= 2; // HAVE_CURRENT_DATA 이상
};