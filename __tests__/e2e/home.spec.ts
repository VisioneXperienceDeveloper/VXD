import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'VXD Blog' })).toBeVisible();
  });

  test('should display the sidebar with categories', async ({ page }) => {
    await expect(page.getByRole('complementary').getByText('Categories')).toBeVisible();
    await expect(page.getByRole('link', { name: 'All Posts' })).toBeVisible();
  });

  test('should display the sidebar with top tags', async ({ page }) => {
    await expect(page.getByRole('complementary').getByText('Top Tags')).toBeVisible();
  });

  test('should display blog posts', async ({ page }) => {
    // Check for the grid container
    const grid = page.locator('.grid.gap-8');
    await expect(grid).toBeVisible();
  });

  test('should navigate to a post when clicked', async ({ page }) => {
    // Wait for posts to load
    const mainContent = page.locator('.lg\\:col-span-3');
    const postLink = mainContent.locator('a[href^="/"]').first();
    
    if (await postLink.count() > 0) {
        const postTitle = (await postLink.locator('h2').textContent())?.trim();
        await postLink.click();
        await page.waitForURL('**/*-*-*-*-*'); // Expect a UUID-like pattern or just any change
        await expect(page.locator('h1')).toContainText(postTitle || '');
    }
  });
});
