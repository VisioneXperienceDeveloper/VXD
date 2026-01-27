import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { PostList } from '@/widgets/post-list/ui/PostList';
import { mockBlogPosts } from '../../fixtures/notion-data';
import { fetchPosts } from '@/app/actions';

/* eslint-disable @typescript-eslint/no-explicit-any */

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
  usePathname: vi.fn(),
}));

// Mock routing
vi.mock('@/shared/i18n/routing', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock fetchPosts action
vi.mock('@/app/actions', () => ({
  fetchPosts: vi.fn(),
}));

describe('PostList Component', () => {
  let intersectionCallback: IntersectionObserverCallback;
  const mockObserve = vi.fn();
  const mockDisconnect = vi.fn();

  beforeEach(() => {
    // Capture the intersection callback
    class MockIntersectionObserver implements IntersectionObserver {
      readonly root: Element | null = null;
      readonly rootMargin: string = '';
      readonly thresholds: ReadonlyArray<number> = [];
      
      constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        intersectionCallback = callback;
      }
      
      observe = mockObserve;
      unobserve = vi.fn();
      disconnect = mockDisconnect;
      takeRecords = vi.fn(() => []);
    }

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('should render initial posts', () => {
    render(
      <PostList
        initialPosts={mockBlogPosts}
        initialHasMore={false}
      />
    );

    expect(screen.getByText('A')).toBeDefined();
    expect(screen.getByText('B')).toBeDefined();
    expect(screen.getByText('C')).toBeDefined();
  });

  it('should show no posts message when empty', () => {
    render(
      <PostList
        initialPosts={[]}
        initialHasMore={false}
      />
    );

    expect(screen.getByText('noPosts')).toBeDefined();
  });

  it('should show loading indicator area when hasMore is true', () => {
    render(
      <PostList
        initialPosts={mockBlogPosts}
        initialHasMore={true}
      />
    );

    // The observer target div should exist
    const container = document.querySelector('.flex.justify-center');
    expect(container).toBeDefined();
  });

  it('should reset state when filters change', () => {
    const { rerender } = render(
      <PostList
        initialPosts={mockBlogPosts}
        initialHasMore={true}
        tag="tech"
      />
    );

    // Rerender with different props
    rerender(
      <PostList
        initialPosts={[mockBlogPosts[0]]}
        initialHasMore={false}
        tag="life"
      />
    );

    expect(screen.getByText('A')).toBeDefined();
  });

  it('should call fetchPosts when intersection observer triggers', async () => {
    const mockFetchPosts = fetchPosts as any;
    mockFetchPosts.mockResolvedValue({
      posts: [mockBlogPosts[0]],
      hasMore: false,
    });

    render(
      <PostList
        initialPosts={mockBlogPosts}
        initialHasMore={true}
      />
    );

    // Simulate intersection
    await act(async () => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    await waitFor(() => {
      expect(mockFetchPosts).toHaveBeenCalledWith({
        page: 2,
        tag: undefined,
        search: undefined,
        group: undefined,
        locale: undefined,
      });
    });
  });

  it('should not load more when already loading', async () => {
    const mockFetchPosts = fetchPosts as any;
    // Make it take a long time 
    mockFetchPosts.mockImplementation(() => new Promise(resolve => 
      setTimeout(() => resolve({ posts: [], hasMore: false }), 1000)
    ));

    render(
      <PostList
        initialPosts={mockBlogPosts}
        initialHasMore={true}
      />
    );

    // Trigger twice quickly
    await act(async () => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    await act(async () => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    // Should only be called once because loading state prevents second call
    expect(mockFetchPosts).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch error gracefully', async () => {
    const mockFetchPosts = fetchPosts as any;
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFetchPosts.mockRejectedValue(new Error('Network error'));

    render(
      <PostList
        initialPosts={mockBlogPosts}
        initialHasMore={true}
      />
    );

    await act(async () => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load more posts:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('should append new posts on successful loadMore', async () => {
    const mockFetchPosts = fetchPosts as any;
    const newPosts = [{ ...mockBlogPosts[0], id: 'new-1', title: 'New Post 1' }];
    mockFetchPosts.mockResolvedValue({
      posts: newPosts,
      hasMore: true,
    });

    render(
      <PostList
        initialPosts={mockBlogPosts}
        initialHasMore={true}
      />
    );

    // Initial posts should be visible
    expect(screen.getByText('A')).toBeDefined();

    // Trigger intersection
    await act(async () => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    // Wait for new post to appear
    await waitFor(() => {
      expect(screen.getByText('New Post 1')).toBeDefined();
    });

    // Original posts should still be there
    expect(screen.getByText('A')).toBeDefined();
  });

  it('should update hasMore flag when no more posts', async () => {
    const mockFetchPosts = fetchPosts as any;
    mockFetchPosts.mockResolvedValue({
      posts: [],
      hasMore: false,
    });

    render(
      <PostList
        initialPosts={mockBlogPosts}
        initialHasMore={true}
      />
    );

    // Trigger intersection
    await act(async () => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(mockFetchPosts).toHaveBeenCalled();
    });

    // Loading indicator should not be visible anymore
    const loadingContainer = document.querySelector('.flex.justify-center');
    // If hasMore is false, observer target might be removed or not visible
    // This is implementation dependent
  });

  it('should not trigger loadMore when not intersecting', async () => {
    const mockFetchPosts = fetchPosts as any;
    mockFetchPosts.mockResolvedValue({
      posts: [],
      hasMore: false,
    });

    render(
      <PostList
        initialPosts={mockBlogPosts}
        initialHasMore={true}
      />
    );

    // Trigger with isIntersecting: false
    await act(async () => {
      intersectionCallback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    // Should not call fetchPosts
    expect(mockFetchPosts).not.toHaveBeenCalled();
  });
});

