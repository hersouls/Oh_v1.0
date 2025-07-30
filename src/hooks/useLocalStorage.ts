import { useEffect, useRef } from 'react';
import { usePlayerState } from './usePlayerState';

const STORAGE_KEY = 'moonwave-player-state';

interface StoredPlayerState {
  volume: number;
  repeatMode: 'none' | 'one' | 'all';
  isShuffled: boolean;
  currentTrackId?: string | undefined;
  currentTime?: number;
}

export const useLocalStorage = () => {
  const { state, actions } = usePlayerState();
  const isInitialized = useRef(false);

  // 상태를 로컬 스토리지에 저장
  const saveToStorage = (playerState: StoredPlayerState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playerState));
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to save to localStorage:', error);
      }
    }
  };

  // 로컬 스토리지에서 상태 복원
  const loadFromStorage = (): StoredPlayerState | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to load from localStorage:', error);
      }
      return null;
    }
  };

  // 초기 상태 복원
  useEffect(() => {
    if (isInitialized.current) return;

    const storedState = loadFromStorage();
    if (storedState) {
      // 볼륨 설정 복원
      if (storedState.volume !== undefined) {
        actions.setVolume(storedState.volume);
      }
      
      // 반복 모드 복원
      if (storedState.repeatMode) {
        // repeatMode는 이미 기본값으로 설정됨
      }
      
      // 셔플 상태 복원
      if (storedState.isShuffled !== undefined) {
        // isShuffled는 이미 기본값으로 설정됨
      }
    }

    isInitialized.current = true;
  }, [actions]);

  // 상태 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    if (!isInitialized.current) return;

    const stateToStore: StoredPlayerState = {
      volume: state.volume,
      repeatMode: state.repeatMode,
      isShuffled: state.isShuffled,
      currentTrackId: state.currentTrack?.id || undefined,
      currentTime: state.currentTime,
    };

    saveToStorage(stateToStore);
  }, [
    state.volume,
    state.repeatMode,
    state.isShuffled,
    state.currentTrack?.id,
    state.currentTime,
  ]);

  // 현재 트랙 ID로 트랙 찾기
  const findTrackById = (trackId: string) => {
    return state.playlist.find(track => track.id === trackId);
  };

  // 저장된 트랙 복원
  const restoreCurrentTrack = () => {
    const storedState = loadFromStorage();
    if (storedState?.currentTrackId) {
      const track = findTrackById(storedState.currentTrackId);
      if (track) {
        actions.playTrack(track);
        if (storedState.currentTime) {
          actions.seek(storedState.currentTime);
        }
      }
    }
  };

  // 저장된 상태 초기화
  const clearStoredState = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to clear localStorage:', error);
      }
    }
  };

  return {
    restoreCurrentTrack,
    clearStoredState,
    loadFromStorage,
    saveToStorage,
  };
};