import React from 'react';
import {
  PlayIcon,
  PauseIcon,
  BackwardIcon,
  ForwardIcon,
  ArrowsRightLeftIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/solid';

interface PlayerControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
  onDownload?: ((track: { title: string; artist: string }) => void) | undefined;
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
  isLoading: boolean;
  currentTrack?: { title: string; artist: string } | null;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onPrevious,
  onNext,
  onToggleShuffle,
  onCycleRepeat,
  onDownload,
  isShuffled,
  repeatMode,
  isLoading,
  currentTrack,
}) => {
  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one':
        return <ArrowPathIcon className="w-5 h-5" />;
      case 'all':
        return <ArrowPathIcon className="w-5 h-5" />;
      default:
        return <ArrowPathIcon className="w-5 h-5" />;
    }
  };

  const getRepeatColor = () => {
    switch (repeatMode) {
      case 'one':
        return 'text-moonwave-400';
      case 'all':
        return 'text-moonwave-400';
      default:
        return 'text-gray-400';
    }
  };

  const handleDownload = () => {
    if (onDownload && currentTrack) {
      onDownload(currentTrack);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {/* 셔플 버튼 */}
      <button
        data-testid="shuffle-button"
        onClick={onToggleShuffle}
        className={`p-2 rounded-full hover:bg-white/10 transition-colors ${
          isShuffled ? 'text-moonwave-400' : 'text-gray-400'
        }`}
        title="셔플"
      >
        <ArrowsRightLeftIcon className="w-5 h-5" />
      </button>

      {/* 이전 곡 버튼 */}
      <button
        data-testid="prev-button"
        onClick={onPrevious}
        className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
        title="이전 곡"
      >
        <BackwardIcon className="w-6 h-6" />
      </button>

      {/* 재생/정지 버튼 */}
      <button
        data-testid="play-pause-button"
        onClick={onTogglePlay}
        disabled={isLoading}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-moonwave-500 hover:bg-moonwave-600 transition-colors disabled:opacity-50"
        title={isPlaying ? '정지' : '재생'}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <PauseIcon className="w-6 h-6 text-white" data-testid="pause-icon" />
        ) : (
          <PlayIcon className="w-6 h-6 text-white ml-0.5" data-testid="play-icon" />
        )}
      </button>

      {/* 다음 곡 버튼 */}
      <button
        data-testid="next-button"
        onClick={onNext}
        className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
        title="다음 곡"
      >
        <ForwardIcon className="w-6 h-6" />
      </button>

      {/* 반복 버튼 */}
      <button
        data-testid="repeat-button"
        onClick={onCycleRepeat}
        className={`p-2 rounded-full hover:bg-white/10 transition-colors ${getRepeatColor()}`}
        title={`반복: ${repeatMode === 'none' ? '끄기' : repeatMode === 'one' ? '한 곡' : '전체'}`}
      >
        {getRepeatIcon()}
      </button>

      {/* 다운로드 버튼 */}
      {onDownload && currentTrack && (
        <button
          onClick={handleDownload}
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          title={`${currentTrack.title} 다운로드`}
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};