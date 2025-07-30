import { useState, useEffect, Suspense, startTransition } from 'react';
import { MainPage } from './components/MainPage';
import { DetailPage } from './components/DetailPage';
import { AboutPage } from './components/AboutPage';
import { MusicPlayer } from './components/MusicPlayer';
import { Footer } from './components/Footer';
import { useMusicPlayer } from './hooks/useMusicPlayer';
import { Track, Page } from './types';
import { tracks } from './data/tracks';

// React 19의 새로운 기능들을 활용한 컴포넌트
export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('main');
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);


  const musicPlayer = useMusicPlayer();

  // 앱 시작 시 1번 트랙 자동 재생 (사용자 상호작용 후)
  useEffect(() => {
    if (currentPage === 'main' && !musicPlayer.currentTrack) {
      let hasInteracted = false;
      
      // 사용자 상호작용 후에만 자동 재생
      const handleUserInteraction = () => {
        if (hasInteracted) return;
        hasInteracted = true;
        
        console.log('🎵 사용자 상호작용 감지, 첫 번째 트랙 재생 시작');
        const firstTrack = tracks[0];
        if (firstTrack) {
          musicPlayer.playTrack(firstTrack);
        }
        
        // 이벤트 리스너 제거
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
        document.removeEventListener('mousedown', handleUserInteraction);
      };

      // 사용자 상호작용 이벤트 리스너 추가
      document.addEventListener('click', handleUserInteraction);
      document.addEventListener('keydown', handleUserInteraction);
      document.addEventListener('touchstart', handleUserInteraction);
      document.addEventListener('mousedown', handleUserInteraction);

      // 클린업 함수
      return () => {
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
        document.removeEventListener('mousedown', handleUserInteraction);
      };
    }
  }, [currentPage, musicPlayer.currentTrack, musicPlayer]);



  const handleTrackSelect = (track: Track) => {
    startTransition(() => {
      setSelectedTrack(track);
      setCurrentPage('detail');
    });
  };

  const handleTrackPlay = (track: Track) => {
    console.log('🎵 TrackCard에서 재생 버튼 클릭:', track.title);
    console.log('🎵 하단 뮤직플레이어를 통해서만 재생됩니다');
    
    // 현재 재생 중인 트랙이면 일시정지/재생 토글
    if (musicPlayer.currentTrack?.id === track.id) {
      console.log('🎵 현재 트랙 토글');
      musicPlayer.togglePlay();
    } else {
      // 다른 트랙이면 해당 트랙을 선택하고 재생
      console.log('🎵 다른 트랙 재생:', track.title);
      musicPlayer.playTrack(track);
    }
  };

  const handleBack = () => {
    startTransition(() => {
      setCurrentPage('main');
      setSelectedTrack(null);
    });
  };

  const handleAboutClick = () => {
    startTransition(() => {
      setCurrentPage('about');
    });
  };

  const handleHomeClick = () => {
    startTransition(() => {
      setCurrentPage('main');
      setSelectedTrack(null);
    });
  };

  // 페이지별 렌더링
  const renderPage = () => {

    switch (currentPage) {
      case 'main':
        return (
          <MainPage
            currentTrack={musicPlayer.currentTrack}
            isPlaying={musicPlayer.isPlaying}
            onTrackSelect={handleTrackSelect}
            onTrackPlay={handleTrackPlay}
            onAboutClick={handleAboutClick}
            onHomeClick={handleHomeClick}
          />
        );
      case 'detail':
        return selectedTrack ? (
          <DetailPage
            track={selectedTrack}
            isPlaying={musicPlayer.isPlaying && musicPlayer.currentTrack?.id === selectedTrack.id}
            onBack={handleBack}
            onPlayPause={() => {
              console.log('🎵 DetailPage 재생 버튼 클릭:', selectedTrack.title);
              console.log('🎵 하단 뮤직플레이어를 통해서만 재생됩니다');
              
              // 하단 뮤직플레이어를 통해서만 재생
              if (musicPlayer.currentTrack?.id !== selectedTrack.id) {
                console.log('🎵 다른 트랙이므로 하단 뮤직플레이어에서 재생');
                musicPlayer.playTrack(selectedTrack);
              } else {
                console.log('🎵 현재 트랙이므로 하단 뮤직플레이어에서 토글');
                musicPlayer.togglePlay();
              }
            }}
          />
        ) : null;
      case 'about':
        return <AboutPage onBack={handleBack} />;
      default:
        return (
          <MainPage
            currentTrack={musicPlayer.currentTrack}
            isPlaying={musicPlayer.isPlaying}
            onTrackSelect={handleTrackSelect}
            onTrackPlay={handleTrackPlay}
            onAboutClick={handleAboutClick}
            onHomeClick={handleHomeClick}
          />
        );
    }
  };

  return (
    <div className="min-h-screen moonwave-background moonwave-starry relative flex flex-col">
      <div className="flex-1">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
              <p className="mt-4 text-white text-lg">페이지 로딩 중...</p>
            </div>
          </div>
        }>
          {renderPage()}
        </Suspense>

        {/* Music Player - Always visible when a track is loaded */}
        {musicPlayer.currentTrack && (
          <MusicPlayer
            currentTrack={musicPlayer.currentTrack}
            isPlaying={musicPlayer.isPlaying}
            currentTime={musicPlayer.currentTime}
            duration={musicPlayer.duration}
            volume={musicPlayer.volume}
            playMode={musicPlayer.playMode}
            onPlayPause={musicPlayer.togglePlay}
            onNext={musicPlayer.nextTrack}
            onPrevious={musicPlayer.previousTrack}
            onSeek={musicPlayer.setCurrentTime}
            onVolumeChange={musicPlayer.setVolume}
            onPlayModeToggle={musicPlayer.togglePlayMode}
            formatTime={musicPlayer.formatTime}
          />
        )}
      </div>

      {/* Footer - Always visible */}
      <Footer />
    </div>
  );
}
