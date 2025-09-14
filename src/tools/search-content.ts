import { z } from 'zod';
import { SimpleContentExtractor } from '../extraction/content-extractor.js';
import { SimpleSearch } from '../search/simple-search.js';
import { BatchProcessor } from '../processing/batch-processor.js';
import { formatSearchResults } from '../utils/formatters.js';
import { handleToolError } from '../utils/errors.js';
import { ToolError } from '../types/index.js';

export const searchContentTool = {
  name: "search_style_content",
  description: "Search for terms across Style Manual pages",
  inputSchema: z.object({
    query: z.string(),
    urls: z.array(z.string().url()).optional()
  }),
  handler: async ({ query, urls }: { query: string; urls?: string[] | undefined }) => {
    try {
      // Import URL configuration
      const { DEFAULT_SEARCH_URLS, isValidStyleManualUrl } = await import('../config/urls.js') as { 
        DEFAULT_SEARCH_URLS: string[];
        isValidStyleManualUrl: (url: string) => boolean;
      };
      
      // Use provided URLs or default ones
      const searchUrls = urls || DEFAULT_SEARCH_URLS;
      
      // Validate all URLs are from Style Manual domain
      const invalidUrls = searchUrls.filter((url: string) => !isValidStyleManualUrl(url));
      if (invalidUrls.length > 0) {
        throw new ToolError(`Invalid URLs (must be from stylemanual.gov.au): ${invalidUrls.join(', ')}`);
      }
      
      const batchProcessor = new BatchProcessor();
      const searcher = new SimpleSearch();
      
      const results = await batchProcessor.processUrlsInBatches(
        searchUrls,
        async (url) => {
          const extractor = new SimpleContentExtractor();
          const content = await extractor.extractPageContent(url);
          const matches = searcher.findMatches(content, query);
          return matches.length > 0 ? { url, matches } : null;
        },
        { batchSize: 3, delayMs: 2000 }
      );
      
      // Filter out null results
      const validResults = results.filter(result => result !== null);
      
      const markdown = formatSearchResults(validResults, query);
      return {
        content: [{ type: "text" as const, text: markdown }]
      };
    } catch (error) {
      return handleToolError(error);
    }
  }
};