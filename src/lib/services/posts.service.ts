import { BlockObjectResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { unstable_cache } from 'next/cache';

import { notion } from "../notion";
import { BlogPost, SortOption, SortDirection } from "../types";
import { getNumberValue, extractBlogPostFromPage } from "./posts.helper";

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
  
  let response;
  try {
    response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        property: "published_date",
        date: {
          before: new Date().toISOString(),
        },
      },
      sorts: [
        {
          timestamp: "created_time",
          direction: "descending",
        },
      ],
    });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return null;
  }

  const posts = response.results
    .filter((page): page is PageObjectResponse => 'properties' in page)
    .map(extractBlogPostFromPage);

  return posts;
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

  // Normalize tags: support both single tag and multiple tags for backward compatibility
  const selectedTags = tags || (tag ? [tag] : []);

  // Filter posts
  const filteredPosts = posts.filter(post => {
    // Filter out future posts
    if (post.date && new Date(post.date) > now) return false;

    // Filter by locale (Language property)
    // Map 'en' locale to 'EN' property value, 'ko' to 'KR' (or whatever is used in Notion)
    // Assuming Notion uses 'KR' and 'EN' as select options
    if (post.language) {
      if (locale === 'ko') {
        // For Korean locale, accept 'KR', etc.
        if (post.language !== 'KR') return false;
      } else {
        // For English locale, strictly check for 'EN'
        if (post.language !== 'EN') return false;
      }
    }
    
    // Filter by tags (multi-tag AND filtering)
    if (selectedTags.length > 0) {
      const hasAllTags = selectedTags.every(selectedTag => 
        post.tags.includes(selectedTag)
      );
      if (!hasAllTags) return false;
    }

    // Filter by search query if provided
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;

    // Filter by group if provided
    if (group && post.group !== group) return false;
    
    return true;
  });

  // Sort posts
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

  // Format dates
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
  
  // Sort posts within each group by date (descending)
  // Note: getPublishedPosts already returns sorted posts if the API sort works, 
  // but let's ensure it here as per requirement "get order by published date"
  Object.keys(grouped).forEach(key => {
    grouped[key].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });
  
  return grouped;
};

export const getPageContent = unstable_cache(async (pageId: string) => {
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
    });
    
    const blocks = response.results as BlockObjectResponse[];
    
    // Fetch children for blocks that have them (e.g., tables)
    const blocksWithChildren = await Promise.all(
      blocks.map(async (block) => {
        if (block.has_children && block.type === 'table') {
          const childrenResponse = await notion.blocks.children.list({
            block_id: block.id,
          });
          return {
            ...block,
            children: childrenResponse.results,
          };
        }
        return block;
      })
    );
  
    return blocksWithChildren;
  } catch (error) {
    console.error("Failed to fetch page content:", error);
    return [];
  }
}, ['page-content'], { revalidate });

export const getPostById = unstable_cache(async (pageId: string): Promise<BlogPost | null> => {
  try {
    const response = await notion.pages.retrieve({ page_id: pageId });
    
    if (!('properties' in response)) {
      return null;
    }
    
    const post = extractBlogPostFromPage(response as PageObjectResponse);
    
    // Format date for display (extractBlogPostFromPage keeps raw date)
    return {
      ...post,
      date: new Date(post.date).toLocaleDateString(),
    };
  } catch {
    return null;
  }
}, ['post-by-id'], { revalidate });

export const getPostBySlug = unstable_cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const posts = await getCachedAllPosts();
    if (!posts) return null;
    
    // Decoded slug for comparison because URL params might be encoded (though Next.js usually decodes, explicit decoding is safer)
    const decodedSlug = decodeURIComponent(slug);
    
    const post = posts.find(p => p.slug === decodedSlug || p.slug === slug);
    if (!post) return null;
    
    // Format date for display
    return {
      ...post,
      date: new Date(post.date).toLocaleDateString(),
    };
  } catch {
    return null;
  }
}, ['post-by-slug'], { revalidate });

// Increment view count for a post (no caching, direct update)
export async function incrementViewCount(pageId: string): Promise<number> {
  try {
    // First, get the current view count
    const response = await notion.pages.retrieve({ page_id: pageId });
    
    if (!('properties' in response)) {
      return 0;
    }
    
    const currentCount = getNumberValue(response.properties.view_count);
    const newCount = currentCount + 1;
    
    // Update the page with incremented view count
    await notion.pages.update({
      page_id: pageId,
      properties: {
        view_count: {
          number: newCount
        }
      }
    });
    
    return newCount;
  } catch (error) {
    console.error('Failed to increment view count:', error);
    return 0;
  }
}

