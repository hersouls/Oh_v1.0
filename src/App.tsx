import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PlayerProvider } from '@/hooks/usePlayerState';
import { Layout } from '@/components/layout/Layout';
import { IntroPage } from '@/components/intro/IntroPage';
import { AboutPage } from '@/components/intro/AboutPage';
import { TracksPage } from '@/pages/TracksPage';
import './App.css';

function App() {
  const handleStart = () => {
    // 인트로에서 시작 버튼 클릭 시 처리
    console.log('음악 여정 시작!');
  };

  return (
    <PlayerProvider>
      <Router>
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
                  <AboutPage onListenMusic={() => console.log('음악 듣기')} />
                </Layout>
              } 
            />
            
            {/* 트랙 리스트 페이지 */}
            <Route 
              path="/tracks" 
              element={
                <Layout>
                  <TracksPage />
                </Layout>
              } 
            />
            
            {/* 404 페이지 */}
            <Route 
              path="*" 
              element={
                <Layout>
                  <div className="container mx-auto px-4 py-8 text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">404</h1>
                    <p className="text-gray-300 mb-8">페이지를 찾을 수 없습니다.</p>
                    <a 
                      href="/" 
                      className="text-moonwave-300 hover:text-moonwave-200 transition-colors"
                    >
                      홈으로 돌아가기
                    </a>
                  </div>
                </Layout>
              } 
            />
          </Routes>
        </div>
      </Router>
    </PlayerProvider>
  );
}

export default App;