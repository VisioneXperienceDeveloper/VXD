import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { notion } from "../client";
import { Comment } from "../types/BlogComment";

export const fetchCommentsByPostId = async (dataSourceId: string, postId: string): Promise<Comment[]> => {
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

    const comments = response.results.map((page: any) => {
      const p = page as PageObjectResponse;
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
    console.error("[Comments] Failed to fetch comments:", error);
    return [];
  }
};

export const createNotionComment = async (dataSourceId: string, postId: string, comment: string): Promise<{ success: boolean; error?: string }> => {
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
    
    return { success: true };
  } catch (error) {
    console.error("[Comments] Failed to create comment:", error);
    return { success: false, error: 'Failed to submit comment. Please try again.' };
  }
};
