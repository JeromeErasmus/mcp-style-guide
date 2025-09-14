// src/config/urls.ts
export const STYLE_MANUAL_URLS: Record<string, string> = {
  // Core sections
  homepage: 'https://www.stylemanual.gov.au/',
  
  // Writing guidance
  writingContent: 'https://www.stylemanual.gov.au/writing-and-designing-content/',
  contentStructure: 'https://www.stylemanual.gov.au/writing-and-designing-content/content-structure/',
  writingStyle: 'https://www.stylemanual.gov.au/writing-and-designing-content/writing-style/',
  
  // Grammar and conventions
  grammarPunctuation: 'https://www.stylemanual.gov.au/grammar-punctuation-and-conventions/',
  punctuation: 'https://www.stylemanual.gov.au/grammar-punctuation-and-conventions/punctuation/',
  grammar: 'https://www.stylemanual.gov.au/grammar-punctuation-and-conventions/grammar/',
  capitalisation: 'https://www.stylemanual.gov.au/grammar-punctuation-and-conventions/capitalisation/',
  
  // Accessibility and inclusion
  accessibleContent: 'https://www.stylemanual.gov.au/accessible-and-inclusive-content/',
  inclusiveLanguage: 'https://www.stylemanual.gov.au/accessible-and-inclusive-content/inclusive-language/',
  writingAccessibility: 'https://www.stylemanual.gov.au/accessible-and-inclusive-content/writing-accessible-content/',
  
  // Formatting and presentation
  formatting: 'https://www.stylemanual.gov.au/formatting/',
  lists: 'https://www.stylemanual.gov.au/formatting/lists/',
  numbers: 'https://www.stylemanual.gov.au/formatting/numbers/',
  dates: 'https://www.stylemanual.gov.au/formatting/dates-and-time/'
};

// Default URLs for search when none specified
export const DEFAULT_SEARCH_URLS: string[] = [
  STYLE_MANUAL_URLS.writingContent,
  STYLE_MANUAL_URLS.grammarPunctuation,
  STYLE_MANUAL_URLS.accessibleContent,
  STYLE_MANUAL_URLS.formatting,
  STYLE_MANUAL_URLS.writingStyle,
  STYLE_MANUAL_URLS.punctuation,
  STYLE_MANUAL_URLS.inclusiveLanguage
];

// URL validation
export const ALLOWED_DOMAIN = 'stylemanual.gov.au';

export function isValidStyleManualUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === ALLOWED_DOMAIN || urlObj.hostname === `www.${ALLOWED_DOMAIN}`;
  } catch {
    return false;
  }
}