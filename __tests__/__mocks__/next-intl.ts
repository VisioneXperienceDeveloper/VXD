import { vi } from 'vitest';

export const useLocale = vi.fn(() => 'en');
export const useTranslations = vi.fn(() => (key: string) => key);
export const Link = ({ children, href }: { children: React.ReactNode, href: string }) => children;
export const useRouter = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
}));
export const usePathname = vi.fn(() => '');
export const redirect = vi.fn();
export const permanentRedirect = vi.fn();
export const getPathname = vi.fn(() => '');

// For next-intl/routing
export const defineRouting = vi.fn(() => ({}));

// For next-intl/navigation
export const createNavigation = vi.fn(() => ({
  Link,
  redirect,
  usePathname,
  useRouter,
  permanentRedirect,
  getPathname,
}));
