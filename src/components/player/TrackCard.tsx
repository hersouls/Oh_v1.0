import React, { memo, useCallback } from 'react';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import { Track } from '@/types';
import { cn } from '@/utils/cn';

interface TrackCardProps {
  track: Track;
  onPlay?: ((track: Track) => void) | undefined;
  isCurrentTrack?: boolean;
  isPlaying?: boolean;
  className?: string;
}

export const TrackCard: React.FC<TrackCardProps> = memo(({
  track,
  onPlay,
  isCurrentTrack = false,
  isPlaying = false,
  className,
}) => {
  const handlePlayClick = useCallback(() => {
    onPlay?.(track);
  }, [track, onPlay]);

  const isPlayingCurrent = isCurrentTrack && isPlaying;

  return (
    <div className={cn(
      "group relative bg-black/20 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-all duration-300",
      className
    )}>
      {/* 커버 이미지 */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={track.cover}
          alt={track.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* 오버레이 */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* 재생 버튼 */}
        <button
          onClick={handlePlayClick}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 btn-touch"
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-moonwave-500/90 hover:bg-moonwave-500 flex items-center justify-center transition-colors">
            {isPlayingCurrent ? (
              <PauseIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            ) : (
              <PlayIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-0.5 sm:ml-1" />
            )}
          </div>
        </button>

        {/* 현재 재생 중 표시 */}
        {isCurrentTrack && (
          <div className="absolute top-2 right-2 w-2 h-2 sm:w-3 sm:h-3 bg-moonwave-400 rounded-full animate-pulse" />
        )}
      </div>

      {/* 트랙 정보 */}
      <div className="p-3 sm:p-4">
        <h3 className="text-white font-medium truncate mb-1 text-sm sm:text-base">{track.title}</h3>
        <p className="text-gray-300 text-xs sm:text-sm truncate mb-1 sm:mb-2">{track.artist}</p>
        {track.description && (
          <p className="text-gray-400 text-xs line-clamp-2">{track.description}</p>
        )}
      </div>
    </div>
  );
});

TrackCard.displayName = 'TrackCard';