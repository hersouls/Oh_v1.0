import { useRef, useCallback } from 'react';

interface AudioCache {
  [key: string]: HTMLAudioElement;
}

export const useAudioPreloader = () => {
  const audioCache = useRef<AudioCache>({});
  // const preloadQueue = useRef<string[]>([]); // 사용하지 않는 변수
  const isPreloading = useRef(false);

  // 오디오 프리로드
  const preloadAudio = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // 이미 캐시된 경우
      if (audioCache.current[src]) {
        resolve();
        return;
      }

      const audio = new Audio();
      
      audio.addEventListener('canplaythrough', () => {
        audioCache.current[src] = audio;
        resolve();
      }, { once: true });

      audio.addEventListener('error', (error) => {
        // Failed to preload audio - silent fail
        reject(error);
      }, { once: true });

      // 오디오 로드 시작
      audio.src = src;
      audio.load();
    });
  }, []);

  // 여러 오디오 프리로드
  const preloadMultiple = useCallback(async (sources: string[]): Promise<void> => {
    const promises = sources.map(src => preloadAudio(src));
    await Promise.allSettled(promises);
  }, [preloadAudio]);

  // 큐 기반 프리로드 (메모리 효율적)
  const preloadQueueAsync = useCallback(async (sources: string[], concurrency = 3): Promise<void> => {
    if (isPreloading.current) {
      return;
    }

    isPreloading.current = true;
    const queue = [...sources];

    while (queue.length > 0) {
      const batch = queue.splice(0, concurrency);
      await Promise.allSettled(batch.map(src => preloadAudio(src)));
    }

    isPreloading.current = false;
  }, [preloadAudio]);

  // 캐시에서 오디오 가져오기
  const getCachedAudio = useCallback((src: string): HTMLAudioElement | null => {
    return audioCache.current[src] || null;
  }, []);

  // 캐시에서 오디오 제거
  const removeFromCache = useCallback((src: string): void => {
    if (audioCache.current[src]) {
      audioCache.current[src].src = '';
      delete audioCache.current[src];
    }
  }, []);

  // 전체 캐시 클리어
  const clearCache = useCallback((): void => {
    Object.values(audioCache.current).forEach(audio => {
      audio.src = '';
    });
    audioCache.current = {};
  }, []);

  // 캐시 상태 확인
  const getCacheStatus = useCallback(() => {
    return {
      cachedCount: Object.keys(audioCache.current).length,
      cachedSources: Object.keys(audioCache.current),
      isPreloading: isPreloading.current,
    };
  }, []);

  return {
    preloadAudio,
    preloadMultiple,
    preloadQueue: preloadQueueAsync,
    getCachedAudio,
    removeFromCache,
    clearCache,
    getCacheStatus,
  };
};