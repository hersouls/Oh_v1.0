import * as React from 'react';
import { clsx } from 'clsx';

interface GlassEffectsProps {
  children: React.ReactNode;
  className?: string;
  transparency?: 'none' | 'light' | 'medium' | 'heavy';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'glow' | 'moonwave';
  border?: boolean;
  borderOpacity?: number;
  hover?: boolean;
  animated?: boolean;
}

export const GlassEffects: React.FC<GlassEffectsProps> = ({
  children,
  className,
  transparency = 'medium',
  shadow = 'md',
  border = true,
  borderOpacity = 0.2,
  hover = true,
  animated = false
}) => {
  const transparencyClasses = {
    none: 'bg-opacity-100',
    light: 'bg-opacity-90',
    medium: 'bg-opacity-75',
    heavy: 'bg-opacity-50'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    glow: 'shadow-glow',
    moonwave: 'shadow-moonwave'
  };

  const borderClasses = border ? 'border border-glass-border' : '';
  const hoverClasses = hover ? 'hover:shadow-glow hover:bg-opacity-90 transition-all duration-300' : '';
  const animatedClasses = animated ? 'animate-float' : '';

  return (
    <div
      className={clsx(
        'relative overflow-hidden',
        transparencyClasses[transparency],
        shadowClasses[shadow],
        borderClasses,
        hoverClasses,
        animatedClasses,
        className
      )}
      style={{
        '--border-opacity': borderOpacity
      } as React.CSSProperties}
    >
      {/* 투명도 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* 내부 콘텐츠 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// 투명도 전용 컴포넌트
interface TransparencyProps {
  children: React.ReactNode;
  className?: string;
  level?: 'none' | 'light' | 'medium' | 'heavy';
  color?: 'white' | 'black' | 'moonwave';
}

export const Transparency: React.FC<TransparencyProps> = ({
  children,
  className,
  level = 'medium',
  color = 'white'
}) => {
  const levelClasses = {
    none: 'opacity-100',
    light: 'opacity-90',
    medium: 'opacity-75',
    heavy: 'opacity-50'
  };

  const colorClasses = {
    white: 'bg-white',
    black: 'bg-black',
    moonwave: 'bg-moonwave-500'
  };

  return (
    <div
      className={clsx(
        levelClasses[level],
        colorClasses[color],
        className
      )}
    >
      {children}
    </div>
  );
};

// 그림자 전용 컴포넌트
interface ShadowProps {
  children: React.ReactNode;
  className?: string;
  type?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'glow' | 'moonwave' | 'glass';
  color?: 'default' | 'moonwave' | 'custom';
  customColor?: string;
}

export const Shadow: React.FC<ShadowProps> = ({
  children,
  className,
  type = 'md',
  color = 'default',
  customColor
}) => {
  const typeClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    glow: 'shadow-glow',
    moonwave: 'shadow-moonwave',
    glass: 'shadow-glass'
  };

  const getShadowColor = () => {
    if (color === 'custom' && customColor) {
      return customColor;
    }
    return color === 'moonwave' ? 'rgba(14, 165, 233, 0.3)' : undefined;
  };

  return (
    <div
      className={clsx(
        typeClasses[type],
        className
      )}
      style={{
        boxShadow: getShadowColor()
      }}
    >
      {children}
    </div>
  );
};

// 특화된 컴포넌트들
export const LightGlass: React.FC<Omit<GlassEffectsProps, 'transparency'> & { transparency?: never }> = (props) => (
  <GlassEffects {...props} transparency="light" />
);

export const HeavyGlass: React.FC<Omit<GlassEffectsProps, 'transparency'> & { transparency?: never }> = (props) => (
  <GlassEffects {...props} transparency="heavy" />
);

export const GlowGlass: React.FC<Omit<GlassEffectsProps, 'shadow'> & { shadow?: never }> = (props) => (
  <GlassEffects {...props} shadow="glow" />
);

export const MoonwaveGlass: React.FC<Omit<GlassEffectsProps, 'shadow'> & { shadow?: never }> = (props) => (
  <GlassEffects {...props} shadow="moonwave" />
);

export const AnimatedGlass: React.FC<Omit<GlassEffectsProps, 'animated'> & { animated?: never }> = (props) => (
  <GlassEffects {...props} animated={true} />
);