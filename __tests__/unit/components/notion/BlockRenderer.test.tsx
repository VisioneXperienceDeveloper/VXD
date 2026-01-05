import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BlockRenderer } from '@/components/notion/BlockRenderer';

describe('BlockRenderer Component', () => {
  it('should render paragraph', () => {
    const block = {
      type: 'paragraph',
      id: '1',
      paragraph: {
        rich_text: [{ 
          type: 'text', 
          text: { content: 'Hello World' }, 
          plain_text: 'Hello World',
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' }
        }],
      },
    };
    render(<BlockRenderer block={block} />);
    expect(screen.getByText('Hello World')).toBeDefined();
  });

  it('should render heading_1', () => {
    const block = {
      type: 'heading_1',
      id: '2',
      heading_1: {
        rich_text: [{ 
          type: 'text', 
          text: { content: 'Heading 1' }, 
          plain_text: 'Heading 1',
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' }
        }],
      },
    };
    render(<BlockRenderer block={block} />);
    expect(screen.getByRole('heading', { level: 1 })).toBeDefined();
    expect(screen.getByText('Heading 1')).toBeDefined();
  });

  it('should render bulleted_list_item', () => {
    const block = {
      type: 'bulleted_list_item',
      id: '3',
      bulleted_list_item: {
        rich_text: [{ 
          type: 'text', 
          text: { content: 'List Item' }, 
          plain_text: 'List Item',
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' }
        }],
      },
    };
    render(<BlockRenderer block={block} />);
    expect(screen.getByText('List Item')).toBeDefined();
  });

  it('should render callout with icon', () => {
    const block = {
      type: 'callout',
      id: '4',
      callout: {
        rich_text: [{ 
          type: 'text', 
          text: { content: 'Callout Text' }, 
          plain_text: 'Callout Text',
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' }
        }],
        icon: { type: 'emoji', emoji: '💡' },
      },
    };
    render(<BlockRenderer block={block} />);
    expect(screen.getByText('Callout Text')).toBeDefined();
    expect(screen.getByText('💡')).toBeDefined();
  });

  it('should render unsupported block message', () => {
    const block = {
      type: 'unsupported_type',
      id: '5',
      unsupported_type: {},
    };
    render(<BlockRenderer block={block} />);
    expect(screen.getByText('Unsupported block type: unsupported_type')).toBeDefined();
  });
});
