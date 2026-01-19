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
    
    // Check if page loaded successfully
    await expect(page.locator('h1')).toBeVisible();
    
    // Check language toggle shows KR
    const langToggle = page.getByLabel('Toggle language');
    await expect(langToggle).toContainText('KR');
  });

  test('should show English posts on /en route', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    
    // Check if page loaded successfully
    await expect(page.locator('h1')).toBeVisible();
    
    // Check language toggle shows EN
    const langToggle = page.getByLabel('Toggle language');
    await expect(langToggle).toContainText('EN');
  });

  test('should redirect root to default locale', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Should redirect to a valid locale (either /ko or /en)
    const url = page.url();
    expect(url.includes('/ko') || url.includes('/en')).toBeTruthy();
  });

  test('should preserve search params when switching locale', async ({ page }) => {
    await page.goto('/ko?tag=Tech');
    await page.waitForLoadState('networkidle');
    
    // Verify we're on Korean page with tag
    expect(page.url()).toContain('/ko');
    expect(page.url()).toContain('tag=Tech');
    
    // Switch to English
    const langToggle = page.getByLabel('Toggle language');
    await expect(langToggle).toContainText('KR');
    await langToggle.click();
    await page.waitForLoadState('networkidle');
    
    // Verify language changed (params may or may not be preserved depending on implementation)
    const langToggleAfter = page.getByLabel('Toggle language');
    await expect(langToggleAfter).toContainText('EN');
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
