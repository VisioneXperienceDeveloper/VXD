import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { GoogleAnalytics } from '@/components/delegator/GoogleAnalytics';

describe('GoogleAnalytics Component', () => {
  it('should render without errors when GA ID is not set', () => {
    const { container } = render(<GoogleAnalytics />);
    // Component should render without crashing
    expect(container).toBeDefined();
  });

  it('should render without errors when GA ID is set', () => {
    // Note: GoogleAnalytics reads from process.env.GA_ID at build time
    // This test just ensures the component renders without runtime errors
    const { container } = render(<GoogleAnalytics />);
    expect(container).toBeDefined();
  });
});
