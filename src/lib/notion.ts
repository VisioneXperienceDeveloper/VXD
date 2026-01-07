import { Client } from "@notionhq/client";
import { BlockObjectResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { unstable_cache } from 'next/cache';

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const getDataSourceId = () => {
  const dataSourceId = process.env.NOTION_DATA_SOURCE_ID;
  if (!dataSourceId) {
      throw new Error("NOTION_DATA_SOURCE_ID is not set in environment variables");
  }
  return dataSourceId;
}

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  date: string;
  tags: string[];
  cover: string | null;
  description: string;
  group?: string;
  part?: string;
  language?: string;
  translationId?: string | null;
  viewCount?: number;
};

// Type-safe property extraction helpers
type NotionPropertyValue = PageObjectResponse['properties'][string];

function getSelectValue(property: NotionPropertyValue | undefined): string | undefined {
  if (property?.type === 'select' && property.select) {
    return property.select.name;
  }
  return undefined;
}

function getRichTextValue(property: NotionPropertyValue | undefined): string | undefined {
  if (property?.type === 'rich_text' && property.rich_text.length > 0) {
    return property.rich_text[0].plain_text;
  }
  return undefined;
}

function getRelationFirstId(property: NotionPropertyValue | undefined): string | null {
  if (property?.type === 'relation' && property.relation.length > 0) {
    return property.relation[0].id;
  }
  return null;
}

function getPartValue(property: NotionPropertyValue | undefined): string | undefined {
  // Part can be either select or rich_text depending on Notion setup
  return getSelectValue(property) || getRichTextValue(property);
}

function getNumberValue(property: NotionPropertyValue | undefined): number {
  if (property?.type === 'number' && property.number !== null) {
    return property.number;
  }
  return 0;
}

function extractBlogPostFromPage(p: PageObjectResponse): BlogPost {
  const title = p.properties.title?.type === 'title' 
    ? p.properties.title.title[0]?.plain_text ?? 'Untitled' 
    : 'Untitled';

  const dateProperty = p.properties.published_date?.type === 'date' 
    ? p.properties.published_date.date?.start 
    : null;
  const date = dateProperty ?? p.last_edited_time ?? '';

  const tags = p.properties.tags?.type === 'multi_select' 
    ? p.properties.tags.multi_select.map(tag => tag.name) 
    : [];

  const groupName = getSelectValue(p.properties.group);
  const part = getPartValue(p.properties.part);
  const language = getSelectValue(p.properties.language) || 'ko';
  const translationId = getRelationFirstId(p.properties.translation);
  const viewCount = getNumberValue(p.properties.view_count);

  let cover: string | null = null;
  if (p.cover?.type === 'external') {
    cover = p.cover.external.url;
  } else if (p.cover?.type === 'file') {
    cover = p.cover.file.url;
  }

  return {
    id: p.id,
    slug: p.id,
    title,
    date,
    tags,
    group: groupName,
    part,
    cover,
    description: '',
    language,
    translationId,
    viewCount,
  };
}

const getCachedAllPosts = unstable_cache(async (): Promise<BlogPost[] | null> => {
  const dataSourceId = getDataSourceId();
  
  let response;
  try {
    response = await notion.dataSources.query({
      data_source_id: dataSourceId,
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
}, ['all-posts'], { revalidate: 3600 });

export const getPublishedPosts = async (tag?: string, searchQuery?: string, group?: string, locale: string = 'ko'): Promise<BlogPost[] | null> => {
  const posts = await getCachedAllPosts();
  if (!posts) return null;

  const now = new Date();

  return posts
    .filter(post => {
      // Filter out future posts
      if (post.date && new Date(post.date) > now) return false;

      // Filter by locale (Language property)
      // Map 'en' locale to 'EN' property value, 'ko' to 'KR' (or whatever is used in Notion)
      // Assuming Notion uses 'KR' and 'EN' as select options
      const targetLang = locale === 'ko' ? 'KR' : 'EN';
      if (post.language && post.language !== targetLang) return false;
      
      // Filter by tag if provided
      if (tag && !post.tags.includes(tag)) return false;
  
      // Filter by search query if provided
      if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
  
      // Filter by group if provided
      if (group && post.group !== group) return false;
      
      return true;
    })
    .map(post => ({
      ...post,
      date: new Date(post.date).toLocaleDateString(), // Format date for display
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
}, ['page-content'], { revalidate: 3600 });

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
}, ['post-by-id'], { revalidate: 3600 });

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

