import React, { useRef, useEffect, useState } from 'react';
import { Track } from '@/hooks/usePlayerState';

interface SyncLine {
  time: number;
  line: string;
}

interface LyricsSyncProps {
  track: Track;
  currentTime: number;
  className?: string;
}

export const LyricsSync: React.FC<LyricsSyncProps> = ({
  track,
  currentTime,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  // 현재 시간에 해당하는 가사 라인 찾기
  useEffect(() => {
    if (!track.sync || track.sync.length === 0) return;

    let newActiveIndex = -1;
    
    for (let i = 0; i < track.sync.length; i++) {
      const line = track.sync[i];
      const nextLine = track.sync[i + 1];
      
      if (currentTime >= line.time && (!nextLine || currentTime < nextLine.time)) {
        newActiveIndex = i;
        break;
      }
    }
    
    setActiveIndex(newActiveIndex);
  }, [currentTime, track.sync]);

  // 활성 라인으로 스크롤
  useEffect(() => {
    if (activeIndex >= 0 && containerRef.current) {
      const activeElement = containerRef.current.children[activeIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [activeIndex]);

  if (!track.sync || track.sync.length === 0) {
    return (
      <div className={`text-center text-gray-400 py-8 ${className}`}>
        <p>가사 정보가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={`max-h-96 overflow-y-auto ${className}`}>
      <div ref={containerRef} className="space-y-4">
        {track.sync.map((line, index) => (
          <div
            key={index}
            className={`transition-all duration-300 ${
              index === activeIndex
                ? 'text-moonwave-400 text-lg font-medium'
                : 'text-gray-400 text-base'
            }`}
          >
            <p className="text-center leading-relaxed">{line.line}</p>
          </div>
        ))}
      </div>
    </div>
  );
};