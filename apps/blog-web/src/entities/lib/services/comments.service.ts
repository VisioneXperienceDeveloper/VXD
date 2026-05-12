import { unstable_cache } from 'next/cache';
import { 
  fetchCommentsByPostId, 
  createNotionComment,
  Comment 
} from "@vxd/notion-client";

export const getCommentsDataSourceId = () => {
  const dataSourceId = process.env.NOTION_COMMENTS_DATA_SOURCE_ID;
  if (!dataSourceId) {
    throw new Error("NOTION_COMMENTS_DATA_SOURCE_ID is not set in environment variables");
  }
  return dataSourceId;
}

const getCachedComments = unstable_cache(async (postId: string): Promise<Comment[]> => {
  const dataSourceId = getCommentsDataSourceId();
  return fetchCommentsByPostId(dataSourceId, postId);
}, ['comments'], { revalidate: 60 });

export const getCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  return getCachedComments(postId);
};

export const createComment = async (postId: string, comment: string): Promise<{ success: boolean; error?: string }> => {
  const dataSourceId = getCommentsDataSourceId();
  
  if (!comment || comment.trim().length < 1) {
    return { success: false, error: 'Comment cannot be empty' };
  }
  if (comment.length > 1000) {
    return { success: false, error: 'Comment must be less than 1000 characters' };
  }
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  if (urlPattern.test(comment)) {
    return { success: false, error: 'URLs are not allowed in comments' };
  }
  
  return createNotionComment(dataSourceId, postId, comment);
};
