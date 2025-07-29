import React from 'react';
import { Track } from '@/hooks/usePlayerState';

interface TrackInfoProps {
  track: Track;
}

export const TrackInfo: React.FC<TrackInfoProps> = ({ track }) => {
  return (
    <div className="flex items-center space-x-3">
      {/* 커버 이미지 */}
      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={track.coverUrl}
          alt={track.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* 트랙 정보 */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-medium truncate">{track.title}</h3>
        <p className="text-gray-300 text-sm truncate">{track.artist}</p>
      </div>
    </div>
  );
};