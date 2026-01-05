import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getPublishedPosts, getAllTags, getAllGroups, getTopTags, groupPosts } from '@/lib/notion';
import { mockPosts, mockBlogPosts } from '../../fixtures/notion-data';

// Mock the notion client
const { mockQuery } = vi.hoisted(() => {
  return { mockQuery: vi.fn() };
});

vi.mock('@notionhq/client', () => {
  return {
    Client: class {
      dataSources = {
        query: mockQuery,
      };
      // Add other properties if needed
      constructor(options: any) {}
    },
    LogLevel: {},
  };
});

vi.mock('next/cache', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unstable_cache: (fn: any) => fn,
}));

describe('getPublishedPosts', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T12:00:00Z'));
    process.env.NOTION_DATABASE_ID = 'test-db-id';
    process.env.NOTION_API_KEY = 'test-api-key';
    process.env.NOTION_DATA_SOURCE_ID = 'test-source-id';
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should filter out posts with a future date', async () => {
    mockQuery.mockResolvedValue({
      results: [mockPosts[0], mockPosts[1]], // Past and Future
    });

    const posts = await getPublishedPosts();

    expect(posts).toHaveLength(1);
    expect(posts![0].title).toBe('Past Post');
  });

  it('should include posts with today date', async () => {
    mockQuery.mockResolvedValue({
      results: [mockPosts[2]], // Today
    });

    const posts = await getPublishedPosts();
    expect(posts).toHaveLength(1);
    expect(posts![0].title).toBe('Today Post');
  });

  it('should filter posts by tag', async () => {
    mockQuery.mockResolvedValue({
      results: [mockPosts[3], mockPosts[4]], // Tag and No Tag
    });

    const posts = await getPublishedPosts('Tech');
    expect(posts).toHaveLength(1);
    expect(posts![0].title).toBe('Tag Post');
  });
});

describe('getAllTags', () => {
  it('should return unique tags from posts', async () => {
    mockQuery.mockResolvedValue({
      results: [mockPosts[3], mockPosts[4]], // Tech and Life
    });

    const tags = await getAllTags();
    
    expect(tags).toEqual(expect.arrayContaining(['Tech', 'Life']));
    expect(tags).toHaveLength(2);
  });
});

describe('groupPosts', () => {
  it('should group posts by group property', async () => {
    mockQuery.mockResolvedValue({
      results: [mockPosts[5]], // Group A
    });
    
    const posts = await getPublishedPosts();
    expect(posts![0].group).toBe('Section A');
  });

  it('should correctly group and sort posts', async () => {
    const grouped = groupPosts(mockBlogPosts);
    
    expect(Object.keys(grouped)).toEqual(expect.arrayContaining(['Group 1', 'Group 2']));
    expect(grouped['Group 1']).toHaveLength(2);
    expect(grouped['Group 1'][0].title).toBe('B'); // Sorted by date desc (newest first)
    expect(grouped['Group 1'][1].title).toBe('A');
    expect(grouped['Group 2']).toHaveLength(1);
  });
});

describe('getAllGroups', () => {
  it('should return unique groups from posts', async () => {
    mockQuery.mockResolvedValue({
      results: [mockPosts[5], mockPosts[6]], // Section A and Section B
    });

    const groups = await getAllGroups();
    expect(groups).toContain('Section A');
    expect(groups).toContain('Section B');
    expect(groups.length).toBe(2);
  });
});

describe('getTopTags', () => {
  it('should return top 5 tags sorted by count', async () => {
    // Construct data with tags
    const taggedPosts = [
      { ...mockPosts[0], id: '1', properties: { ...mockPosts[0].properties, tags: { type: 'multi_select', multi_select: [{ name: 'React' }, { name: 'Next.js' }] } } },
      { ...mockPosts[0], id: '2', properties: { ...mockPosts[0].properties, tags: { type: 'multi_select', multi_select: [{ name: 'React' }, { name: 'TypeScript' }] } } },
      { ...mockPosts[0], id: '3', properties: { ...mockPosts[0].properties, tags: { type: 'multi_select', multi_select: [{ name: 'Life' }] } } },
      { ...mockPosts[0], id: '4', properties: { ...mockPosts[0].properties, tags: { type: 'multi_select', multi_select: [{ name: 'React' }] } } },
      { ...mockPosts[0], id: '5', properties: { ...mockPosts[0].properties, tags: { type: 'multi_select', multi_select: [{ name: 'Next.js' }] } } },
    ];

    mockQuery.mockResolvedValue({
      results: taggedPosts,
    });

    const topTags = await getTopTags();
    
    expect(topTags.length).toBeLessThanOrEqual(5);
    expect(topTags[0]).toBe('React'); // 3
    expect(topTags[1]).toBe('Next.js'); // 2
  });
});
