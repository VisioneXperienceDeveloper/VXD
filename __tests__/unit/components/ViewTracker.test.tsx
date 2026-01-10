import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { ViewTracker } from '@/components/ViewTracker';

describe('ViewTracker Component', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('should render nothing visible', () => {
    const { container } = render(<ViewTracker postId="test-post-id" />);
    expect(container.innerHTML).toBe('');
  });

  it('should call fetch on mount', async () => {
    render(<ViewTracker postId="test-post-123" />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/view/test-post-123', { method: 'POST' });
    });
  });

  it('should only track once per mount', async () => {
    const { rerender } = render(<ViewTracker postId="test-post-123" />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    // Rerender same component
    rerender(<ViewTracker postId="test-post-123" />);

    // Should still be called only once
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch error silently', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Should not throw
    expect(() => render(<ViewTracker postId="test-post-123" />)).not.toThrow();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('should track different post when postId changes on new mount', async () => {
    const { unmount } = render(<ViewTracker postId="post-1" />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/view/post-1', { method: 'POST' });
    });

    unmount();

    render(<ViewTracker postId="post-2" />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/view/post-2', { method: 'POST' });
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
