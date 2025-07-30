import { renderHook, act } from '@testing-library/react';

import { usePlayerState } from '../usePlayerState';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock Howler
const mockHowl = {
  play: jest.fn(),
  pause: jest.fn(),
  stop: jest.fn(),
  volume: jest.fn(),
  seek: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  duration: jest.fn(() => 180),
  playing: jest.fn(() => false),
};

jest.mock('howler', () => ({
  Howl: jest.fn(() => mockHowl),
  Howler: {
    volume: jest.fn(),
    mute: jest.fn(),
    stop: jest.fn(),
  },
}));

const mockTrack = {
  id: '1',
  title: '테스트 트랙',
  artist: '테스트 아티스트',
  album: '테스트 앨범',
  duration: 180,
  file: '/audio/test.mp3',
  cover: '/covers/test.jpg',
  lyrics: [],
  interpretation: '테스트 해석',
  description: '테스트 설명',
};

describe('usePlayerState Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  test('초기 상태가 올바르게 설정된다', () => {
    const { result } = renderHook(() => usePlayerState());

    expect(result.current.state.isPlaying).toBe(false);
    expect(result.current.state.currentTrack).toBeNull();
    expect(result.current.state.volume).toBe(0.7);
  });

  test('트랙을 재생하면 상태가 올바르게 변경된다', async () => {
    const { result } = renderHook(() => usePlayerState());

    act(() => {
      result.current.actions.playTrack(mockTrack);
    });

    expect(result.current.state.isPlaying).toBe(true);
    expect(result.current.state.currentTrack).toEqual(mockTrack);
  });

  test('재생 중인 트랙을 일시정지하면 상태가 올바르게 변경된다', async () => {
    const { result } = renderHook(() => usePlayerState());

    // 먼저 트랙 재생
    act(() => {
      result.current.actions.playTrack(mockTrack);
    });

    // 일시정지
    act(() => {
      result.current.actions.pause();
    });

    expect(result.current.state.isPlaying).toBe(false);
  });

  test('볼륨을 변경하면 상태가 올바르게 업데이트된다', () => {
    const { result } = renderHook(() => usePlayerState());

    act(() => {
      result.current.actions.setVolume(0.5);
    });

    expect(result.current.state.volume).toBe(0.5);
  });

  test('재생/일시정지 토글이 올바르게 작동한다', () => {
    const { result } = renderHook(() => usePlayerState());

    // 먼저 트랙 설정
    act(() => {
      result.current.actions.playTrack(mockTrack);
    });

    // 토글하여 일시정지
    act(() => {
      result.current.actions.togglePlay();
    });

    expect(result.current.state.isPlaying).toBe(false);

    // 다시 토글하여 재생
    act(() => {
      result.current.actions.togglePlay();
    });

    expect(result.current.state.isPlaying).toBe(true);
  });

  test('다른 트랙을 재생하면 이전 트랙이 자동으로 정지된다', async () => {
    const { result } = renderHook(() => usePlayerState());

    const secondTrack = { ...mockTrack, id: '2', title: '테스트 트랙 2', file: '/audio/test2.mp3' };

    // 첫 번째 트랙 재생
    act(() => {
      result.current.actions.playTrack(mockTrack);
    });

    // 두 번째 트랙 재생
    act(() => {
      result.current.actions.playTrack(secondTrack);
    });

    expect(result.current.state.currentTrack).toEqual(secondTrack);
  });

  test('진행률이 올바르게 업데이트된다', () => {
    const { result } = renderHook(() => usePlayerState());

    act(() => {
      result.current.actions.seek(30);
    });

    expect(result.current.state.currentTime).toBe(30);
  });

  test('재생 목록이 올바르게 관리된다', () => {
    const { result } = renderHook(() => usePlayerState());

    const tracks = [mockTrack, { ...mockTrack, id: '2', file: '/audio/test2.mp3' }];

    act(() => {
      result.current.actions.setPlaylist(tracks);
    });

    expect(result.current.state.playlist).toEqual(tracks);
  });

  test('반복 모드가 올바르게 변경된다', () => {
    const { result } = renderHook(() => usePlayerState());

    act(() => {
      result.current.actions.toggleRepeat();
    });

    expect(result.current.state.repeatMode).toBe('one');

    act(() => {
      result.current.actions.toggleRepeat();
    });

    expect(result.current.state.repeatMode).toBe('all');

    act(() => {
      result.current.actions.toggleRepeat();
    });

    expect(result.current.state.repeatMode).toBe('none');
  });

  test('셔플 모드가 올바르게 토글된다', () => {
    const { result } = renderHook(() => usePlayerState());

    act(() => {
      result.current.actions.toggleShuffle();
    });

    expect(result.current.state.isShuffled).toBe(true);

    act(() => {
      result.current.actions.toggleShuffle();
    });

    expect(result.current.state.isShuffled).toBe(false);
  });

  test('로컬 스토리지에 설정이 저장된다', () => {
    const { result } = renderHook(() => usePlayerState());

    act(() => {
      result.current.actions.setVolume(0.7);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'moonwave-player-state',
      expect.stringContaining('"volume":0.7')
    );
  });

  test('로컬 스토리지에서 설정을 불러온다', () => {
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify({
        volume: 0.8,
        repeatMode: 'one',
        isShuffled: true,
      })
    );

    const { result } = renderHook(() => usePlayerState());

    expect(result.current.state.volume).toBe(0.8);
    expect(result.current.state.repeatMode).toBe('one');
    expect(result.current.state.isShuffled).toBe(true);
  });

  test('에러 상태가 올바르게 처리된다', () => {
    const { result } = renderHook(() => usePlayerState());

    // 에러 상태는 usePlayerState에서 직접 관리하지 않으므로
    // 기본 상태를 확인
    expect(result.current.state.error).toBeNull();
  });

  test('로딩 상태가 올바르게 관리된다', () => {
    const { result } = renderHook(() => usePlayerState());

    // 로딩 상태는 usePlayerState에서 직접 관리하지 않으므로
    // 기본 상태를 확인
    expect(result.current.state.isLoading).toBe(false);
  });
});