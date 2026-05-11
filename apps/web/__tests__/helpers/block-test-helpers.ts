import type { BlockObjectResponse, PartialBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

/**
 * Creates a minimal block object for testing purposes.
 * This helper ensures type safety while only requiring the properties actually used by BlockRenderer.
 */
export function createTestBlock<T extends BlockObjectResponse['type']>(
  type: T,
  content: Partial<Extract<BlockObjectResponse, { type: T }>> & {
    children?: (BlockObjectResponse | PartialBlockObjectResponse)[];
  }
): BlockObjectResponse & { children?: (BlockObjectResponse | PartialBlockObjectResponse)[] } {
  const baseBlock = {
    object: 'block' as const,
    id: content.id || 'test-id',
    parent: {
      type: 'page_id' as const,
      page_id: 'test-parent-id',
    },
    created_time: '2024-01-01T00:00:00.000Z',
    last_edited_time: '2024-01-01T00:00:00.000Z',
    created_by: {
      object: 'user' as const,
      id: 'test-user-id',
    },
    last_edited_by: {
      object: 'user' as const,
      id: 'test-user-id',
    },
    has_children: !!content.children,
    archived: false,
    in_trash: false,
    type,
    ...content,
  };

  return baseBlock as BlockObjectResponse & { children?: (BlockObjectResponse | PartialBlockObjectResponse)[] };
}
