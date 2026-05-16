import { Doc } from "@convex/_generated/dataModel";

export type BlogPost = Doc<"posts"> & {
  id: string;
};

export type RichText = {
  type: "text" | "mention" | "equation";
  text?: {
    content: string;
    link: { url: string } | null;
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href: string | null;
};

export type BlockType = 
  | "paragraph" 
  | "heading_1" 
  | "heading_2" 
  | "heading_3" 
  | "bulleted_list_item" 
  | "numbered_list_item" 
  | "to_do" 
  | "toggle" 
  | "quote" 
  | "callout" 
  | "code" 
  | "image" 
  | "table" 
  | "table_row" 
  | "divider";

export interface BaseBlock {
  id: string;
  type: BlockType;
  children?: Block[];
}

export type BlockRendererProps = {
  block: Block;
};

export interface ParagraphBlock extends BaseBlock {
  type: "paragraph";
  paragraph: {
    rich_text: RichText[];
    color: string;
  };
}

export interface Heading1Block extends BaseBlock {
  type: "heading_1";
  heading_1: {
    rich_text: RichText[];
    color: string;
    is_toggleable: boolean;
  };
}

export interface Heading2Block extends BaseBlock {
  type: "heading_2";
  heading_2: {
    rich_text: RichText[];
    color: string;
    is_toggleable: boolean;
  };
}

export interface Heading3Block extends BaseBlock {
  type: "heading_3";
  heading_3: {
    rich_text: RichText[];
    color: string;
    is_toggleable: boolean;
  };
}

export interface BulletedListItemBlock extends BaseBlock {
  type: "bulleted_list_item";
  bulleted_list_item: {
    rich_text: RichText[];
    color: string;
  };
}

export interface NumberedListItemBlock extends BaseBlock {
  type: "numbered_list_item";
  numbered_list_item: {
    rich_text: RichText[];
    color: string;
  };
}

export interface ToDoBlock extends BaseBlock {
  type: "to_do";
  to_do: {
    rich_text: RichText[];
    checked: boolean;
    color: string;
  };
}

export interface ToggleBlock extends BaseBlock {
  type: "toggle";
  toggle: {
    rich_text: RichText[];
    color: string;
  };
}

export interface QuoteBlock extends BaseBlock {
  type: "quote";
  quote: {
    rich_text: RichText[];
    color: string;
  };
}

export interface CalloutBlock extends BaseBlock {
  type: "callout";
  callout: {
    rich_text: RichText[];
    icon: { type: "emoji"; emoji: string } | { type: "external"; external: { url: string } } | null;
    color: string;
  };
}

export interface CodeBlockContent extends BaseBlock {
  type: "code";
  code: {
    rich_text: RichText[];
    language: string;
    caption: RichText[];
  };
}

export interface ImageBlock extends BaseBlock {
  type: "image";
  image: {
    type: "external" | "file";
    external?: { url: string };
    file?: { url: string; expiry_time: string };
    caption: RichText[];
  };
}

export interface TableBlock extends BaseBlock {
  type: "table";
  table: {
    table_width: number;
    has_column_header: boolean;
    has_row_header: boolean;
  };
}

export interface TableRowBlock extends BaseBlock {
  type: "table_row";
  table_row: {
    cells: RichText[][];
  };
}

export interface DividerBlock extends BaseBlock {
  type: "divider";
  divider: Record<string, never>;
}

export interface Comment {
  _id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: number;
}

export type SortOption = 'published_date' | 'view_count' | 'comment_count';
export type SortDirection = 'asc' | 'desc';

export type Block = 
  | ParagraphBlock 
  | Heading1Block 
  | Heading2Block 
  | Heading3Block 
  | BulletedListItemBlock 
  | NumberedListItemBlock 
  | ToDoBlock 
  | ToggleBlock 
  | QuoteBlock 
  | CalloutBlock 
  | CodeBlockContent 
  | ImageBlock 
  | TableBlock 
  | TableRowBlock 
  | DividerBlock;
