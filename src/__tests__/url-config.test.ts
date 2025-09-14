import { isValidStyleManualUrl, STYLE_MANUAL_URLS, DEFAULT_SEARCH_URLS } from '../config/urls.js';

describe('URL Configuration', () => {
  describe('isValidStyleManualUrl', () => {
    test('should accept valid Style Manual URLs', () => {
      expect(isValidStyleManualUrl('https://www.stylemanual.gov.au/')).toBe(true);
      expect(isValidStyleManualUrl('https://stylemanual.gov.au/grammar')).toBe(true);
    });

    test('should reject invalid URLs', () => {
      expect(isValidStyleManualUrl('https://example.com/')).toBe(false);
      expect(isValidStyleManualUrl('https://malicious.stylemanual.gov.au/')).toBe(false);
      expect(isValidStyleManualUrl('not-a-url')).toBe(false);
    });
  });

  describe('URL Configuration', () => {
    test('should have all required URLs configured', () => {
      expect(STYLE_MANUAL_URLS.homepage).toBeDefined();
      expect(STYLE_MANUAL_URLS.grammarPunctuation).toBeDefined();
      expect(STYLE_MANUAL_URLS.accessibleContent).toBeDefined();
    });

    test('should have valid default search URLs', () => {
      expect(DEFAULT_SEARCH_URLS.length).toBeGreaterThan(0);
      DEFAULT_SEARCH_URLS.forEach(url => {
        expect(isValidStyleManualUrl(url)).toBe(true);
      });
    });
  });
});