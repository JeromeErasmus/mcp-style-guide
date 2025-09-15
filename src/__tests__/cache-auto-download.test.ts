import { searchContentTool } from '../tools/search-content.js';
import { rewriteDocumentTool } from '../tools/rewrite-document.js';
import { promises as fs } from 'fs';
import path from 'path';

// Mock the GlobalCache to avoid import.meta issues in tests
jest.mock('../utils/cache.js', () => {
  return {
    GlobalCache: jest.fn().mockImplementation(() => ({
      cachePath: '/tmp/test-cache',
      sectionPath: '/tmp/test-cache/sections',
      isCachePopulated: jest.fn().mockResolvedValue(false),
      getAllCachedFiles: jest.fn().mockResolvedValue([]),
      getCachedFile: jest.fn().mockResolvedValue(null),
      ensureCacheDirectories: jest.fn().mockResolvedValue(undefined)
    }))
  };
});

describe('Cache Auto-Download Integration', () => {
  // The GlobalCache is mocked above to simulate empty cache

  describe('search_style_content tool', () => {
    test('should fall back to web fetching when cache is not available', async () => {
      // Mock cache indicates empty cache (isCachePopulated returns false)
      
      // Execute search with limited URLs - should fall back to web fetching
      const result = await searchContentTool.handler({
        query: 'plain language',
        urls: ['https://www.stylemanual.gov.au/writing-and-designing-content/clear-language-and-writing-style/plain-language-and-word-choice']
      });

      expect(result.content).toBeDefined();
      expect(result.content[0].text).toBeDefined();
      
      // The result should not contain cache indicator since cache is empty
      const resultText = result.content[0].text;
      expect(resultText).not.toContain('Results from cached content');
      
      // The tool should work with web fetching
      expect(typeof resultText).toBe('string');
      expect(resultText.length).toBeGreaterThan(0);
    }, 30000);

    test('should handle search without cache gracefully', async () => {
      // With mocked empty cache, tool should fall back to web fetching
      
      // Execute search with specific URLs to limit scope
      const result = await searchContentTool.handler({
        query: 'active voice',
        urls: ['https://www.stylemanual.gov.au/writing-and-designing-content/clear-language-and-writing-style/voice-and-tone']
      });

      expect(result.content).toBeDefined();
      expect(result.content[0].text).toBeDefined();
      
      // Should complete successfully but slower without cache
      const resultText = result.content[0].text;
      expect(typeof resultText).toBe('string');
      expect(resultText.length).toBeGreaterThan(0);
    }, 30000);
  });

  describe('rewrite_with_style_guide tool', () => {
    test('should fall back to URL fetching when cache is unavailable', async () => {
      // Mock cache is empty (isCachePopulated returns false)
      
      // Execute rewrite - should fall back to URL fetching
      const result = await rewriteDocumentTool.handler({
        document: "The utilisation of complex methodologies requires careful consideration.",
        focusAreas: ['plain-language'],
        targetAudience: 'general-public',
        explanation: false
      });

      expect(result.content).toBeDefined();
      expect(result.content[0].text).toBeDefined();
      
      // Should complete successfully but with URL-based guideline extraction
      const resultText = result.content[0].text;
      expect(typeof resultText).toBe('string');
      expect(resultText.length).toBeGreaterThan(0);
      
      // Should contain rewritten document structure
      expect(resultText).toContain('# Rewritten Document');
    }, 30000);

    test('should handle multiple focus areas without cache', async () => {
      // Mock cache is empty - should fall back to URL fetching
      
      // Execute rewrite with multiple focus areas - should work but be slower
      const result = await rewriteDocumentTool.handler({
        document: "The govt. will utilise e.g. various methodologies.",
        focusAreas: ['plain-language', 'shortened-words'],
        targetAudience: 'general-public',
        explanation: false
      });

      expect(result.content).toBeDefined();
      expect(result.content[0].text).toBeDefined();
      
      // Should complete successfully
      const resultText = result.content[0].text;
      expect(typeof resultText).toBe('string');
      expect(resultText.length).toBeGreaterThan(0);
      
      // Should contain rewritten document structure
      expect(resultText).toContain('# Rewritten Document');
    }, 45000);
  });

  describe('Cache behavior validation', () => {
    test('should demonstrate tools work without cache (fallback behavior)', async () => {
      // With mocked empty cache, tools should fall back gracefully
      
      // Test that the basic transformations work even without extensive guidelines from cache
      const result = await rewriteDocumentTool.handler({
        document: "The utilisation of complex methodologies requires careful consideration.",
        focusAreas: ['plain-language'],
        targetAudience: 'general-public',
        explanation: false
      });

      expect(result.content).toBeDefined();
      expect(result.content[0].text).toBeDefined();
      
      const resultText = result.content[0].text;
      expect(typeof resultText).toBe('string');
      expect(resultText.length).toBeGreaterThan(0);
      
      // The basic rewrite structure should still work
      expect(resultText).toContain('# Rewritten Document');
      // The original text should be present (even if not significantly transformed without cache)
      expect(resultText).toContain('methodologies');
    }, 30000);

    test('should verify that cache auto-download is NOT implemented (current behavior)', async () => {
      // This test documents current behavior: tools fall back to web fetching
      // rather than automatically downloading cache when it's unavailable
      
      const result = await searchContentTool.handler({
        query: 'test search',
        urls: ['https://www.stylemanual.gov.au/writing-and-designing-content/clear-language-and-writing-style/plain-language-and-word-choice']
      });

      expect(result.content).toBeDefined();
      
      // Result should NOT contain cache indicators since cache is empty
      const resultText = result.content[0].text;
      expect(resultText).not.toContain('Results from cached content');
      
      // This confirms that tools work without cache but don't auto-download
      // If auto-download were implemented, this behavior would change
    }, 30000);
  });
});