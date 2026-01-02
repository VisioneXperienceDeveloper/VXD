import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/vxd/i); // Adjust based on actual title
  });

  test('should display blog posts', async ({ page }) => {
    await page.goto('/');
    // Check for a list of posts or a specific element that contains posts
    // This depends on the actual DOM structure
    // await expect(page.locator('article')).not.toHaveCount(0);
  });
});
