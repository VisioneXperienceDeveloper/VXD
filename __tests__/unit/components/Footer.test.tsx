import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '@/widgets/footer';

// Mock next-intl server
vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string, params?: { year?: number }) => {
    if (key === 'copyright' && params?.year) {
      return `© ${params.year} VXD Blog`;
    }
    return key;
  }),
}));

// Mock routing
vi.mock('@/i18n/routing', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('Footer Component', () => {
  it('should render footer with links', async () => {
    const FooterComponent = await Footer();
    render(FooterComponent);

    expect(screen.getByText('about')).toBeDefined();
    expect(screen.getByText('privacy')).toBeDefined();
    expect(screen.getByText('terms')).toBeDefined();
  });

  it('should render copyright with current year', async () => {
    const FooterComponent = await Footer();
    render(FooterComponent);

    const year = new Date().getFullYear();
    expect(screen.getByText(`© ${year} VXD Blog`)).toBeDefined();
  });

  it('should have correct link hrefs', async () => {
    const FooterComponent = await Footer();
    render(FooterComponent);

    const aboutLink = screen.getByText('about').closest('a');
    const privacyLink = screen.getByText('privacy').closest('a');
    const termsLink = screen.getByText('terms').closest('a');

    expect(aboutLink?.getAttribute('href')).toBe('/about');
    expect(privacyLink?.getAttribute('href')).toBe('/privacy');
    expect(termsLink?.getAttribute('href')).toBe('/terms');
  });
});
