import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  size = 'md'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 모달 컨테이너 */}
      <div
        className={clsx(
          'relative w-full bg-glass-primary border border-glass-border rounded-xl backdrop-blur-sm shadow-glow',
          sizeClasses[size],
          className
        )}
      >
        {/* 헤더 */}
        {(title || true) && (
          <div className="flex items-center justify-between p-6 border-b border-glass-border">
            {title && (
              <h2 className="text-xl font-semibold text-white">{title}</h2>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-glass-secondary transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
        
        {/* 콘텐츠 */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};