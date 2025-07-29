import React from 'react';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import { Track } from '@/hooks/usePlayerState';
import { useIntegratedPlayer } from '@/hooks/useIntegratedPlayer';

interface TrackCardProps {
  track: Track;
  index: number;
  className?: string;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  index,
  className = '',
}) => {
  const { currentTrack, isPlaying, playTrack } = useIntegratedPlayer();
  
  const isCurrentTrack = currentTrack?.id === track.id;
  const isPlayingCurrent = isCurrentTrack && isPlaying;

  const handlePlayClick = () => {
    if (isCurrentTrack) {
      // 현재 트랙이면 재생/정지 토글
      // 이는 AudioPlayer에서 처리됨
    } else {
      // 다른 트랙이면 해당 트랙 재생
      playTrack(track, index);
    }
  };

  return (
    <div className={`group relative bg-black/20 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-all duration-300 ${className}`}>
      {/* 커버 이미지 */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={track.coverUrl}
          alt={track.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* 오버레이 */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* 재생 버튼 */}
        <button
          onClick={handlePlayClick}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="w-16 h-16 rounded-full bg-moonwave-500/90 hover:bg-moonwave-500 flex items-center justify-center transition-colors">
            {isPlayingCurrent ? (
              <PauseIcon className="w-8 h-8 text-white" />
            ) : (
              <PlayIcon className="w-8 h-8 text-white ml-1" />
            )}
          </div>
        </button>

        {/* 현재 재생 중 표시 */}
        {isCurrentTrack && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-moonwave-400 rounded-full animate-pulse" />
        )}
      </div>

      {/* 트랙 정보 */}
      <div className="p-4">
        <h3 className="text-white font-medium truncate mb-1">{track.title}</h3>
        <p className="text-gray-300 text-sm truncate mb-2">{track.artist}</p>
        <p className="text-gray-400 text-xs line-clamp-2">{track.description}</p>
      </div>
    </div>
  );
};