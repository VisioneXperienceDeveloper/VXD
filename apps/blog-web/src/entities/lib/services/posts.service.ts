import { unstable_cache } from 'next/cache';
import { 
  fetchAllPosts, 
  fetchPageContent, 
  fetchPostById, 
  incrementPostViewCount,
  BlogPost,
  SortOption,
  SortDirection
} from "@vxd/notion-client";

export const revalidate = 1 * 60 * 60; // Revalidate every 1 hour

export const getPostsDataSourceId = () => {
  const dataSourceId = process.env.NOTION_POSTS_DATA_SOURCE_ID;
  if (!dataSourceId) {
    throw new Error("NOTION_POSTS_DATA_SOURCE_ID is not set in environment variables");
  }
  return dataSourceId;
}

const getCachedAllPosts = unstable_cache(async (): Promise<BlogPost[] | null> => {
  const dataSourceId = getPostsDataSourceId();
  return fetchAllPosts(dataSourceId);
}, ['all-posts'], { revalidate });

export interface GetPublishedPostsOptions {
  tag?: string;
  tags?: string[];
  searchQuery?: string;
  group?: string;
  locale?: string;
  sortBy?: SortOption;
  sortDirection?: SortDirection;
}

export const getPublishedPosts = async (options: GetPublishedPostsOptions = {}): Promise<BlogPost[] | null> => {
  const { 
    tag, 
    tags,
    searchQuery, 
    group, 
    locale = 'ko',
    sortBy = 'published_date',
    sortDirection = 'desc'
  } = options;
  const posts = await getCachedAllPosts();
  if (!posts) return null;

  const now = new Date();
  const selectedTags = tags || (tag ? [tag] : []);

  const filteredPosts = posts.filter(post => {
    if (post.date && new Date(post.date) > now) return false;
    if (post.language) {
      if (locale === 'ko') {
        if (post.language !== 'KR') return false;
      } else {
        if (post.language !== 'EN') return false;
      }
    }
    if (selectedTags.length > 0) {
      const hasAllTags = selectedTags.every(selectedTag => 
        post.tags.includes(selectedTag)
      );
      if (!hasAllTags) return false;
    }
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (group && post.group !== group) return false;
    return true;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
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

export const getPageContent = unstable_cache(async (pageId: string) => {
  return fetchPageContent(pageId);
}, ['page-content'], { revalidate });

export const getPostById = unstable_cache(async (pageId: string): Promise<BlogPost | null> => {
  const post = await fetchPostById(pageId);
  if (!post) return null;
  return {
    ...post,
    date: new Date(post.date).toLocaleDateString(),
  };
}, ['post-by-id'], { revalidate });

export const getPostBySlug = unstable_cache(async (slug: string): Promise<BlogPost | null> => {
  const posts = await getCachedAllPosts();
  if (!posts) return null;
  const decodedSlug = decodeURIComponent(slug);
  const post = posts.find(p => p.slug === decodedSlug || p.slug === slug);
  if (!post) return null;
  return {
    ...post,
    date: new Date(post.date).toLocaleDateString(),
  };
}, ['post-by-slug'], { revalidate });

export async function incrementViewCount(pageId: string): Promise<number> {
  return incrementPostViewCount(pageId);
}
