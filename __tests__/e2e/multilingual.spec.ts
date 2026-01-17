import { test, expect } from '@playwright/test';

test.describe('Multilingual Navigation', () => {
  test('should load Korean homepage at /ko', async ({ page }) => {
    await page.goto('/ko');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check for Korean content
    await expect(page.locator('h1')).toContainText('VXD Blog');
    
    // Check language toggle shows KR
    const langToggle = page.getByLabel('Toggle language');
    await expect(langToggle).toContainText('KR');
  });

  test('should load English homepage at /en', async ({ page }) => {
    await page.goto('/en');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check for English content
    await expect(page.locator('h1')).toContainText('VXD Blog');
    
    // Check language toggle shows EN
    const langToggle = page.getByLabel('Toggle language');
    await expect(langToggle).toContainText('EN');
  });

  test('should switch from Korean to English', async ({ page }) => {
    await page.goto('/ko');
    await page.waitForLoadState('networkidle');
    
    // Click language toggle
    const langToggle = page.getByLabel('Toggle language');
    await expect(langToggle).toContainText('KR');
    await langToggle.click();
    
    // Wait for navigation
    await page.waitForURL('/en');
    
    // Verify language changed
    await expect(langToggle).toContainText('EN');
  });

  test('should switch from English to Korean', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    
    // Click language toggle
    const langToggle = page.getByLabel('Toggle language');
    await expect(langToggle).toContainText('EN');
    await langToggle.click();
    
    // Wait for navigation
    await page.waitForURL('/ko');
    
    // Verify language changed
    await expect(langToggle).toContainText('KR');
  });

  test('should maintain locale when navigating to posts', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    
    // Find and click first post (if exists)
    const firstPost = page.locator('article a').first();
    const postExists = await firstPost.count() > 0;
    
    if (postExists) {
      await firstPost.click();
      await page.waitForLoadState('networkidle');
      
      // Verify still on English locale
      const langToggle = page.getByLabel('Toggle language');
      await expect(langToggle).toContainText('EN');
      
      // URL should start with /en/
      expect(page.url()).toContain('/en/');
    }
  });

  test('should show Korean posts on /ko route', async ({ page }) => {
    await page.goto('/ko');
    await page.waitForLoadState('networkidle');
    
    // Check if posts are loaded
    const posts = page.locator('article');
    const postCount = await posts.count();
    
    // Should have at least some posts or show "no posts" message
    if (postCount === 0) {
      await expect(page.locator('text=noPosts')).toBeVisible();
    } else {
      expect(postCount).toBeGreaterThan(0);
    }
  });

  test('should show English posts on /en route', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    
    // Check if posts are loaded
    const posts = page.locator('article');
    const postCount = await posts.count();
    
    // Should have at least some posts or show "no posts" message
    if (postCount === 0) {
      await expect(page.locator('text=noPosts')).toBeVisible();
    } else {
      expect(postCount).toBeGreaterThan(0);
    }
  });

  test('should redirect root to default locale', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Should redirect to /ko (default locale)
    expect(page.url()).toContain('/ko');
  });

  test('should preserve search params when switching locale', async ({ page }) => {
    await page.goto('/ko?tag=Tech');
    await page.waitForLoadState('networkidle');
    
    // Switch to English
    const langToggle = page.getByLabel('Toggle language');
    await langToggle.click();
    await page.waitForURL('/en?tag=Tech');
    
    // Verify tag parameter is preserved
    expect(page.url()).toContain('tag=Tech');
  });

  test('should handle invalid locale gracefully', async ({ page }) => {
    // Try to access invalid locale
    const response = await page.goto('/fr');
    
    // Should either redirect to valid locale or show 404
    // Next.js typically redirects to default locale
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url.includes('/ko') || url.includes('/en') || response?.status() === 404).toBeTruthy();
  });
});
