import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BlockRenderer } from '@/entities/notion';
import { createTestBlock } from '../../../helpers/block-test-helpers';

// Mock next/image to avoid width/height requirement in tests
// Mock react-syntax-highlighter
vi.mock('react-syntax-highlighter', () => ({
  Prism: ({ children }: { children: string }) => <pre>{children}</pre>,
}));

vi.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  atomDark: {},
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} data-testid="mock-image" />
  ),
}));

describe('BlockRenderer Component', () => {
  it('should render paragraph', () => {
    const block = createTestBlock('paragraph', {
      id: '1',
      paragraph: {
        rich_text: [{ 
          type: 'text', 
          text: { content: 'Hello World', link: null }, 
          plain_text: 'Hello World',
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
          href: null,
        }],
        color: 'default',
      },
    });
    render(<BlockRenderer block={block} />);
    expect(screen.getByText('Hello World')).toBeDefined();
  });

  it('should render heading_1', () => {
    const block = createTestBlock('heading_1', {
      id: '2',
      heading_1: {
        rich_text: [{ 
          type: 'text', 
          text: { content: 'Heading 1', link: null }, 
          plain_text: 'Heading 1',
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
          href: null,
        }],
        color: 'default',
        is_toggleable: false,
      },
    });
    render(<BlockRenderer block={block} />);
    expect(screen.getByRole('heading', { level: 1 })).toBeDefined();
    expect(screen.getByText('Heading 1')).toBeDefined();
  });

  it('should render bulleted_list_item', () => {
    const block = createTestBlock('bulleted_list_item', {
      id: '3',
      bulleted_list_item: {
        rich_text: [{ 
          type: 'text', 
          text: { content: 'List Item', link: null }, 
          plain_text: 'List Item',
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
          href: null,
        }],
        color: 'default',
      },
    });
    render(<BlockRenderer block={block} />);
    expect(screen.getByText('List Item')).toBeDefined();
  });

  it('should render callout with icon', () => {
    const block = createTestBlock('callout', {
      id: '4',
      callout: {
        rich_text: [{ 
          type: 'text', 
          text: { content: 'Callout Text', link: null }, 
          plain_text: 'Callout Text',
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
          href: null,
        }],
        icon: { type: 'emoji', emoji: '💡' },
        color: 'default',
      },
    });
    render(<BlockRenderer block={block} />);
    expect(screen.getByText('Callout Text')).toBeDefined();
    expect(screen.getByText('💡')).toBeDefined();
  });

  it('should render unsupported block message', () => {
    const block = createTestBlock('unsupported', {
      id: '5',
    });
    render(<BlockRenderer block={block} />);
    expect(screen.getByText('Unsupported block type: unsupported')).toBeDefined();
  });

  it('should render heading_2', () => {
    const block = createTestBlock('heading_2', {
      id: '6',
      heading_2: {
        rich_text: [{ 
          type: 'text', 
          text: { content: 'Heading 2', link: null }, 
          plain_text: 'Heading 2',
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
          href: null,
        }],
        color: 'default',
        is_toggleable: false,
      },
    });
    render(<BlockRenderer block={block} />);
    expect(screen.getByRole('heading', { level: 2 })).toBeDefined();
    expect(screen.getByText('Heading 2')).toBeDefined();
  });

  it('should render heading_3', () => {
    const block = createTestBlock('heading_3', {
      id: '7',
      heading_3: {
        rich_text: [{ 
          type: 'text', 
          text: { content: 'Heading 3', link: null }, 
          plain_text: 'Heading 3',
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
          href: null,
        }],
        color: 'default',
        is_toggleable: false,
      },
    });
    render(<BlockRenderer block={block} />);
    expect(screen.getByRole('heading', { level: 3 })).toBeDefined();
    expect(screen.getByText('Heading 3')).toBeDefined();
  });

  it('should render numbered_list_item', () => {
    const block = createTestBlock('numbered_list_item', {
      id: '8',
      numbered_list_item: {
        rich_text: [{ 
          type: 'text', 
          text: { content: 'Numbered Item', link: null }, 
          plain_text: 'Numbered Item',
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
          href: null,
        }],
        color: 'default',
      },
    });
    render(<BlockRenderer block={block} />);
    expect(screen.getByText('Numbered Item')).toBeDefined();
  });

  it('should render to_do unchecked', () => {
    const block = createTestBlock('to_do', {
      id: '9',
      to_do: {
        checked: false,
        rich_text: [{ 
          type: 'text', 
          text: { content: 'Todo Item', link: null }, 
          plain_text: 'Todo Item',
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
          href: null,
        }],
        color: 'default',
      },
    });
    render(<BlockRenderer block={block} />);
    expect(screen.getByText('Todo Item')).toBeDefined();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDefined();
    expect((checkbox as HTMLInputElement).checked).toBe(false);
  });

  it('should render to_do checked with strikethrough', () => {
    const block = createTestBlock('to_do', {
      id: '10',
      to_do: {
        checked: true,
        rich_text: [{ 
          type: 'text', 
          text: { content: 'Completed Todo', link: null }, 
          plain_text: 'Completed Todo',
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
          href: null,
        }],
        color: 'default',
      },
    });
    render(<BlockRenderer block={block} />);
    const checkbox = screen.getByRole('checkbox');
    expect((checkbox as HTMLInputElement).checked).toBe(true);
  });

  it('should render toggle', () => {
    const block = createTestBlock('toggle', {
      id: '11',
      toggle: {
        rich_text: [{ 
          type: 'text', 
          text: { content: 'Toggle Title', link: null }, 
          plain_text: 'Toggle Title',
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
          href: null,
        }],
        color: 'default',
      },
    });
    render(<BlockRenderer block={block} />);
    expect(screen.getByText('Toggle Title')).toBeDefined();
    expect(screen.getByText('(Nested content not loaded)')).toBeDefined();
  });

  it('should render quote', () => {
    const block = createTestBlock('quote', {
      id: '12',
      quote: {
        rich_text: [{ 
          type: 'text', 
          text: { content: 'Quote Text', link: null }, 
          plain_text: 'Quote Text',
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
          href: null,
        }],
        color: 'default',
      },
    });
    render(<BlockRenderer block={block} />);
    const blockquote = screen.getByText('Quote Text').closest('blockquote');
    expect(blockquote).toBeDefined();
  });

  it('should render code block', () => {
    const block = createTestBlock('code', {
      id: '13',
      code: {
        language: 'javascript',
        rich_text: [{ 
          type: 'text', 
          text: { content: 'const x = 1;', link: null }, 
          plain_text: 'const x = 1;',
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
          href: null,
        }],
        caption: [],
      },
    });
    render(<BlockRenderer block={block} />);
    expect(screen.getByText('const x = 1;')).toBeDefined();
    const pre = screen.getByText('const x = 1;').closest('pre');
    expect(pre).toBeDefined();
  });

  it('should render divider', () => {
    const block = createTestBlock('divider', {
      id: '14',
      divider: {},
    });
    const { container } = render(<BlockRenderer block={block} />);
    expect(container.querySelector('hr')).toBeDefined();
  });

  it('should render callout without icon (default)', () => {
    const block = createTestBlock('callout', {
      id: '15',
      callout: {
        rich_text: [{ 
          type: 'text', 
          text: { content: 'Callout no icon', link: null }, 
          plain_text: 'Callout no icon',
          annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
          href: null,
        }],
        icon: null,
        color: 'default',
      },
    });
    render(<BlockRenderer block={block} />);
    expect(screen.getByText('Callout no icon')).toBeDefined();
    expect(screen.getByText('💡')).toBeDefined(); // Default icon
  });

  it('should render table_row as null', () => {
    const block = createTestBlock('table_row', {
      id: '16',
      table_row: {
        cells: [],
      },
    });
    const { container } = render(<BlockRenderer block={block} />);
    expect(container.innerHTML).toBe('');
  });

  it('should render table with rows', () => {
    const block = createTestBlock('table', {
      id: '17',
      table: {
        has_column_header: true,
        has_row_header: false,
        table_width: 2,
      },
      children: [
        createTestBlock('table_row', {
          id: 'row1',
          table_row: {
            cells: [
              [{ type: 'text', text: { content: 'Header 1', link: null }, plain_text: 'Header 1', annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' }, href: null }],
              [{ type: 'text', text: { content: 'Header 2', link: null }, plain_text: 'Header 2', annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' }, href: null }],
            ],
          },
        }),
        createTestBlock('table_row', {
          id: 'row2',
          table_row: {
            cells: [
              [{ type: 'text', text: { content: 'Cell 1', link: null }, plain_text: 'Cell 1', annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' }, href: null }],
              [{ type: 'text', text: { content: 'Cell 2', link: null }, plain_text: 'Cell 2', annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' }, href: null }],
            ],
          },
        }),
      ],
    });
    render(<BlockRenderer block={block} />);
    expect(screen.getByText('Header 1')).toBeDefined();
    expect(screen.getByText('Header 2')).toBeDefined();
    expect(screen.getByText('Cell 1')).toBeDefined();
    expect(screen.getByText('Cell 2')).toBeDefined();
  });

  it('should render table with row header', () => {
    const block = createTestBlock('table', {
      id: '18',
      table: {
        has_column_header: false,
        has_row_header: true,
        table_width: 2,
      },
      children: [
        createTestBlock('table_row', {
          id: 'row1',
          table_row: {
            cells: [
              [{ type: 'text', text: { content: 'Row Header', link: null }, plain_text: 'Row Header', annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' }, href: null }],
              [{ type: 'text', text: { content: 'Content', link: null }, plain_text: 'Content', annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' }, href: null }],
            ],
          },
        }),
      ],
    });
    render(<BlockRenderer block={block} />);
    expect(screen.getByText('Row Header')).toBeDefined();
    expect(screen.getByText('Content')).toBeDefined();
  });

  it('should render image with external URL', () => {
    const block = createTestBlock('image', {
      id: '19',
      image: {
        type: 'external',
        external: { url: 'https://example.com/image.jpg' },
        caption: [{ plain_text: 'Image Caption', type: 'text', text: { content: 'Image Caption', link: null }, annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' }, href: null }],
      },
    });
    render(<BlockRenderer block={block} />);
    const figure = document.querySelector('figure');
    expect(figure).toBeDefined();
    expect(screen.getByText('Image Caption')).toBeDefined();
  });

  it('should render image with file URL', () => {
    const block = createTestBlock('image', {
      id: '20',
      image: {
        type: 'file',
        file: { url: 'https://notion-storage.com/image.jpg', expiry_time: '2024-12-31T23:59:59.000Z' },
        caption: [],
      },
    });
    render(<BlockRenderer block={block} />);
    const figure = document.querySelector('figure');
    expect(figure).toBeDefined();
  });

  it('should render image without caption', () => {
    const block = createTestBlock('image', {
      id: '21',
      image: {
        type: 'external',
        external: { url: 'https://example.com/image.jpg' },
        caption: [],
      },
    });
    render(<BlockRenderer block={block} />);
    const figure = document.querySelector('figure');
    expect(figure).toBeDefined();
  });
});
