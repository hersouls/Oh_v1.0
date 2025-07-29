import { useEffect, useCallback } from 'react';
import { useAudioPlayer } from './useAudioPlayer';
import { usePlayerState, usePlayerActions, Track } from './usePlayerState';
import { useAudioPreloader } from './useAudioPreloader';

export const useIntegratedPlayer = () => {
  const audioPlayer = useAudioPlayer();
  const { state } = usePlayerState();
  const actions = usePlayerActions();
  const audioPreloader = useAudioPreloader();

  // 오디오 플레이어 상태를 전역 상태와 동기화
  useEffect(() => {
    actions.setPlaying(audioPlayer.isPlaying);
    actions.setCurrentTime(audioPlayer.currentTime);
    actions.setDuration(audioPlayer.duration);
    actions.setVolume(audioPlayer.volume);
    actions.setMuted(audioPlayer.isMuted);
    actions.setLoading(audioPlayer.isLoading);
    actions.setError(audioPlayer.error);
  }, [
    audioPlayer.isPlaying,
    audioPlayer.currentTime,
    audioPlayer.duration,
    audioPlayer.volume,
    audioPlayer.isMuted,
    audioPlayer.isLoading,
    audioPlayer.error,
    actions,
  ]);

  // 현재 트랙이 변경되면 오디오 로드
  useEffect(() => {
    if (state.currentTrack) {
      audioPlayer.loadAudio(state.currentTrack.audioUrl);
    }
  }, [state.currentTrack, audioPlayer]);

  // 다음 곡 프리로드
  useEffect(() => {
    if (state.playlist.length > 0 && state.currentIndex >= 0) {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex < state.playlist.length) {
        const nextTrack = state.playlist[nextIndex];
        audioPreloader.preloadAudio(nextTrack.audioUrl).catch(error => {
          console.warn('Failed to preload next track:', error);
        });
      }
    }
  }, [state.playlist, state.currentIndex, audioPreloader]);

  // 재생/정지 상태 동기화
  useEffect(() => {
    if (state.isPlaying && !audioPlayer.isPlaying) {
      audioPlayer.play();
    } else if (!state.isPlaying && audioPlayer.isPlaying) {
      audioPlayer.pause();
    }
  }, [state.isPlaying, audioPlayer]);

  // 볼륨 동기화
  useEffect(() => {
    if (Math.abs(state.volume - audioPlayer.volume) > 0.01) {
      audioPlayer.setVolume(state.volume);
    }
  }, [state.volume, audioPlayer]);

  // 음소거 동기화
  useEffect(() => {
    if (state.isMuted !== audioPlayer.isMuted) {
      audioPlayer.toggleMute();
    }
  }, [state.isMuted, audioPlayer]);

  // 트랙 재생 함수
  const playTrack = useCallback(
    async (track: Track, index?: number) => {
      actions.setCurrentTrack(track);
      if (index !== undefined) {
        actions.setCurrentIndex(index);
      }
      actions.setPlaying(true);
    },
    [actions]
  );

  // 재생/정지 토글
  const togglePlay = useCallback(async () => {
    if (state.isPlaying) {
      actions.setPlaying(false);
    } else {
      actions.setPlaying(true);
    }
  }, [state.isPlaying, actions]);

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

  // 음소거 토글
  const toggleMute = useCallback(() => {
    actions.setMuted(!state.isMuted);
  }, [state.isMuted, actions]);

  // 다음 곡
  const playNext = useCallback(() => {
    actions.nextTrack();
  }, [actions]);

  // 이전 곡
  const playPrevious = useCallback(() => {
    actions.previousTrack();
  }, [actions]);

  // 반복 모드 변경
  const cycleRepeatMode = useCallback(() => {
    const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(state.repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    actions.setRepeatMode(modes[nextIndex]);
  }, [state.repeatMode, actions]);

  // 셔플 토글
  const toggleShuffle = useCallback(() => {
    actions.toggleShuffle();
  }, [actions]);

  // 다운로드 기능
  const downloadCurrentTrack = useCallback(() => {
    if (state.currentTrack) {
      const link = document.createElement('a');
      link.href = state.currentTrack.audioUrl;
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
        audioPreloader.preloadAudio(tracks[0].audioUrl).catch(error => {
          console.warn('Failed to preload first track:', error);
        });
      }
    },
    [actions, audioPreloader]
  );

  // 현재 트랙이 끝났을 때 처리
  useEffect(() => {
    if (state.currentTrack && state.duration > 0 && state.currentTime >= state.duration) {
      if (state.repeatMode === 'one') {
        // 한 곡 반복: 현재 곡 다시 재생
        audioPlayer.seek(0);
        audioPlayer.play();
      } else if (state.repeatMode === 'all') {
        // 전체 반복: 다음 곡으로
        playNext();
      } else {
        // 반복 없음: 재생 정지
        actions.setPlaying(false);
      }
    }
  }, [state.currentTime, state.duration, state.repeatMode, state.currentTrack, playNext, actions, audioPlayer]);

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
        case 'KeyM':
          e.preventDefault();
          // M: 음소거 토글
          toggleMute();
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
    toggleMute,
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
    isMuted: state.isMuted,
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
    toggleMute,
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