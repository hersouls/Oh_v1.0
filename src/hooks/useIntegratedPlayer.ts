import { useEffect, useCallback } from 'react';
import { useAudioPlayer } from './useAudioPlayer';
import { usePlayerState, usePlayerActions, Track } from './usePlayerState';

export const useIntegratedPlayer = () => {
  const audioPlayer = useAudioPlayer();
  const { state } = usePlayerState();
  const actions = usePlayerActions();

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

  // 플레이리스트 설정
  const setPlaylist = useCallback(
    (tracks: Track[]) => {
      actions.setPlaylist(tracks);
    },
    [actions]
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
    setPlaylist,

    // 오디오 요소 참조 (컴포넌트에서 사용)
    audioRef: audioPlayer.audioRef,
  };
};