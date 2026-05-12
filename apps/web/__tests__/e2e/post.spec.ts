import { test, expect } from '@playwright/test';

test.describe('Post Detail Page', () => {
  test('should display post content and related posts', async ({ page }) => {
    await page.goto('/ko');
    
    const mainContent = page.locator('.lg\\:col-span-3');
    const postLink = mainContent.locator('a').first();
    
    if (await postLink.count() > 0) {
        await postLink.click();
        
        // Check for title
        await expect(page.locator('h1')).toBeVisible();
        
        // Check for "Back to Garden" link
        await expect(page.getByText('뒤로')).toBeVisible();
        
        // Check for related posts sidebar
        // It might say "More in [Group]" or "More in this blog"
        await expect(page.locator('h3', { hasText: /의 다른 글/ })).toBeVisible();
    }
  });
});
