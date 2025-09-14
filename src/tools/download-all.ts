import { z } from 'zod';
import { promises as fs } from 'fs';
import { StyleManualExtractor } from '../extraction/style-manual-extractor.js';
import { BatchProcessor } from '../processing/batch-processor.js';
import { formatAsMarkdown, generateFilename, generateIndexFiles } from '../utils/formatters.js';
import { handleToolError } from '../utils/errors.js';
import { DownloadResult } from '../types/index.js';

export const downloadAllTool = {
  name: "download_all_content",
  description: "Download all configured Style Manual pages to local markdown files",
  inputSchema: z.object({
    outputDir: z.string()
  }),
  handler: async ({ outputDir }: { outputDir: string }) => {
    try {
      const { STYLE_MANUAL_URLS } = await import('../config/urls.js') as { STYLE_MANUAL_URLS: Record<string, string> };
      const batchProcessor = new BatchProcessor();
      const extractor = new StyleManualExtractor();
      
      // Create organized directory structure
      await fs.mkdir(`${outputDir}/sections`, { recursive: true });
      await fs.mkdir(`${outputDir}/search-index`, { recursive: true });
      await fs.mkdir(`${outputDir}/metadata`, { recursive: true });
      
      const allUrls = Object.values(STYLE_MANUAL_URLS) as string[];
      const results = await batchProcessor.processUrlsInBatches(
        allUrls,
        async (url) => {
          try {
            const content = await extractor.extractPageContent(url);
            const filename = generateFilename(url);
            const filepath = `${outputDir}/sections/${filename}`;
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
      
      // Generate index files
      await generateIndexFiles(outputDir, successfulResults);
      
      const summary = {
        total: results.length,
        successful: successfulResults.length,
        failed: results.length - successfulResults.length,
        outputDirectory: outputDir
      };
      
      return {
        content: [{ type: "text" as const, text: `Downloaded ${summary.successful}/${summary.total} pages to ${outputDir}` }]
      };
    } catch (error) {
      return handleToolError(error);
    }
  }
};