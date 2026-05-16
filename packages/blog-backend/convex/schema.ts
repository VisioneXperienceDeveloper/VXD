import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
    title: v.string(),
    slug: v.string(),
    date: v.string(), // ISO string or formatted date
    tags: v.array(v.string()),
    group: v.optional(v.string()),
    language: v.string(), // 'KR' | 'EN'
    viewCount: v.number(),
    commentCount: v.number(),
    description: v.optional(v.string()),
    cover: v.optional(v.string()),
    part: v.optional(v.string()),
    content: v.any(), // Array of Notion-style blocks
    notionId: v.optional(v.string()), // To track original notion page
  })
    .index("by_slug", ["slug"])
    .index("by_date", ["date"])
    .index("by_language_date", ["language", "date"]),

  comments: defineTable({
    postId: v.id("posts"),
    author: v.string(),
    content: v.string(),
    createdAt: v.number(), // timestamp
  }).index("by_post", ["postId"]),
});
