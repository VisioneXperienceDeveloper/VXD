import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test('should allow searching', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.getByPlaceholder('Search...');
    await expect(searchInput).toBeVisible();
    
    await searchInput.fill('test');
    await searchInput.press('Enter');
    
    // Verify search results or URL change
    // await expect(page).toHaveURL(/search=test/);
  });
});
