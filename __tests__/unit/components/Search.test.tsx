import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Search } from '@/components/Search';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';

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
}));

// Mock routing
vi.mock('@/i18n/routing', () => ({
  useRouter: vi.fn(),
}));

describe('Search Component', () => {
  it('should render search input', () => {
    (useSearchParams as any).mockReturnValue({ get: vi.fn().mockReturnValue(null), toString: vi.fn().mockReturnValue('') });
    render(<Search />);
    expect(screen.getByPlaceholderText('placeholder')).toBeDefined();
  });

  it('should update input value on change', () => {
    (useSearchParams as any).mockReturnValue({ get: vi.fn().mockReturnValue(null), toString: vi.fn().mockReturnValue('') });
    render(<Search />);
    const input = screen.getByPlaceholderText('placeholder');
    fireEvent.change(input, { target: { value: 'test query' } });
    expect((input as HTMLInputElement).value).toBe('test query');
  });

  it('should navigate on search submit after debounce', async () => {
    const pushMock = vi.fn();
    (useRouter as any).mockReturnValue({ push: pushMock });
    (useSearchParams as any).mockReturnValue({ 
      get: vi.fn().mockReturnValue(null), 
      toString: vi.fn().mockReturnValue('') 
    });

    render(<Search />);
    const input = screen.getByPlaceholderText('placeholder');
    fireEvent.change(input, { target: { value: 'test query' } });

    // Wait for debounce
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/?search=test+query');
    }, { timeout: 500 });
  });
});
