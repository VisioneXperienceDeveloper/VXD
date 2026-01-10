import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BlockRenderer } from '@/components/notion/BlockRenderer';

/* eslint-disable @typescript-eslint/no-explicit-any */

// Mock next/image to avoid width/height requirement in tests
vi.mock('next/image', () => ({
  default: ({ src, alt, className }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} data-testid="mock-image" />
  ),
}));

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

  it('should render heading_2', () => {
    const block = {
      type: 'heading_2',
      id: '6',
      heading_2: {
        rich_text: [{ 
          type: 'text', 
          text: { content: 'Heading 2' }, 
          plain_text: 'Heading 2',
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' }
        }],
      },
    };
    render(<BlockRenderer block={block} />);
    expect(screen.getByRole('heading', { level: 2 })).toBeDefined();
    expect(screen.getByText('Heading 2')).toBeDefined();
  });

  it('should render heading_3', () => {
    const block = {
      type: 'heading_3',
      id: '7',
      heading_3: {
        rich_text: [{ 
          type: 'text', 
          text: { content: 'Heading 3' }, 
          plain_text: 'Heading 3',
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' }
        }],
      },
    };
    render(<BlockRenderer block={block} />);
    expect(screen.getByRole('heading', { level: 3 })).toBeDefined();
    expect(screen.getByText('Heading 3')).toBeDefined();
  });

  it('should render numbered_list_item', () => {
    const block = {
      type: 'numbered_list_item',
      id: '8',
      numbered_list_item: {
        rich_text: [{ 
          type: 'text', 
          text: { content: 'Numbered Item' }, 
          plain_text: 'Numbered Item',
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' }
        }],
      },
    };
    render(<BlockRenderer block={block} />);
    expect(screen.getByText('Numbered Item')).toBeDefined();
  });

  it('should render to_do unchecked', () => {
    const block = {
      type: 'to_do',
      id: '9',
      to_do: {
        checked: false,
        rich_text: [{ 
          type: 'text', 
          text: { content: 'Todo Item' }, 
          plain_text: 'Todo Item',
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' }
        }],
      },
    };
    render(<BlockRenderer block={block} />);
    expect(screen.getByText('Todo Item')).toBeDefined();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDefined();
    expect((checkbox as HTMLInputElement).checked).toBe(false);
  });

  it('should render to_do checked with strikethrough', () => {
    const block = {
      type: 'to_do',
      id: '10',
      to_do: {
        checked: true,
        rich_text: [{ 
          type: 'text', 
          text: { content: 'Completed Todo' }, 
          plain_text: 'Completed Todo',
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' }
        }],
      },
    };
    render(<BlockRenderer block={block} />);
    const checkbox = screen.getByRole('checkbox');
    expect((checkbox as HTMLInputElement).checked).toBe(true);
  });

  it('should render toggle', () => {
    const block = {
      type: 'toggle',
      id: '11',
      toggle: {
        rich_text: [{ 
          type: 'text', 
          text: { content: 'Toggle Title' }, 
          plain_text: 'Toggle Title',
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' }
        }],
      },
    };
    render(<BlockRenderer block={block} />);
    expect(screen.getByText('Toggle Title')).toBeDefined();
    expect(screen.getByText('(Nested content not loaded)')).toBeDefined();
  });

  it('should render quote', () => {
    const block = {
      type: 'quote',
      id: '12',
      quote: {
        rich_text: [{ 
          type: 'text', 
          text: { content: 'Quote Text' }, 
          plain_text: 'Quote Text',
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' }
        }],
      },
    };
    render(<BlockRenderer block={block} />);
    const blockquote = screen.getByText('Quote Text').closest('blockquote');
    expect(blockquote).toBeDefined();
  });

  it('should render code block', () => {
    const block = {
      type: 'code',
      id: '13',
      code: {
        language: 'javascript',
        rich_text: [{ 
          type: 'text', 
          text: { content: 'const x = 1;' }, 
          plain_text: 'const x = 1;',
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' }
        }],
      },
    };
    render(<BlockRenderer block={block} />);
    expect(screen.getByText('const x = 1;')).toBeDefined();
    const pre = screen.getByText('const x = 1;').closest('pre');
    expect(pre).toBeDefined();
  });

  it('should render divider', () => {
    const block = {
      type: 'divider',
      id: '14',
      divider: {},
    };
    const { container } = render(<BlockRenderer block={block} />);
    expect(container.querySelector('hr')).toBeDefined();
  });

  it('should render callout without icon (default)', () => {
    const block = {
      type: 'callout',
      id: '15',
      callout: {
        rich_text: [{ 
          type: 'text', 
          text: { content: 'Callout no icon' }, 
          plain_text: 'Callout no icon',
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' }
        }],
        icon: null,
      },
    };
    render(<BlockRenderer block={block} />);
    expect(screen.getByText('Callout no icon')).toBeDefined();
    expect(screen.getByText('💡')).toBeDefined(); // Default icon
  });

  it('should render table_row as null', () => {
    const block = {
      type: 'table_row',
      id: '16',
      table_row: {
        cells: [],
      },
    };
    const { container } = render(<BlockRenderer block={block} />);
    expect(container.innerHTML).toBe('');
  });

  it('should render table with rows', () => {
    const block = {
      type: 'table',
      id: '17',
      table: {
        has_column_header: true,
        has_row_header: false,
      },
      children: [
        {
          id: 'row1',
          type: 'table_row',
          table_row: {
            cells: [
              [{ type: 'text', text: { content: 'Header 1' }, plain_text: 'Header 1', annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' } }],
              [{ type: 'text', text: { content: 'Header 2' }, plain_text: 'Header 2', annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' } }],
            ],
          },
        },
        {
          id: 'row2',
          type: 'table_row',
          table_row: {
            cells: [
              [{ type: 'text', text: { content: 'Cell 1' }, plain_text: 'Cell 1', annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' } }],
              [{ type: 'text', text: { content: 'Cell 2' }, plain_text: 'Cell 2', annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' } }],
            ],
          },
        },
      ],
    };
    render(<BlockRenderer block={block as any} />);
    expect(screen.getByText('Header 1')).toBeDefined();
    expect(screen.getByText('Header 2')).toBeDefined();
    expect(screen.getByText('Cell 1')).toBeDefined();
    expect(screen.getByText('Cell 2')).toBeDefined();
  });

  it('should render table with row header', () => {
    const block = {
      type: 'table',
      id: '18',
      table: {
        has_column_header: false,
        has_row_header: true,
      },
      children: [
        {
          id: 'row1',
          type: 'table_row',
          table_row: {
            cells: [
              [{ type: 'text', text: { content: 'Row Header' }, plain_text: 'Row Header', annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' } }],
              [{ type: 'text', text: { content: 'Content' }, plain_text: 'Content', annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' } }],
            ],
          },
        },
      ],
    };
    render(<BlockRenderer block={block as any} />);
    expect(screen.getByText('Row Header')).toBeDefined();
    expect(screen.getByText('Content')).toBeDefined();
  });

  it('should render image with external URL', () => {
    const block = {
      type: 'image',
      id: '19',
      image: {
        type: 'external',
        external: { url: 'https://example.com/image.jpg' },
        caption: [{ plain_text: 'Image Caption' }],
      },
    };
    render(<BlockRenderer block={block} />);
    const figure = document.querySelector('figure');
    expect(figure).toBeDefined();
    expect(screen.getByText('Image Caption')).toBeDefined();
  });

  it('should render image with file URL', () => {
    const block = {
      type: 'image',
      id: '20',
      image: {
        type: 'file',
        file: { url: 'https://notion-storage.com/image.jpg' },
        caption: [],
      },
    };
    render(<BlockRenderer block={block} />);
    const figure = document.querySelector('figure');
    expect(figure).toBeDefined();
  });

  it('should render image without caption', () => {
    const block = {
      type: 'image',
      id: '21',
      image: {
        type: 'external',
        external: { url: 'https://example.com/image.jpg' },
        caption: null,
      },
    };
    render(<BlockRenderer block={block} />);
    const figure = document.querySelector('figure');
    expect(figure).toBeDefined();
  });
});
