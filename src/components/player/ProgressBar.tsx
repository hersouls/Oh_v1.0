import React, { useState, useRef, useEffect, useCallback } from 'react';
import { formatTime } from '@/utils/audio';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);


  const displayTime = isDragging ? dragTime : currentTime;
  const displayProgress = duration > 0 ? (displayTime / duration) * 100 : 0;

  const getTimeFromEvent = useCallback((clientX: number) => {
    if (!progressRef.current) return 0;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    return percentage * duration;
  }, [duration]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!progressRef.current) return;
    
    setIsDragging(true);
    const newTime = getTimeFromEvent(e.clientX);
    setDragTime(newTime);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!progressRef.current) return;
    
    setIsDragging(true);
    const touch = e.touches[0];
    if (touch) {
      const newTime = getTimeFromEvent(touch.clientX);
      setDragTime(newTime);
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !progressRef.current) return;
    
    const newTime = getTimeFromEvent(e.clientX);
    setDragTime(newTime);
  }, [isDragging, getTimeFromEvent]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || !progressRef.current) return;
    
    e.preventDefault(); // 스크롤 방지
    const touch = e.touches[0];
    if (touch) {
      const newTime = getTimeFromEvent(touch.clientX);
      setDragTime(newTime);
    }
  }, [isDragging, getTimeFromEvent]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      onSeek(dragTime);
      setIsDragging(false);
    }
  }, [isDragging, dragTime, onSeek]);

  const handleTouchEnd = useCallback(() => {
    if (isDragging) {
      onSeek(dragTime);
      setIsDragging(false);
    }
  }, [isDragging, dragTime, onSeek]);

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
    return undefined;
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const handleClick = (e: React.MouseEvent) => {
    if (!progressRef.current) return;
    
    const newTime = getTimeFromEvent(e.clientX);
    onSeek(newTime);
  };

  const handleTouch = (e: React.TouchEvent) => {
    if (!progressRef.current) return;
    
    const touch = e.touches[0];
    if (touch) {
      const newTime = getTimeFromEvent(touch.clientX);
      onSeek(newTime);
    }
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
        data-testid="progress-bar"
        ref={progressRef}
        className="relative h-2 bg-white/20 rounded-full cursor-pointer overflow-hidden touch-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleClick}
        onTouchEnd={handleTouch}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={displayTime}
      >


        {/* 진행률 */}
        <div
          data-testid="progress-fill"
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-moonwave-400 to-moonwave-500 rounded-full transition-all duration-100"
          style={{ width: `${displayProgress}%` }}
        />

        {/* 드래그 핸들 */}
        <div
          data-testid="progress-handle"
          className="absolute top-1/2 w-3 h-3 bg-white rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity"
          style={{ left: `${displayProgress}%` }}
        />
      </div>
    </div>
  );
};