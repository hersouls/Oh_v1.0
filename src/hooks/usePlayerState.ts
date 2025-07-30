import { useState, useCallback, useEffect } from 'react';
import { Track } from '@/types';

export type RepeatMode = 'none' | 'one' | 'all';

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  playlist: Track[];
  currentIndex: number;
  isLoading: boolean;
  error: string | null;
}

interface UsePlayerStateReturn {
  state: PlayerState;
  actions: {
    play: () => Promise<void>;
    pause: () => void;
    togglePlay: () => Promise<void>;
    seek: (time: number) => void;
    setVolume: (volume: number) => void;
    playTrack: (track: Track) => Promise<void>;
    playTrackById: (trackId: string) => Promise<void>;
    playNext: () => void;
    playPrevious: () => void;
    toggleRepeat: () => void;
    toggleShuffle: () => void;
    setPlaylist: (tracks: Track[]) => void;
    clearError: () => void;
  };
}

export const usePlayerState = (initialPlaylist: Track[] = []): UsePlayerStateReturn => {
  const [state, setState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    repeatMode: 'none',
    isShuffled: false,
    playlist: initialPlaylist,
    currentIndex: -1,
    isLoading: false,
    error: null,
  });

  // 로컬 스토리지에서 상태 복원
  useEffect(() => {
    const savedState = localStorage.getItem('moonwave-player-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setState(prev => ({
          ...prev,
          volume: parsed.volume ?? prev.volume,
          repeatMode: parsed.repeatMode ?? prev.repeatMode,
          isShuffled: parsed.isShuffled ?? prev.isShuffled,
        }));
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Failed to restore player state:', error);
        }
      }
    }
  }, []);

  // 상태 변경시 로컬 스토리지에 저장
  useEffect(() => {
    const stateToSave = {
      volume: state.volume,
      repeatMode: state.repeatMode,
      isShuffled: state.isShuffled,
    };
    localStorage.setItem('moonwave-player-state', JSON.stringify(stateToSave));
  }, [state.volume, state.repeatMode, state.isShuffled]);

  const play = useCallback(async () => {
    setState(prev => ({ ...prev, isPlaying: true, error: null }));
  }, []);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const togglePlay = useCallback(async () => {
    if (state.currentTrack) {
      if (state.isPlaying) {
        pause();
      } else {
        await play();
      }
    }
  }, [state.currentTrack, state.isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    setState(prev => ({ ...prev, currentTime: time }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }));
  }, []);

  const playTrack = useCallback(async (track: Track) => {
    const trackIndex = state.playlist.findIndex(t => t.id === track.id);
    setState(prev => ({
      ...prev,
      currentTrack: track,
      currentIndex: trackIndex,
      isPlaying: true,
      currentTime: 0,
      duration: 0,
      isLoading: true,
      error: null,
    }));
  }, [state.playlist]);

  const playTrackById = useCallback(async (trackId: string) => {
    const track = state.playlist.find(t => t.id === trackId);
    if (track) {
      await playTrack(track);
    }
  }, [state.playlist, playTrack]);

  const playNext = useCallback(() => {
    if (state.playlist.length === 0) return;

    let nextIndex = state.currentIndex + 1;
    
    // 셔플 모드일 때 랜덤 선택
    if (state.isShuffled) {
      nextIndex = Math.floor(Math.random() * state.playlist.length);
    }
    
    // 반복 모드 처리
    if (nextIndex >= state.playlist.length) {
      if (state.repeatMode === 'all') {
        nextIndex = 0;
      } else if (state.repeatMode === 'one') {
        nextIndex = state.currentIndex;
      } else {
        return; // 재생 중지
      }
    }

    const nextTrack = state.playlist[nextIndex];
    if (nextTrack) {
      playTrack(nextTrack);
    }
  }, [state.playlist, state.currentIndex, state.isShuffled, state.repeatMode, playTrack]);

  const playPrevious = useCallback(() => {
    if (state.playlist.length === 0) return;

    let prevIndex = state.currentIndex - 1;
    
    // 셔플 모드일 때 랜덤 선택
    if (state.isShuffled) {
      prevIndex = Math.floor(Math.random() * state.playlist.length);
    }
    
    // 반복 모드 처리
    if (prevIndex < 0) {
      if (state.repeatMode === 'all') {
        prevIndex = state.playlist.length - 1;
      } else if (state.repeatMode === 'one') {
        prevIndex = state.currentIndex;
      } else {
        return; // 재생 중지
      }
    }

    const prevTrack = state.playlist[prevIndex];
    if (prevTrack) {
      playTrack(prevTrack);
    }
  }, [state.playlist, state.currentIndex, state.isShuffled, state.repeatMode, playTrack]);

  const toggleRepeat = useCallback(() => {
    const modes: RepeatMode[] = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(state.repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setState(prev => ({ ...prev, repeatMode: modes[nextIndex] as RepeatMode }));
  }, [state.repeatMode]);

  const toggleShuffle = useCallback(() => {
    setState(prev => ({ ...prev, isShuffled: !prev.isShuffled }));
  }, []);

  const setPlaylist = useCallback((tracks: Track[]) => {
    setState(prev => ({ ...prev, playlist: tracks }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    state,
    actions: {
      play,
      pause,
      togglePlay,
      seek,
      setVolume,
      playTrack,
      playTrackById,
      playNext,
      playPrevious,
      toggleRepeat,
      toggleShuffle,
      setPlaylist,
      clearError,
    },
  };
};