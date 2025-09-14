import * as cheerio from 'cheerio';
import type { CheerioAPI } from 'cheerio';
import { PageContent, Section } from '../types/index.js';

export class SimpleContentExtractor {
  async extractPageContent(url: string): Promise<PageContent> {
    try {
      const $ = await cheerio.fromURL(url);
      
      return {
        url,
        title: this.extractTitle($),
        content: this.extractContent($),
        sections: this.extractSections($),
        lastFetched: new Date()
      };
    } catch (error) {
      throw new Error(`Failed to extract content from ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private extractTitle($: CheerioAPI): string {
    // Try multiple selectors in order of preference
    const titleSelectors = ['h1', '.page-title', 'title'];
    for (const selector of titleSelectors) {
      const title = $(selector).first().text().trim();
      if (title) return title;
    }
    return 'Untitled';
  }

  private extractContent($: CheerioAPI): string {
    // Try multiple content selectors
    const contentSelectors = ['main', '.content', '.entry-content', 'article'];
    for (const selector of contentSelectors) {
      const content = $(selector).first().text().trim();
      if (content) return content;
    }
    return '';
  }

  private extractSections($: CheerioAPI): Section[] {
    const sections: Section[] = [];
    $('h2, h3, h4').each((_, element) => {
      const $el = $(element);
      const tagName = $el.prop('tagName');
      if (tagName) {
        sections.push({
          heading: $el.text().trim(),
          level: parseInt(tagName.slice(1)), // h2 -> 2
          content: this.getSectionContent($, $el)
        });
      }
    });
    return sections;
  }

  private getSectionContent(_$: CheerioAPI, $heading: cheerio.Cheerio<any>): string {
    // Extract content until next heading of same or higher level
    let content = '';
    let current = $heading.next();
    
    while (current.length && !current.is('h1, h2, h3, h4, h5, h6')) {
      content += current.text().trim() + '\n';
      current = current.next();
    }
    
    return content.trim();
  }
}