'use server';

import { getPublishedPosts } from '@/entities/lib/services';
import { BlogPost } from '@/entities/lib/types';

const POSTS_PER_PAGE = 6;

export async function fetchPosts({
  page = 1,
  tag,
  search,
  group,
  locale = 'ko',
}: {
  page?: number;
  tag?: string;
  search?: string;
  group?: string;
  locale?: string;
}): Promise<{ posts: BlogPost[]; hasMore: boolean }> {
  const allPosts = await getPublishedPosts({ tag, searchQuery: search, group, locale });
  
  if (!allPosts) {
    return { posts: [], hasMore: false };
  }

  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;
  const paginatedPosts = allPosts.slice(start, end);
  const hasMore = end < allPosts.length;

  return {
    posts: paginatedPosts,
    hasMore,
  };
}
