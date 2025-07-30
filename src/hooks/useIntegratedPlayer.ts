import { useEffect, useCallback } from 'react';
import { useAudioPlayer } from './useAudioPlayer';
import { usePlayerState } from './usePlayerState';
import { useAudioPreloader } from './useAudioPreloader';
import { Track } from '@/types';

export const useIntegratedPlayer = () => {
  const audioPlayer = useAudioPlayer();
  const { state, actions } = usePlayerState();
  const audioPreloader = useAudioPreloader();

  // 오디오 플레이어 상태를 전역 상태와 동기화
  useEffect(() => {
    if (state.currentTrack) {
      audioPlayer.loadTrack(state.currentTrack);
    }
  }, [state.currentTrack, audioPlayer]);

  // 재생/정지 상태 동기화
  useEffect(() => {
    if (state.isPlaying) {
      audioPlayer.play();
    } else {
      audioPlayer.pause();
    }
  }, [state.isPlaying, audioPlayer]);

  // 볼륨 동기화
  useEffect(() => {
    audioPlayer.setVolume(state.volume);
  }, [state.volume, audioPlayer]);

  // 다음 곡 프리로드
  useEffect(() => {
    if (state.playlist.length > 0 && state.currentIndex >= 0) {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex < state.playlist.length) {
        const nextTrack = state.playlist[nextIndex];
        if (nextTrack) {
          audioPreloader.preloadAudio(nextTrack.file).catch(() => {
            // Failed to preload next track - silent fail
          });
        }
      }
    }
  }, [state.playlist, state.currentIndex, audioPreloader]);

  // 오디오 이벤트 핸들러
  const handleTimeUpdate = useCallback(() => {
    // currentTime은 audioPlayer에서 직접 가져올 수 없으므로 state에서 사용
    actions.seek(state.currentTime);
  }, [state.currentTime, actions]);

  const handleLoadedMetadata = useCallback(() => {
    // duration은 자동으로 업데이트됨
  }, []);

  const handleEnded = useCallback(() => {
    actions.playNext();
  }, [actions]);

  const handleError = useCallback((_error: Event) => {
    // Audio playback error - silent fail
    actions.clearError();
  }, [actions]);

  // 오디오 이벤트 리스너 설정
  useEffect(() => {
    const audio = audioPlayer.audioRef?.current;
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };
    }
    return undefined;
  }, [audioPlayer.audioRef, handleTimeUpdate, handleLoadedMetadata, handleEnded, handleError]);

  // 트랙 재생 함수
  const playTrack = useCallback(
    async (track: Track, index?: number) => {
      actions.playTrack(track);
      if (index !== undefined) {
        // 인덱스 설정은 playTrack에서 처리됨
      }
    },
    [actions]
  );

  // 재생/정지 토글
  const togglePlay = useCallback(async () => {
    actions.togglePlay();
  }, [actions]);

  // 시간 이동
  const seekTo = useCallback(
    (time: number) => {
      audioPlayer.seek(time);
    },
    [audioPlayer]
  );

  // 볼륨 설정
  const setVolume = useCallback(
    (volume: number) => {
      actions.setVolume(volume);
    },
    [actions]
  );

  // 다음 곡
  const playNext = useCallback(() => {
    actions.playNext();
  }, [actions]);

  // 이전 곡
  const playPrevious = useCallback(() => {
    actions.playPrevious();
  }, [actions]);

  // 반복 모드 변경
  const cycleRepeatMode = useCallback(() => {
    actions.toggleRepeat();
  }, [actions]);

  // 셔플 토글
  const toggleShuffle = useCallback(() => {
    actions.toggleShuffle();
  }, [actions]);

  // 다운로드 기능
  const downloadCurrentTrack = useCallback(() => {
    if (state.currentTrack) {
      const link = document.createElement('a');
      link.href = state.currentTrack.file;
      link.download = `${state.currentTrack.artist} - ${state.currentTrack.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [state.currentTrack]);

  // 플레이리스트 설정
  const setPlaylist = useCallback(
    (tracks: Track[]) => {
      actions.setPlaylist(tracks);
      
      // 플레이리스트 설정 후 첫 번째 곡 프리로드
      if (tracks.length > 0) {
        const firstTrack = tracks[0];
        if (firstTrack) {
          audioPreloader.preloadAudio(firstTrack.file).catch(() => {
            // Failed to preload first track - silent fail
          });
        }
      }
    },
    [actions, audioPreloader]
  );

  // 키보드 단축키 지원
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 포커스된 요소가 input이나 textarea인 경우 무시
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (e.ctrlKey || e.metaKey) {
            // Ctrl/Cmd + 왼쪽: 이전 곡
            playPrevious();
          } else {
            // 왼쪽: 10초 뒤로
            seekTo(Math.max(0, state.currentTime - 10));
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (e.ctrlKey || e.metaKey) {
            // Ctrl/Cmd + 오른쪽: 다음 곡
            playNext();
          } else {
            // 오른쪽: 10초 앞으로
            seekTo(Math.min(state.duration, state.currentTime + 10));
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          // 위쪽: 볼륨 증가
          const newVolumeUp = Math.min(1, state.volume + 0.1);
          setVolume(newVolumeUp);
          break;
        case 'ArrowDown':
          e.preventDefault();
          // 아래쪽: 볼륨 감소
          const newVolumeDown = Math.max(0, state.volume - 0.1);
          setVolume(newVolumeDown);
          break;
        case 'KeyR':
          e.preventDefault();
          // R: 반복 모드 변경
          cycleRepeatMode();
          break;
        case 'KeyS':
          e.preventDefault();
          // S: 셔플 토글
          toggleShuffle();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    togglePlay,
    playPrevious,
    playNext,
    seekTo,
    setVolume,
    cycleRepeatMode,
    toggleShuffle,
    state.currentTime,
    state.duration,
    state.volume,
  ]);

  return {
    // 상태
    currentTrack: state.currentTrack,
    isPlaying: state.isPlaying,
    currentTime: state.currentTime,
    duration: state.duration,
    volume: state.volume,
    isLoading: state.isLoading,
    error: state.error,
    playlist: state.playlist,
    currentIndex: state.currentIndex,
    repeatMode: state.repeatMode,
    isShuffled: state.isShuffled,

    // 액션
    playTrack,
    togglePlay,
    seekTo,
    setVolume,
    playNext,
    playPrevious,
    cycleRepeatMode,
    toggleShuffle,
    downloadCurrentTrack,
    setPlaylist,

    // 오디오 요소 참조 (컴포넌트에서 사용)
    audioRef: audioPlayer.audioRef,
  };
};