import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TextRenderer } from '@/entities/content';

/* eslint-disable @typescript-eslint/no-explicit-any */

describe('TextRenderer Component', () => {
  it('should render plain text', () => {
    const text = [{
      type: 'text',
      text: { content: 'Hello World', link: null },
      annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
      plain_text: 'Hello World',
    }];

    render(<TextRenderer text={text} />);
    expect(screen.getByText('Hello World')).toBeDefined();
  });

  it('should render null when text is null', () => {
    const { container } = render(<TextRenderer text={null as any} />);
    expect(container.innerHTML).toBe('');
  });

  it('should render bold text', () => {
    const text = [{
      type: 'text',
      text: { content: 'Bold Text', link: null },
      annotations: { bold: true, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
      plain_text: 'Bold Text',
    }];

    render(<TextRenderer text={text} />);
    const element = screen.getByText('Bold Text');
    expect(element.className).toContain('font-bold');
  });

  it('should render italic text', () => {
    const text = [{
      type: 'text',
      text: { content: 'Italic Text', link: null },
      annotations: { bold: false, italic: true, strikethrough: false, underline: false, code: false, color: 'default' },
      plain_text: 'Italic Text',
    }];

    render(<TextRenderer text={text} />);
    const element = screen.getByText('Italic Text');
    expect(element.className).toContain('italic');
  });

  it('should render strikethrough text', () => {
    const text = [{
      type: 'text',
      text: { content: 'Strikethrough', link: null },
      annotations: { bold: false, italic: false, strikethrough: true, underline: false, code: false, color: 'default' },
      plain_text: 'Strikethrough',
    }];

    render(<TextRenderer text={text} />);
    const element = screen.getByText('Strikethrough');
    expect(element.className).toContain('line-through');
  });

  it('should render underline text', () => {
    const text = [{
      type: 'text',
      text: { content: 'Underlined', link: null },
      annotations: { bold: false, italic: false, strikethrough: false, underline: true, code: false, color: 'default' },
      plain_text: 'Underlined',
    }];

    render(<TextRenderer text={text} />);
    const element = screen.getByText('Underlined');
    expect(element.className).toContain('underline');
  });

  it('should render code text', () => {
    const text = [{
      type: 'text',
      text: { content: 'code', link: null },
      annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: true, color: 'default' },
      plain_text: 'code',
    }];

    render(<TextRenderer text={text} />);
    const element = screen.getByText('code');
    expect(element.className).toContain('font-mono');
    expect(element.className).toContain('bg-neutral-200');
  });

  it('should render colored text', () => {
    const text = [{
      type: 'text',
      text: { content: 'Colored', link: null },
      annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'red' },
      plain_text: 'Colored',
    }];

    render(<TextRenderer text={text} />);
    const element = screen.getByText('Colored');
    expect(element.className).toContain('text-red-500');
  });

  it('should render linked text', () => {
    const text = [{
      type: 'text',
      text: { content: 'Click here', link: { url: 'https://example.com' } },
      annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
      plain_text: 'Click here',
    }];

    render(<TextRenderer text={text} />);
    const link = screen.getByRole('link', { name: 'Click here' });
    expect(link.getAttribute('href')).toBe('https://example.com');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noreferrer');
  });

  it('should render multiple text segments', () => {
    const text = [
      {
        type: 'text',
        text: { content: 'Hello ', link: null },
        annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
        plain_text: 'Hello ',
      },
      {
        type: 'text',
        text: { content: 'World', link: null },
        annotations: { bold: true, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
        plain_text: 'World',
      },
    ];

    render(<TextRenderer text={text} />);
    expect(screen.getByText('Hello')).toBeDefined();
    expect(screen.getByText('World')).toBeDefined();
  });

  it('should apply custom className', () => {
    const text = [{
      type: 'text',
      text: { content: 'Test', link: null },
      annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
      plain_text: 'Test',
    }];

    const { container } = render(<TextRenderer text={text} className="custom-class" />);
    expect((container.firstChild as HTMLElement)?.className).toContain('custom-class');
  });

  it('should handle text without text property', () => {
    const text = [{
      type: 'text',
      annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
      plain_text: 'Plain only',
    }];

    // Should not crash
    render(<TextRenderer text={text as any} />);
  });
});
