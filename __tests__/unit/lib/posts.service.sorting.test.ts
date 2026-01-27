import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getPublishedPosts } from '@/lib/services/posts.service';
import { mockSortingPosts } from '../../fixtures/sorting-data';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

// Hoist mocks before imports
const { mockQuery } = vi.hoisted(() => {
  return { 
    mockQuery: vi.fn(),
  };
});

vi.mock('@notionhq/client', () => {
  return {
    Client: class {
      dataSources = {
        query: mockQuery,
      };
      blocks = {
        children: {
          list: vi.fn(),
        },
      };
      pages = {
        retrieve: vi.fn(),
        update: vi.fn(),
      };
      constructor(_options: { auth?: string }) {}
    },
    LogLevel: {},
  };
});

vi.mock('next/cache', () => ({
  unstable_cache: <T>(fn: () => Promise<T>) => fn,
}));

/**
 * Helper function to create Notion page objects from BlogPost mock data
 */
function createNotionPage(post: typeof mockSortingPosts[0]): PageObjectResponse {
  return {
    id: post.id,
    properties: {
      title: { 
        type: 'title', 
        title: [{ 
          type: 'text',
          text: { content: post.title, link: null },
          plain_text: post.title,
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          href: null,
        }],
        id: 'title'
      },
      published_date: { 
        type: 'date', 
        date: { start: post.date, end: null, time_zone: null },
        id: 'published_date'
      },
      tags: { 
        type: 'multi_select', 
        multi_select: post.tags.map(tag => ({ id: tag, name: tag, color: 'default' })),
        id: 'tags'
      },
      language: { 
        type: 'select', 
        select: post.language ? { id: post.language, name: post.language, color: 'default' } : null,
        id: 'language'
      },
      group: {
        type: 'select',
        select: post.group ? { id: post.group, name: post.group, color: 'default' } : null,
        id: 'group'
      },
      view_count: {
        type: 'number',
        number: post.viewCount ?? 0,
        id: 'view_count'
      },
      comment_count: {
        type: 'number',
        number: post.commentCount ?? 0,
        id: 'comment_count'
      },
      slug: {
        type: 'rich_text',
        rich_text: [{
          type: 'text',
          text: { content: post.slug, link: null },
          plain_text: post.slug,
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
          href: null,
        }],
        id: 'slug'
      }
    },
    last_edited_time: '2025-01-01T00:00:00Z',
    created_time: '2025-01-01T00:00:00Z',
    archived: false,
    in_trash: false,
    cover: null,
    icon: null,
    parent: { type: 'database_id', database_id: 'test-db' },
    url: `https://notion.so/${post.id}`,
    public_url: null,
    created_by: { object: 'user', id: 'user-1' },
    last_edited_by: { object: 'user', id: 'user-1' },
    object: 'page',
    is_locked: false,
  } as PageObjectResponse;
}

describe('Posts Service - Sorting Functionality', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T12:00:00Z'));
    vi.stubEnv('NOTION_POSTS_DATA_SOURCE_ID', 'test-source-id');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('Sort by published_date', () => {
    it('should sort posts by published_date in descending order (default)', async () => {
      const notionPages = mockSortingPosts.map(createNotionPage);
      mockQuery.mockResolvedValue({ results: notionPages });

      const posts = await getPublishedPosts({
        sortBy: 'published_date',
        sortDirection: 'desc'
      });

      expect(posts).not.toBeNull();
      expect(posts).toHaveLength(6);
      
      // Newest first
      expect(posts![0].title).toBe('Newest Post');
      expect(posts![1].title).toBe('Most Comments Post');
      expect(posts![2].title).toBe('Middle Post');
      expect(posts![3].title).toBe('Zero Engagement');
      expect(posts![4].title).toBe('High Views Post');
      expect(posts![5].title).toBe('Oldest Post');
    });

    it('should sort posts by published_date in ascending order', async () => {
      const notionPages = mockSortingPosts.map(createNotionPage);
      mockQuery.mockResolvedValue({ results: notionPages });

      const posts = await getPublishedPosts({
        sortBy: 'published_date',
        sortDirection: 'asc'
      });

      expect(posts).not.toBeNull();
      expect(posts).toHaveLength(6);
      
      // Oldest first
      expect(posts![0].title).toBe('Oldest Post');
      expect(posts![1].title).toBe('High Views Post');
      expect(posts![2].title).toBe('Zero Engagement');
      expect(posts![3].title).toBe('Middle Post');
      expect(posts![4].title).toBe('Most Comments Post');
      expect(posts![5].title).toBe('Newest Post');
    });

    it('should use published_date desc as default when no sort options provided', async () => {
      const notionPages = mockSortingPosts.map(createNotionPage);
      mockQuery.mockResolvedValue({ results: notionPages });

      const posts = await getPublishedPosts();

      expect(posts).not.toBeNull();
      expect(posts![0].title).toBe('Newest Post');
      expect(posts![5].title).toBe('Oldest Post');
    });
  });

  describe('Sort by view_count', () => {
    it('should sort posts by view_count in descending order', async () => {
      const notionPages = mockSortingPosts.map(createNotionPage);
      mockQuery.mockResolvedValue({ results: notionPages });

      const posts = await getPublishedPosts({
        sortBy: 'view_count',
        sortDirection: 'desc'
      });

      expect(posts).not.toBeNull();
      expect(posts).toHaveLength(6);
      
      // Highest views first
      expect(posts![0].title).toBe('High Views Post'); // 1000
      expect(posts![1].title).toBe('Middle Post'); // 250
      expect(posts![2].title).toBe('Most Comments Post'); // 150
      expect(posts![3].title).toBe('Oldest Post'); // 100
      expect(posts![4].title).toBe('Newest Post'); // 50
      expect(posts![5].title).toBe('Zero Engagement'); // 0
    });

    it('should sort posts by view_count in ascending order', async () => {
      const notionPages = mockSortingPosts.map(createNotionPage);
      mockQuery.mockResolvedValue({ results: notionPages });

      const posts = await getPublishedPosts({
        sortBy: 'view_count',
        sortDirection: 'asc'
      });

      expect(posts).not.toBeNull();
      expect(posts).toHaveLength(6);
      
      // Lowest views first
      expect(posts![0].title).toBe('Zero Engagement'); // 0
      expect(posts![1].title).toBe('Newest Post'); // 50
      expect(posts![2].title).toBe('Oldest Post'); // 100
      expect(posts![3].title).toBe('Most Comments Post'); // 150
      expect(posts![4].title).toBe('Middle Post'); // 250
      expect(posts![5].title).toBe('High Views Post'); // 1000
    });

    it('should handle null/undefined view_count as 0', async () => {
      const postsWithNullViews = [...mockSortingPosts];
      postsWithNullViews[0] = { ...postsWithNullViews[0], viewCount: undefined };
      
      const notionPages = postsWithNullViews.map(createNotionPage);
      mockQuery.mockResolvedValue({ results: notionPages });

      const posts = await getPublishedPosts({
        sortBy: 'view_count',
        sortDirection: 'desc'
      });

      expect(posts).not.toBeNull();
      // Posts with undefined viewCount should be treated as 0 and appear at the end
      const lastPosts = posts!.slice(-2);
      expect(lastPosts.map(p => p.title)).toContain('Oldest Post');
      expect(lastPosts.map(p => p.title)).toContain('Zero Engagement');
    });
  });

  describe('Sort by comment_count', () => {
    it('should sort posts by comment_count in descending order', async () => {
      const notionPages = mockSortingPosts.map(createNotionPage);
      mockQuery.mockResolvedValue({ results: notionPages });

      const posts = await getPublishedPosts({
        sortBy: 'comment_count',
        sortDirection: 'desc'
      });

      expect(posts).not.toBeNull();
      expect(posts).toHaveLength(6);
      
      // Most comments first
      expect(posts![0].title).toBe('Most Comments Post'); // 50
      expect(posts![1].title).toBe('Newest Post'); // 15
      expect(posts![2].title).toBe('Middle Post'); // 10
      expect(posts![3].title).toBe('Oldest Post'); // 5
      expect(posts![4].title).toBe('High Views Post'); // 3
      expect(posts![5].title).toBe('Zero Engagement'); // 0
    });

    it('should sort posts by comment_count in ascending order', async () => {
      const notionPages = mockSortingPosts.map(createNotionPage);
      mockQuery.mockResolvedValue({ results: notionPages });

      const posts = await getPublishedPosts({
        sortBy: 'comment_count',
        sortDirection: 'asc'
      });

      expect(posts).not.toBeNull();
      expect(posts).toHaveLength(6);
      
      // Least comments first
      expect(posts![0].title).toBe('Zero Engagement'); // 0
      expect(posts![1].title).toBe('High Views Post'); // 3
      expect(posts![2].title).toBe('Oldest Post'); // 5
      expect(posts![3].title).toBe('Middle Post'); // 10
      expect(posts![4].title).toBe('Newest Post'); // 15
      expect(posts![5].title).toBe('Most Comments Post'); // 50
    });

    it('should handle null/undefined comment_count as 0', async () => {
      const postsWithNullComments = [...mockSortingPosts];
      postsWithNullComments[0] = { ...postsWithNullComments[0], commentCount: undefined };
      
      const notionPages = postsWithNullComments.map(createNotionPage);
      mockQuery.mockResolvedValue({ results: notionPages });

      const posts = await getPublishedPosts({
        sortBy: 'comment_count',
        sortDirection: 'desc'
      });

      expect(posts).not.toBeNull();
      // Posts with undefined commentCount should be treated as 0 and appear at the end
      const lastPosts = posts!.slice(-2);
      expect(lastPosts.map(p => p.title)).toContain('Oldest Post');
      expect(lastPosts.map(p => p.title)).toContain('Zero Engagement');
    });
  });

  describe('Edge cases', () => {
    it('should handle posts with identical sort values', async () => {
      const identicalPosts = [
        { ...mockSortingPosts[0], viewCount: 100 },
        { ...mockSortingPosts[1], viewCount: 100 },
        { ...mockSortingPosts[2], viewCount: 100 },
      ];
      
      const notionPages = identicalPosts.map(createNotionPage);
      mockQuery.mockResolvedValue({ results: notionPages });

      const posts = await getPublishedPosts({
        sortBy: 'view_count',
        sortDirection: 'desc'
      });

      expect(posts).not.toBeNull();
      expect(posts).toHaveLength(3);
      // All should have same view count
      posts!.forEach(post => {
        expect(post.viewCount).toBe(100);
      });
    });

    it('should maintain stable sort for posts with same date', async () => {
      const sameDatePosts = mockSortingPosts.map(post => ({
        ...post,
        date: '2024-06-15' // All same date
      }));
      
      const notionPages = sameDatePosts.map(createNotionPage);
      mockQuery.mockResolvedValue({ results: notionPages });

      const posts = await getPublishedPosts({
        sortBy: 'published_date',
        sortDirection: 'desc'
      });

      expect(posts).not.toBeNull();
      expect(posts).toHaveLength(6);
      // All posts should have the same formatted date
      const uniqueDates = new Set(posts!.map(p => p.date));
      expect(uniqueDates.size).toBe(1);
    });

    it('should work correctly with combined filters and sorting', async () => {
      const notionPages = mockSortingPosts.map(createNotionPage);
      mockQuery.mockResolvedValue({ results: notionPages });

      const posts = await getPublishedPosts({
        tag: 'Tech',
        sortBy: 'view_count',
        sortDirection: 'desc'
      });

      expect(posts).not.toBeNull();
      // Only Tech posts
      posts!.forEach(post => {
        expect(post.tags).toContain('Tech');
      });
      
      // Sorted by view count desc
      expect(posts![0].title).toBe('High Views Post'); // 1000
      expect(posts![1].title).toBe('Oldest Post'); // 100
    });
  });
});
