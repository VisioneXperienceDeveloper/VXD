import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PostEngagement } from '@/entities/post/ui/PostEngagement';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('PostEngagement Component', () => {
  const mockWriteText = vi.fn();
  
  beforeEach(() => {
    // Mock clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
      configurable: true,
    });
    
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { href: 'https://example.com/post/1' },
      writable: true,
      configurable: true,
    });
    
    mockWriteText.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render view count with number formatting', () => {
    render(<PostEngagement viewCount={1234} />);
    expect(screen.getByText('1,234')).toBeDefined();
  });

  it('should render 0 when viewCount is undefined', () => {
    render(<PostEngagement />);
    expect(screen.getByText('0')).toBeDefined();
  });

  it('should render 0 when viewCount is explicitly 0', () => {
    render(<PostEngagement viewCount={0} />);
    expect(screen.getByText('0')).toBeDefined();
  });

  it('should have share button with aria-label', () => {
    render(<PostEngagement viewCount={100} />);
    expect(screen.getByRole('button', { name: 'copy' })).toBeDefined();
  });

  it('should copy link to clipboard on button click', async () => {
    render(<PostEngagement viewCount={100} />);
    
    const button = screen.getByRole('button', { name: 'copy' });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('https://example.com/post/1');
    });
  });

  it('should handle clipboard error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockWriteText.mockRejectedValue(new Error('Clipboard error'));
    
    render(<PostEngagement viewCount={100} />);
    
    const button = screen.getByRole('button', { name: 'copy' });
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
