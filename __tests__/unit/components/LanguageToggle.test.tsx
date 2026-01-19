import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageToggle } from '@/components/utils/LanguageToggle';

// Mock the hooks
const mockUseLocale = vi.fn();
const mockReplace = vi.fn();
const mockUseRouter = vi.fn(() => ({ replace: mockReplace }));
const mockUsePathname = vi.fn();

vi.mock('next-intl', () => ({
  useLocale: () => mockUseLocale(),
}));

vi.mock('@/i18n/routing', () => ({
  useRouter: () => mockUseRouter(),
  usePathname: () => mockUsePathname(),
}));

describe('LanguageToggle Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render current language', () => {
    mockUseLocale.mockReturnValue('ko');
    mockUsePathname.mockReturnValue('/');

    render(<LanguageToggle />);
    expect(screen.getByText('KR')).toBeDefined();
  });

  it('should toggle language on click', () => {
    mockUseLocale.mockReturnValue('ko');
    mockUsePathname.mockReturnValue('/');

    render(<LanguageToggle />);
    const button = screen.getByLabelText('Toggle language');
    fireEvent.click(button);

    expect(mockReplace).toHaveBeenCalledWith('/', { locale: 'en' });
  });

  it('should use translationSlug if provided', () => {
    mockUseLocale.mockReturnValue('ko');
    mockUsePathname.mockReturnValue('/post/1');

    render(<LanguageToggle translationSlug="translated-slug" />);
    const button = screen.getByLabelText('Toggle language');
    fireEvent.click(button);

    expect(mockReplace).toHaveBeenCalledWith('/translated-slug', { locale: 'en' });
  });
});
