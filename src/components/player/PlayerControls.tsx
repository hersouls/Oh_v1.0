import React from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  BackwardIcon, 
  ForwardIcon,
  ArrowPathIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/solid';
import { Track } from '@/types';

interface PlayerControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  repeatMode: 'none' | 'one' | 'all';
  isShuffled: boolean;
  currentTrack?: Track | undefined;
  onPlay: () => void;
  onPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleRepeat: () => void;
  onToggleShuffle: () => void;
  onDownload?: (track: Track) => void;
  className?: string;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  isMuted,
  volume,
  repeatMode,
  isShuffled,
  currentTrack,
  onPlay,
  onPause,
  onPrevious,
  onNext,
  onToggleMute,
  onVolumeChange,
  onToggleRepeat,
  onToggleShuffle,
  onDownload,
  className
}) => {
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one':
        return <ArrowPathIcon className="w-5 h-5 text-moonwave-500" />;
      case 'all':
        return <ArrowPathIcon className="w-5 h-5 text-white" />;
      default:
        return <ArrowPathIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className={`flex items-center justify-between p-4 bg-glass-primary rounded-xl backdrop-blur-sm ${className}`}>
      {/* 이전/다음 버튼 */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onPrevious}
          className="p-2 rounded-full hover:bg-glass-secondary transition-colors"
        >
          <BackwardIcon className="w-5 h-5 text-white" />
        </button>

        <button
          onClick={isPlaying ? onPause : onPlay}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-moonwave-500 hover:bg-moonwave-600 transition-colors"
        >
          {isPlaying ? (
            <PauseIcon className="w-6 h-6 text-white" />
          ) : (
            <PlayIcon className="w-6 h-6 text-white ml-0.5" />
          )}
        </button>

        <button
          onClick={onNext}
          className="p-2 rounded-full hover:bg-glass-secondary transition-colors"
        >
          <ForwardIcon className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* 반복/셔플 버튼 */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleRepeat}
          className="p-2 rounded-full hover:bg-glass-secondary transition-colors"
          title={`반복: ${repeatMode === 'none' ? '끔' : repeatMode === 'one' ? '한 곡' : '전체'}`}
        >
          {getRepeatIcon()}
        </button>

        <button
          onClick={onToggleShuffle}
          className={`p-2 rounded-full transition-colors ${
            isShuffled 
              ? 'bg-moonwave-500 hover:bg-moonwave-600' 
              : 'hover:bg-glass-secondary'
          }`}
          title="셔플"
        >
          <ArrowPathIcon className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* 볼륨 컨트롤 */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleMute}
          className="p-2 rounded-full hover:bg-glass-secondary transition-colors"
        >
          {isMuted ? (
            <SpeakerXMarkIcon className="w-5 h-5 text-white" />
          ) : (
            <SpeakerWaveIcon className="w-5 h-5 text-white" />
          )}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-20 h-1 bg-glass-border rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.2) ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.2) 100%)`
          }}
        />
      </div>

      {/* 다운로드 버튼 */}
      {currentTrack && onDownload && (
        <button
          onClick={() => onDownload(currentTrack)}
          className="p-2 rounded-full hover:bg-glass-secondary transition-colors"
          title="다운로드"
        >
          <ArrowDownTrayIcon className="w-5 h-5 text-white" />
        </button>
      )}
    </div>
  );
};