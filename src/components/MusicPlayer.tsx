import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Download, Repeat, Shuffle } from 'lucide-react';
import { Slider } from './ui/slider';
import { GlassCard } from './GlassCard';
import { WaveButton } from './WaveButton';
import { Track } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { cn } from './ui/utils';

interface MusicPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playMode: 'sequential' | 'repeat-one' | 'shuffle';
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onPlayModeToggle: () => void;
  formatTime: (seconds: number) => string;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  playMode,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onPlayModeToggle,
  formatTime,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!currentTrack) return;

    try {
      setIsDownloading(true);
      
      // 파일이 존재하는지 확인
      const response = await fetch(currentTrack.url);
      if (!response.ok) {
        throw new Error('파일을 찾을 수 없습니다.');
      }

      // 다운로드 링크 생성
      const link = document.createElement('a');
      link.href = currentTrack.url;
      link.download = `${currentTrack.title} - ${currentTrack.artist}.mp3`;
      link.target = '_blank';
      
      // 링크 클릭하여 다운로드 시작
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 성공 메시지 (선택사항)
      console.log(`${currentTrack.title} 다운로드가 시작되었습니다.`);
      
    } catch (error) {
      console.error('다운로드 중 오류가 발생했습니다:', error);
      alert('다운로드에 실패했습니다. 파일을 다시 확인해주세요.');
    } finally {
      setIsDownloading(false);
    }
  };
  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const themeGradients = {
    beginning: 'from-blue-400/30 to-cyan-400/30',
    growth: 'from-purple-400/30 to-violet-400/30',
    challenge: 'from-orange-400/30 to-red-400/30',
    shine: 'from-yellow-400/30 to-amber-400/30',
  };

  return (
    <div className="fixed bottom-8 left-0 right-0 z-50 p-4">
      <div className="max-w-7xl mx-auto">
        <GlassCard 
          variant="strong" 
          withWaveEffect={isPlaying}
          className={cn(
            'bg-gradient-to-r',
            themeGradients[currentTrack.theme]
          )}
        >
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white/60 rounded-full transition-all duration-200 transform-gpu will-change-transform"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={(e) => onSeek(Number(e.target.value))}
                className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer touch-manipulation"
              />
            </div>
            <div className="flex justify-between text-white/80 text-sm mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Track Info */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <ImageWithFallback
                  src={currentTrack.coverUrl}
                  alt={`${currentTrack.title} 커버`}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-xl object-cover shadow-lg"
                />
                {isPlaying && (
                  <div className="absolute inset-0 rounded-xl bg-white/20 wave-pulse" />
                )}
              </div>
              
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-white text-xs sm:text-sm md:text-lg truncate break-keep-ko">
                  {currentTrack.title}
                </h4>
                <p className="text-white/80 text-xs break-keep-ko truncate">
                  {currentTrack.artist}
                </p>
                <div className="hidden sm:flex items-center space-x-2 mt-1">
                  <span className="text-xs text-white/60 capitalize">
                    {currentTrack.theme} Phase
                  </span>
                  <span className="text-xs text-white/60">•</span>
                  <span className="text-xs text-white/60">
                    Track {currentTrack.trackNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 mx-2 sm:mx-6">
              <WaveButton
                onClick={() => {
                  console.log('🎵 이전 버튼 클릭됨');
                  console.log('🎵 현재 트랙:', currentTrack?.title);
                  console.log('🎵 현재 재생 상태:', isPlaying);
                  onPrevious();
                }}
                variant="ghost"
                size="sm"
                ariaLabel="이전 트랙"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full p-0"
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </WaveButton>
              
              <WaveButton
                onClick={() => {
                  console.log('🎵 재생/일시정지 버튼 클릭됨');
                  console.log('🎵 현재 트랙:', currentTrack?.title);
                  console.log('🎵 현재 재생 상태:', isPlaying);
                  console.log('🎵 트랙 URL:', currentTrack?.url);
                  console.log('🎵 트랙 ID:', currentTrack?.id);
                  
                  // 사용자 상호작용 확인
                  console.log('🎵 사용자 상호작용 감지됨');
                  
                  onPlayPause();
                }}
                variant="primary"
                size="lg"
                ariaLabel={isPlaying ? '일시정지' : '재생'}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full p-0 shadow-2xl"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                ) : (
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5 text-white" />
                )}
              </WaveButton>
              
              <WaveButton
                onClick={() => {
                  console.log('🎵 다음 버튼 클릭됨');
                  console.log('🎵 현재 트랙:', currentTrack?.title);
                  console.log('🎵 현재 재생 상태:', isPlaying);
                  onNext();
                }}
                variant="ghost"
                size="sm"
                ariaLabel="다음 트랙"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full p-0"
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </WaveButton>
            </div>

            {/* Play Mode Button */}
            <div className="flex items-center">
              <WaveButton
                onClick={() => {
                  console.log('🎵 재생 모드 버튼 클릭됨');
                  console.log('🎵 현재 재생 모드:', playMode);
                  console.log('🎵 현재 트랙:', currentTrack?.title);
                  onPlayModeToggle();
                }}
                variant="ghost"
                size="sm"
                ariaLabel={`재생 모드: ${playMode}`}
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-full p-0 text-white transition-all duration-300",
                  playMode === 'repeat-one' && "bg-blue-500/20 border-blue-500/30",
                  playMode === 'sequential' && "bg-green-500/20 border-green-500/30",
                  playMode === 'shuffle' && "bg-purple-500/20 border-purple-500/30"
                )}
              >
                {playMode === 'shuffle' ? (
                  <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : playMode === 'repeat-one' ? (
                  <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </WaveButton>
              <span className={cn(
                "hidden sm:inline text-xs ml-1 transition-all duration-300",
                playMode === 'repeat-one' && "text-blue-400",
                playMode === 'sequential' && "text-green-400",
                playMode === 'shuffle' && "text-purple-400",
                "text-white/80"
              )}>
                {playMode === 'repeat-one' ? '1' : playMode === 'sequential' ? '→' : ''}
              </span>
            </div>

            {/* Volume and Additional Controls */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 justify-end min-w-0">
              <div className="hidden md:flex items-center space-x-3">
                <Volume2 className="w-5 h-5 text-white" />
                <div className="w-24">
                  <Slider
                    value={[volume * 100]}
                    onValueChange={([value]) => onVolumeChange(value / 100)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
              
              <WaveButton
                onClick={handleDownload}
                variant="ghost"
                size="sm"
                ariaLabel={isDownloading ? "다운로드 중..." : "다운로드"}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full p-0"
                disabled={isDownloading}
              >
                <Download className={`w-4 h-4 sm:w-5 sm:h-5 text-white ${isDownloading ? 'animate-spin' : ''}`} />
              </WaveButton>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};