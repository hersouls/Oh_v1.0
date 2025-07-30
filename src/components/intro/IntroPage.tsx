import React from 'react';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';

interface IntroPageProps {
  onStart: () => void;
  className?: string;
}

export const IntroPage: React.FC<IntroPageProps> = ({ onStart, className }) => {
  console.log('IntroPage 렌더링 중...');
  
  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden ${className}`}>
      {/* 배경 그라디언트 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900" />
      
      {/* 애니메이션 배경 요소들 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <img
            src="/moonwave_log.png"
            alt="Moonwave"
            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 rounded-full shadow-glow"
          />
          
          <Typography variant="h1" className="text-white mb-3 sm:mb-4 font-bold text-responsive-xl">
            Moonwave
          </Typography>
          
          <Typography variant="h3" className="text-blue-200 mb-6 sm:mb-8 text-responsive-lg">
            오안나의 음악 여정
          </Typography>
        </div>

        <div className="mb-8 sm:mb-12 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <Typography variant="body" className="text-white/80 max-w-lg sm:max-w-2xl mx-auto leading-relaxed text-responsive">
            "평범함에서 특별함으로" - 재능보다 노력으로, 한계를 넘어 자신만의 빛을 찾아가는 여정을 13개의 트랙으로 표현한 음악 플레이어
          </Typography>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '1s' }}>
          <Button
            onClick={onStart}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-glow btn-touch"
          >
            음악으로 만나기
          </Button>
        </div>

        {/* 스크롤 힌트 */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
          <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-2 sm:h-3 bg-white/60 rounded-full mt-1 sm:mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};