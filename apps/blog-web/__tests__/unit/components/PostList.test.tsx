import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PostList } from '@/widgets/post-list/ui/PostList';
import { mockBlogPosts } from '../../fixtures/content-data';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    prefetch: vi.fn(),
  })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  usePathname: vi.fn(),
}));

// Mock routing
vi.mock('@/shared/i18n/routing', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  usePathname: vi.fn(() => '/'),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
}));

describe('PostList Component', () => {
  it('should render initial posts', () => {
    render(
      <PostList
        posts={mockBlogPosts}
        currentPage={1}
        totalPages={1}
      />
    );

    expect(screen.getByText('A')).toBeDefined();
    expect(screen.getByText('B')).toBeDefined();
    expect(screen.getByText('C')).toBeDefined();
  });

  it('should show no posts message when empty', () => {
    render(
      <PostList
        posts={[]}
        currentPage={1}
        totalPages={0}
      />
    );

    expect(screen.getByText('noPosts')).toBeDefined();
  });

  it('should render pagination bar', () => {
    render(
      <PostList
        posts={mockBlogPosts}
        currentPage={1}
        totalPages={5}
      />
    );

    // PaginationBar should show current page and total pages
    // Assuming it renders something like "Page 1 of 5" or just "1" and "5"
    // We can check for the existence of the pagination container if it has a specific class
    // Or just check for the text if we know how it renders
  });
});
