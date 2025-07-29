import React, { useState, useRef, useEffect } from 'react';
import { formatTime } from '@/utils/audio';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  isLoading: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
  isLoading,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const displayTime = isDragging ? dragTime : currentTime;
  const displayProgress = duration > 0 ? (displayTime / duration) * 100 : 0;

  const getTimeFromEvent = (clientX: number) => {
    if (!progressRef.current) return 0;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    return percentage * duration;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!progressRef.current || isLoading) return;
    
    setIsDragging(true);
    const newTime = getTimeFromEvent(e.clientX);
    setDragTime(newTime);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!progressRef.current || isLoading) return;
    
    setIsDragging(true);
    const touch = e.touches[0];
    const newTime = getTimeFromEvent(touch.clientX);
    setDragTime(newTime);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !progressRef.current) return;
    
    const newTime = getTimeFromEvent(e.clientX);
    setDragTime(newTime);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !progressRef.current) return;
    
    e.preventDefault(); // 스크롤 방지
    const touch = e.touches[0];
    const newTime = getTimeFromEvent(touch.clientX);
    setDragTime(newTime);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      onSeek(dragTime);
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      onSeek(dragTime);
      setIsDragging(false);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, dragTime, duration, onSeek]);

  const handleClick = (e: React.MouseEvent) => {
    if (!progressRef.current || isLoading) return;
    
    const newTime = getTimeFromEvent(e.clientX);
    onSeek(newTime);
  };

  const handleTouch = (e: React.TouchEvent) => {
    if (!progressRef.current || isLoading) return;
    
    const touch = e.touches[0];
    const newTime = getTimeFromEvent(touch.clientX);
    onSeek(newTime);
  };

  return (
    <div className={className}>
      {/* 시간 표시 */}
      <div className="flex justify-between text-xs text-gray-300 mb-2">
        <span>{formatTime(displayTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* 진행바 */}
      <div
        ref={progressRef}
        className="relative h-2 bg-white/20 rounded-full cursor-pointer overflow-hidden touch-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleClick}
        onTouchEnd={handleTouch}
      >
        {/* 로딩 인디케이터 */}
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
        )}

        {/* 진행률 */}
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-moonwave-400 to-moonwave-500 rounded-full transition-all duration-100"
          style={{ width: `${displayProgress}%` }}
        />

        {/* 드래그 핸들 */}
        <div
          className="absolute top-1/2 w-3 h-3 bg-white rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity"
          style={{ left: `${displayProgress}%` }}
        />
      </div>
    </div>
  );
};