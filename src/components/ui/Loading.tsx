import React from 'react';
import { clsx } from 'clsx';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <div
        className={clsx(
          'animate-spin rounded-full border-2 border-glass-border border-t-moonwave-500',
          sizeClasses[size]
        )}
      />
    </div>
  );
};