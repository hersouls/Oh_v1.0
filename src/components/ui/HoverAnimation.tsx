import * as React from 'react';
import { clsx } from 'clsx';

interface HoverAnimationProps {
  children: React.ReactNode;
  className?: string;
  type?: 'lift' | 'scale' | 'glow' | 'rotate' | 'shake' | 'wiggle' | 'pulse' | 'bounce' | 'slide' | 'fade';
  intensity?: 'light' | 'medium' | 'strong';
  duration?: 'fast' | 'normal' | 'slow';
  delay?: number;
  trigger?: 'hover' | 'focus' | 'both';
  disabled?: boolean;
}

export const HoverAnimation: React.FC<HoverAnimationProps> = ({
  children,
  className,
  type = 'lift',
  intensity = 'medium',
  duration = 'normal',
  delay = 0,
  disabled = false
}) => {
  const typeClasses = {
    lift: 'hover-lift',
    scale: 'hover-scale',
    glow: 'hover-glow',
    rotate: 'hover:rotate-12',
    shake: 'hover:animate-shake',
    wiggle: 'hover:animate-wiggle',
    pulse: 'hover:animate-pulse',
    bounce: 'hover:animate-bounce',
    slide: 'hover:translate-x-2',
    fade: 'hover:opacity-80'
  };

  const intensityClasses = {
    light: {
      lift: 'hover:-translate-y-1',
      scale: 'hover:scale-105',
      glow: 'hover:shadow-glow/50',
      rotate: 'hover:rotate-6',
      shake: 'hover:animate-shake',
      wiggle: 'hover:animate-wiggle',
      pulse: 'hover:animate-pulse',
      bounce: 'hover:animate-bounce',
      slide: 'hover:translate-x-1',
      fade: 'hover:opacity-80'
    },
    medium: {
      lift: 'hover:-translate-y-2',
      scale: 'hover:scale-110',
      glow: 'hover:shadow-glow',
      rotate: 'hover:rotate-12',
      shake: 'hover:animate-shake',
      wiggle: 'hover:animate-wiggle',
      pulse: 'hover:animate-pulse',
      bounce: 'hover:animate-bounce',
      slide: 'hover:translate-x-2',
      fade: 'hover:opacity-80'
    },
    strong: {
      lift: 'hover:-translate-y-4',
      scale: 'hover:scale-125',
      glow: 'hover:shadow-glow hover:shadow-2xl',
      rotate: 'hover:rotate-45',
      shake: 'hover:animate-shake',
      wiggle: 'hover:animate-wiggle',
      pulse: 'hover:animate-pulse',
      bounce: 'hover:animate-bounce',
      slide: 'hover:translate-x-4',
      fade: 'hover:opacity-80'
    }
  };

  const durationClasses = {
    fast: 'duration-150',
    normal: 'duration-300',
    slow: 'duration-500'
  };



  const getAnimationClasses = () => {
    if (disabled) return '';
    
    const baseClass = typeClasses[type];
    const intensityClass = intensityClasses[intensity]?.[type] || '';
    const durationClass = durationClasses[duration];
    
    return clsx(
      'transition-all',
      durationClass,
      baseClass,
      intensityClass
    );
  };

  return (
    <div
      className={clsx(
        getAnimationClasses(),
        className
      )}
      style={{
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

// 특화된 호버 애니메이션 컴포넌트들
export const LiftOnHover: React.FC<Omit<HoverAnimationProps, 'type'> & { type?: never }> = (props) => (
  <HoverAnimation {...props} type="lift" />
);

export const ScaleOnHover: React.FC<Omit<HoverAnimationProps, 'type'> & { type?: never }> = (props) => (
  <HoverAnimation {...props} type="scale" />
);

export const GlowOnHover: React.FC<Omit<HoverAnimationProps, 'type'> & { type?: never }> = (props) => (
  <HoverAnimation {...props} type="glow" />
);

export const RotateOnHover: React.FC<Omit<HoverAnimationProps, 'type'> & { type?: never }> = (props) => (
  <HoverAnimation {...props} type="rotate" />
);

export const ShakeOnHover: React.FC<Omit<HoverAnimationProps, 'type'> & { type?: never }> = (props) => (
  <HoverAnimation {...props} type="shake" />
);

export const WiggleOnHover: React.FC<Omit<HoverAnimationProps, 'type'> & { type?: never }> = (props) => (
  <HoverAnimation {...props} type="wiggle" />
);

export const PulseOnHover: React.FC<Omit<HoverAnimationProps, 'type'> & { type?: never }> = (props) => (
  <HoverAnimation {...props} type="pulse" />
);

export const BounceOnHover: React.FC<Omit<HoverAnimationProps, 'type'> & { type?: never }> = (props) => (
  <HoverAnimation {...props} type="bounce" />
);

export const SlideOnHover: React.FC<Omit<HoverAnimationProps, 'type'> & { type?: never }> = (props) => (
  <HoverAnimation {...props} type="slide" />
);

export const FadeOnHover: React.FC<Omit<HoverAnimationProps, 'type'> & { type?: never }> = (props) => (
  <HoverAnimation {...props} type="fade" />
);

// 강도별 컴포넌트들
export const LightHover: React.FC<Omit<HoverAnimationProps, 'intensity'> & { intensity?: never }> = (props) => (
  <HoverAnimation {...props} intensity="light" />
);

export const StrongHover: React.FC<Omit<HoverAnimationProps, 'intensity'> & { intensity?: never }> = (props) => (
  <HoverAnimation {...props} intensity="strong" />
);

// 속도별 컴포넌트들
export const FastHover: React.FC<Omit<HoverAnimationProps, 'duration'> & { duration?: never }> = (props) => (
  <HoverAnimation {...props} duration="fast" />
);

export const SlowHover: React.FC<Omit<HoverAnimationProps, 'duration'> & { duration?: never }> = (props) => (
  <HoverAnimation {...props} duration="slow" />
);