// @ts-check
const { test, expect } = require('@playwright/test');

// Test site-wide search in navigation
test('Site-wide search functionality works', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('http://localhost:4000/ai-demystified/');
  
  // Check if the search input exists
  const searchInput = await page.locator('#site-search-input');
  await expect(searchInput).toBeVisible();
  
  // Take a screenshot of the initial state
  await page.screenshot({ path: 'initial-state.png' });
  
  // Enter a search term
  await searchInput.fill('model');
  
  // Wait for search results to appear
  await page.waitForTimeout(500); // Wait for debounce
  
  // Check if the search results container is active
  const searchResults = await page.locator('#site-search-results');
  await expect(searchResults).toHaveClass(/active/);
  
  // Take a screenshot of the search results
  await page.screenshot({ path: 'search-results.png' });
  
  // Check if there are actual results
  const resultsCount = await page.locator('#site-search-results li').count();
  expect(resultsCount).toBeGreaterThan(0);
  
  console.log(`Found ${resultsCount} search results for 'model'`);
  console.log('Site-wide search functionality works');
});

// Test glossary search functionality
test('Glossary search functionality works', async ({ page }) => {
  // Navigate to the glossary page
  await page.goto('http://localhost:4000/ai-demystified/content/glossary/');
  
  // Check if the glossary search input exists
  const glossarySearchInput = await page.locator('#glossary-search-input');
  await expect(glossarySearchInput).toBeVisible();
  
  // Take a screenshot of the initial state
  await page.screenshot({ path: 'glossary-initial.png' });
  
  // Count initial number of glossary entries
  const initialEntryCount = await page.locator('#glossary-entries-list li').count();
  console.log(`Initial glossary entries: ${initialEntryCount}`);
  
  // Enter a search term
  await glossarySearchInput.fill('neural');
  
  // Wait for the list to update
  await page.waitForTimeout(500); // Allow debounce to complete
  
  // Take a screenshot of filtered results
  await page.screenshot({ path: 'glossary-filtered.png' });
  
  // Count filtered entries
  const filteredEntryCount = await page.locator('#glossary-entries-list li').count();
  console.log(`Filtered glossary entries: ${filteredEntryCount}`);
  
  // There should be fewer entries after filtering (assuming not all entries contain "neural")
  expect(filteredEntryCount).toBeLessThan(initialEntryCount);
  
  // Verify that entries containing "neural" are still visible
  const neuralEntries = await page.locator('#glossary-entries-list li a:text-matches("neural", "i")').count();
  expect(neuralEntries).toBeGreaterThan(0);
  
  console.log('Glossary search functionality works');
});