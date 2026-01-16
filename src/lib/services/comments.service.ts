import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { unstable_cache } from 'next/cache';

import { notion } from "../notion";
import { Comment } from "../types";

export const getCommentsDataSourceId = () => {
  const dataSourceId = process.env.NOTION_COMMENTS_DATA_SOURCE_ID;
  console.log('[Comments] Checking NOTION_COMMENTS_DATA_SOURCE_ID:', dataSourceId ? `Found: ${dataSourceId}` : 'NOT FOUND');
  if (!dataSourceId) {
      throw new Error("NOTION_COMMENTS_DATA_SOURCE_ID is not set in environment variables");
  }
  return dataSourceId;
}

const getCachedComments = unstable_cache(async (postId: string): Promise<Comment[]> => {
  const dataSourceId = getCommentsDataSourceId();
  
  try {
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        property: 'post_id',
        relation: {
          contains: postId
        }
      },
      sorts: [
        {
          timestamp: 'created_time',
          direction: 'descending'
        }
      ]
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const comments = response.results.map((page: PageObjectResponse | any) => {
      const p = page as PageObjectResponse;

      console.log('[Comments] Fetched comments:', p.properties.comment);
      
      // Read from title property instead of comment rich_text
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const comment = (p.properties.comment as any)?.title?.[0]?.plain_text || '';
      const createdTime = p.created_time;
      return {
        id: p.id,
        comment,
        createdTime,
        postId
      };
    });

    return comments;
  } catch (error) {
    console.error("[Comments] Failed to fetch comments:", {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorType: error?.constructor?.name,
      postId,
      dataSourceId
    });
    return [];
  }
}, ['comments'], { revalidate: 60 }); // Cache for 1 minute

export const getCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  return getCachedComments(postId);
};

export const createComment = async (postId: string, comment: string): Promise<{ success: boolean; error?: string }> => {
  const dataSourceId = getCommentsDataSourceId();
  
  // Validation
  if (!comment || comment.trim().length < 1) {
    return { success: false, error: 'Comment cannot be empty' };
  }
  
  if (comment.length > 1000) {
    return { success: false, error: 'Comment must be less than 1000 characters' };
  }
  
  // Check for URLs (simple regex)
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  if (urlPattern.test(comment)) {
    return { success: false, error: 'URLs are not allowed in comments' };
  }
  
  try {
    await notion.pages.create({
      parent: {
        data_source_id: dataSourceId
      },
      properties: {
        title: {
          title: [
            {
              text: {
                content: comment
              }
            }
          ]
        },
        post_id: {
          relation: [
            {
              id: postId
            }
          ]
        },
        status: {
          select: {
            name: 'approved'
          }
        }
      }
    });
    
    console.log('[Comments] Comment created successfully');
    return { success: true };
  } catch (error) {
    console.error("[Comments] Failed to create comment:", {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorType: error?.constructor?.name,
      postId,
      dataSourceId,
      commentLength: comment.length
    });
    return { success: false, error: 'Failed to submit comment. Please try again.' };
  }
};
