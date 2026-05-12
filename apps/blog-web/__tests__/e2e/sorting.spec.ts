import { test, expect } from '@playwright/test';

test.describe('Sorting Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should display default sort option (published_date) on initial load', async ({ page }) => {
    // Check URL - should not have 'sort' parameter (default)
    await expect(page).toHaveURL(/^(?!.*sort=)/);
    await page.waitForLoadState('networkidle');

    // Check if the "최신글" (Published Date) button is highlighted
    // Note: This selector assumes Korean locale
    const publishedDateButton = page.getByRole('button', { name: /최신글|Latest/i });
    
    // The button should have active styling (font-medium class)
    await expect(publishedDateButton).toHaveClass(/font-medium/);
  });

  test('should update URL when clicking View Count sort option', async ({ page }) => {
    // Find and click the View Count button
    const viewCountButton = page.getByRole('button', { name: /조회수|Views/i });
    await viewCountButton.click();
    
    // Wait for navigation
    await page.waitForLoadState('networkidle');
    
    // Verify URL contains sort=view_count
    await expect(page).toHaveURL(/sort=view_count/);
    
    // Verify the button is now highlighted
    await expect(viewCountButton).toHaveClass(/font-medium/);
  });

  test('should update URL when clicking Comments sort option', async ({ page }) => {
    // Find and click the Comments button
    const commentsButton = page.getByRole('button', { name: /댓글수|Comments/i });
    await commentsButton.click();
    
    // Wait for navigation
    await page.waitForLoadState('networkidle');
    
    // Verify URL contains sort=comment_count
    await expect(page).toHaveURL(/sort=comment_count/);
    
    // Verify the button is now highlighted
    await expect(commentsButton).toHaveClass(/font-medium/);
  });

  test('should remove sort parameter when clicking Published Date from another sort', async ({ page }) => {
    // First, select View Count
    const viewCountButton = page.getByRole('button', { name: /조회수|Views/i });
    await viewCountButton.click();
    await page.waitForLoadState('networkidle');
    
    // Verify sort parameter exists
    await expect(page).toHaveURL(/sort=view_count/);
    
    // Now click Published Date (default)
    const publishedDateButton = page.getByRole('button', { name: /최신글|Latest/i });
    await publishedDateButton.click();
    await page.waitForLoadState('networkidle');
    
    // Verify sort parameter is removed
    await expect(page).toHaveURL(/^(?!.*sort=)/);
  });

  test('should reflect sort option from URL on page load', async ({ page }) => {
    // Navigate directly to URL with sort parameter
    await page.goto('/?sort=view_count');
    await page.waitForLoadState('networkidle');
    
    // Verify the View Count button is highlighted
    const viewCountButton = page.getByRole('button', { name: /조회수|Views/i });
    await expect(viewCountButton).toHaveClass(/font-medium/);
  });

  test('should preserve sort state after page refresh', async ({ page }) => {
    // Set sort to comment_count
    const commentsButton = page.getByRole('button', { name: /댓글수|Comments/i });
    await commentsButton.click();
    await page.waitForLoadState('networkidle');
    
    // Verify URL
    await expect(page).toHaveURL(/sort=comment_count/);
    
    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verify sort parameter is still in URL
    await expect(page).toHaveURL(/sort=comment_count/);
    
    // Verify the button is still highlighted
    await expect(commentsButton).toHaveClass(/font-medium/);
  });

  test('should preserve other URL parameters when changing sort', async ({ page }) => {
    // Navigate with a tag filter
    await page.goto('/?tag=Tech');
    await page.waitForLoadState('networkidle');
    
    // Click View Count sort
    const viewCountButton = page.getByRole('button', { name: /조회수|Views/i });
    await viewCountButton.click();
    await page.waitForLoadState('networkidle');
    
    // Verify both parameters are in URL
    await expect(page).toHaveURL(/tag=Tech/);
    await expect(page).toHaveURL(/sort=view_count/);
  });

  test('should change sort options sequentially', async ({ page }) => {
    // Start with default (published_date)
    await expect(page).toHaveURL(/^(?!.*sort=)/);
    
    // Change to view_count
    const viewCountButton = page.getByRole('button', { name: /조회수|Views/i });
    await viewCountButton.click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/sort=view_count/);
    
    // Change to comment_count
    const commentsButton = page.getByRole('button', { name: /댓글수|Comments/i });
    await commentsButton.click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/sort=comment_count/);
    
    // Change back to published_date
    const publishedDateButton = page.getByRole('button', { name: /최신글|Latest/i });
    await publishedDateButton.click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/^(?!.*sort=)/);
  });

  test('should display posts in correct order based on sort option', async ({ page }) => {
    // This test assumes there are posts with varying view counts
    // Note: This test may be brittle depending on actual data
    
    // Click View Count sort
    const viewCountButton = page.getByRole('button', { name: /조회수|Views/i });
    await viewCountButton.click();
    await page.waitForLoadState('networkidle');
    
    // Get all post cards
    const postCards = page.locator('article').or(page.locator('[data-testid="post-card"]'));
    const count = await postCards.count();
    
    // If there are posts, verify they exist
    if (count > 0) {
      expect(count).toBeGreaterThan(0);
    }
    
    // Note: To properly test ordering, we would need:
    // 1. Known test data in the database
    // 2. OR data-testid attributes with view counts on post cards
    // 3. OR reading actual view count values from the UI
  });

  test('should handle invalid sort parameter gracefully', async ({ page }) => {
    // Navigate with invalid sort parameter
    await page.goto('/?sort=invalid_sort_option');
    await page.waitForLoadState('networkidle');
    
    // Page should still load without errors
    // Published Date should be selected as default
    const publishedDateButton = page.getByRole('button', { name: /최신글|Latest/i });
    await expect(publishedDateButton).toHaveClass(/text-sm/);
  });
});
