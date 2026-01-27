import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';

// Mock next-themes
vi.mock('next-themes', () => ({
  ThemeProvider: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider" data-props={JSON.stringify(props)}>
      {children}
    </div>
  ),
}));

describe('ThemeProvider Component', () => {
  it('should wrap children with NextThemesProvider', () => {
    render(
      <ThemeProvider>
        <div data-testid="child">Child content</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-provider')).toBeDefined();
    expect(screen.getByTestId('child')).toBeDefined();
    expect(screen.getByText('Child content')).toBeDefined();
  });

  it('should pass props to NextThemesProvider', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="dark">
        <div>Content</div>
      </ThemeProvider>
    );

    const provider = screen.getByTestId('theme-provider');
    const props = JSON.parse(provider.getAttribute('data-props') || '{}');
    
    expect(props.attribute).toBe('class');
    expect(props.defaultTheme).toBe('dark');
  });

  it('should render multiple children', () => {
    render(
      <ThemeProvider>
        <div data-testid="first">First</div>
        <div data-testid="second">Second</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId('first')).toBeDefined();
    expect(screen.getByTestId('second')).toBeDefined();
  });
});
