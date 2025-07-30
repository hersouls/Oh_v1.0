import { useState, useEffect } from 'react';
import { Track } from '@/types';

interface PlaylistData {
  tracks: Track[];
  playlist: {
    name: string;
    description: string;
    totalDuration: number;
    totalTracks: number;
  };
}

export const useTrackData = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlist, setPlaylist] = useState<PlaylistData['playlist'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 트랙 데이터 로드
  const loadTracks = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/sample-tracks.json');
      if (!response.ok) {
        throw new Error('트랙 데이터를 불러올 수 없습니다.');
      }

      const data: PlaylistData = await response.json();
      setTracks(data.tracks);
      setPlaylist(data.playlist);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to load tracks:', err);
      }
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    loadTracks();
  }, []);

  // 트랙 ID로 트랙 찾기
  const getTrackById = (id: string): Track | undefined => {
    return tracks.find(track => track.id === id);
  };

  // 트랙 인덱스로 트랙 찾기
  const getTrackByIndex = (index: number): Track | undefined => {
    return tracks[index];
  };

  // 트랙 검색
  const searchTracks = (query: string): Track[] => {
    if (!query.trim()) return tracks;
    
    const lowerQuery = query.toLowerCase();
    return tracks.filter(track => 
      track.title.toLowerCase().includes(lowerQuery) ||
      track.artist.toLowerCase().includes(lowerQuery) ||
      (track.lyrics && track.lyrics.some(line => line.text.toLowerCase().includes(lowerQuery)))
    );
  };

  // 트랙 필터링 (예: 특정 아티스트)
  const filterTracksByArtist = (artist: string): Track[] => {
    return tracks.filter(track => track.artist === artist);
  };

  // 트랙 정렬
  const sortTracks = (sortBy: 'title' | 'artist' | 'duration' | 'id', order: 'asc' | 'desc' = 'asc'): Track[] => {
    return [...tracks].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'artist':
          aValue = a.artist;
          bValue = b.artist;
          break;
        case 'duration':
          aValue = a.duration || 0;
          bValue = b.duration || 0;
          break;
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        default:
          return 0;
      }

      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  };

  // 플레이리스트 통계
  const getPlaylistStats = () => {
    if (tracks.length === 0) return null;

    const totalDuration = tracks.reduce((sum, track) => sum + (track.duration || 0), 0);
    const artists = [...new Set(tracks.map(track => track.artist))];
    const averageDuration = totalDuration / tracks.length;

    return {
      totalTracks: tracks.length,
      totalDuration,
      averageDuration,
      artists,
      artistCount: artists.length,
    };
  };

  // 트랙 재로드
  const reloadTracks = () => {
    loadTracks();
  };

  return {
    tracks,
    playlist,
    isLoading,
    error,
    getTrackById,
    getTrackByIndex,
    searchTracks,
    filterTracksByArtist,
    sortTracks,
    getPlaylistStats,
    reloadTracks,
  };
};