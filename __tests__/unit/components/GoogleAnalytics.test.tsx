import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';

// Mock next/script
vi.mock('next/script', () => ({
  default: ({ children, src, id }: { children?: React.ReactNode; src?: string; id?: string }) => (
    <script data-testid={id || 'script'} src={src}>
      {children}
    </script>
  ),
}));

describe('GoogleAnalytics Component', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should render nothing when GA ID is not set', () => {
    delete process.env.NEXT_PUBLIC_GA_ID;
    const { container } = render(<GoogleAnalytics />);
    expect(container.innerHTML).toBe('');
  });

  it('should render scripts when GA ID is set', () => {
    process.env.NEXT_PUBLIC_GA_ID = 'G-TESTID123';
    const { container } = render(<GoogleAnalytics />);
    
    const scripts = container.querySelectorAll('script');
    expect(scripts.length).toBe(2);
  });

  it('should include GA ID in script src', () => {
    process.env.NEXT_PUBLIC_GA_ID = 'G-TESTID123';
    const { container } = render(<GoogleAnalytics />);
    
    const externalScript = container.querySelector('script[src*="googletagmanager"]');
    expect(externalScript?.getAttribute('src')).toContain('G-TESTID123');
  });

  it('should include GA config in inline script', () => {
    process.env.NEXT_PUBLIC_GA_ID = 'G-TESTID123';
    const { container } = render(<GoogleAnalytics />);
    
    const inlineScript = container.querySelector('script[data-testid="google-analytics"]');
    expect(inlineScript?.textContent).toContain('G-TESTID123');
    expect(inlineScript?.textContent).toContain("gtag('config'");
  });
});
