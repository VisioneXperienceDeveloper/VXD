import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchPosts } from '@/app/actions';
import { mockBlogPosts } from '../../fixtures/notion-data';

// Mock the notion module
vi.mock('@/lib/notion', () => ({
  getPublishedPosts: vi.fn(),
}));

import { getPublishedPosts } from '@/lib/services/posts.service';

describe('fetchPosts server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return first page of posts', async () => {
    const allPosts = [...mockBlogPosts, ...mockBlogPosts]; // 6 posts
    (getPublishedPosts as ReturnType<typeof vi.fn>).mockResolvedValue(allPosts);

    const result = await fetchPosts({ page: 1 });

    expect(result.posts).toHaveLength(6);
    expect(result.hasMore).toBe(false);
  });

  it('should return paginated posts with hasMore true', async () => {
    const allPosts = Array(10).fill(null).map((_, i) => ({ ...mockBlogPosts[0], id: String(i) }));
    (getPublishedPosts as ReturnType<typeof vi.fn>).mockResolvedValue(allPosts);

    const result = await fetchPosts({ page: 1 });

    expect(result.posts).toHaveLength(6);
    expect(result.hasMore).toBe(true);
  });

  it('should return second page of posts', async () => {
    const allPosts = Array(10).fill(null).map((_, i) => ({ ...mockBlogPosts[0], id: String(i) }));
    (getPublishedPosts as ReturnType<typeof vi.fn>).mockResolvedValue(allPosts);

    const result = await fetchPosts({ page: 2 });

    expect(result.posts).toHaveLength(4);
    expect(result.hasMore).toBe(false);
  });

  it('should return empty posts when getPublishedPosts returns null', async () => {
    (getPublishedPosts as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const result = await fetchPosts({ page: 1 });

    expect(result.posts).toEqual([]);
    expect(result.hasMore).toBe(false);
  });

  it('should pass filter parameters to getPublishedPosts', async () => {
    (getPublishedPosts as ReturnType<typeof vi.fn>).mockResolvedValue(mockBlogPosts);

    await fetchPosts({ page: 1, tag: 'Tech', search: 'test', group: 'Group 1', locale: 'en' });

    expect(getPublishedPosts).toHaveBeenCalledWith('Tech', 'test', 'Group 1', 'en');
  });

  it('should use default locale when not provided', async () => {
    (getPublishedPosts as ReturnType<typeof vi.fn>).mockResolvedValue(mockBlogPosts);

    await fetchPosts({ page: 1 });

    expect(getPublishedPosts).toHaveBeenCalledWith(undefined, undefined, undefined, 'ko');
  });
});
