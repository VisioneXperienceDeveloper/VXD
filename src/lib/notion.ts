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
};

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const posts = await Promise.all(response.results.map(async (page: PageObjectResponse | any) => {
    const p = page as PageObjectResponse;
    
    // Extract properties safely based on actual available properties
    // Available: tags, type, title, published_date, group
    const title = p.properties.title?.type === 'title' ? p.properties.title.title[0]?.plain_text ?? 'Untitled' : 'Untitled';
    
    // Legacy translation support (optional, can be removed if fully migrated)
    // if (locale !== 'ko') {
    //   title = await translateText(title, locale);
    // }

    const dateProperty = p.properties.published_date?.type === 'date' ? p.properties.published_date.date?.start : null;
    const lastEditedTime = p.last_edited_time;
    const date = dateProperty ?? lastEditedTime ?? ''; 
    
    const tags = p.properties.tags?.type === 'multi_select' ? p.properties.tags.multi_select.map(tag => tag.name) : [];
    const groupName = p.properties.group?.type === 'select' ? p.properties.group.select?.name : undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const part = (p.properties.part as any)?.select?.name || (p.properties.part as any)?.rich_text?.[0]?.plain_text;
    const description = ''; // No description property
    
    // Extract new i18n properties
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const language = (p.properties.language as any)?.select?.name || 'ko'; // Default to 'ko' if missing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const translationId = (p.properties.translation as any)?.relation?.[0]?.id || null;

    // Extract cover
    let cover = null;
    if (p.cover?.type === 'external') {
      cover = p.cover.external.url;
    } else if (p.cover?.type === 'file') {
      cover = p.cover.file.url;
    }

    return {
      id: p.id,
      slug: p.id, // Use ID as slug
      title,
      date: date, // Keep raw date string for filtering
      tags,
      group: groupName,
      part,
      cover,
      description,
      language,
      translationId,
    };
  }));

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
  const response = await notion.blocks.children.list({
    block_id: pageId,
  });
  
  const blocks = response.results as BlockObjectResponse[];
  
  // Legacy translation support (optional)
  // if (locale === 'ko') return blocks;
  // return Promise.all(blocks.map(block => translateBlock(block, locale)));
  
  return blocks;
}, ['page-content'], { revalidate: 3600 });

export const getPostById = unstable_cache(async (pageId: string): Promise<BlogPost | null> => {
  try {
    const response = await notion.pages.retrieve({ page_id: pageId });
    const p = response as PageObjectResponse;

    const title = p.properties.title?.type === 'title' ? p.properties.title.title[0]?.plain_text ?? 'Untitled' : 'Untitled';
    
    // Legacy translation support (optional)
    // if (locale !== 'ko') {
    //   title = await translateText(title, locale);
    // }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const date = (p as any).last_edited_time ?? '';
    const tags = p.properties.tags?.type === 'multi_select' ? p.properties.tags.multi_select.map(tag => tag.name) : [];
    const group = p.properties.group?.type === 'select' ? p.properties.group.select?.name : undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const part = (p.properties.part as any)?.select?.name || (p.properties.part as any)?.rich_text?.[0]?.plain_text;
    const description = '';
    
    // Extract new i18n properties
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const language = (p.properties.language as any)?.select?.name || 'ko';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const translationId = (p.properties.translation as any)?.relation?.[0]?.id || null;

    let cover = null;
    if (p.cover?.type === 'external') {
      cover = p.cover.external.url;
    } else if (p.cover?.type === 'file') {
      cover = p.cover.file.url;
    }

    return {
      id: p.id,
      slug: p.id,
      title,
      date: new Date(date).toLocaleDateString(),
      tags,
      group,
      part,
      cover,
      description,
      language,
      translationId,
    };
  } catch {
    return null;
  }
}, ['post-by-id'], { revalidate: 3600 });
