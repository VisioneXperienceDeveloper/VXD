import { unstable_cache } from 'next/cache';
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "@convex/_generated/api";
import { Doc, Id } from "@convex/_generated/dataModel";
import { BlogPost, Block } from "../types";

// Types moved to ../types/blog.ts

export const revalidate = 1 * 60 * 60; // Revalidate every 1 hour

const getCachedAllPosts = unstable_cache(async (language?: string, tag?: string): Promise<BlogPost[] | null> => {
  try {
    console.log(`Fetching all posts for language: ${language}, tag: ${tag}`);
    const result = await fetchQuery(api.posts.list, { language, tag });
    const posts = Array.isArray(result) ? result : result.page;
    return posts.map((p: Doc<"posts">) => ({ ...p, id: p._id }));
  } catch (error: unknown) {
    const err = error as { message?: string; stack?: string; data?: unknown };
    console.error("CRITICAL ERROR: Failed to fetch posts from Convex:", {
      message: err?.message || "No error message provided",
      stack: err?.stack,
      data: err?.data
    });
    return null;
  }
}, ['all-posts'], { revalidate });

export interface GetPublishedPostsOptions {
  tag?: string;
  tags?: string[];
  searchQuery?: string;
  group?: string;
  locale?: string;
  sortBy?: 'published_date' | 'view_count' | 'comment_count';
  sortDirection?: 'asc' | 'desc';
  numItems?: number;
  cursor?: string | null;
}

export interface PaginatedPosts {
  posts: BlogPost[];
  isDone: boolean;
  continueCursor: string;
}

export const getPublishedPosts = async (options: GetPublishedPostsOptions = {}): Promise<BlogPost[] | null> => {
  const { 
    tag, 
    tags,
    locale = 'ko',
    sortBy = 'published_date',
    sortDirection = 'desc'
  } = options;
  
  const language = locale === 'ko' ? 'KR' : 'EN';
  // Use either singular tag or first of plural tags
  const selectedTag = tag || (tags && tags.length > 0 ? tags[0] : undefined);
  
  // Use a composite cache key to avoid collisions
  const cacheKey = `all-posts-${language}-${selectedTag || 'all'}`;
  const posts = await unstable_cache(
    () => getCachedAllPosts(language, selectedTag),
    [cacheKey],
    { revalidate }
  )();
  
  if (!posts) return null;

  // Sorting logic (if not fully handled by Convex)
  const sortedPosts = [...posts].sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;
    switch (sortBy) {
      case 'published_date':
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
        break;
      case 'view_count':
        aValue = a.viewCount || 0;
        bValue = b.viewCount || 0;
        break;
      case 'comment_count':
        aValue = a.commentCount || 0;
        bValue = b.commentCount || 0;
        break;
      default:
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
    }
    const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    return sortDirection === 'desc' ? -comparison : comparison;
  });

  return sortedPosts.map(post => ({
    ...post,
    date: new Date(post.date).toLocaleDateString(),
  }));
};

export const getPaginatedPosts = async (options: GetPublishedPostsOptions = {}): Promise<PaginatedPosts | null> => {
  const { 
    locale = 'ko',
    numItems = 10,
    cursor = null,
    tag
  } = options;
  
  const language = locale === 'ko' ? 'KR' : 'EN';
  
  try {
    const result = await fetchQuery(api.posts.list, { 
      language, 
      tag,
      paginationOpts: {
        numItems,
        cursor,
      }
    });

    if (Array.isArray(result)) {
      return {
        posts: result.map((p: Doc<"posts">) => ({ 
          ...p, 
          id: p._id,
          date: new Date(p.date).toLocaleDateString(),
        })),
        isDone: true,
        continueCursor: '',
      };
    }

    return {
      posts: result.page.map((p: Doc<"posts">) => ({ 
        ...p, 
        id: p._id,
        date: new Date(p.date).toLocaleDateString(),
      })),
      isDone: result.isDone,
      continueCursor: result.continueCursor,
    };
  } catch (error) {
    console.error("Failed to fetch paginated posts from Convex:", error);
    return null;
  }
};

export const getAllTags = async (): Promise<string[]> => {
  const posts = await getPublishedPosts();
  if (!posts) return [];
  const tags = new Set<string>();
  posts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags);
};

export const getAllGroups = async (): Promise<string[]> => {
  const posts = await getPublishedPosts();
  if (!posts) return [];
  const groups = new Set<string>();
  posts.forEach(post => {
    if (post.group) {
      groups.add(post.group);
    }
  });
  return Array.from(groups).sort();
};

export const getTopTags = async (): Promise<string[]> => {
  const posts = await getPublishedPosts();
  if (!posts) return [];
  const tagCounts: Record<string, number> = {};
  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  return Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag]) => tag);
};

export const groupPosts = (posts: BlogPost[]): Record<string, BlogPost[]> => {
  const grouped: Record<string, BlogPost[]> = {};
  posts.forEach(post => {
    const groupName = post.group || 'Other';
    if (!grouped[groupName]) {
      grouped[groupName] = [];
    }
    grouped[groupName].push(post);
  });
  Object.keys(grouped).forEach(key => {
    grouped[key].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });
  return grouped;
};

export const getPageContent = unstable_cache(async (pageId: string): Promise<Block[]> => {
  try {
    const post = await fetchQuery(api.posts.getById, { id: pageId as Id<"posts"> });
    return (post?.content as Block[]) || [];
  } catch (error) {
    console.error(`Failed to fetch page content for ${pageId}:`, error);
    return [];
  }
}, ['page-content'], { revalidate });

export const getPostById = unstable_cache(async (pageId: string): Promise<BlogPost | null> => {
  try {
    const post = await fetchQuery(api.posts.getById, { id: pageId as Id<"posts"> });
  if (!post) return null;
    return {
      ...post,
      id: post._id,
      date: new Date(post.date).toLocaleDateString(),
    };
  } catch (error) {
    console.error(`Failed to fetch post by ID ${pageId}:`, error);
    return null;
  }
}, ['post-by-id'], { revalidate });

export const getPostBySlug = unstable_cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const post = await fetchQuery(api.posts.getBySlug, { slug });
  if (!post) return null;
    return {
      ...post,
      id: post._id,
      date: new Date(post.date).toLocaleDateString(),
    };
  } catch (error) {
    console.error(`Failed to fetch post by slug ${slug}:`, error);
    return null;
  }
}, ['post-by-slug'], { revalidate });

export async function incrementViewCount(pageId: string): Promise<void> {
  try {
    await fetchMutation(api.posts.incrementView, { id: pageId as Id<"posts"> });
  } catch (error) {
    console.error('Failed to increment view count in Convex:', error);
  }
}
