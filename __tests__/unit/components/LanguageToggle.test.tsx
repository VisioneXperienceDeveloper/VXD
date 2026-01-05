import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

// Mocks are handled by vitest.config.ts aliases, but we need to mock specific return values
vi.mock('next-intl', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as any),
    useLocale: vi.fn(),
  };
});

vi.mock('@/i18n/routing', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

describe('LanguageToggle Component', () => {
  it('should render current language', () => {
    (useLocale as any).mockReturnValue('ko');
    (useRouter as any).mockReturnValue({ replace: vi.fn() });
    (usePathname as any).mockReturnValue('/');

    render(<LanguageToggle />);
    expect(screen.getByText('KR')).toBeDefined();
  });

  it('should toggle language on click', () => {
    const replaceMock = vi.fn();
    (useLocale as any).mockReturnValue('ko');
    (useRouter as any).mockReturnValue({ replace: replaceMock });
    (usePathname as any).mockReturnValue('/');

    render(<LanguageToggle />);
    const button = screen.getByLabelText('Toggle language');
    fireEvent.click(button);

    expect(replaceMock).toHaveBeenCalledWith('/', { locale: 'en' });
  });

  it('should use translationId if provided', () => {
    const replaceMock = vi.fn();
    (useLocale as any).mockReturnValue('ko');
    (useRouter as any).mockReturnValue({ replace: replaceMock });
    (usePathname as any).mockReturnValue('/post/1');

    render(<LanguageToggle translationId="translated-id" />);
    const button = screen.getByLabelText('Toggle language');
    fireEvent.click(button);

    expect(replaceMock).toHaveBeenCalledWith('/translated-id', { locale: 'en' });
  });
});
