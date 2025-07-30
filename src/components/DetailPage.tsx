import React, { useState } from 'react';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import { Track } from '../types';
import { WaveBackground } from './WaveBackground';
import { GlassCard } from './GlassCard';
import { WaveButton } from './WaveButton';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { cn } from './ui/utils';

interface DetailPageProps {
  track: Track;
  isPlaying: boolean;
  onBack: () => void;
  onPlayPause: () => void;
}

export const DetailPage: React.FC<DetailPageProps> = ({
  track,
  isPlaying,
  onBack,
  onPlayPause,
}) => {
  const [activeTab, setActiveTab] = useState<'lyrics' | 'interpretation'>('lyrics');

  const themeGradients = {
    beginning: 'from-blue-400/30 to-cyan-400/30',
    growth: 'from-purple-400/30 to-violet-400/30',
    challenge: 'from-orange-400/30 to-red-400/30',
    shine: 'from-yellow-400/30 to-amber-400/30',
  };



  const tabs = [
    { id: 'lyrics', label: '가사', icon: '🎵' },
    { id: 'interpretation', label: '해석', icon: '💭' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Wave Background */}
      <WaveBackground />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 p-4">
        <div className="max-w-4xl mx-auto">
          <GlassCard variant="strong" className="p-4">
            <div className="flex items-center justify-between">
              <WaveButton
                onClick={onBack}
                variant="ghost"
                size="sm"
                ariaLabel="뒤로 가기"
                className="p-2 rounded-full"
              >
                <ArrowLeft className="w-6 h-6" />
              </WaveButton>
              
              <div className="flex-1 text-center">
                <h1 className="text-lg font-semibold text-white break-keep-ko">
                  {track.title}
                </h1>
                <p className="text-white/70 text-sm break-keep-ko">
                  {track.artist}
                </p>
              </div>
              
              <div className="w-10"></div>
            </div>
          </GlassCard>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-32 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <GlassCard 
            variant="strong" 
            withWaveEffect={isPlaying}
            className={cn(
              'text-center bg-gradient-to-br',
              themeGradients[track.theme]
            )}
          >
            {/* Album Art */}
            <div className="relative inline-block mb-6">
              <ImageWithFallback
                src={track.coverUrl}
                alt={`${track.title} 커버`}
                className="w-48 h-48 mx-auto rounded-2xl shadow-2xl"
              />
              
              {/* Play Button Overlay - 하단 뮤직플레이어를 통해서만 재생 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <WaveButton
                  onClick={onPlayPause}
                  variant="primary"
                  size="lg"
                  ariaLabel={isPlaying ? '일시정지 (하단 뮤직플레이어)' : '재생 (하단 뮤직플레이어)'}
                  className="w-20 h-20 rounded-full p-0 shadow-2xl group/play"
                  title={isPlaying ? '하단 뮤직플레이어에서 일시정지' : '하단 뮤직플레이어에서 재생'}
                >
                  {isPlaying ? (
                    <Pause className="w-10 h-10" />
                  ) : (
                    <Play className="w-10 h-10 ml-1" />
                  )}
                </WaveButton>
              </div>
            </div>

            {/* Track Info */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 break-keep-ko">
              {track.title}
            </h2>
            <p className="text-white/90 text-lg mb-4 break-keep-ko">
              {track.artist}
            </p>
            
            {/* 재생 상태 표시 */}
            {isPlaying && (
              <div className="mb-4">
                <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full wave-pulse" />
                  <span className="text-white/90 text-sm">하단 뮤직플레이어에서 재생 중</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-center space-x-4 text-white/70 text-sm">
              <span className="capitalize">{track.theme} Phase</span>
              <span>•</span>
              <span>Track {track.trackNumber}</span>
              <span>•</span>
              <span>{track.duration}</span>
            </div>
          </GlassCard>

          {/* Tabs */}
          <GlassCard variant="light">
            <div className="flex space-x-1 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200',
                    activeTab === tab.id
                      ? 'bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-lg'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <span className="mr-2">{tab.icon}</span>
                  <span className="break-keep-ko">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'lyrics' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4 break-keep-ko">
                    가사
                  </h3>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="space-y-4 text-white/90 leading-relaxed break-keep-ko">
                      {track.lyrics ? (
                        track.lyrics.split('\n').map((line, index) => (
                          <p key={index} className="text-base">
                            {line || '\u00A0'}
                          </p>
                        ))
                      ) : (
                        <p className="text-base text-white/70 break-keep-ko">
                          가사 정보가 준비되지 않았습니다.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'interpretation' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4 break-keep-ko">
                    해석 & 의미
                  </h3>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <p className="text-white/90 leading-relaxed break-keep-ko text-base">
                      {track.lyricsInterpretation || '해석 정보가 준비되지 않았습니다.'}
                    </p>
                  </div>
                  
                  {/* Story Context */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h4 className="font-semibold text-white mb-3 break-keep-ko">
                      성장 스토리 속에서
                    </h4>
                    <p className="text-white/90 leading-relaxed break-keep-ko text-base">
                      {track.theme === 'beginning' && 
                        '평범한 일상에서 시작되는 첫 번째 용기의 순간들. 작은 변화가 큰 성장의 시작이 됩니다.'}
                      {track.theme === 'growth' && 
                        '매일의 노력이 쌓여가며 실력과 자신감이 조금씩 자라나는 시기. 포기하고 싶은 순간을 이겨내는 힘을 기릅니다.'}
                      {track.theme === 'challenge' && 
                        '한계에 부딪히고 극복해나가는 과정. 실패와 좌절 속에서도 다시 일어서는 법을 배웁니다.'}
                      {track.theme === 'shine' && 
                        '노력의 결실을 맺고 자신만의 빛을 발하는 단계. 평범했던 자신이 특별한 존재가 되어가는 기쁨을 경험합니다.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
};