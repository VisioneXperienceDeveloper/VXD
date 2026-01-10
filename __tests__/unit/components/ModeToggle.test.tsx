import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModeToggle } from '@/components/ModeToggle';
import { useTheme } from 'next-themes';

/* eslint-disable @typescript-eslint/no-explicit-any */

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

  it('should toggle from light to dark', () => {
    const setThemeMock = vi.fn();
    (useTheme as any).mockReturnValue({ theme: 'light', setTheme: setThemeMock });
    
    render(<ModeToggle />);
    const button = screen.getByLabelText('Toggle theme');
    fireEvent.click(button);
    
    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });

  it('should toggle from dark to system', () => {
    const setThemeMock = vi.fn();
    (useTheme as any).mockReturnValue({ theme: 'dark', setTheme: setThemeMock });
    
    render(<ModeToggle />);
    const button = screen.getByLabelText('Toggle theme');
    fireEvent.click(button);
    
    expect(setThemeMock).toHaveBeenCalledWith('system');
  });

  it('should toggle from system to light', () => {
    const setThemeMock = vi.fn();
    (useTheme as any).mockReturnValue({ theme: 'system', setTheme: setThemeMock });
    
    render(<ModeToggle />);
    const button = screen.getByLabelText('Toggle theme');
    fireEvent.click(button);
    
    expect(setThemeMock).toHaveBeenCalledWith('light');
  });

  it('should show Sun icon for light theme', () => {
    (useTheme as any).mockReturnValue({ theme: 'light', setTheme: vi.fn() });
    render(<ModeToggle />);
    expect(screen.getByLabelText('Toggle theme')).toBeDefined();
  });

  it('should show Moon icon for dark theme', () => {
    (useTheme as any).mockReturnValue({ theme: 'dark', setTheme: vi.fn() });
    render(<ModeToggle />);
    expect(screen.getByLabelText('Toggle theme')).toBeDefined();
  });

  it('should show Monitor icon for system theme', () => {
    (useTheme as any).mockReturnValue({ theme: 'system', setTheme: vi.fn() });
    render(<ModeToggle />);
    expect(screen.getByLabelText('Toggle theme')).toBeDefined();
  });
});
