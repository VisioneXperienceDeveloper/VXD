import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getPublishedPosts } from '@/lib/notion';

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

describe('getPublishedPosts', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T12:00:00Z'));
    process.env.NOTION_DATABASE_ID = 'test-db-id';
    process.env.NOTION_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should filter out posts with a future date', async () => {
    // Mock response with one past post and one future post
    mockQuery.mockResolvedValue({
      results: [
        {
          id: 'past-post',
          properties: {
            title: { type: 'title', title: [{ plain_text: 'Past Post' }] },
            published_date: { type: 'date', date: { start: '2024-12-31' } }, // Past
            tags: { type: 'multi_select', multi_select: [] },
          },
          last_edited_time: '2024-12-31T00:00:00Z',
        },
        {
          id: 'future-post',
          properties: {
            title: { type: 'title', title: [{ plain_text: 'Future Post' }] },
            published_date: { type: 'date', date: { start: '2025-01-02' } }, // Future
            tags: { type: 'multi_select', multi_select: [] },
          },
          last_edited_time: '2025-01-02T00:00:00Z',
        },
      ],
    });

    const posts = await getPublishedPosts();

    expect(posts).toHaveLength(1);
    expect(posts[0].title).toBe('Past Post');
  });

  it('should include posts with today date', async () => {
    mockQuery.mockResolvedValue({
      results: [
        {
          id: 'today-post',
          properties: {
            title: { type: 'title', title: [{ plain_text: 'Today Post' }] },
            published_date: { type: 'date', date: { start: '2025-01-01' } }, // Today
            tags: { type: 'multi_select', multi_select: [] },
          },
          last_edited_time: '2025-01-01T00:00:00Z',
        },
      ],
    });

    const posts = await getPublishedPosts();
    expect(posts).toHaveLength(1);
    expect(posts[0].title).toBe('Today Post');
  });
  it('should filter posts by tag', async () => {
    mockQuery.mockResolvedValue({
      results: [
        {
          id: 'tag-post',
          properties: {
            title: { type: 'title', title: [{ plain_text: 'Tag Post' }] },
            published_date: { type: 'date', date: { start: '2025-01-01' } },
            tags: { type: 'multi_select', multi_select: [{ name: 'Tech' }] },
          },
          last_edited_time: '2025-01-01T00:00:00Z',
        },
        {
          id: 'no-tag-post',
          properties: {
            title: { type: 'title', title: [{ plain_text: 'No Tag Post' }] },
            published_date: { type: 'date', date: { start: '2025-01-01' } },
            tags: { type: 'multi_select', multi_select: [{ name: 'Life' }] },
          },
          last_edited_time: '2025-01-01T00:00:00Z',
        },
      ],
    });

    const posts = await getPublishedPosts('Tech');
    expect(posts).toHaveLength(1);
    expect(posts[0].title).toBe('Tag Post');
  });
});

describe('getAllTags', () => {
  it('should return unique tags from posts', async () => {
    mockQuery.mockResolvedValue({
      results: [
        {
          id: 'post-1',
          properties: {
            title: { type: 'title', title: [{ plain_text: 'Post 1' }] },
            published_date: { type: 'date', date: { start: '2025-01-01' } },
            tags: { type: 'multi_select', multi_select: [{ name: 'Tech' }, { name: 'Life' }] },
          },
          last_edited_time: '2025-01-01T00:00:00Z',
        },
        {
          id: 'post-2',
          properties: {
            title: { type: 'title', title: [{ plain_text: 'Post 2' }] },
            published_date: { type: 'date', date: { start: '2025-01-01' } },
            tags: { type: 'multi_select', multi_select: [{ name: 'Tech' }] },
          },
          last_edited_time: '2025-01-01T00:00:00Z',
        },
      ],
    });

    const { getAllTags } = await import('@/lib/notion');
    const tags = await getAllTags();
    
    expect(tags).toEqual(['Tech', 'Life']);
  });
});

describe('groupPosts', () => {
  it('should group posts by group property and sort by date', async () => {
    // We don't need to mock query here if we test the helper function with static data
    // But we need to ensure getPublishedPosts extracts the group property first.
    // Let's first test that getPublishedPosts extracts 'group'.
    
    mockQuery.mockResolvedValue({
      results: [
        {
          id: 'g1',
          properties: {
            title: { type: 'title', title: [{ plain_text: 'G1' }] },
            published_date: { type: 'date', date: { start: '2025-01-02' } },
            tags: { type: 'multi_select', multi_select: [] },
            group: { type: 'select', select: { name: 'Section A' } },
          },
          last_edited_time: '2025-01-02T00:00:00Z',
        },
      ],
    });
    
    const posts = await getPublishedPosts();
    // @ts-ignore
    expect(posts[0].group).toBe('Section A');
  });

  it('should correctly group and sort posts', async () => {
    const { groupPosts } = await import('@/lib/notion');
    const mockPosts = [
      { id: '1', title: 'A', date: '2025-01-01', group: 'Group 1', tags: [], slug: '1', cover: null, description: '' },
      { id: '2', title: 'B', date: '2025-01-03', group: 'Group 1', tags: [], slug: '2', cover: null, description: '' },
      { id: '3', title: 'C', date: '2025-01-02', group: 'Group 2', tags: [], slug: '3', cover: null, description: '' },
    ];

    const grouped = groupPosts(mockPosts);
    
    expect(Object.keys(grouped)).toEqual(['Group 1', 'Group 2']);
    expect(grouped['Group 1']).toHaveLength(2);
    expect(grouped['Group 1'][0].title).toBe('B'); // Sorted by date desc (newest first)
    expect(grouped['Group 1'][1].title).toBe('A');
    expect(grouped['Group 2']).toHaveLength(1);
  });
});

describe('getAllGroups', () => {
  it('should return unique groups from posts', async () => {
    const { getAllGroups } = await import('@/lib/notion');
    // Mock getPublishedPosts via the mockQuery response
    mockQuery.mockResolvedValue({
      results: [
        {
          id: 'p1',
          properties: {
            title: { type: 'title', title: [{ plain_text: 'P1' }] },
            published_date: { type: 'date', date: { start: '2025-01-01' } },
            tags: { type: 'multi_select', multi_select: [] },
            group: { type: 'select', select: { name: 'Engineering' } },
          },
          last_edited_time: '2025-01-01T00:00:00Z',
        },
        {
          id: 'p2',
          properties: {
            title: { type: 'title', title: [{ plain_text: 'P2' }] },
            published_date: { type: 'date', date: { start: '2025-01-01' } },
            tags: { type: 'multi_select', multi_select: [] },
            group: { type: 'select', select: { name: 'Personal' } },
          },
          last_edited_time: '2025-01-01T00:00:00Z',
        },
        {
          id: 'p3',
          properties: {
            title: { type: 'title', title: [{ plain_text: 'P3' }] },
            published_date: { type: 'date', date: { start: '2025-01-01' } },
            tags: { type: 'multi_select', multi_select: [] },
            group: { type: 'select', select: { name: 'Engineering' } },
          },
          last_edited_time: '2025-01-01T00:00:00Z',
        },
      ],
    });

    const groups = await getAllGroups();
    expect(groups).toContain('Engineering');
    expect(groups).toContain('Personal');
    expect(groups.length).toBe(2);
  });
});

describe('getTopTags', () => {
  it('should return top 5 tags sorted by count', async () => {
    const { getTopTags } = await import('@/lib/notion');
    
    // Mock posts with tags
    // React: 3, Next.js: 2, TypeScript: 1, Life: 1, Vue: 1, Angular: 1
    mockQuery.mockResolvedValue({
      results: [
        { id: '1', properties: { title: { type: 'title', title: [{ plain_text: '1' }] }, published_date: { type: 'date', date: { start: '2025-01-01' } }, tags: { type: 'multi_select', multi_select: [{ name: 'React' }, { name: 'Next.js' }] } }, last_edited_time: '2025-01-01' },
        { id: '2', properties: { title: { type: 'title', title: [{ plain_text: '2' }] }, published_date: { type: 'date', date: { start: '2025-01-01' } }, tags: { type: 'multi_select', multi_select: [{ name: 'React' }, { name: 'TypeScript' }] } }, last_edited_time: '2025-01-01' },
        { id: '3', properties: { title: { type: 'title', title: [{ plain_text: '3' }] }, published_date: { type: 'date', date: { start: '2025-01-01' } }, tags: { type: 'multi_select', multi_select: [{ name: 'Life' }] } }, last_edited_time: '2025-01-01' },
        { id: '4', properties: { title: { type: 'title', title: [{ plain_text: '4' }] }, published_date: { type: 'date', date: { start: '2025-01-01' } }, tags: { type: 'multi_select', multi_select: [{ name: 'React' }] } }, last_edited_time: '2025-01-01' },
        { id: '5', properties: { title: { type: 'title', title: [{ plain_text: '5' }] }, published_date: { type: 'date', date: { start: '2025-01-01' } }, tags: { type: 'multi_select', multi_select: [{ name: 'Next.js' }] } }, last_edited_time: '2025-01-01' },
        { id: '6', properties: { title: { type: 'title', title: [{ plain_text: '6' }] }, published_date: { type: 'date', date: { start: '2025-01-01' } }, tags: { type: 'multi_select', multi_select: [{ name: 'Vue' }] } }, last_edited_time: '2025-01-01' },
        { id: '7', properties: { title: { type: 'title', title: [{ plain_text: '7' }] }, published_date: { type: 'date', date: { start: '2025-01-01' } }, tags: { type: 'multi_select', multi_select: [{ name: 'Angular' }] } }, last_edited_time: '2025-01-01' },
      ],
    });

    const topTags = await getTopTags();
    
    expect(topTags.length).toBeLessThanOrEqual(5);
    expect(topTags[0]).toBe('React'); // 3
    expect(topTags[1]).toBe('Next.js'); // 2
    // Others have 1, order might vary but they should be present
  });
});
