export const mockPosts = [
  {
    id: 'past-post',
    properties: {
      title: { type: 'title', title: [{ plain_text: 'Past Post' }] },
      published_date: { type: 'date', date: { start: '2024-12-31' } }, // Past
      tags: { type: 'multi_select', multi_select: [] },
      language: { type: 'select', select: { name: 'KR' } },
    },
    last_edited_time: '2024-12-31T00:00:00Z',
  },
  {
    id: 'future-post',
    properties: {
      title: { type: 'title', title: [{ plain_text: 'Future Post' }] },
      published_date: { type: 'date', date: { start: '2025-01-02' } }, // Future
      tags: { type: 'multi_select', multi_select: [] },
      language: { type: 'select', select: { name: 'KR' } },
    },
    last_edited_time: '2025-01-02T00:00:00Z',
  },
  {
    id: 'today-post',
    properties: {
      title: { type: 'title', title: [{ plain_text: 'Today Post' }] },
      published_date: { type: 'date', date: { start: '2025-01-01' } }, // Today
      tags: { type: 'multi_select', multi_select: [] },
      language: { type: 'select', select: { name: 'KR' } },
    },
    last_edited_time: '2025-01-01T00:00:00Z',
  },
  {
    id: 'tag-post',
    properties: {
      title: { type: 'title', title: [{ plain_text: 'Tag Post' }] },
      published_date: { type: 'date', date: { start: '2025-01-01' } },
      tags: { type: 'multi_select', multi_select: [{ name: 'Tech' }] },
      language: { type: 'select', select: { name: 'KR' } },
    },
    last_edited_time: '2025-01-01T00:00:00Z',
  },
  {
    id: 'no-tag-post',
    properties: {
      title: { type: 'title', title: [{ plain_text: 'No Tag Post' }] },
      published_date: { type: 'date', date: { start: '2025-01-01' } },
      tags: { type: 'multi_select', multi_select: [{ name: 'Life' }] },
      language: { type: 'select', select: { name: 'KR' } },
    },
    last_edited_time: '2025-01-01T00:00:00Z',
  },
  {
    id: 'group-post-1',
    properties: {
      title: { type: 'title', title: [{ plain_text: 'G1' }] },
      published_date: { type: 'date', date: { start: '2025-01-01' } },
      tags: { type: 'multi_select', multi_select: [] },
      group: { type: 'select', select: { name: 'Section A' } },
      language: { type: 'select', select: { name: 'KR' } },
    },
    last_edited_time: '2025-01-01T00:00:00Z',
  },
  {
    id: 'group-post-2',
    properties: {
      title: { type: 'title', title: [{ plain_text: 'G2' }] },
      published_date: { type: 'date', date: { start: '2025-01-01' } },
      tags: { type: 'multi_select', multi_select: [] },
      group: { type: 'select', select: { name: 'Section B' } },
      language: { type: 'select', select: { name: 'KR' } },
    },
    last_edited_time: '2025-01-01T00:00:00Z',
  },
];

export const mockBlogPosts = [
  { id: '1', title: 'A', date: '2025-01-01', group: 'Group 1', tags: [], slug: '1', cover: null, description: '', language: 'ko' },
  { id: '2', title: 'B', date: '2025-01-03', group: 'Group 1', tags: [], slug: '2', cover: null, description: '', language: 'ko' },
  { id: '3', title: 'C', date: '2025-01-02', group: 'Group 2', tags: [], slug: '3', cover: null, description: '', language: 'ko' },
];
