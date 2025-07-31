import { useState, useCallback } from 'react';
import { Track } from '../types';

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

  const playTrack = useCallback((track: Track) => {
    setState(prev => ({
      ...prev,
      currentTrack: track,
      isPlaying: true,
    }));
  }, []);

  const togglePlay = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  }, []);

  const pause = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: false,
    }));
  }, []);

  const resume = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: true,
    }));
  }, []);

  const stop = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: false,
      currentTime: 0,
    }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    setState(prev => ({
      ...prev,
      volume: Math.max(0, Math.min(1, volume)),
    }));
  }, []);

  const seek = useCallback((time: number) => {
    setState(prev => ({
      ...prev,
      currentTime: time,
    }));
  }, []);

  const nextTrack = useCallback(() => {
    // Placeholder for next track functionality
    console.log('Next track');
  }, []);

  const previousTrack = useCallback(() => {
    // Placeholder for previous track functionality
    console.log('Previous track');
  }, []);

  const setCurrentTime = useCallback((time: number) => {
    setState(prev => ({
      ...prev,
      currentTime: time,
    }));
  }, []);

  const togglePlayMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      playMode: prev.playMode === 'sequential' ? 'repeat-one' : prev.playMode === 'repeat-one' ? 'shuffle' : 'sequential',
    }));
  }, []);

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
    seek,
    nextTrack,
    previousTrack,
    setCurrentTime,
    togglePlayMode,
    formatTime,
  };
};
