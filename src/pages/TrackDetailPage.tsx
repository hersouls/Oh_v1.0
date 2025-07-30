import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TrackCard } from '@/components/player/TrackCard';
import { LyricsSync } from '@/components/player/LyricsSync';
import { Modal } from '@/components/ui/Modal';
import { Track } from '@/types';

// TrackDetailPage doesn't need props

export const TrackDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [track, setTrack] = useState<Track | null>(null);
  const [activeTab, setActiveTab] = useState<'lyrics' | 'interpretation' | 'sync'>('lyrics');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // 트랙 데이터 로드
    const loadTrack = async () => {
      try {
        const response = await fetch('/sample-tracks.json');
        const data = await response.json();
        const foundTrack = data.tracks.find((t: Track) => t.id === id);
        
        if (foundTrack) {
          setTrack(foundTrack);
        } else {
          // 트랙을 찾을 수 없는 경우
          navigate('/tracks');
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('트랙 로드 실패:', error);
        }
        navigate('/tracks');
      }
    };

    if (id) {
      loadTrack();
    }
  }, [id, navigate]);

  if (!track) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-gray-300 mt-4">트랙을 로드하는 중...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'lyrics', label: '가사' },
    { id: 'interpretation', label: '해석' },
    { id: 'sync', label: '싱크' },
  ] as const;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => navigate('/tracks')}
        className="mb-6 text-gray-300 hover:text-white transition-colors"
      >
        ← 트랙 목록으로
      </button>

      {/* 트랙 정보 */}
      <div className="mb-8">
        <TrackCard track={track} />
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex space-x-1 mb-6 bg-white/10 backdrop-blur-sm rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white/20 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        {activeTab === 'lyrics' && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">가사</h3>
            <div className="space-y-4 text-gray-200 leading-relaxed">
              {track.lyrics?.map((line, index) => (
                <p key={index} className="text-center">
                  {line.text}
                </p>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'interpretation' && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">해석</h3>
            <div className="text-gray-200 leading-relaxed">
              <p>{track.interpretation}</p>
            </div>
          </div>
        )}

        {activeTab === 'sync' && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">가사 싱크</h3>
            <button
              onClick={() => setShowModal(true)}
              className="bg-moonwave-500 hover:bg-moonwave-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              가사 싱크 보기
            </button>
          </div>
        )}
      </div>

      {/* 가사 싱크 모달 */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="가사 싱크"
        className="max-w-2xl"
      >
        <LyricsSync
          lyrics={track.lyrics || []}
          currentTime={0}
          className="h-96"
        />
      </Modal>
    </div>
  );
};