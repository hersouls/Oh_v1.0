import React, { useState } from 'react';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <SpeakerXMarkIcon className="w-5 h-5" />;
    } else if (volume < 0.5) {
      return <SpeakerWaveIcon className="w-5 h-5" />;
    } else {
      return <SpeakerWaveIcon className="w-5 h-5" />;
    }
  };

  return (
    <div
      className="flex items-center space-x-2 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 음소거 버튼 */}
      <button
        onClick={onToggleMute}
        className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
        title={isMuted ? '음소거 해제' : '음소거'}
      >
        {getVolumeIcon()}
      </button>

      {/* 볼륨 슬라이더 */}
      <div className={`transition-all duration-200 ${isHovered ? 'w-20 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.2) ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.2) 100%)`
          }}
        />
      </div>
    </div>
  );
};