import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { Client } from "@notionhq/client";

export const run = action({
  args: {
    notionToken: v.optional(v.string()),
    databaseId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const token = args.notionToken || process.env.NOTION_TOKEN;
    const dbId = args.databaseId || process.env.NOTION_POSTS_DATA_SOURCE_ID;

    if (!token || !dbId) {
      throw new Error("Missing NOTION_TOKEN or NOTION_POSTS_DATA_SOURCE_ID");
    }

    const notion = new Client({ auth: token });

    // 1. Fetch posts from Notion
    // Note: Notion's dataSources.query is a bit different from standard databases.query
    // But based on the code I saw, it's using dataSources.query
    const response = await (notion as any).dataSources.query({
      data_source_id: dbId,
      filter: {
        property: "published_date",
        date: {
          before: new Date().toISOString(),
        },
      },
    });

    console.log(`Found ${response.results.length} posts in Notion`);

    for (const page of response.results) {
      if (!("properties" in page)) continue;

      const props = page.properties;
      
      // Extract properties (simplified version of extractBlogPostFromPage)
      // I'll need to handle the specific property mapping here
      const title = props.title?.title?.[0]?.plain_text || "Untitled";
      const slug = props.slug?.rich_text?.[0]?.plain_text || "";
      const date = props.published_date?.date?.start || new Date().toISOString();
      const tags = props.tags?.multi_select?.map((t: any) => t.name) || [];
      const group = props.group?.select?.name;
      const language = props.language?.select?.name === "KR" ? "KR" : "EN";
      const viewCount = props.view_count?.number || 0;
      const description = props.description?.rich_text?.[0]?.plain_text || "";
      const cover = page.cover?.type === "external" ? page.cover.external.url : page.cover?.file?.url;
      const part = props.part?.select?.name || "";

      // 2. Fetch page content (blocks)
      const blocksResponse = await notion.blocks.children.list({
        block_id: page.id,
      });
      const content = blocksResponse.results;

      // 3. Save to Convex
      await ctx.runMutation(internal.migration.insertPost, {
        title,
        slug,
        date,
        tags,
        group,
        language,
        viewCount,
        commentCount: 0,
        description,
        cover,
        part,
        content,
        notionId: page.id,
      });

      console.log(`Migrated: ${title}`);
    }

    return "Migration completed";
  },
});

// Internal mutation to insert post without being exposed to client
import { internalMutation } from "./_generated/server";
export const insertPost = internalMutation({
  args: {
    title: v.string(),
    slug: v.string(),
    date: v.string(),
    tags: v.array(v.string()),
    group: v.optional(v.string()),
    language: v.string(),
    viewCount: v.number(),
    commentCount: v.number(),
    description: v.optional(v.string()),
    cover: v.optional(v.string()),
    part: v.optional(v.string()),
    content: v.any(),
    notionId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if post already exists by notionId to avoid duplicates
    const existing = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("notionId"), args.notionId))
      .unique();

    if (existing) {
      return await ctx.db.replace(existing._id, args);
    }

    return await ctx.db.insert("posts", args);
  },
});
