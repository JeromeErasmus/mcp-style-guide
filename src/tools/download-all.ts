import { z } from 'zod';
import { promises as fs } from 'fs';
import { StyleManualExtractor } from '../extraction/style-manual-extractor.js';
import { BatchProcessor } from '../processing/batch-processor.js';
import { formatAsMarkdown, generateFilename, generateIndexFiles } from '../utils/formatters.js';
import { handleToolError } from '../utils/errors.js';
import { DownloadResult } from '../types/index.js';
import { GlobalCache } from '../utils/cache.js';

export const downloadAllTool = {
  name: "download_all_content",
  description: "Download all configured Style Manual pages to global cache for reuse across projects",
  inputSchema: z.object({
    forceRefresh: z.boolean().optional().default(false)
  }),
  handler: async ({ forceRefresh = false }: { forceRefresh?: boolean }) => {
    try {
      const { STYLE_MANUAL_URLS, getFullUrl } = await import('../config/urls.js') as { 
        STYLE_MANUAL_URLS: Record<string, string>; 
        getFullUrl: (uriPath: string) => string;
      };
      
      const cache = new GlobalCache();
      
      // Check if cache is already populated and we don't need to force refresh
      if (!forceRefresh && await cache.isCachePopulated()) {
        const cachedFiles = await cache.getAllCachedFiles();
        return {
          content: [{ 
            type: "text" as const, 
            text: `Cache already contains ${cachedFiles.length} pages at ${cache.cachePath}. Use forceRefresh=true to re-download.` 
          }]
        };
      }
      
      const batchProcessor = new BatchProcessor();
      const extractor = new StyleManualExtractor();
      
      // Ensure cache directories exist
      await cache.ensureCacheDirectories();
      
      // Convert URI paths to full URLs
      const allUrls = Object.values(STYLE_MANUAL_URLS).map((uriPath: string) => getFullUrl(uriPath));
      const results = await batchProcessor.processUrlsInBatches(
        allUrls,
        async (url) => {
          try {
            const content = await extractor.extractPageContent(url);
            const filename = generateFilename(url);
            const filepath = `${cache.sectionPath}/${filename}`;
            const markdown = formatAsMarkdown(content);
            
            await fs.writeFile(filepath, markdown, 'utf8');
            return { url, filename, success: true } as DownloadResult;
          } catch (error) {
            return { 
              url, 
              filename: generateFilename(url), 
              error: error instanceof Error ? error.message : 'Unknown error', 
              success: false 
            } as DownloadResult;
          }
        },
        { batchSize: 3, delayMs: 2000 }
      );
      
      // Filter successful results for index generation  
      const successfulResults = results.filter((r): r is DownloadResult => r !== null && r !== undefined && r.success);
      
      // Generate index files in cache
      await generateIndexFiles(cache.cachePath, successfulResults);
      
      // Update cache info
      await cache.updateCacheInfo({
        lastUpdated: new Date().toISOString(),
        version: '1.0.0'
      });
      
      const summary = {
        total: results.length,
        successful: successfulResults.length,
        failed: results.length - successfulResults.length,
        cacheDirectory: cache.cachePath
      };
      
      return {
        content: [{ type: "text" as const, text: `Downloaded ${summary.successful}/${summary.total} pages to global cache at ${summary.cacheDirectory}` }]
      };
    } catch (error) {
      return handleToolError(error);
    }
  }
};