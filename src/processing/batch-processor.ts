import { BatchOptions } from '../types/index.js';

export class BatchProcessor {
  async processUrlsInBatches<T>(
    urls: string[],
    processor: (url: string) => Promise<T | null>,
    options: BatchOptions = { batchSize: 3, delayMs: 2000 }
  ): Promise<(T | null)[]> {
    const results: (T | null)[] = [];
    
    // Split URLs into batches
    const batches = this.chunkArray(urls, options.batchSize);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      
      // Process batch in parallel
      const batchResults = await Promise.allSettled(
        batch.map(url => processor(url))
      );
      
      // Extract results, handling failures gracefully
      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          console.warn(`Failed to process URL:`, result.reason);
          results.push(null);
        }
      }
      
      // Respectful delay between batches (except for last batch)
      if (i < batches.length - 1) {
        await this.delay(options.delayMs);
      }
    }
    
    return results;
  }
  
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}