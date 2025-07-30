import React, { useState } from 'react';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  onVolumeChange,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
  };

  const getVolumeIcon = () => {
    if (volume === 0) {
      return <SpeakerXMarkIcon className="w-5 h-5" />;
    } else if (volume < 0.5) {
      return <SpeakerWaveIcon className="w-5 h-5" />;
    } else {
      return <SpeakerWaveIcon className="w-5 h-5" />;
    }
  };

  return (
    <div
      data-testid="volume-control"
      className="flex items-center space-x-2 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 볼륨 아이콘 */}
      <div className="p-2 text-white" data-testid="volume-icon">
        {getVolumeIcon()}
      </div>

      {/* 볼륨 슬라이더 */}
      <div className={`transition-all duration-200 ${isHovered ? 'w-20 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
        <input
          data-testid="volume-slider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${volume * 100}%, rgba(255, 255, 255, 0.2) ${volume * 100}%, rgba(255, 255, 255, 0.2) 100%)`
          }}
        />
      </div>
    </div>
  );
};