import React from 'react';
import { Typography } from '@/components/ui/Typography';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-glass-primary border-t border-glass-border backdrop-blur-sm ${className}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 브랜드 정보 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/moonwave_log.png"
                alt="Moonwave"
                className="w-8 h-8 rounded-full"
              />
              <Typography variant="h6" className="text-white font-bold">
                Moonwave
              </Typography>
            </div>
            <Typography variant="body" className="text-gray-300 leading-relaxed">
              "평범함에서 특별함으로" - 재능보다 노력으로, 한계를 넘어 자신만의 빛을 찾아가는 여정
            </Typography>
          </div>

          {/* 빠른 링크 */}
          <div className="space-y-4">
            <Typography variant="h6" className="text-white font-semibold">
              빠른 링크
            </Typography>
            <nav className="space-y-2">
              <a
                href="/"
                className="block text-gray-300 hover:text-moonwave-300 transition-colors"
              >
                홈
              </a>
              <a
                href="/tracks"
                className="block text-gray-300 hover:text-moonwave-300 transition-colors"
              >
                트랙
              </a>
              <a
                href="/about"
                className="block text-gray-300 hover:text-moonwave-300 transition-colors"
              >
                오안나
              </a>
            </nav>
          </div>

          {/* 연락처 */}
          <div className="space-y-4">
            <Typography variant="h6" className="text-white font-semibold">
              연락처
            </Typography>
            <div className="space-y-2 text-gray-300">
              <p>이메일: contact@moonwave.kr</p>
              <p>웹사이트: moonwave.kr</p>
            </div>
          </div>
        </div>

        {/* 저작권 */}
        <div className="border-t border-glass-border mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Typography variant="caption" className="text-gray-400">
              © {currentYear} Moonwave. All rights reserved.
            </Typography>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-moonwave-300 transition-colors"
              >
                개인정보처리방침
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-moonwave-300 transition-colors"
              >
                이용약관
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};