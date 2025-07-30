import React, { memo, useCallback } from 'react';
import { Track } from '../../types';
import { PlayerControls } from './PlayerControls';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { TrackInfo } from './TrackInfo';

export interface AudioPlayerProps {
  currentTrack?: Track | undefined;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  repeatMode: 'none' | 'one' | 'all';
  isShuffled: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleRepeat: () => void;
  onToggleShuffle: () => void;
  onDownload?: ((track: { title: string; artist: string }) => void) | undefined;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = memo(({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  repeatMode,
  isShuffled,
  onTogglePlay,
  onSeek,
  onVolumeChange,
  onNext,
  onPrevious,
  onToggleRepeat,
  onToggleShuffle,
  onDownload,
  className = '',
}) => {
  // 메모이제이션된 콜백 함수들
  const handleTogglePlay = useCallback(() => {
    onTogglePlay();
  }, [onTogglePlay]);

  const handleSeek = useCallback((time: number) => {
    onSeek(time);
  }, [onSeek]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    onVolumeChange(newVolume);
  }, [onVolumeChange]);

  const handleNext = useCallback(() => {
    onNext();
  }, [onNext]);

  const handlePrevious = useCallback(() => {
    onPrevious();
  }, [onPrevious]);

  const handleToggleRepeat = useCallback(() => {
    onToggleRepeat();
  }, [onToggleRepeat]);

  const handleToggleShuffle = useCallback(() => {
    onToggleShuffle();
  }, [onToggleShuffle]);

  // 트랙이 없으면 렌더링하지 않음
  if (!currentTrack) {
    return null;
  }

  return (
    <div className={`audio-player ${className}`}>
      <div className="audio-player-content">
        <TrackInfo track={currentTrack} />
        
        <div className="audio-player-controls">
          <PlayerControls
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onCycleRepeat={handleToggleRepeat}
            onToggleShuffle={handleToggleShuffle}
            onDownload={onDownload}
            repeatMode={repeatMode}
            isShuffled={isShuffled}
            isLoading={false}
            currentTrack={currentTrack}
          />
          
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />
        </div>
        
        <VolumeControl
          volume={volume}
          onVolumeChange={handleVolumeChange}
        />
      </div>
    </div>
  );
});

AudioPlayer.displayName = 'AudioPlayer';