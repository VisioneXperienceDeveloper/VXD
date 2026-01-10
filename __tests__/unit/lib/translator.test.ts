import { describe, it, expect } from 'vitest';
import { translateText, translateBlock } from '@/lib/translator';

describe('translateText', () => {
  it('should return original text for Korean locale', async () => {
    const result = await translateText('안녕하세요', 'ko');
    expect(result).toBe('안녕하세요');
  });

  it('should return original text for non-Korean locale (mock)', async () => {
    const result = await translateText('Hello', 'en');
    expect(result).toBe('Hello');
  });
});

describe('translateBlock', () => {
  it('should return original block for Korean locale', async () => {
    const block = {
      type: 'paragraph',
      paragraph: { rich_text: [{ plain_text: '테스트', text: { content: '테스트' } }] }
    };
    const result = await translateBlock(block, 'ko');
    expect(result).toEqual(block);
  });

  it('should translate paragraph block for non-Korean locale', async () => {
    const block = {
      type: 'paragraph',
      paragraph: { rich_text: [{ plain_text: 'Hello', text: { content: 'Hello' } }] }
    };
    const result = await translateBlock(block, 'en');
    expect(result.paragraph.rich_text[0].plain_text).toBe('Hello');
    expect(result.paragraph.rich_text[0].text.content).toBe('Hello');
  });

  it('should handle paragraph block without text property', async () => {
    const block = {
      type: 'paragraph',
      paragraph: { rich_text: [{ plain_text: 'Hello' }] }
    };
    const result = await translateBlock(block, 'en');
    expect(result.paragraph.rich_text[0].plain_text).toBe('Hello');
  });

  it('should translate heading_1 block', async () => {
    const block = {
      type: 'heading_1',
      heading_1: { rich_text: [{ plain_text: 'Title', text: { content: 'Title' } }] }
    };
    const result = await translateBlock(block, 'en');
    expect(result.heading_1.rich_text[0].plain_text).toBe('Title');
  });

  it('should translate heading_2 block', async () => {
    const block = {
      type: 'heading_2',
      heading_2: { rich_text: [{ plain_text: 'Subtitle', text: { content: 'Subtitle' } }] }
    };
    const result = await translateBlock(block, 'en');
    expect(result.heading_2.rich_text[0].plain_text).toBe('Subtitle');
  });

  it('should handle empty rich_text array for paragraph', async () => {
    const block = {
      type: 'paragraph',
      paragraph: { rich_text: [] }
    };
    const result = await translateBlock(block, 'en');
    expect(result.paragraph.rich_text).toEqual([]);
  });

  it('should handle empty rich_text array for heading', async () => {
    const block = {
      type: 'heading_1',
      heading_1: { rich_text: [] }
    };
    const result = await translateBlock(block, 'en');
    expect(result.heading_1.rich_text).toEqual([]);
  });

  it('should not modify non-paragraph/heading blocks', async () => {
    const block = {
      type: 'code',
      code: { rich_text: [{ plain_text: 'const x = 1;' }] }
    };
    const result = await translateBlock(block, 'en');
    expect(result.code.rich_text[0].plain_text).toBe('const x = 1;');
  });
});
