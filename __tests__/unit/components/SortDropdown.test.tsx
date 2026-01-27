import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SortDropdown } from '@/features/sort-posts/ui/SortDropdown';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/shared/i18n/routing';

/* eslint-disable @typescript-eslint/no-explicit-any */

// Mock next/navigation for useSearchParams
vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}));

// Mock @/i18n/routing
vi.mock('@/i18n/routing', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
  Link: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

// Mock next-intl
vi.mock('next-intl', () => ({
  useLocale: () => 'ko',
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      publishedDate: '최신순',
      viewCount: '조회수',
      comments: '댓글수',
    };
    return translations[key] || key;
  },
}));

describe('SortDropdown Component', () => {
  const mockPush = vi.fn();
  const mockPathname = '/ko';

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({ push: mockPush });
    (usePathname as any).mockReturnValue(mockPathname);
  });

  it('should render all sort options', () => {
    (useSearchParams as any).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
      toString: vi.fn().mockReturnValue(''),
    });

    render(<SortDropdown />);

    expect(screen.getByText('최신순')).toBeDefined();
    expect(screen.getByText('조회수')).toBeDefined();
    expect(screen.getByText('댓글수')).toBeDefined();
  });

  it('should highlight default sort option (published_date)', () => {
    (useSearchParams as any).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
      toString: vi.fn().mockReturnValue(''),
    });

    render(<SortDropdown />);

    const publishedDateButton = screen.getByText('최신순');
    
    // Check if it has the active class (font-medium)
    expect(publishedDateButton.className).toContain('font-medium');
  });

  it('should highlight selected sort option from URL', () => {
    (useSearchParams as any).mockReturnValue({
      get: vi.fn((key: string) => (key === 'sort' ? 'view_count' : null)),
      toString: vi.fn().mockReturnValue('sort=view_count'),
    });

    render(<SortDropdown />);

    const viewCountButton = screen.getByText('조회수');
    
    // Check if view_count option has active class
    expect(viewCountButton.className).toContain('font-medium');
  });

  it('should update URL when selecting view_count', () => {
    (useSearchParams as any).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
      toString: vi.fn().mockReturnValue(''),
    });

    render(<SortDropdown />);

    const viewCountButton = screen.getByText('조회수');
    fireEvent.click(viewCountButton);

    expect(mockPush).toHaveBeenCalledWith('/ko?sort=view_count');
  });

  it('should update URL when selecting comment_count', () => {
    (useSearchParams as any).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
      toString: vi.fn().mockReturnValue(''),
    });

    render(<SortDropdown />);

    const commentCountButton = screen.getByText('댓글수');
    fireEvent.click(commentCountButton);

    expect(mockPush).toHaveBeenCalledWith('/ko?sort=comment_count');
  });

  it('should remove sort param when selecting default (published_date)', () => {
    (useSearchParams as any).mockReturnValue({
      get: vi.fn((key: string) => (key === 'sort' ? 'view_count' : null)),
      toString: vi.fn().mockReturnValue('sort=view_count'),
    });

    render(<SortDropdown />);

    const publishedDateButton = screen.getByText('최신순');
    fireEvent.click(publishedDateButton);

    // Should remove 'sort' param when reverting to default
    expect(mockPush).toHaveBeenCalledWith('/ko?');
  });

  it('should preserve other URL parameters when changing sort', () => {
    (useSearchParams as any).mockReturnValue({
      get: vi.fn((key: string) => {
        if (key === 'sort') return null;
        if (key === 'search') return 'test';
        return null;
      }),
      toString: vi.fn().mockReturnValue('search=test'),
    });

    render(<SortDropdown />);

    const viewCountButton = screen.getByText('조회수');
    fireEvent.click(viewCountButton);

    // Should keep existing params and add sort
    expect(mockPush).toHaveBeenCalledWith('/ko?search=test&sort=view_count');
  });

  it('should handle multiple parameter changes', () => {
    (useSearchParams as any).mockReturnValue({
      get: vi.fn((key: string) => {
        if (key === 'sort') return 'view_count';
        if (key === 'tag') return 'Tech';
        return null;
      }),
      toString: vi.fn().mockReturnValue('sort=view_count&tag=Tech'),
    });

    render(<SortDropdown />);

    const commentCountButton = screen.getByText('댓글수');
    fireEvent.click(commentCountButton);

    // Should keep tag param and update sort
    expect(mockPush).toHaveBeenCalledWith('/ko?sort=comment_count&tag=Tech');
  });

  it('should apply correct styles to active option', () => {
    (useSearchParams as any).mockReturnValue({
      get: vi.fn((key: string) => (key === 'sort' ? 'comment_count' : null)),
      toString: vi.fn().mockReturnValue('sort=comment_count'),
    });

    render(<SortDropdown />);

    const commentCountButton = screen.getByText('댓글수');
    const viewCountButton = screen.getByText('조회수');
    const publishedDateButton = screen.getByText('최신순');

    // Active option should have font-medium
    expect(commentCountButton.className).toContain('font-medium');
    
    // Inactive options should not have font-medium in their active style
    expect(viewCountButton.className).not.toContain('font-medium');
    expect(publishedDateButton.className).not.toContain('font-medium');
  });

  it('should use Korean translations', () => {
    (useSearchParams as any).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
      toString: vi.fn().mockReturnValue(''),
    });

    render(<SortDropdown />);

    // Should display Korean labels
    expect(screen.getByText('최신순')).toBeDefined();
    expect(screen.getByText('조회수')).toBeDefined();
    expect(screen.getByText('댓글수')).toBeDefined();
  });
});
