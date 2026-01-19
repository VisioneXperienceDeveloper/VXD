import { describe, it, expect, beforeEach } from 'vitest';
import { extractBlogPostFromPage, getNumberValue } from '@/lib/services/posts.helper';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

/* eslint-disable @typescript-eslint/no-explicit-any */

describe('posts.helper - API Response Parsing', () => {
  describe('getNumberValue', () => {
    it('should extract number value from property', () => {
      const property = {
        type: 'number' as const,
        number: 42,
        id: 'test'
      };
      expect(getNumberValue(property)).toBe(42);
    });

    it('should return 0 for null number', () => {
      const property = {
        type: 'number' as const,
        number: null,
        id: 'test'
      };
      expect(getNumberValue(property)).toBe(0);
    });

    it('should return 0 for undefined property', () => {
      expect(getNumberValue(undefined)).toBe(0);
    });

    it('should return 0 for non-number property', () => {
      const property = {
        type: 'title' as const,
        id: 'test'
      } as any;
      expect(getNumberValue(property)).toBe(0);
    });
  });

  describe('extractBlogPostFromPage', () => {
    let mockPage: PageObjectResponse;

    beforeEach(() => {
      mockPage = {
        id: 'test-page-id',
        created_time: '2024-01-01T00:00:00.000Z',
        last_edited_time: '2024-01-02T00:00:00.000Z',
        object: 'page',
        parent: { type: 'database_id', database_id: 'test-db' },
        archived: false,
        in_trash: false,
        properties: {
          title: {
            type: 'title',
            title: [{ type: 'text', text: { content: 'Test Post' }, plain_text: 'Test Post', annotations: {} as any, href: null }],
            id: 'title'
          },
          published_date: {
            type: 'date',
            date: { start: '2024-01-15', end: null, time_zone: null },
            id: 'date'
          },
          tags: {
            type: 'multi_select',
            multi_select: [{ id: '1', name: 'Tech', color: 'blue' }, { id: '2', name: 'Tutorial', color: 'green' }],
            id: 'tags'
          },
          group: {
            type: 'select',
            select: { id: 'g1', name: 'Development', color: 'blue' },
            id: 'group'
          },
          part: {
            type: 'select',
            select: { id: 'p1', name: 'Part 1', color: 'red' },
            id: 'part'
          },
          language: {
            type: 'select',
            select: { id: 'l1', name: 'EN', color: 'gray' },
            id: 'language'
          },
          translation: {
            type: 'relation',
            relation: [{ id: 'translated-page-id' }],
            id: 'translation',
            has_more: false
          },
          view_count: {
            type: 'number',
            number: 100,
            id: 'view_count'
          }
        },
        cover: {
          type: 'external',
          external: { url: 'https://example.com/cover.jpg' }
        },
        icon: null,
        url: 'https://notion.so/test',
        public_url: null,
        created_by: { object: 'user', id: 'user1' },
        last_edited_by: { object: 'user', id: 'user1' }
      };
    });

    it('should extract all properties correctly', () => {
      const result = extractBlogPostFromPage(mockPage);

      expect(result).toEqual({
        id: 'test-page-id',
        slug: 'test-post',
        title: 'Test Post',
        date: '2024-01-15',
        tags: ['Tech', 'Tutorial'],
        group: 'Development',
        part: 'Part 1',
        cover: 'https://example.com/cover.jpg',
        description: '',
        language: 'EN',
        translationId: 'translated-page-id',
        viewCount: 100
      });
    });

    it('should handle missing title with default', () => {
      mockPage.properties.title = {
        type: 'title',
        title: [],
        id: 'title'
      };

      const result = extractBlogPostFromPage(mockPage);
      expect(result.title).toBe('Untitled');
    });

    it('should use last_edited_time when published_date is missing', () => {
      delete (mockPage.properties as any).published_date;

      const result = extractBlogPostFromPage(mockPage);
      expect(result.date).toBe('2024-01-02T00:00:00.000Z');
    });

    it('should handle empty tags', () => {
      mockPage.properties.tags = {
        type: 'multi_select',
        multi_select: [],
        id: 'tags'
      };

      const result = extractBlogPostFromPage(mockPage);
      expect(result.tags).toEqual([]);
    });

    it('should handle missing group', () => {
      mockPage.properties.group = {
        type: 'select',
        select: null,
        id: 'group'
      };

      const result = extractBlogPostFromPage(mockPage);
      expect(result.group).toBeUndefined();
    });

    it('should handle missing part', () => {
      mockPage.properties.part = {
        type: 'select',
        select: null,
        id: 'part'
      };

      const result = extractBlogPostFromPage(mockPage);
      expect(result.part).toBeUndefined();
    });

    it('should default to ko language when missing', () => {
      mockPage.properties.language = {
        type: 'select',
        select: null,
        id: 'language'
      };

      const result = extractBlogPostFromPage(mockPage);
      expect(result.language).toBe('ko');
    });

    it('should handle missing translation relation', () => {
      mockPage.properties.translation = {
        type: 'relation',
        relation: [],
        id: 'translation',
        has_more: false
      };

      const result = extractBlogPostFromPage(mockPage);
      expect(result.translationId).toBeNull();
    });

    it('should handle file cover type', () => {
      mockPage.cover = {
        type: 'file',
        file: { url: 'https://files.notion.so/file.jpg', expiry_time: '2024-12-31' }
      };

      const result = extractBlogPostFromPage(mockPage);
      expect(result.cover).toBe('https://files.notion.so/file.jpg');
    });

    it('should handle missing cover', () => {
      mockPage.cover = null;

      const result = extractBlogPostFromPage(mockPage);
      expect(result.cover).toBeNull();
    });

    it('should handle zero view count', () => {
      mockPage.properties.view_count = {
        type: 'number',
        number: 0,
        id: 'view_count'
      };

      const result = extractBlogPostFromPage(mockPage);
      expect(result.viewCount).toBe(0);
    });

    it('should handle missing view count', () => {
      mockPage.properties.view_count = {
        type: 'number',
        number: null,
        id: 'view_count'
      };

      const result = extractBlogPostFromPage(mockPage);
      expect(result.viewCount).toBe(0);
    });
  });
});
