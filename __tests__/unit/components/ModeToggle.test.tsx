import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModeToggle } from '@/components/ModeToggle';
import { useTheme } from 'next-themes';

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

describe('ModeToggle Component', () => {
  it('should render toggle button', () => {
    (useTheme as any).mockReturnValue({ theme: 'light', setTheme: vi.fn() });
    render(<ModeToggle />);
    expect(screen.getByLabelText('Toggle theme')).toBeDefined();
  });

  it('should toggle theme on click', () => {
    const setThemeMock = vi.fn();
    (useTheme as any).mockReturnValue({ theme: 'light', setTheme: setThemeMock });
    
    render(<ModeToggle />);
    const button = screen.getByLabelText('Toggle theme');
    fireEvent.click(button);
    
    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });
});
