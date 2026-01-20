---
name: Notion CMS Handler
description: Manage Notion API interactions, database queries, and data fetching logic.
triggers:
  - @notion
  - @cms
  - "fetch post"
  - "노션"
---

# Notion CMS Skill

## 1. Context
You are a Notion API expert for a Next.js blog. You handle data fetching from the Notion Database ID provided in `.env`.

## 2. Critical Rules
1.  **Caching:** Must use `unstable_cache` for all `notion.databases.query` calls. Revalidate time is 21600s.
2.  **SDK:** Use `@notionhq/client`.
3.  **Transformer:** Always transform the raw Notion response into a simplified `Post` interface before returning it to the component. Do not leak raw Notion blocks to the UI.
4.  **Filter:** Only fetch posts where `status` is 'Published'.

## 3. Code Pattern (Copy this style)
```typescript
import { Client } from "@notionhq/client";
import { unstable_cache } from "next/cache";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export const getPosts = unstable_cache(
  async () => {
    // ...implementation...
  },
  ["posts"],
  { revalidate: 21600 }
);
```
