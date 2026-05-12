import { BlogPost } from '@/entities/lib/types';

/**
 * Mock blog posts for sorting tests
 */
export const mockSortingPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Oldest Post',
    slug: 'oldest-post',
    date: '2024-01-01',
    tags: ['Tech'],
    language: 'KR',
    group: 'Group A',
    viewCount: 100,
    commentCount: 5,
    cover: null,
    description: 'Description 1'
  },
  {
    id: '2',
    title: 'Middle Post',
    slug: 'middle-post',
    date: '2024-06-15',
    tags: ['Life'],
    language: 'KR',
    group: 'Group A',
    viewCount: 250,
    commentCount: 10,
    cover: null,
    description: 'Description 2'
  },
  {
    id: '3',
    title: 'Newest Post',
    slug: 'newest-post',
    date: '2024-12-31',
    tags: ['Tech', 'Tutorial'],
    language: 'KR',
    group: 'Group B',
    viewCount: 50,
    commentCount: 15,
    cover: null,
    description: 'Description 3'
  },
  {
    id: '4',
    title: 'High Views Post',
    slug: 'high-views',
    date: '2024-03-20',
    tags: ['Tech'],
    language: 'KR',
    group: 'Group A',
    viewCount: 1000,
    commentCount: 3,
    cover: null,
    description: 'Description 4'
  },
  {
    id: '5',
    title: 'Most Comments Post',
    slug: 'most-comments',
    date: '2024-08-10',
    tags: ['Discussion'],
    language: 'KR',
    group: 'Group B',
    viewCount: 150,
    commentCount: 50,
    cover: null,
    description: 'Description 5'
  },
  {
    id: '6',
    title: 'Zero Engagement',
    slug: 'zero-engagement',
    date: '2024-05-05',
    tags: ['Tech'],
    language: 'KR',
    group: 'Group C',
    viewCount: 0,
    commentCount: 0,
    cover: null,
    description: 'Description 6'
  },
];
