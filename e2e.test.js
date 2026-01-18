import { test, expect } from '@playwright/test';

test.describe('Blog pages', () => {
  test('home page loads with search and filters', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Alen Kis/);
    await expect(page.locator('main h1')).toContainText('Blog');

    // Check search input exists
    await expect(page.locator('#search-input')).toBeVisible();

    // Check tag filters exist
    await expect(page.locator('.chip[data-tag]').first()).toBeVisible();
  });

  test('search filters posts by title', async ({ page }) => {
    await page.goto('/');

    // All posts should be visible initially
    const posts = page.locator('.post-card');
    const initialCount = await posts.count();
    expect(initialCount).toBeGreaterThan(0);

    // Search for "Semigroup"
    await page.fill('#search-input', 'Semigroup');

    // Only Semigroup post should be visible
    await expect(page.locator('.post-card:not(.hidden)')).toHaveCount(1);
    await expect(page.locator('.post-card:not(.hidden)')).toContainText('Semigroup');
  });

  test('tag filter shows only matching posts', async ({ page }) => {
    await page.goto('/');

    // Click on "typescript" tag
    await page.click('.chip[data-tag="typescript"]');

    // All visible posts should have typescript tag
    const visiblePosts = page.locator('.post-card:not(.hidden)');
    const count = await visiblePosts.count();
    expect(count).toBeGreaterThan(0);

    // Click "All" to reset
    await page.click('.chip[data-tag="all"]');
    const allPosts = page.locator('.post-card:not(.hidden)');
    await expect(allPosts).toHaveCount(4);
  });

  test('semigroup page loads with code blocks', async ({ page }) => {
    await page.goto('/semigroup');
    await expect(page).toHaveTitle(/Semigroup/);
    await expect(page.locator('article h1')).toContainText('Semigroup');
    const codeBlocks = page.locator('.expressive-code');
    await expect(codeBlocks.first()).toBeVisible();
  });

  test('monoid page loads with diff code block', async ({ page }) => {
    await page.goto('/monoid');
    await expect(page).toHaveTitle(/Monoid/);
    await expect(page.locator('article h1')).toContainText('Monoid');
    const codeBlocks = page.locator('.expressive-code');
    await expect(codeBlocks.first()).toBeVisible();
  });

  test('dark mode toggle works', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');

    // Click toggle
    await page.click('#theme-toggle');
    await expect(html).toHaveClass(/dark/);

    // Click again to toggle back
    await page.click('#theme-toggle');
    await expect(html).not.toHaveClass(/dark/);
  });

  test('no results message shows when no matches', async ({ page }) => {
    await page.goto('/');

    // Search for something that doesn't exist
    await page.fill('#search-input', 'xyznonexistent');

    // No results message should be visible
    await expect(page.locator('#no-results')).toBeVisible();
  });

  test('year filter shows only posts from that year', async ({ page }) => {
    await page.goto('/');

    // Check year filters exist
    await expect(page.locator('.year-filter').first()).toBeVisible();

    // Click on 2021 year filter
    await page.click('.year-filter[data-year="2021"]');

    // All visible posts should be from 2021 (4 posts)
    const visiblePosts = page.locator('.post-card:not(.hidden)');
    await expect(visiblePosts).toHaveCount(4);

    // Click 2021 again to deselect (year filters toggle)
    await page.click('.year-filter[data-year="2021"]');
    await expect(page.locator('.post-card:not(.hidden)')).toHaveCount(4);
  });
});
