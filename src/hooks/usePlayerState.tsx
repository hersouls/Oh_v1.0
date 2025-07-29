import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// 트랙 인터페이스
export interface Track {
  id: number;
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl: string;
  description: string;
  lyrics: string;
  interpretation: string;
  sync?: Array<{ time: number; line: string }>;
}

// 플레이어 상태 인터페이스
interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  error: string | null;
  playlist: Track[];
  currentIndex: number;
  repeatMode: 'none' | 'one' | 'all';
  isShuffled: boolean;
  shuffledPlaylist: Track[]; // 셔플된 플레이리스트
  originalPlaylist: Track[]; // 원본 플레이리스트
}

// 액션 타입
type PlayerAction =
  | { type: 'SET_CURRENT_TRACK'; payload: Track }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_MUTED'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PLAYLIST'; payload: Track[] }
  | { type: 'SET_CURRENT_INDEX'; payload: number }
  | { type: 'SET_REPEAT_MODE'; payload: 'none' | 'one' | 'all' }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREVIOUS_TRACK' }
  | { type: 'RESET' };

// 초기 상태
const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  isLoading: false,
  error: null,
  playlist: [],
  currentIndex: -1,
  repeatMode: 'none',
  isShuffled: false,
  shuffledPlaylist: [],
  originalPlaylist: [],
};

// 리듀서
function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'SET_CURRENT_TRACK':
      return { ...state, currentTrack: action.payload };
    
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    
    case 'SET_MUTED':
      return { ...state, isMuted: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_PLAYLIST':
      return { 
        ...state, 
        playlist: action.payload,
        originalPlaylist: action.payload,
        shuffledPlaylist: action.payload,
        currentIndex: action.payload.length > 0 ? 0 : -1,
        currentTrack: action.payload.length > 0 ? action.payload[0] : null
      };
    
    case 'SET_CURRENT_INDEX':
      return { ...state, currentIndex: action.payload };
    
    case 'SET_REPEAT_MODE':
      return { ...state, repeatMode: action.payload };
    
    case 'TOGGLE_SHUFFLE':
      if (state.isShuffled) {
        // 셔플 해제: 원본 플레이리스트로 복원
        const currentTrack = state.currentTrack;
        const originalIndex = state.originalPlaylist.findIndex(track => track.id === currentTrack?.id);
        return {
          ...state,
          isShuffled: false,
          playlist: state.originalPlaylist,
          currentIndex: originalIndex >= 0 ? originalIndex : 0,
        };
      } else {
        // 셔플 활성화: 플레이리스트 섞기
        const shuffled = [...state.playlist];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return {
          ...state,
          isShuffled: true,
          shuffledPlaylist: shuffled,
          playlist: shuffled,
          currentIndex: 0,
          currentTrack: shuffled[0],
        };
      }
    
    case 'NEXT_TRACK':
      if (state.playlist.length === 0) return state;
      
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.playlist.length) {
        if (state.repeatMode === 'all') {
          return { ...state, currentIndex: 0, currentTrack: state.playlist[0] };
        } else {
          return { ...state, isPlaying: false };
        }
      }
      return { 
        ...state, 
        currentIndex: nextIndex, 
        currentTrack: state.playlist[nextIndex] 
      };
    
    case 'PREVIOUS_TRACK':
      if (state.playlist.length === 0) return state;
      
      const prevIndex = state.currentIndex - 1;
      if (prevIndex < 0) {
        if (state.repeatMode === 'all') {
          const lastIndex = state.playlist.length - 1;
          return { 
            ...state, 
            currentIndex: lastIndex, 
            currentTrack: state.playlist[lastIndex] 
          };
        } else {
          return state;
        }
      }
      return { 
        ...state, 
        currentIndex: prevIndex, 
        currentTrack: state.playlist[prevIndex] 
      };
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
}

// Context 생성
const PlayerContext = createContext<{
  state: PlayerState;
  dispatch: React.Dispatch<PlayerAction>;
} | null>(null);

// Provider 컴포넌트
interface PlayerProviderProps {
  children: ReactNode;
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(playerReducer, initialState);

  // 로컬 스토리지에서 상태 복원
  useEffect(() => {
    const savedState = localStorage.getItem('playerState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        
        // 볼륨 복원
        if (parsedState.volume !== undefined) {
          dispatch({ type: 'SET_VOLUME', payload: parsedState.volume });
        }
        
        // 반복 모드 복원
        if (parsedState.repeatMode !== undefined) {
          dispatch({ type: 'SET_REPEAT_MODE', payload: parsedState.repeatMode });
        }
        
        // 셔플 상태 복원
        if (parsedState.isShuffled !== undefined) {
          if (parsedState.isShuffled) {
            dispatch({ type: 'TOGGLE_SHUFFLE' });
          }
        }
        
        // 플레이리스트 복원
        if (parsedState.playlist && parsedState.playlist.length > 0) {
          dispatch({ type: 'SET_PLAYLIST', payload: parsedState.playlist });
          
          // 현재 트랙과 인덱스 복원
          if (parsedState.currentTrack && parsedState.currentIndex !== undefined) {
            dispatch({ type: 'SET_CURRENT_TRACK', payload: parsedState.currentTrack });
            dispatch({ type: 'SET_CURRENT_INDEX', payload: parsedState.currentIndex });
            
            // 재생 상태 복원 (자동 재생 정책으로 인해 false로 설정)
            if (parsedState.isPlaying !== undefined) {
              dispatch({ type: 'SET_PLAYING', payload: false });
            }
          }
        }
      } catch (error) {
        console.error('Failed to restore player state:', error);
      }
    }
  }, []);

  // 상태 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    const stateToSave = {
      volume: state.volume,
      repeatMode: state.repeatMode,
      isShuffled: state.isShuffled,
      playlist: state.playlist,
      currentTrack: state.currentTrack,
      currentIndex: state.currentIndex,
      isPlaying: state.isPlaying,
    };
    localStorage.setItem('playerState', JSON.stringify(stateToSave));
  }, [
    state.volume, 
    state.repeatMode, 
    state.isShuffled, 
    state.playlist, 
    state.currentTrack, 
    state.currentIndex,
    state.isPlaying
  ]);

  return (
    <PlayerContext.Provider value={{ state, dispatch }}>
      {children}
    </PlayerContext.Provider>
  );
};

// 훅
export const usePlayerState = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayerState must be used within a PlayerProvider');
  }
  return context;
};

// 편의 함수들
export const usePlayerActions = () => {
  const { dispatch } = usePlayerState();

  const setCurrentTrack = (track: Track) => {
    dispatch({ type: 'SET_CURRENT_TRACK', payload: track });
  };

  const setPlaying = (isPlaying: boolean) => {
    dispatch({ type: 'SET_PLAYING', payload: isPlaying });
  };

  const setCurrentTime = (time: number) => {
    dispatch({ type: 'SET_CURRENT_TIME', payload: time });
  };

  const setDuration = (duration: number) => {
    dispatch({ type: 'SET_DURATION', payload: duration });
  };

  const setVolume = (volume: number) => {
    dispatch({ type: 'SET_VOLUME', payload: volume });
  };

  const setMuted = (isMuted: boolean) => {
    dispatch({ type: 'SET_MUTED', payload: isMuted });
  };

  const setLoading = (isLoading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: isLoading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const setPlaylist = (playlist: Track[]) => {
    dispatch({ type: 'SET_PLAYLIST', payload: playlist });
  };

  const setCurrentIndex = (index: number) => {
    dispatch({ type: 'SET_CURRENT_INDEX', payload: index });
  };

  const setRepeatMode = (mode: 'none' | 'one' | 'all') => {
    dispatch({ type: 'SET_REPEAT_MODE', payload: mode });
  };

  const toggleShuffle = () => {
    dispatch({ type: 'TOGGLE_SHUFFLE' });
  };

  const nextTrack = () => {
    dispatch({ type: 'NEXT_TRACK' });
  };

  const previousTrack = () => {
    dispatch({ type: 'PREVIOUS_TRACK' });
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  return {
    setCurrentTrack,
    setPlaying,
    setCurrentTime,
    setDuration,
    setVolume,
    setMuted,
    setLoading,
    setError,
    setPlaylist,
    setCurrentIndex,
    setRepeatMode,
    toggleShuffle,
    nextTrack,
    previousTrack,
    reset,
  };
};