import { useState, useCallback, useRef, useEffect } from 'react';
import { Track } from '../types';
import { getNextTrack, getPreviousTrack } from '../data/tracks';

export interface MusicPlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playMode: 'sequential' | 'repeat-one' | 'shuffle';
}

export const useMusicPlayer = () => {
  const [state, setState] = useState<MusicPlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playMode: 'sequential',
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio 요소 초기화
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';
    }

    const audio = audioRef.current;

    // 이벤트 리스너 설정
    const handleLoadedMetadata = () => {
      console.log('🎵 오디오 메타데이터 로드됨');
      setState(prev => ({
        ...prev,
        duration: audio.duration || 0,
      }));
    };

    const handleTimeUpdate = () => {
      setState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
      }));
    };

    const handleEnded = () => {
      console.log('🎵 트랙 재생 완료');
      setState(prev => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
      }));
    };

    const handleError = (e: Event) => {
      console.error('🎵 오디오 재생 오류:', e);
      setState(prev => ({
        ...prev,
        isPlaying: false,
      }));
    };

    const handleCanPlay = () => {
      console.log('🎵 오디오 재생 준비됨');
    };

    // 이벤트 리스너 추가
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    // 클린업
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  // 볼륨 변경 시 오디오에 적용
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
    }
  }, [state.volume]);

  const playTrack = useCallback(async (track: Track) => {
    if (!audioRef.current) return;

    try {
      console.log('🎵 트랙 재생 시작:', track.title);
      console.log('🎵 트랙 URL:', track.url);

      // 새 트랙 로드
      audioRef.current.src = track.url;
      audioRef.current.load();

      // 상태 업데이트
      setState(prev => ({
        ...prev,
        currentTrack: track,
        isPlaying: false, // 로드 완료 후 재생
        currentTime: 0,
      }));

      // 오디오 로드 완료 후 재생
      audioRef.current.addEventListener('canplay', () => {
        console.log('🎵 오디오 재생 준비 완료, 재생 시작');
        audioRef.current?.play().then(() => {
          setState(prev => ({
            ...prev,
            isPlaying: true,
          }));
        }).catch((error) => {
          console.error('🎵 재생 실패:', error);
          setState(prev => ({
            ...prev,
            isPlaying: false,
          }));
        });
      }, { once: true });

    } catch (error) {
      console.error('🎵 트랙 로드 실패:', error);
    }
  }, []);

  const togglePlay = useCallback(async () => {
    if (!audioRef.current || !state.currentTrack) return;

    try {
      if (state.isPlaying) {
        console.log('🎵 일시정지');
        audioRef.current.pause();
        setState(prev => ({
          ...prev,
          isPlaying: false,
        }));
      } else {
        console.log('🎵 재생');
        await audioRef.current.play();
        setState(prev => ({
          ...prev,
          isPlaying: true,
        }));
      }
    } catch (error) {
      console.error('🎵 재생/일시정지 오류:', error);
    }
  }, [state.isPlaying, state.currentTrack]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    
    console.log('🎵 일시정지');
    audioRef.current.pause();
    setState(prev => ({
      ...prev,
      isPlaying: false,
    }));
  }, []);

  const resume = useCallback(async () => {
    if (!audioRef.current) return;

    try {
      console.log('🎵 재생 재개');
      await audioRef.current.play();
      setState(prev => ({
        ...prev,
        isPlaying: true,
      }));
    } catch (error) {
      console.error('🎵 재생 재개 오류:', error);
    }
  }, []);

  const stop = useCallback(() => {
    if (!audioRef.current) return;

    console.log('🎵 정지');
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setState(prev => ({
      ...prev,
      isPlaying: false,
      currentTime: 0,
    }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    const newVolume = Math.max(0, Math.min(1, volume));
    console.log('🎵 볼륨 변경:', newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    
    setState(prev => ({
      ...prev,
      volume: newVolume,
    }));
  }, []);

  const setCurrentTime = useCallback((time: number) => {
    if (!audioRef.current) return;

    console.log('🎵 시간 이동:', time);
    audioRef.current.currentTime = time;
    setState(prev => ({
      ...prev,
      currentTime: time,
    }));
  }, []);

  const nextTrack = useCallback(() => {
    if (!state.currentTrack) return;
    
    console.log('🎵 다음 트랙으로 이동');
    const nextTrack = getNextTrack(state.currentTrack.id);
    playTrack(nextTrack);
  }, [state.currentTrack, playTrack]);

  const previousTrack = useCallback(() => {
    if (!state.currentTrack) return;
    
    console.log('🎵 이전 트랙으로 이동');
    const previousTrack = getPreviousTrack(state.currentTrack.id);
    playTrack(previousTrack);
  }, [state.currentTrack, playTrack]);

  const togglePlayMode = useCallback(() => {
    const modes: ('sequential' | 'repeat-one' | 'shuffle')[] = ['sequential', 'repeat-one', 'shuffle'];
    const currentIndex = modes.indexOf(state.playMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    const newMode = modes[nextIndex];
    
    console.log('🎵 재생 모드 변경:', newMode);
    setState(prev => ({
      ...prev,
      playMode: newMode,
    }));
  }, [state.playMode]);

  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    ...state,
    playTrack,
    togglePlay,
    pause,
    resume,
    stop,
    setVolume,
    setCurrentTime,
    nextTrack,
    previousTrack,
    togglePlayMode,
    formatTime,
  };
};
