import React, { useRef, useEffect, useState } from 'react';
import { SyncLine } from '@/types';

interface LyricsSyncProps {
  lyrics: SyncLine[];
  currentTime: number;
  className?: string;
  onLineClick?: (line: SyncLine) => void;
}

export const LyricsSync: React.FC<LyricsSyncProps> = ({
  lyrics,
  currentTime,
  className,
  onLineClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLineIndex, setActiveLineIndex] = useState<number>(-1);

  // 현재 시간에 맞는 가사 라인 찾기
  useEffect(() => {
    const currentIndex = lyrics.findIndex(
      (line, index) => {
        const nextLine = lyrics[index + 1];
        return currentTime >= line.startTime && 
               (!nextLine || currentTime < nextLine.startTime);
      }
    );
    
    setActiveLineIndex(currentIndex);
  }, [currentTime, lyrics]);

  // 활성 라인으로 스크롤
  useEffect(() => {
    if (activeLineIndex >= 0 && containerRef.current) {
      const activeElement = containerRef.current.children[activeLineIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [activeLineIndex]);

  const handleLineClick = (line: SyncLine) => {
    onLineClick?.(line);
  };

  return (
    <div
      ref={containerRef}
      className={`space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-glass-border scrollbar-track-transparent ${className}`}
    >
      {lyrics.map((line, index) => {
        const isActive = index === activeLineIndex;
        const isPast = currentTime > line.endTime;
        
        return (
          <div
            key={line.id}
            onClick={() => handleLineClick(line)}
            className={`
              p-3 rounded-lg cursor-pointer transition-all duration-300
              ${isActive 
                ? 'bg-moonwave-500/20 text-moonwave-300 border border-moonwave-500/30' 
                : isPast 
                  ? 'text-gray-400' 
                  : 'text-gray-300 hover:text-white hover:bg-glass-secondary'
              }
            `}
          >
            <div className="text-sm font-medium leading-relaxed">
              {line.text}
            </div>
            {line.translation && (
              <div className={`text-xs mt-1 leading-relaxed ${
                isActive ? 'text-moonwave-200' : 'text-gray-500'
              }`}>
                {line.translation}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">
              {formatTime(line.startTime)} - {formatTime(line.endTime)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 시간 포맷팅 유틸리티 함수
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};