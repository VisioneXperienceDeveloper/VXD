import { unstable_cache } from 'next/cache';
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { Comment } from "../types";

// Comment type moved to ../types/blog.ts

const getCachedComments = unstable_cache(async (postId: string): Promise<Comment[]> => {
  try {
    const comments = await fetchQuery(api.comments.getByPostId, { postId: postId as Id<"posts"> });
    return comments.map(c => ({ ...c, _id: c._id }));
  } catch (error) {
    console.error("Failed to fetch comments from Convex:", error);
    return [];
  }
}, ['comments'], { revalidate: 60 });

export const getCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  return getCachedComments(postId);
};

export const createComment = async (postId: string, comment: string): Promise<{ success: boolean; error?: string }> => {
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
  
  try {
    await fetchMutation(api.comments.add, { 
      postId: postId as Id<"posts">, 
      author: "Anonymous", // Default for now
      content: comment 
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to create comment in Convex:", error);
    return { success: false, error: "Failed to post comment" };
  }
};
