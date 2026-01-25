
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  tags: string[];
  cover: string | null;
  description: string;
  group?: string;
  part?: string;
  language?: string;
  translationId?: string | null;
  viewCount?: number;
  commentCount?: number;
};
