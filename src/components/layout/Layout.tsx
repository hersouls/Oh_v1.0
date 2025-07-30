import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showPlayer?: boolean;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
  showPlayer = false,
  className
}) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 ${className}`}>
      {showHeader && <Header />}
      
      <main className={`${showHeader ? 'pt-16 sm:pt-20' : ''} ${showPlayer ? 'pb-24 sm:pb-32' : ''} min-h-screen container-mobile sm:container-tablet lg:container-desktop`}>
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  );
};