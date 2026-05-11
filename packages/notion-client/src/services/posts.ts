import { BlockObjectResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { notion } from "../client";
import { BlogPost } from "../types/BlogPost";
import { extractBlogPostFromPage, getNumberValue } from "./helper";

export const fetchAllPosts = async (dataSourceId: string): Promise<BlogPost[] | null> => {
  let response;
  try {
    response = await (notion as any).dataSources.query({
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
    .filter((page: any): page is PageObjectResponse => 'properties' in page)
    .map((page: PageObjectResponse) => extractBlogPostFromPage(page));

  const postsMap = new Map<string, BlogPost>();
  posts.forEach((p: BlogPost) => postsMap.set(p.id, p));

  posts.forEach((post: BlogPost) => {
    if (!post.cover && post.translationId) {
      const translatedPost = postsMap.get(post.translationId);
      if (translatedPost?.cover) {
        post.cover = translatedPost.cover;
      }
    }
  });

  return posts;
};

export const fetchPageContent = async (pageId: string) => {
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
    });
    
    const blocks = response.results as BlockObjectResponse[];
    
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
};

export const fetchPostById = async (pageId: string): Promise<BlogPost | null> => {
  try {
    const response = await notion.pages.retrieve({ page_id: pageId });
    
    if (!('properties' in response)) {
      return null;
    }
    
    return extractBlogPostFromPage(response as PageObjectResponse);
  } catch {
    return null;
  }
};

export async function incrementPostViewCount(pageId: string): Promise<number> {
  try {
    const response = await notion.pages.retrieve({ page_id: pageId });
    
    if (!('properties' in response)) {
      return 0;
    }
    
    const currentCount = getNumberValue(response.properties.view_count);
    const newCount = currentCount + 1;
    
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
