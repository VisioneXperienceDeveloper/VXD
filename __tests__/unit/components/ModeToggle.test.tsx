import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModeToggle } from '@/components/ModeToggle';
import { useTheme } from 'next-themes';

// Mock useTheme
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

describe('ModeToggle Component', () => {
  it('should render toggle button', () => {
    (useTheme as any).mockReturnValue({ setTheme: vi.fn(), theme: 'light' });
    render(<ModeToggle />);
    expect(screen.getByRole('button')).toBeDefined();
  });

  it('should toggle theme on click', () => {
    const setThemeMock = vi.fn();
    (useTheme as any).mockReturnValue({ setTheme: setThemeMock, theme: 'light' });
    render(<ModeToggle />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });
});
