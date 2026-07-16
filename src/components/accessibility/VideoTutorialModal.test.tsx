import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VideoTutorialModal } from './VideoTutorialModal';

const { mockClosePanel } = vi.hoisted(() => ({
  mockClosePanel: vi.fn(),
}));

vi.mock('@/shared/context/AccessibilityContext', () => ({
  useAccessibility: () => ({
    closePanel: mockClosePanel,
    transcripts: false,
  }),
}));
vi.mock('@/shared/hooks/useFocusTrap', () => ({
  useFocusTrap: vi.fn(),
}));

const video = {
  id: 'tutorial-1',
  title: 'Getting Started',
  description: 'A quick guide',
  image: 'img.jpg',
  poster: 'poster.jpg',
  videoSrc: 'video.mp4',
  subtitlesSrc: 'subs.vtt',
  descriptionsSrc: 'desc.vtt',
  transcriptSrc: 'transcript.txt',
};

describe('VideoTutorialModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(global, 'fetch').mockResolvedValue({ ok: false, text: () => Promise.resolve('') } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders nothing when closed', () => {
    const { container } = render(
      <VideoTutorialModal video={video} isOpen={false} onClose={vi.fn()} />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders the modal when open', () => {
    render(<VideoTutorialModal video={video} isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<VideoTutorialModal video={video} isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText(/cerrar reproductor/i));
    expect(onClose).toHaveBeenCalled();
  });
});
