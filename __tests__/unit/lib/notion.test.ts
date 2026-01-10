import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getPublishedPosts, getAllTags, getAllGroups, getTopTags, groupPosts, getDataSourceId, getPageContent, getPostById, incrementViewCount } from '@/lib/notion';
import { mockPosts, mockBlogPosts } from '../../fixtures/notion-data';

// Mock the notion client
const { mockQuery, mockBlocksList, mockRetrieve, mockUpdate } = vi.hoisted(() => {
  return { 
    mockQuery: vi.fn(),
    mockBlocksList: vi.fn(),
    mockRetrieve: vi.fn(),
    mockUpdate: vi.fn(),
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
          list: mockBlocksList,
        },
      };
      pages = {
        retrieve: mockRetrieve,
        update: mockUpdate,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      constructor(options: any) {}
    },
    LogLevel: {},
  };
});

vi.mock('next/cache', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unstable_cache: (fn: any) => fn,
}));

describe('getDataSourceId', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return data source id when set', () => {
    process.env.NOTION_DATA_SOURCE_ID = 'test-source-id';
    expect(getDataSourceId()).toBe('test-source-id');
  });

  it('should throw error when data source id is not set', () => {
    delete process.env.NOTION_DATA_SOURCE_ID;
    expect(() => getDataSourceId()).toThrow('NOTION_DATA_SOURCE_ID is not set in environment variables');
  });
});

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

  it('should filter posts by search query', async () => {
    mockQuery.mockResolvedValue({
      results: [mockPosts[0], mockPosts[2]], // Past and Today
    });

    const posts = await getPublishedPosts(undefined, 'Past');
    expect(posts).toHaveLength(1);
    expect(posts![0].title).toBe('Past Post');
  });

  it('should filter posts by group', async () => {
    mockQuery.mockResolvedValue({
      results: [mockPosts[5], mockPosts[6]], // Section A and B
    });

    const posts = await getPublishedPosts(undefined, undefined, 'Section A');
    expect(posts).toHaveLength(1);
    expect(posts![0].group).toBe('Section A');
  });

  it('should return null when API fails', async () => {
    mockQuery.mockRejectedValue(new Error('API Error'));

    const posts = await getPublishedPosts();
    expect(posts).toBeNull();
  });
});

describe('getAllTags', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T12:00:00Z'));
    process.env.NOTION_DATA_SOURCE_ID = 'test-source-id';
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should return unique tags from posts', async () => {
    mockQuery.mockResolvedValue({
      results: [mockPosts[3], mockPosts[4]], // Tech and Life
    });

    const tags = await getAllTags();
    
    expect(tags).toEqual(expect.arrayContaining(['Tech', 'Life']));
    expect(tags).toHaveLength(2);
  });

  it('should return empty array when no posts', async () => {
    mockQuery.mockRejectedValue(new Error('API Error'));

    const tags = await getAllTags();
    expect(tags).toEqual([]);
  });
});

describe('groupPosts', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T12:00:00Z'));
    process.env.NOTION_DATA_SOURCE_ID = 'test-source-id';
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

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

  it('should group posts without group as Other', () => {
    const postsWithoutGroup = [
      { ...mockBlogPosts[0], group: undefined },
    ];
    const grouped = groupPosts(postsWithoutGroup);
    expect(grouped['Other']).toHaveLength(1);
  });
});

describe('getAllGroups', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T12:00:00Z'));
    process.env.NOTION_DATA_SOURCE_ID = 'test-source-id';
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should return unique groups from posts', async () => {
    mockQuery.mockResolvedValue({
      results: [mockPosts[5], mockPosts[6]], // Section A and Section B
    });

    const groups = await getAllGroups();
    expect(groups).toContain('Section A');
    expect(groups).toContain('Section B');
    expect(groups.length).toBe(2);
  });

  it('should return empty array when no posts', async () => {
    mockQuery.mockRejectedValue(new Error('API Error'));

    const groups = await getAllGroups();
    expect(groups).toEqual([]);
  });
});

describe('getTopTags', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T12:00:00Z'));
    process.env.NOTION_DATA_SOURCE_ID = 'test-source-id';
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

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

  it('should return empty array when no posts', async () => {
    mockQuery.mockRejectedValue(new Error('API Error'));

    const topTags = await getTopTags();
    expect(topTags).toEqual([]);
  });
});

describe('getPageContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return blocks for a page', async () => {
    mockBlocksList.mockResolvedValue({
      results: [
        { id: 'block1', type: 'paragraph', has_children: false },
        { id: 'block2', type: 'heading_1', has_children: false },
      ],
    });

    const blocks = await getPageContent('test-page-id');
    expect(blocks).toHaveLength(2);
    expect(blocks[0].id).toBe('block1');
  });

  it('should fetch children for table blocks', async () => {
    mockBlocksList
      .mockResolvedValueOnce({
        results: [
          { id: 'table1', type: 'table', has_children: true },
        ],
      })
      .mockResolvedValueOnce({
        results: [
          { id: 'row1', type: 'table_row' },
          { id: 'row2', type: 'table_row' },
        ],
      });

    const blocks = await getPageContent('test-page-id');
    expect(blocks).toHaveLength(1);
    expect(blocks[0].children).toHaveLength(2);
  });

  it('should return empty array on error', async () => {
    mockBlocksList.mockRejectedValue(new Error('API Error'));

    const blocks = await getPageContent('test-page-id');
    expect(blocks).toEqual([]);
  });
});

describe('getPostById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a post by id', async () => {
    mockRetrieve.mockResolvedValue({
      id: 'test-id',
      properties: {
        title: { type: 'title', title: [{ plain_text: 'Test Post' }] },
        published_date: { type: 'date', date: { start: '2025-01-01' } },
        tags: { type: 'multi_select', multi_select: [{ name: 'Tech' }] },
        language: { type: 'select', select: { name: 'KR' } },
      },
      last_edited_time: '2025-01-01T00:00:00Z',
    });

    const post = await getPostById('test-id');
    expect(post).not.toBeNull();
    expect(post!.title).toBe('Test Post');
  });

  it('should return null when page has no properties', async () => {
    mockRetrieve.mockResolvedValue({ id: 'test-id' }); // No properties

    const post = await getPostById('test-id');
    expect(post).toBeNull();
  });

  it('should return null on error', async () => {
    mockRetrieve.mockRejectedValue(new Error('Not Found'));

    const post = await getPostById('non-existent-id');
    expect(post).toBeNull();
  });
});

describe('incrementViewCount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should increment view count', async () => {
    mockRetrieve.mockResolvedValue({
      id: 'test-id',
      properties: {
        view_count: { type: 'number', number: 10 },
      },
    });
    mockUpdate.mockResolvedValue({});

    const newCount = await incrementViewCount('test-id');
    expect(newCount).toBe(11);
    expect(mockUpdate).toHaveBeenCalledWith({
      page_id: 'test-id',
      properties: {
        view_count: { number: 11 },
      },
    });
  });

  it('should handle null view count', async () => {
    mockRetrieve.mockResolvedValue({
      id: 'test-id',
      properties: {
        view_count: { type: 'number', number: null },
      },
    });
    mockUpdate.mockResolvedValue({});

    const newCount = await incrementViewCount('test-id');
    expect(newCount).toBe(1);
  });

  it('should return 0 when page has no properties', async () => {
    mockRetrieve.mockResolvedValue({ id: 'test-id' }); // No properties

    const newCount = await incrementViewCount('test-id');
    expect(newCount).toBe(0);
  });

  it('should return 0 on error', async () => {
    mockRetrieve.mockRejectedValue(new Error('API Error'));

    const newCount = await incrementViewCount('test-id');
    expect(newCount).toBe(0);
  });
});

