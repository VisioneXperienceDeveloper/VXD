import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const list = query({
  args: {
    paginationOpts: v.optional(paginationOptsValidator),
    language: v.optional(v.string()),
    tag: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let posts;
    if (args.language) {
      posts = await ctx.db
        .query("posts")
        .withIndex("by_language_date", (q) => q.eq("language", args.language!))
        .order("desc")
        .collect();
    } else {
      posts = await ctx.db.query("posts").withIndex("by_date").order("desc").collect();
    }

    // Filter by tag if provided (Manual filtering for now)
    if (args.tag) {
      posts = posts.filter((p) => p.tags.includes(args.tag!));
    }

    if (args.paginationOpts) {
      // For pagination with complex filters, Convex recommends Search Indexes or separate mapping tables.
      // For now, we'll provide a simple manual pagination for the filtered results.
      const start = parseInt(args.paginationOpts.cursor || "0");
      const end = start + args.paginationOpts.numItems;
      const page = posts.slice(start, end);
      return {
        page,
        isDone: end >= posts.length,
        continueCursor: end.toString(),
      };
    }

    return posts;
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const getById = query({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const incrementView = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (!post) throw new Error("Post not found");
    await ctx.db.patch(args.id, { viewCount: post.viewCount + 1 });
  },
});
