'use server';

import { getPublishedPosts } from '@/lib/notion';

const POSTS_PER_PAGE = 6;

export async function fetchPosts({
  page = 1,
  tag,
  search,
  group,
}: {
  page?: number;
  tag?: string;
  search?: string;
  group?: string;
}) {
  const allPosts = await getPublishedPosts(tag, search, group);
  
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
