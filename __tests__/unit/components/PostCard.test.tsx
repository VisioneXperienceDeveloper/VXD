import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PostCard } from '@/entities/post/ui/PostCard';
import { mockBlogPosts } from '../../fixtures/notion-data';

// Explicitly mock next/navigation to override any next-intl patching
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
  usePathname: vi.fn(),
  redirect: vi.fn(),
  permanentRedirect: vi.fn(),
  notFound: vi.fn(),
}));

// Mock next-intl to prevent it from trying to import next/navigation and failing
vi.mock('next-intl', () => ({
  useLocale: () => 'en',
  useTranslations: () => (key: string) => key,
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock routing
vi.mock('@/shared/i18n/routing', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

describe('PostCard Component', () => {
  const post = mockBlogPosts[0];

  it('should render post title and date', () => {
    render(<PostCard post={post} />);
    expect(screen.getByText(post.title)).toBeDefined();
    expect(screen.getByText(post.date)).toBeDefined();
  });

  it('should render placeholder when no cover image', () => {
    render(<PostCard post={post} />);
    expect(screen.getByText('📄')).toBeDefined();
  });
});
