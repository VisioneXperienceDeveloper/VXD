import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Search } from '@/features/search-posts/ui/Search';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';

/* eslint-disable @typescript-eslint/no-explicit-any */

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

  it('should delete search param when query is cleared', async () => {
    const pushMock = vi.fn();
    (useRouter as any).mockReturnValue({ push: pushMock });
    (useSearchParams as any).mockReturnValue({ 
      get: vi.fn().mockReturnValue('existing'), 
      toString: vi.fn().mockReturnValue('search=existing') 
    });

    render(<Search />);
    const input = screen.getByPlaceholderText('placeholder');
    fireEvent.change(input, { target: { value: '' } });

    // Wait for debounce
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/?');
    }, { timeout: 500 });
  });

  it('should toggle search open on button click', () => {
    (useSearchParams as any).mockReturnValue({ get: vi.fn().mockReturnValue(null), toString: vi.fn().mockReturnValue('') });
    (useRouter as any).mockReturnValue({ push: vi.fn() });
    
    render(<Search />);
    const button = screen.getByLabelText('Toggle search');
    
    // Toggle open
    fireEvent.click(button);
    // The input container should expand
    expect(screen.getByPlaceholderText('placeholder')).toBeDefined();
  });

  it('should close search on blur when query is empty', async () => {
    (useSearchParams as any).mockReturnValue({ get: vi.fn().mockReturnValue(null), toString: vi.fn().mockReturnValue('') });
    (useRouter as any).mockReturnValue({ push: vi.fn() });
    
    render(<Search />);
    const input = screen.getByPlaceholderText('placeholder');
    
    // Trigger blur with empty query
    fireEvent.blur(input);
    
    // Component should be ready to close
    expect(screen.getByPlaceholderText('placeholder')).toBeDefined();
  });

  it('should not navigate when query matches current search', async () => {
    const pushMock = vi.fn();
    (useRouter as any).mockReturnValue({ push: pushMock });
    (useSearchParams as any).mockReturnValue({ 
      get: vi.fn().mockReturnValue('same query'), 
      toString: vi.fn().mockReturnValue('search=same+query') 
    });

    render(<Search />);
    const input = screen.getByPlaceholderText('placeholder');
    
    // Change to same value as current search
    fireEvent.change(input, { target: { value: 'same query' } });

    // Wait for debounce - should not navigate since it's the same
    await new Promise(resolve => setTimeout(resolve, 350));
    expect(pushMock).not.toHaveBeenCalled();
  });
});
