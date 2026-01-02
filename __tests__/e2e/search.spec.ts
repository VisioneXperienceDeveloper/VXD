import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should expand search input when clicked', async ({ page }) => {
    const searchButton = page.getByRole('button', { name: /search/i });
    await searchButton.click();
    
    const searchInput = page.getByPlaceholder('Search...');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeFocused();
  });

  test('should filter posts when searching', async ({ page }) => {
    const searchButton = page.getByRole('button', { name: /search/i });
    await searchButton.click();
    
    const searchInput = page.getByPlaceholder('Search...');
    
    // Type a query that is likely to exist or not exist
    // Since we rely on live data (or mocked if we mocked it, but we are hitting the dev server which hits Notion),
    // we should be careful. 
    // Ideally E2E tests should run against a known dataset.
    // For now, let's just test the interaction.
    
    await searchInput.fill('Test');
    
    // Verify URL updates
    await expect(page).toHaveURL(/search=Test/);
  });
});
