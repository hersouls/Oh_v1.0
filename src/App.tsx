import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { IntroPage } from '@/components/intro/IntroPage';
import { AboutPage } from '@/components/intro/AboutPage';
import { TracksPage } from '@/pages/TracksPage';
import { TrackDetailPage } from '@/pages/TrackDetailPage';
import { LyricsTestPage } from '@/pages/LyricsTestPage';
import NotFoundPage from '@/pages/NotFoundPage';
import './App.css';

function AppContent() {
  const navigate = useNavigate();
  
  const handleStart = () => {
    // 인트로에서 시작 버튼 클릭 시 처리
    // /tracks 페이지로 이동
    navigate('/tracks');
  };

  return (
    <div className="App">
      <Routes>
        {/* 인트로 페이지 */}
        <Route 
          path="/" 
          element={
            <Layout showHeader={false} showFooter={false}>
              <IntroPage onStart={handleStart} />
            </Layout>
          } 
        />
        
        {/* 오안나 소개 페이지 */}
        <Route 
          path="/about" 
          element={
            <Layout>
              <AboutPage />
            </Layout>
          } 
        />
        
        {/* 트랙 리스트 페이지 */}
        <Route 
          path="/tracks" 
          element={
            <Layout showPlayer={true}>
              <TracksPage />
            </Layout>
          } 
        />
        
        {/* 트랙 상세 페이지 */}
        <Route 
          path="/track/:id" 
          element={
            <Layout showPlayer={true}>
              <TrackDetailPage />
            </Layout>
          } 
        />
        
        {/* 가사 싱크 테스트 페이지 */}
        <Route 
          path="/lyrics-test" 
          element={<LyricsTestPage />} 
        />
        
        {/* 404 페이지 */}
        <Route 
          path="*" 
          element={<NotFoundPage />} 
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;