import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByPostId = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .order("desc")
      .collect();
  },
});

export const add = mutation({
  args: {
    postId: v.id("posts"),
    author: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("comments", {
      postId: args.postId,
      author: args.author,
      content: args.content,
      createdAt: Date.now(),
    });

    // Update comment count on post
    const post = await ctx.db.get(args.postId);
    if (post) {
      await ctx.db.patch(args.postId, {
        commentCount: (post.commentCount || 0) + 1,
      });
    }
  },
});
