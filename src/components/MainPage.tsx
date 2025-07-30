import React from 'react';
import { Home, User } from 'lucide-react';
import { TrackCard } from './TrackCard';
import { WaveBackground } from './WaveBackground';
import { GlassCard } from './GlassCard';
import { WaveButton } from './WaveButton';
import { Track } from '../types';
import { getTracksByPhase } from '../data/tracks';
import { Typography } from './ui/typography';

interface MainPageProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onTrackSelect: (track: Track) => void;
  onTrackPlay: (track: Track) => void;
  onAboutClick: () => void;
  onHomeClick: () => void;
}

export const MainPage: React.FC<MainPageProps> = ({
  currentTrack,
  isPlaying,
  onTrackSelect,
  onTrackPlay,
  onAboutClick,
  onHomeClick,
}) => {
  // 페이즈별 트랙 분류
  const beginningTracks = getTracksByPhase('beginning');
  const growthTracks = getTracksByPhase('growth');
  const challengeTracks = getTracksByPhase('challenge');
  const shineTracks = getTracksByPhase('shine');
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      <WaveBackground />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <WaveButton
            onClick={onHomeClick}
            className="bg-white/10 backdrop-blur-md border border-white/20"
          >
            <Home className="w-5 h-5" />
          </WaveButton>
          
          <WaveButton
            onClick={onAboutClick}
            className="bg-white/10 backdrop-blur-md border border-white/20"
          >
            <User className="w-5 h-5" />
          </WaveButton>
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Current Playing Info - 하단 뮤직플레이어에서만 표시되므로 제거 */}

          {/* Tracks Grid */}
          <div className="space-y-16">
            {/* Beginning Phase */}
            {beginningTracks.length > 0 && (
              <section>
                <GlassCard variant="light" className="mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-400 rounded-full wave-pulse" />
                    <Typography.H3>
                      Beginning Phase - 평범한 시작
                    </Typography.H3>
                  </div>
                  <Typography.BodySmall className="mt-2">
                    두려움을 뒤로 한 채 첫 걸음을 내딛는 용기
                  </Typography.BodySmall>
                </GlassCard>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {beginningTracks.map((track) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      isPlaying={isPlaying}
                      isCurrent={currentTrack?.id === track.id}
                      onPlay={onTrackPlay}
                      onSelect={onTrackSelect}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Growth Phase */}
            {growthTracks.length > 0 && (
              <section>
                <GlassCard variant="light" className="mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-400 rounded-full wave-pulse" />
                    <Typography.H3>
                      Growth Phase - 성장의 여정
                    </Typography.H3>
                  </div>
                  <Typography.BodySmall className="mt-2">
                    매일의 노력이 쌓여가는 과정
                  </Typography.BodySmall>
                </GlassCard>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {growthTracks.map((track) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      isPlaying={isPlaying}
                      isCurrent={currentTrack?.id === track.id}
                      onPlay={onTrackPlay}
                      onSelect={onTrackSelect}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Challenge Phase */}
            {challengeTracks.length > 0 && (
              <section>
                <GlassCard variant="light" className="mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-orange-400 rounded-full wave-pulse" />
                    <Typography.H3>
                      Challenge Phase - 도전의 순간
                    </Typography.H3>
                  </div>
                  <Typography.BodySmall className="mt-2">
                    한계를 뛰어넘는 용기와 도전
                  </Typography.BodySmall>
                </GlassCard>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {challengeTracks.map((track) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      isPlaying={isPlaying}
                      isCurrent={currentTrack?.id === track.id}
                      onPlay={onTrackPlay}
                      onSelect={onTrackSelect}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Shine Phase */}
            {shineTracks.length > 0 && (
              <section>
                <GlassCard variant="light" className="mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-purple-400 rounded-full wave-pulse" />
                    <Typography.H3>
                      Shine Phase - 빛나는 순간
                    </Typography.H3>
                  </div>
                  <Typography.BodySmall className="mt-2">
                    자신만의 빛을 발하는 순간
                  </Typography.BodySmall>
                </GlassCard>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {shineTracks.map((track) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      isPlaying={isPlaying}
                      isCurrent={currentTrack?.id === track.id}
                      onPlay={onTrackPlay}
                      onSelect={onTrackSelect}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};