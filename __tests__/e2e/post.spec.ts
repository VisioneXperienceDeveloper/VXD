import { test, expect } from '@playwright/test';

test.describe('Post Detail Page', () => {
  test('should display post content and related posts', async ({ page }) => {
    await page.goto('/');
    
    const mainContent = page.locator('.lg\\:col-span-3');
    const postLink = mainContent.locator('a').first();
    
    if (await postLink.count() > 0) {
        await postLink.click();
        
        // Check for title
        await expect(page.locator('h1')).toBeVisible();
        
        // Check for "Back to Garden" link
        await expect(page.getByText('Back to Garden')).toBeVisible();
        
        // Check for related posts sidebar
        // It might say "More in [Group]" or "More in this blog"
        await expect(page.getByText(/More in/)).toBeVisible();
    }
  });
});
