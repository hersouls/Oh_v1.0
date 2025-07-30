import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';

interface AboutPageProps {
  onListenMusic?: () => void;
  className?: string;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onListenMusic, className }) => {
  const navigate = useNavigate();
  
  const handleListenMusic = () => {
    if (onListenMusic) {
      onListenMusic();
    } else {
      navigate('/tracks');
    }
  };
  
  const timeline = [
    {
      year: 2014,
      title: '리듬체조 시작',
      description: '평범한 아이에서 특별한 여정이 시작되었습니다.'
    },
    {
      year: 2022,
      title: '주니어 국가대표 선발',
      description: '노력의 결과로 국가대표팀에 합류하게 되었습니다.'
    },
    {
      year: 2024,
      title: '시니어 국가대표팀 활동',
      description: '더 큰 무대에서 자신만의 빛을 찾아가고 있습니다.'
    }
  ];

  return (
    <div className={`min-h-screen py-20 ${className}`}>
      <div className="container mx-auto px-4">
        {/* 프로필 섹션 */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Typography variant="h1" className="text-white mb-4">
              오안나
            </Typography>
            <Typography variant="h3" className="text-moonwave-200 mb-8">
              평범함에서 특별함으로
            </Typography>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Typography variant="body" className="text-white/80 leading-relaxed">
                오안나는 평범한 아이에서 시작하여 재능보다 노력으로, 한계를 넘어 자신만의 빛을 찾아가는 여정을 보여주는 인물입니다.
              </Typography>
              
              <Typography variant="body" className="text-white/80 leading-relaxed">
                리듬체조라는 스포츠를 통해 자신의 한계에 도전하고, 끊임없는 연습과 노력으로 국가대표팀까지 올라가는 과정에서 보여준 의지와 열정은 많은 이들에게 영감을 주고 있습니다.
              </Typography>

              <Button
                onClick={handleListenMusic}
                size="lg"
                className="bg-gradient-to-r from-moonwave-500 to-moonwave-600 hover:from-moonwave-600 hover:to-moonwave-700"
              >
                음악 듣기
              </Button>
            </div>

            <div className="relative">
              <div className="w-full h-96 bg-glass-primary rounded-2xl backdrop-blur-sm border border-glass-border flex items-center justify-center">
                <Typography variant="h4" className="text-white/60">
                  프로필 이미지
                </Typography>
              </div>
            </div>
          </div>
        </section>

        {/* 타임라인 섹션 */}
        <section className="mb-20">
          <Typography variant="h2" className="text-white text-center mb-12">
            여정의 타임라인
          </Typography>

          <div className="relative">
            {/* 타임라인 라인 */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-moonwave-500/30" />
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  {/* 타임라인 포인트 */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-moonwave-500 rounded-full border-4 border-moonwave-900" />
                  
                  {/* 콘텐츠 */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                    <div className="bg-glass-primary rounded-xl p-6 backdrop-blur-sm border border-glass-border">
                      <Typography variant="h4" className="text-moonwave-400 mb-2">
                        {item.year}
                      </Typography>
                      <Typography variant="h5" className="text-white mb-2">
                        {item.title}
                      </Typography>
                      <Typography variant="body" className="text-white/80">
                        {item.description}
                      </Typography>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 스토리 섹션 */}
        <section>
          <Typography variant="h2" className="text-white text-center mb-12">
            스토리
          </Typography>

          <div className="max-w-4xl mx-auto">
            <div className="bg-glass-primary rounded-2xl p-8 backdrop-blur-sm border border-glass-border">
              <Typography variant="body" className="text-white/80 leading-relaxed mb-6">
                오안나의 스토리는 단순한 성공 이야기가 아닙니다. 그것은 평범함에서 시작하여 자신만의 특별함을 찾아가는 과정입니다. 
                재능보다 노력이 중요하다는 것을 몸소 보여주며, 한계를 넘어서는 의지의 힘을 보여줍니다.
              </Typography>
              
              <Typography variant="body" className="text-white/80 leading-relaxed mb-6">
                리듬체조라는 스포츠를 통해 자신의 한계에 도전하고, 끊임없는 연습과 노력으로 국가대표팀까지 올라가는 과정에서 
                보여준 의지와 열정은 많은 이들에게 영감을 주고 있습니다.
              </Typography>
              
              <Typography variant="body" className="text-white/80 leading-relaxed">
                이 음악 플레이어는 오안나의 여정을 13개의 트랙으로 표현하여, 그녀의 이야기를 음악을 통해 전하고자 합니다.
              </Typography>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};