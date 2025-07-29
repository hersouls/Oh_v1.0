import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { PlayerControls } from '@/components/player/PlayerControls';
import { Track } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showPlayer?: boolean;
  playerState?: {
    isPlaying: boolean;
    isMuted: boolean;
    volume: number;
    repeatMode: 'none' | 'one' | 'all';
    isShuffled: boolean;
    currentTrack?: Track;
  };
  playerHandlers?: {
    onPlay: () => void;
    onPause: () => void;
    onPrevious: () => void;
    onNext: () => void;
    onToggleMute: () => void;
    onVolumeChange: (volume: number) => void;
    onToggleRepeat: () => void;
    onToggleShuffle: () => void;
    onDownload?: (track: Track) => void;
  };
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
  showPlayer = false,
  playerState,
  playerHandlers,
  className
}) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-moonwave-900 via-moonwave-800 to-moonwave-900 ${className}`}>
      {showHeader && <Header />}
      
      <main className={`${showHeader ? 'pt-20' : ''} ${showPlayer ? 'pb-32' : ''} min-h-screen`}>
        {children}
      </main>

      {/* 고정 플레이어 */}
      {showPlayer && playerState && playerHandlers && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4">
          <PlayerControls
            isPlaying={playerState.isPlaying}
            isMuted={playerState.isMuted}
            volume={playerState.volume}
            repeatMode={playerState.repeatMode}
            isShuffled={playerState.isShuffled}
            currentTrack={playerState.currentTrack}
            onPlay={playerHandlers.onPlay}
            onPause={playerHandlers.onPause}
            onPrevious={playerHandlers.onPrevious}
            onNext={playerHandlers.onNext}
            onToggleMute={playerHandlers.onToggleMute}
            onVolumeChange={playerHandlers.onVolumeChange}
            onToggleRepeat={playerHandlers.onToggleRepeat}
            onToggleShuffle={playerHandlers.onToggleShuffle}
            onDownload={playerHandlers.onDownload || undefined}
          />
        </div>
      )}

      {showFooter && <Footer />}
    </div>
  );
};