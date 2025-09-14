import { z } from 'zod';
import { SimpleContentExtractor } from '../extraction/content-extractor.js';
import { formatAsMarkdown } from '../utils/formatters.js';
import { handleToolError } from '../utils/errors.js';
import { ToolError } from '../types/index.js';

export const fetchPageTool = {
  name: "fetch_style_page",
  description: "Fetch and extract content from any Australian Style Manual page",
  inputSchema: z.object({
    url: z.string().url()
  }),
  handler: async ({ url }: { url: string }) => {
    try {
      // Import URL validation
      const { isValidStyleManualUrl } = await import('../config/urls.js') as { isValidStyleManualUrl: (url: string) => boolean };
      
      // Validate URL is from Style Manual domain
      if (!isValidStyleManualUrl(url)) {
        throw new ToolError(`Invalid URL: must be from stylemanual.gov.au domain`);
      }
      
      const extractor = new SimpleContentExtractor();
      const content = await extractor.extractPageContent(url);
      
      // Format as markdown
      const markdown = formatAsMarkdown(content);
      
      return {
        content: [{ type: "text" as const, text: markdown }]
      };
    } catch (error) {
      return handleToolError(error);
    }
  }
};