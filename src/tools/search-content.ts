import { z } from 'zod';
import { StyleManualExtractor } from '../extraction/style-manual-extractor.js';
import { SimpleSearch } from '../search/simple-search.js';
import { BatchProcessor } from '../processing/batch-processor.js';
import { formatSearchResults } from '../utils/formatters.js';
import { handleToolError } from '../utils/errors.js';
import { ToolError } from '../types/index.js';
import { GlobalCache } from '../utils/cache.js';
import { generateFilename } from '../utils/formatters.js';

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
      
      const cache = new GlobalCache();
      const searcher = new SimpleSearch();
      
      // Try to use cache first if it's available
      if (await cache.isCachePopulated()) {
        const results = [];
        
        // When using cache, search ALL cached files, not just the search URLs
        // This provides more comprehensive results since all content is available
        const cachedFiles = await cache.getAllCachedFiles();
        
        for (const filename of cachedFiles) {
          const cachedContent = await cache.getCachedFile(filename);
          
          if (cachedContent) {
            // Parse cached markdown to extract content for search
            const lines = cachedContent.split('\n');
            const titleMatch = lines.find(line => line.startsWith('# '));
            const title = titleMatch ? titleMatch.replace('# ', '') : filename.replace('.md', '');
            
            // Extract URL from the cached content (it should be in the Source line)
            const sourceMatch = lines.find(line => line.startsWith('**Source:**'));
            const url = sourceMatch 
              ? sourceMatch.replace('**Source:** ', '').trim()
              : `https://www.stylemanual.gov.au/${filename.replace('.md', '')}`;
            
            const content = {
              title,
              url,
              content: cachedContent,
              sections: [],
              lastFetched: new Date()
            };
            
            const matches = searcher.findMatches(content, query);
            if (matches.length > 0) {
              results.push({ url, matches });
            }
          }
        }
        
        if (results.length > 0) {
          const markdown = formatSearchResults(results, query);
          return {
            content: [{ type: "text" as const, text: `${markdown}\n\n*Results from cached content*` }]
          };
        }
      }
      
      // Fallback to web fetching if cache is not available or no results
      const batchProcessor = new BatchProcessor();
      
      const results = await batchProcessor.processUrlsInBatches(
        searchUrls,
        async (url) => {
          const extractor = new StyleManualExtractor();
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
        content: [{ type: "text" as const, text: `${markdown}\n\n*Results from live web fetch*` }]
      };
    } catch (error) {
      return handleToolError(error);
    }
  }
};