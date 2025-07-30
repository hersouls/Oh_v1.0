import { useEffect, useRef, useCallback } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeOptions {
  threshold?: number;
  velocity?: number;
  preventDefault?: boolean;
}

export const useSwipe = (
  handlers: SwipeHandlers,
  options: SwipeOptions = {}
) => {
  const {
    threshold = 50,
    velocity = 0.3,
    preventDefault = true
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);
  const startTime = useRef<number>(0);
  const isSwiping = useRef<boolean>(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (preventDefault) {
      e.preventDefault();
    }
    
    const touch = e.touches[0];
    if (!touch) return;
    startX.current = touch.clientX;
    startY.current = touch.clientY;
    startTime.current = Date.now();
    isSwiping.current = true;
  }, [preventDefault]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isSwiping.current) return;
    
    if (preventDefault) {
      e.preventDefault();
    }
  }, [preventDefault]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!isSwiping.current) return;
    
    const touch = e.changedTouches[0];
    if (!touch) return;
    const deltaX = touch.clientX - startX.current;
    const deltaY = touch.clientY - startY.current;
    const deltaTime = Date.now() - startTime.current;
    const velocityX = Math.abs(deltaX) / deltaTime;
    const velocityY = Math.abs(deltaY) / deltaTime;

    // 속도와 거리가 임계값을 넘으면 스와이프로 인식
    if (velocityX > velocity || velocityY > velocity) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 가로 스와이프
        if (Math.abs(deltaX) > threshold) {
          if (deltaX > 0 && handlers.onSwipeRight) {
            handlers.onSwipeRight();
          } else if (deltaX < 0 && handlers.onSwipeLeft) {
            handlers.onSwipeLeft();
          }
        }
      } else {
        // 세로 스와이프
        if (Math.abs(deltaY) > threshold) {
          if (deltaY > 0 && handlers.onSwipeDown) {
            handlers.onSwipeDown();
          } else if (deltaY < 0 && handlers.onSwipeUp) {
            handlers.onSwipeUp();
          }
        }
      }
    }

    isSwiping.current = false;
  }, [handlers, threshold, velocity]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return elementRef;
};