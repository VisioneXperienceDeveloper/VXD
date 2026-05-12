import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { BlogPost } from "../types/BlogPost";

type NotionPropertyValue = PageObjectResponse['properties'][string];

function getSelectValue(property: NotionPropertyValue | undefined): string | undefined {
  if (property?.type === 'select' && property.select) {
    return property.select.name;
  }
  return undefined;
}

function getRelationId(property: NotionPropertyValue | undefined): string | null {
  if (property?.type === 'relation' && property.relation.length > 0) {
    return property.relation[0].id;
  }
  return null;
}

export function getNumberValue(property: NotionPropertyValue | undefined): number {
  if (property?.type === 'number' && property.number !== null) {
    return property.number;
  }
  return 0;
}

function generateSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s가-힣-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  return baseSlug;
}

export function extractBlogPostFromPage(p: PageObjectResponse): BlogPost {
  const title = p.properties.title?.type === 'title' 
    ? p.properties.title.title[0]?.plain_text ?? 'Untitled' 
    : 'Untitled';

  const dateProperty = p.properties.published_date?.type === 'date' 
    ? p.properties.published_date.date?.start 
    : null;
  const date = dateProperty ?? p.last_edited_time ?? '';

  const tags = p.properties.tags?.type === 'multi_select' 
    ? p.properties.tags.multi_select.map((tag: any) => tag.name) 
    : [];

  const groupName = getSelectValue(p.properties.group);
  const part = getSelectValue(p.properties.part);
  const language = getSelectValue(p.properties.language) || 'KR';
  const translationId = getRelationId(p.properties.translation);
  const viewCount = getNumberValue(p.properties.view_count);
  const commentCount = getNumberValue(p.properties.comment_count);

  let cover: string | null = null;
  if (p.cover?.type === 'external') {
    cover = p.cover.external.url;
  } else if (p.cover?.type === 'file') {
    cover = p.cover.file.url;
  }

  const blogPost: BlogPost = {
    id: p.id,
    slug: generateSlug(title),
    title,
    date,
    tags,
    group: groupName,
    part,
    cover,
    description: '',
    language,
    translationId,
    viewCount,
    commentCount,
  };

  return blogPost;
}
