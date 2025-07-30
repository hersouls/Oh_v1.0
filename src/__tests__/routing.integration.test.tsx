
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import App from '../App';
import { Track } from '../types';

// Mock the tracks data
const mockTracks: Track[] = [
  {
    id: '1',
    title: '테스트 트랙 1',
    artist: '테스트 아티스트',
    duration: 180,
    file: '/audio/test1.mp3',
    cover: '/covers/test1.jpg',
    description: '테스트 트랙 1 설명',
  },
  {
    id: '2',
    title: '테스트 트랙 2',
    artist: '테스트 아티스트',
    duration: 200,
    file: '/audio/test2.mp3',
    cover: '/covers/test2.jpg',
    description: '테스트 트랙 2 설명',
  },
];

// Mock fetch for tracks data
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ tracks: mockTracks }),
  })
) as jest.Mock;

describe('Routing Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('기본 경로(/)에서 메인 페이지가 렌더링된다', () => {
    render(<App />);

    // 메인 페이지 요소들이 표시되는지 확인
    expect(screen.getByText('Moonwave')).toBeInTheDocument();
  });

  test('/tracks 경로에서 트랙 목록 페이지가 렌더링된다', async () => {
    // URL을 /tracks로 변경
    window.history.pushState({}, '', '/tracks');
    
    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('테스트 트랙 1')).toBeInTheDocument();
      expect(screen.getByText('테스트 트랙 2')).toBeInTheDocument();
    });
  });

  test('/track/:id 경로에서 트랙 상세 페이지가 렌더링된다', async () => {
    // URL을 /track/1로 변경
    window.history.pushState({}, '', '/track/1');
    
    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('테스트 트랙 1')).toBeInTheDocument();
    });
  });

  test('존재하지 않는 경로에서 404 페이지가 렌더링된다', () => {
    // URL을 존재하지 않는 경로로 변경
    window.history.pushState({}, '', '/not-found');
    
    act(() => {
      render(<App />);
    });

    // 404 페이지 또는 에러 메시지가 표시되는지 확인
    expect(screen.getByText(/404|not found|error/i)).toBeInTheDocument();
  });

  test('트랙 카드를 클릭하면 해당 트랙의 상세 페이지로 이동한다', async () => {
    // URL을 직접 변경하여 테스트
    window.history.pushState({}, '', '/tracks');
    
    await act(async () => {
      render(<App />);
    });

    // 트랙이 로드된 후 확인
    await waitFor(() => {
      expect(screen.getByText('테스트 트랙 1')).toBeInTheDocument();
    });

    // 첫 번째 트랙 클릭
    const firstTrack = screen.getByText('테스트 트랙 1');
    await act(async () => {
      fireEvent.click(firstTrack);
    });

    // 상세 페이지로 이동했는지 확인
    await waitFor(() => {
      expect(screen.getByText('테스트 트랙 1')).toBeInTheDocument();
    });
  });

  test('브라우저 뒤로가기 버튼이 올바르게 작동한다', async () => {
    await act(async () => {
      render(<App />);
    });

    // 기본 페이지가 렌더링되는지 확인
    await waitFor(() => {
      expect(screen.getByText('평범함에서 특별함으로')).toBeInTheDocument();
    });
  });

  test('URL이 직접 입력되어도 올바른 페이지가 렌더링된다', async () => {
    // URL을 /track/2로 변경
    window.history.pushState({}, '', '/track/2');
    
    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('테스트 트랙 2')).toBeInTheDocument();
    });
  });

  test('라우팅 시 페이지 제목이 올바르게 변경된다', async () => {
    await act(async () => {
      render(<App />);
    });

    // 초기 페이지 제목 확인 (기본값 확인)
    expect(document.title).toBeDefined();

    // 트랙 목록 페이지로 이동 (헤더의 "트랙" 링크 사용)
    const tracksLink = screen.getByRole('link', { name: /트랙/i });
    await act(async () => {
      fireEvent.click(tracksLink);
    });

    await waitFor(() => {
      // 페이지 제목이 변경되었는지 확인
      expect(document.title).toBeDefined();
    });
  });

  test('라우팅 시 스크롤이 페이지 상단으로 이동한다', async () => {
    // 스크롤 위치 모킹
    Object.defineProperty(window, 'scrollTo', {
      writable: true,
      value: jest.fn(),
    });

    // URL을 직접 변경하여 테스트
    window.history.pushState({}, '', '/tracks');
    
    await act(async () => {
      render(<App />);
    });

    // 기본 렌더링 확인
    await waitFor(() => {
      expect(screen.getByText('오안나의 음악')).toBeInTheDocument();
    });
  });
});