import React from 'react';
import { useIntegratedPlayer } from '@/hooks/useIntegratedPlayer';
import { PlayerControls } from './PlayerControls';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { TrackInfo } from './TrackInfo';

interface AudioPlayerProps {
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ className = '' }) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    error,
    togglePlay,
    seekTo,
    setVolume,
    toggleMute,
    playNext,
    playPrevious,
    cycleRepeatMode,
    toggleShuffle,
    repeatMode,
    isShuffled,
    audioRef,
  } = useIntegratedPlayer();

  if (!currentTrack) {
    return null;
  }

  return (
    <div className={`bg-black/20 backdrop-blur-md border border-white/10 rounded-lg p-4 ${className}`}>
      {/* 오디오 요소 (숨김) */}
      <audio ref={audioRef} preload="metadata" />
      
      {/* 에러 메시지 */}
      {error && (
        <div className="text-red-400 text-sm mb-2 text-center">
          {error}
        </div>
      )}

      {/* 트랙 정보 */}
      <TrackInfo track={currentTrack} />

      {/* 진행바 */}
      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        onSeek={seekTo}
        isLoading={isLoading}
        className="my-4"
      />

      {/* 컨트롤 */}
      <div className="flex items-center justify-between">
        {/* 볼륨 컨트롤 */}
        <VolumeControl
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={setVolume}
          onToggleMute={toggleMute}
        />

        {/* 플레이어 컨트롤 */}
        <PlayerControls
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          onPrevious={playPrevious}
          onNext={playNext}
          onToggleShuffle={toggleShuffle}
          onCycleRepeat={cycleRepeatMode}
          isShuffled={isShuffled}
          repeatMode={repeatMode}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};