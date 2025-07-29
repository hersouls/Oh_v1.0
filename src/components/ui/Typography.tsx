import React from 'react';
import { clsx } from 'clsx';

interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'overline';
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  children,
  className,
  as,
  ...props
}) => {
  const variantClasses = {
    h1: 'text-4xl font-bold leading-tight tracking-tight',
    h2: 'text-3xl font-bold leading-tight tracking-tight',
    h3: 'text-2xl font-semibold leading-tight',
    h4: 'text-xl font-semibold leading-tight',
    h5: 'text-lg font-medium leading-tight',
    h6: 'text-base font-medium leading-tight',
    body: 'text-base leading-relaxed',
    caption: 'text-sm leading-relaxed',
    overline: 'text-xs font-medium uppercase tracking-wider'
  };

  const Component = as || (variant.startsWith('h') ? variant : 'p') as React.ElementType;

  return (
    <Component
      className={clsx(
        'font-pretendard antialiased',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};