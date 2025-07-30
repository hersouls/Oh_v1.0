import { render, screen } from '@testing-library/react';
import { LyricsSync } from '../LyricsSync';
import { SyncLine } from '@/types';

const mockLyrics = [
  { time: 0, text: '첫 번째 가사' },
  { time: 10, text: '두 번째 가사' },
  { time: 20, text: '세 번째 가사' },
  { time: 30, text: '네 번째 가사' },
  { time: 40, text: '다섯 번째 가사' },
];

const defaultProps = {
  lyrics: mockLyrics,
  currentTime: 0,
  className: 'test-class',
};

describe('LyricsSync', () => {
  beforeEach(() => {
    // Mock scrollTo method
    Element.prototype.scrollTo = jest.fn();
  });

  it('renders without crashing', () => {
    render(<LyricsSync {...defaultProps} />);
    expect(screen.getByText('첫 번째 가사')).toBeInTheDocument();
  });

  it('displays all lyrics', () => {
    render(<LyricsSync {...defaultProps} />);
    expect(screen.getByText('첫 번째 가사')).toBeInTheDocument();
    expect(screen.getByText('두 번째 가사')).toBeInTheDocument();
    expect(screen.getByText('세 번째 가사')).toBeInTheDocument();
    expect(screen.getByText('네 번째 가사')).toBeInTheDocument();
    expect(screen.getByText('다섯 번째 가사')).toBeInTheDocument();
  });

  it('highlights the correct line based on current time', () => {
    const { rerender } = render(<LyricsSync {...defaultProps} />);
    
    // At 0 seconds, first line should be active
    const firstLine = screen.getByText('첫 번째 가사').closest('div');
    expect(firstLine).toHaveClass('bg-white/20');
    
    // At 15 seconds, second line should be active
    rerender(<LyricsSync {...defaultProps} currentTime={15} />);
    const secondLine = screen.getByText('두 번째 가사').closest('div');
    expect(secondLine).toHaveClass('bg-white/20');
    
    // At 35 seconds, fourth line should be active
    rerender(<LyricsSync {...defaultProps} currentTime={35} />);
    const fourthLine = screen.getByText('네 번째 가사').closest('div');
    expect(fourthLine).toHaveClass('bg-white/20');
  });

  it('applies custom className', () => {
    render(<LyricsSync {...defaultProps} />);
    const container = screen.getByText('첫 번째 가사').closest('div')?.parentElement;
    expect(container).toHaveClass('test-class');
  });

  it('shows message when no lyrics are provided', () => {
    render(<LyricsSync lyrics={[]} currentTime={0} />);
    expect(screen.getByText('가사가 없습니다.')).toBeInTheDocument();
  });

  it('shows message when lyrics is null', () => {
    render(<LyricsSync lyrics={null as unknown as SyncLine[]} currentTime={0} />);
    expect(screen.getByText('가사가 없습니다.')).toBeInTheDocument();
  });

  it('handles empty lyrics array', () => {
    render(<LyricsSync lyrics={[]} currentTime={0} />);
    expect(screen.getByText('가사가 없습니다.')).toBeInTheDocument();
  });

  it('handles time beyond last lyric', () => {
    render(<LyricsSync {...defaultProps} currentTime={100} />);
    // Should highlight the last line
    const lastLine = screen.getByText('다섯 번째 가사').closest('div');
    expect(lastLine).toHaveClass('bg-white/20');
  });

  it('handles time before first lyric', () => {
    render(<LyricsSync {...defaultProps} currentTime={-5} />);
    // Should highlight the first line
    const firstLine = screen.getByText('첫 번째 가사').closest('div');
    expect(firstLine).toHaveClass('bg-white/20');
  });

  it('handles exact time matches', () => {
    const { rerender } = render(<LyricsSync {...defaultProps} />);
    
    // At exactly 10 seconds, second line should be active
    rerender(<LyricsSync {...defaultProps} currentTime={10} />);
    const secondLine = screen.getByText('두 번째 가사').closest('div');
    expect(secondLine).toHaveClass('bg-white/20');
    
    // At exactly 30 seconds, fourth line should be active
    rerender(<LyricsSync {...defaultProps} currentTime={30} />);
    const fourthLine = screen.getByText('네 번째 가사').closest('div');
    expect(fourthLine).toHaveClass('bg-white/20');
  });

  it('renders with different time values', () => {
    const { rerender } = render(<LyricsSync {...defaultProps} />);
    expect(screen.getByText('첫 번째 가사')).toBeInTheDocument();
    
    rerender(<LyricsSync {...defaultProps} currentTime={25} />);
    expect(screen.getByText('세 번째 가사')).toBeInTheDocument();
    
    rerender(<LyricsSync {...defaultProps} currentTime={45} />);
    expect(screen.getByText('다섯 번째 가사')).toBeInTheDocument();
  });

  it('has proper container structure', () => {
    render(<LyricsSync {...defaultProps} />);
    const container = screen.getByText('첫 번째 가사').closest('div')?.parentElement;
    expect(container).toHaveClass('h-64', 'overflow-y-auto', 'scrollbar-hide');
  });

  it('applies correct styling to active and inactive lines', () => {
    render(<LyricsSync {...defaultProps} currentTime={15} />);
    
    // Active line (second line)
    const activeLine = screen.getByText('두 번째 가사').closest('div');
    expect(activeLine).toHaveClass('bg-white/20', 'text-white', 'font-medium', 'scale-105');
    
    // Inactive line (first line)
    const inactiveLine = screen.getByText('첫 번째 가사').closest('div');
    expect(inactiveLine).toHaveClass('text-gray-300', 'hover:text-white/80');
  });

  it('handles lyrics with missing time property', () => {
    const lyricsWithMissingTime = [
      { time: 0, text: '첫 번째 가사' },
      { text: '시간 없는 가사' } as unknown as SyncLine,
      { time: 20, text: '세 번째 가사' },
    ];
    
    render(<LyricsSync lyrics={lyricsWithMissingTime} currentTime={15} />);
    expect(screen.getByText('첫 번째 가사')).toBeInTheDocument();
    expect(screen.getByText('시간 없는 가사')).toBeInTheDocument();
    expect(screen.getByText('세 번째 가사')).toBeInTheDocument();
  });
});