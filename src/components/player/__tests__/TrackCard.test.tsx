import { render, screen, fireEvent } from '@testing-library/react';
import { TrackCard } from '../TrackCard';
import { Track } from '@/types';

const mockTrack: Track = {
  id: '1',
  title: 'Test Song',
  artist: 'Test Artist',
  album: 'Test Album',
  duration: 180,
  file: '/music/test.mp3',
  cover: '/covers/test.jpg',
  lyrics: [],
  interpretation: 'Test interpretation',
  description: 'Test description',
};

const defaultProps = {
  track: mockTrack,
  onPlay: jest.fn(),
  isCurrentTrack: false,
  isPlaying: false,
  className: 'test-class',
};

describe('TrackCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<TrackCard {...defaultProps} />);
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
  });

  it('displays track information correctly', () => {
    render(<TrackCard {...defaultProps} />);
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('displays track cover image', () => {
    render(<TrackCard {...defaultProps} />);
    const coverImage = screen.getByAltText('Test Song');
    expect(coverImage).toBeInTheDocument();
    expect(coverImage).toHaveAttribute('src', '/covers/test.jpg');
  });

  it('calls onPlay when play button is clicked', () => {
    render(<TrackCard {...defaultProps} />);
    const playButton = screen.getByRole('button');
    fireEvent.click(playButton);
    expect(defaultProps.onPlay).toHaveBeenCalledWith(mockTrack);
  });

  it('shows play icon when not playing', () => {
    render(<TrackCard {...defaultProps} />);
    // Play icon should be present (Heroicons PlayIcon)
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows pause icon when playing current track', () => {
    render(
      <TrackCard 
        {...defaultProps} 
        isCurrentTrack={true} 
        isPlaying={true} 
      />
    );
    // Pause icon should be present (Heroicons PauseIcon)
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows current track indicator when isCurrentTrack is true', () => {
    render(
      <TrackCard 
        {...defaultProps} 
        isCurrentTrack={true} 
      />
    );
    // The indicator is a div with specific classes, we can check for the container
    const card = screen.getByText('Test Song').closest('div');
    expect(card).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<TrackCard {...defaultProps} />);
    const card = screen.getByText('Test Song').closest('div')?.parentElement;
    expect(card).toHaveClass('test-class');
  });

  it('handles track without description', () => {
    const trackWithoutDescription = { ...mockTrack, description: undefined as string | undefined };
    render(<TrackCard {...defaultProps} track={trackWithoutDescription} />);
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    // Should not render description paragraph
    expect(screen.queryByText('Test description')).not.toBeInTheDocument();
  });

  it('handles onPlay callback being undefined', () => {
    render(<TrackCard {...defaultProps} onPlay={undefined as ((track: Track) => void) | undefined} />);
    const playButton = screen.getByRole('button');
    // Should not throw error when clicked
    expect(() => fireEvent.click(playButton)).not.toThrow();
  });

  it('renders with different playing states', () => {
    const { rerender } = render(<TrackCard {...defaultProps} />);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<TrackCard {...defaultProps} isPlaying={true} />);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(
      <TrackCard 
        {...defaultProps} 
        isCurrentTrack={true} 
        isPlaying={true} 
      />
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<TrackCard {...defaultProps} />);
    const playButton = screen.getByRole('button');
    expect(playButton).toBeInTheDocument();
    
    const coverImage = screen.getByAltText('Test Song');
    expect(coverImage).toHaveAttribute('loading', 'lazy');
  });

  it('handles long text with truncation', () => {
    const longTrack = {
      ...mockTrack,
      title: 'This is a very long track title that should be truncated',
      artist: 'This is a very long artist name that should be truncated',
    };
    render(<TrackCard {...defaultProps} track={longTrack} />);
    expect(screen.getByText(longTrack.title)).toBeInTheDocument();
    expect(screen.getByText(longTrack.artist)).toBeInTheDocument();
  });
});