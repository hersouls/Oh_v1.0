import React from 'react';
import { Track } from '@/types';

interface TrackInfoProps {
  track: Track;
}

export const TrackInfo: React.FC<TrackInfoProps> = ({ track }) => {
  return (
    <div data-testid="current-track-info" className="flex items-center space-x-3">
      {/* 커버 이미지 */}
      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={track.cover}
          alt={track.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* 트랙 정보 */}
      <div className="flex-1 min-w-0">
        <h3 data-testid="track-title" className="text-white font-medium truncate">{track.title}</h3>
        <p data-testid="track-artist" className="text-gray-300 text-sm truncate">{track.artist}</p>
      </div>
    </div>
  );
};